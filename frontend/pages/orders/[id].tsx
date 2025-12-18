'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../lib/auth';
import apiClient from '../../lib/api';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentProof?: string;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchOrder();
    }
  }, [id, user]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.getOrderById(id as string);
      setOrder(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError(err.response?.data?.error || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!order || !e.target.files?.[0]) return;

    const file = e.target.files[0];

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        try {
          const response = await apiClient.post(`/orders/${order.id}/payment`, {
            paymentProof: base64,
            paymentMethod: 'bank-transfer'
          });

          setOrder(response.data);
          setError(null);
          alert('Payment proof uploaded successfully. Waiting for admin verification.');
        } catch (err: any) {
          console.error('Upload error:', err);
          setError(err.response?.data?.error || 'Failed to upload payment proof');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Failed to read file');
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12">Loading order details...</p>;
  }

  if (error && !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link href="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isPendingVerification = order.paymentStatus === 'PENDING_VERIFICATION';

  return (
    <div>
      <div className="mb-8">
        <Link href="/orders" className="text-blue-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Order #{order.id.substring(0, 8)}</h1>

      {error && (
        <div className="error-message mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Order Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-semibold">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {order.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold">
                  <span className={`inline-block px-3 py-1 rounded text-sm ${
                    order.paymentStatus === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <Link
                  key={item.id}
                  href={`/products/${item.productId}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-blue-600 hover:underline">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">GHC{(item.priceAtPurchase / 100 * item.quantity).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Order Total */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Order Total</h2>
            <div className="text-4xl font-bold text-blue-600">
              GHC{(order.totalAmount / 100).toFixed(2)}
            </div>
          </div>

          {/* Payment Upload */}
          {order.paymentStatus === 'PENDING' && (
            <div className="card border-yellow-200 bg-yellow-50">
              <h2 className="font-bold text-lg mb-4">Upload Payment Proof</h2>
              <p className="text-sm text-gray-700 mb-4">
                Please upload a screenshot or image of your payment proof (receipt, bank transfer, etc.)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePaymentProofUpload}
                disabled={uploading}
                className="block w-full text-sm mb-3 p-2 border border-gray-300 rounded cursor-pointer"
              />
              <button
                disabled={uploading}
                className="w-full btn btn-primary disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Upload Proof'}
              </button>
            </div>
          )}

          {/* Payment Proof Display */}
          {isPendingVerification && order.paymentProof && (
            <div className="card border-blue-200 bg-blue-50">
              <h2 className="font-bold text-lg mb-4">Payment Proof</h2>
              <img
                src={order.paymentProof}
                alt="Payment proof"
                className="w-full border border-blue-300 rounded"
              />
              <p className="text-xs text-gray-600 mt-2">
                ⏳ Awaiting admin verification...
              </p>
            </div>
          )}

          {/* Approved Status */}
          {order.paymentStatus === 'APPROVED' && (
            <div className="card border-green-200 bg-green-50">
              <p className="text-green-700 font-semibold">
                ✓ Payment verified and approved!
              </p>
            </div>
          )}

          {/* Rejected Status */}
          {order.paymentStatus === 'REJECTED' && (
            <div className="card border-red-200 bg-red-50">
              <p className="text-red-700 font-semibold mb-3">
                ✗ Payment rejected. Please resubmit.
              </p>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentProofUpload}
                  disabled={uploading}
                  className="block w-full text-sm mb-2 p-2 border border-gray-300 rounded cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
