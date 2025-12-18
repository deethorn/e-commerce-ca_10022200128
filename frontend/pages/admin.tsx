'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/api';

interface DashboardMetrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (user && user.role === 'ADMIN') {
        fetchMetrics();
      } else {
        // Non-admin or not logged in users are redirected to home
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/dashboard');
      setMetrics(response.data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center py-12">Loading...</p>;
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-8 flex gap-4 border-b border-gray-200">
        <button className="px-4 py-2 font-semibold text-blue-600 border-b-2 border-blue-600">
          Overview
        </button>
        <Link href="/admin/products" className="px-4 py-2 font-semibold text-gray-600 hover:text-blue-600">
          Inventory Management
        </Link>
        <Link href="/admin/verification" className="px-4 py-2 font-semibold text-gray-600 hover:text-blue-600">
          Payment Verification
        </Link>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-3xl font-bold">{metrics.totalUsers}</div>
            <p className="text-gray-600">Total Users</p>
          </div>

          <div className="card">
            <div className="text-3xl font-bold">{metrics.totalOrders}</div>
            <p className="text-gray-600">Total Orders</p>
          </div>

          <div className="card">
            <div className="text-3xl font-bold">GHC{(metrics.totalRevenue / 100).toFixed(2)}</div>
            <p className="text-gray-600">Total Revenue</p>
          </div>

          <div className="card">
            <div className="text-3xl font-bold">{metrics.pendingOrders}</div>
            <p className="text-gray-600">Pending Orders</p>
          </div>
        </div>
      )}
    </div>
  );
}
