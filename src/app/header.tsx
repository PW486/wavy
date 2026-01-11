"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.refresh(); // Refresh current route
    // window.location.reload(); // Hard reload to ensure all states are reset if needed
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          Micro-SNS
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">@{user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
