'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { orderAPI } from '../lib/auth';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, getTotalPrice, isLoading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);


const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
const [paymentUploading, setPaymentUploading] = useState(false);
const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await orderAPI.createOrder(
        items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        '123 Main St, City, State 12345'
      );

      setCurrentOrderId(response.id);
      setPaymentError(null);
      alert('✓ Order created successfully!You can now upload payment proof below or view the order.');
      router.push(`/orders/${response.id}`);
    } catch (err: any) {
      alert('Failed to create order');
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCartPaymentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentOrderId || !e.target.files?.[0]) {
      setPaymentError('Please create an order first, then upload payment proof.');
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setPaymentError('Please upload an image file');
      return;
    }

    setPaymentUploading(true);
    setPaymentError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;

      try {
        await orderAPI.uploadPaymentProof(currentOrderId, base64, 'bank-transfer');
        alert('Payment proof uploaded! You can track status on the Orders page.');
      } catch (err: any) {
        console.error('Upload error:', err);
        setPaymentError(err.response?.data?.error || 'Failed to upload payment proof');
      } finally {
        setPaymentUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your cart</h1>
        <Link href="/login" className="px-6 py-2 btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/products" className="px-6 py-2 btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="card h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>GHC{(getTotalPrice() / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>Total:</span>
                <span>GHC{(getTotalPrice() / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full py-3 btn btn-primary disabled:opacity-50 mb-4"
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            {currentOrderId && (
            <div className="mb-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700 mb-2">
                Upload payment proof for your latest order, or view details on the Orders page.
              </p>
              {paymentError && (
                <p className="text-xs text-red-600 mb-1">{paymentError}</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCartPaymentUpload}
                disabled={paymentUploading}
                className="block w-full text-sm mb-2 p-2 border border-gray-300 rounded cursor-pointer"
              />
              <p className="text-xs text-gray-600">
                After upload, you can track verification under Orders.
              </p>
            </div>
            )}

            <Link href="/products" className="block w-full py-2 text-center btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
