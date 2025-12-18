'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Product } from '../../types';
import { productAPI } from '../../lib/auth';
import { useCart } from '../../hooks/useCart';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.getProductById(id as string);
      setProduct(data);
    } catch (err: any) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      alert(`✓ Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    } catch (err: any) {
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12">Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="text-gray-600 mt-4">Sorry, we couldn't find this product.</p>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const categoryEmoji: { [key: string]: string } = {
    ELECTRONICS: '💻',
    FASHION: '👕',
    HOME_ESSENTIALS: '🏠',
    BOOKS: '📚'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/products" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-9xl">
          {categoryEmoji[product.category] || '📦'}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">{product.category}</span>
            <span className="text-sm text-gray-600">⭐ {product.rating.toFixed(1)}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 text-lg mb-6">{product.description}</p>

          {/* Price and Stock */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Price:</span>
              <span className="text-3xl font-bold">GHC{(product.price / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stock Available:</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              This product is currently out of stock.
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Category: {product.category}</li>
              <li>✓ Rating: {product.rating.toFixed(1)} / 5</li>
              <li>✓ Free shipping on orders over GHC50</li>
              <li>✓ 30-day return policy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
