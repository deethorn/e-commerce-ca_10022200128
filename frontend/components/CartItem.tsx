'use client';

import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  if (!item.product) return null;

  return (
    <div className="card flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.product.name}</h3>
        <p className="text-gray-600">GHC{(item.product.price / 100).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max={item.product.stock}
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 px-2 py-1 border border-gray-300 rounded"
        />
        <button
          onClick={() => onRemove(item.id)}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
