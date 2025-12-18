'use client';

import Link from 'next/link';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card">
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
        {product.category === 'ELECTRONICS' && '💻'}
        {product.category === 'FASHION' && '👕'}
        {product.category === 'HOME_ESSENTIALS' && '🏠'}
        {product.category === 'BOOKS' && '📚'}
      </div>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

      <div className="flex items-center gap-1 mb-3">
        <span className="text-sm"> {product.rating.toFixed(1)}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold">GHC{(product.price / 100).toFixed(2)}</span>
        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
      </div>

      <div className="space-y-2">
        <Link
          href={`/products/${product.id}`}
          className="block w-full py-2 text-center border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-50 font-semibold"
        >
          View Details
        </Link>
        <button
          onClick={() => onAddToCart?.(product.id)}
          disabled={product.stock === 0}
          className="w-full py-2 btn btn-primary disabled:opacity-50"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
