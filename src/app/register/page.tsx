"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User as UserIcon, Lock, ArrowLeft, Waves, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(`Welcome aboard, @${username}! Your account has been created.`);
        setTimeout(() => {
            router.push('/login');
        }, 2000);
      } else {
        setMessage(data.error || 'Registration failed');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred during registration.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-cyan-600 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to feed</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl shadow-xl shadow-cyan-100 mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-500 font-medium text-sm">Join the community and start making waves</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-cyan-50/50 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isSuccess ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
             <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-600 font-bold hover:text-cyan-700">
                  Sign in here
                </Link>
             </p>
          </div>
          
          {message && (
            <div className={`mt-4 p-4 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2 ${
              isSuccess ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {isSuccess && <CheckCircle2 className="w-4 h-4" />}
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
