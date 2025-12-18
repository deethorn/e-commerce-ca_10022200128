import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
   
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => console.log('Backend response:', data))
      .catch(err => console.error('Backend error:', err));
  }, []);

   return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#6B7B6E' }}>
          Welcome to Ingrid
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover a curated selection of everyday essentials across Electronics, Fashion, Home, and Books.
          Simple, reliable, and built for you.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-3 btn btn-primary"
          >
            Start Shopping
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 btn btn-outline"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ingrid?</h2>

        <div className="product-grid">
          <div className="card text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Browse thousands of products across multiple categories</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
            <p className="text-gray-600">Your data is protected with industry-standard encryption</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Electronics', 'Fashion', 'Home Essentials', 'Books'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.replace(' ', '_').toUpperCase()}`}
              className="card text-center hover:shadow-lg transition"
            >
              <div className="text-3xl mb-4">
                {category === 'Electronics' && '📱'}
                {category === 'Fashion' && '👕'}
                {category === 'Home Essentials' && '🏠'}
                {category === 'Books' && '📚'}
              </div>
              <h3 className="text-lg font-semibold">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
