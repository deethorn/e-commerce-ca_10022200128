import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { cartAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const useCart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartAPI.getCart();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to remove from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartAPI.updateQuantity(itemId, quantity);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  const getTotalPrice = (): number => {
    return items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  return {
    items,
    isLoading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice
  };
};
