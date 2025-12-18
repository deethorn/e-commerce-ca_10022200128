'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/api';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface PendingOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentProof: string;
  paymentStatus: string;
  shippingAddress: string;
  items: OrderItem[];
  user: {
    email: string;
    firstName: string;
  };
  createdAt: string;
}

export default function PaymentVerificationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (user && user.role === 'ADMIN') {
        fetchPendingOrders();
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/orders/pending-verification');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch pending orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (orderId: string) => {
    setVerifying(orderId);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/verify-payment`, { approved: true });
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Payment approved. Order moved to processing.');
    } catch (err) {
      console.error('Failed to approve payment:', err);
      alert('Failed to approve payment');
    } finally {
      setVerifying(null);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    if (!confirm('Are you sure you want to reject this payment? Order will return to PENDING.')) {
      return;
    }
    setVerifying(orderId);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/verify-payment`, { approved: false });
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Payment rejected. Order returned to PENDING.');
    } catch (err) {
      console.error('Failed to reject payment:', err);
      alert('Failed to reject payment');
    } finally {
      setVerifying(null);
    }
  };

  if (isLoading) {
    return <p className="text-center py-12">Loading...</p>;
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Payment Verification</h1>

      {loading ? (
        <p>Loading pending orders...</p>
      ) : orders.length === 0 ? (
        <div className="card bg-green-50 border-green-200">
          <p className="text-green-700 font-semibold">✓ All payments verified! No pending orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-1">
                  <h3 className="font-bold text-lg mb-3">Order #{order.id.substring(0, 8)}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Customer:</span> {order.user.firstName} ({order.user.email})</p>
                    <p><span className="font-semibold">Amount:</span> GHC{(order.totalAmount / 100).toFixed(2)}</p>
                    <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Status:</span> <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{order.paymentStatus}</span></p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-sm">Items:</h4>
                    {order.items.map(item => (
                      <div key={item.id} className="text-sm bg-gray-50 p-2 rounded">
                        <Link href={`/products/${item.productId}`} className="text-blue-600 hover:underline">
                          {item.product.name}
                        </Link>
                        <p className="text-gray-600">x{item.quantity} @ GHC{(item.priceAtPurchase / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Proof Image */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold mb-3">Payment Proof</h4>
                  {order.paymentProof ? (
                    <div className="space-y-2">
                      <img
                        src={order.paymentProof}
                        alt="Payment proof"
                        className="w-full border border-gray-300 rounded max-h-64 object-cover cursor-pointer hover:opacity-90"
                        onClick={() => setSelectedImage(order.paymentProof)}
                      />
                      <p className="text-xs text-gray-600">Click to enlarge</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No payment proof uploaded</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-1 flex flex-col justify-center gap-3">
                  <button
                    onClick={() => handleApprovePayment(order.id)}
                    disabled={verifying === order.id}
                    className="w-full btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {verifying === order.id ? 'Processing...' : '✓ Approve Payment'}
                  </button>
                  <button
                    onClick={() => handleRejectPayment(order.id)}
                    disabled={verifying === order.id}
                    className="w-full btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {verifying === order.id ? 'Processing...' : '✗ Reject Payment'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Payment proof enlarged"
            className="max-w-2xl max-h-96 object-contain"
          />
          <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">Click to close</p>
        </div>
      )}
    </div>
  );
}
