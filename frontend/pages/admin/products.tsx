'use client';

import { useState, useEffect } from 'react';
import { Product } from '../../types';
import apiClient from '../../lib/api';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: 'ELECTRONICS',
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/products');
      setProducts(response.data.items || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || formData.price <= 0 || formData.stock < 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    try {
      if (editing) {
        // Update existing product
        await apiClient.patch(`/admin/products/${editing}`, formData);
        alert('✓ Product updated successfully');
      } else {
        // Create new product
        await apiClient.post('/admin/products', formData);
        alert('✓ Product created successfully');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'ELECTRONICS',
        stock: 0
      });
      setEditing(null);
      setShowForm(false);

      // Refresh products
      fetchProducts();
    } catch (err: any) {
      alert(`Failed to save product: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await apiClient.delete(`/admin/products/${id}`);
      alert('✓ Product deleted successfully');
      fetchProducts();
    } catch (err: any) {
      alert(`Failed to delete product: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'ELECTRONICS',
      stock: 0
    });
  };

  if (loading) {
    return <p className="text-center py-12">Loading products...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Inventory Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (editing) {
              setEditing(null);
              setFormData({
                name: '',
                description: '',
                price: 0,
                category: 'ELECTRONICS',
                stock: 0
              });
            }
          }}
          className="py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Product' : 'Create New Product'}</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (cedis)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="ELECTRONICS">Electronics</option>
              <option value="FASHION">Fashion</option>
              <option value="HOME_ESSENTIALS">Home Essentials</option>
              <option value="BOOKS">Books</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              {editing ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-right">Price</th>
              <th className="border p-3 text-right">Stock</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="border p-3 text-center text-gray-600">
                  No products yet. Create one to get started!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border hover:bg-gray-50">
                  <td className="border p-3 font-medium">{product.name}</td>
                  <td className="border p-3">{product.category}</td>
                  <td className="border p-3 text-right">GHC{(product.price / 100).toFixed(2)}</td>
                  <td className="border p-3 text-right">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
