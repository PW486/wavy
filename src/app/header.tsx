"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogOut, User as UserIcon, Waves, Search } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [prevQueryParam, setPrevQueryParam] = useState(searchParams.get('q'));

  if (searchParams.get('q') !== prevQueryParam) {
    setPrevQueryParam(searchParams.get('q'));
    setSearchQuery(searchParams.get('q') || '');
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500 p-2 rounded-xl group-hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-100">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 tracking-tight">
              Wavy
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search waves..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm ml-2 w-full text-gray-900"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Link href={`/${user.username}`} className="flex items-center gap-3 group">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">@{user.username}</span>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-cyan-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 font-bold text-sm shadow-lg shadow-cyan-100 transition-all active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
