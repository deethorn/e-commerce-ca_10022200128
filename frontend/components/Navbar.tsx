'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#6B7B6E' }}>
          Ingrid
        </Link>

        <div className="space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-black">
            Shop
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-black">
            Cart
          </Link>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-600 hover:text-black">
                  Admin
                </Link>
              )}
              <Link href="/orders" className="text-gray-600 hover:text-black">
                Orders
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-black">
                Logout ({user.firstName})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-black">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
