"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, Send, Sparkles, Waves } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { motion, AnimatePresence } from 'framer-motion';

// Define the types for our data
interface Post {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
}

interface User {
  id: number;
  username: string;
}

// Component to create a new post
function CreatePostForm({ onPostCreated, user }: { onPostCreated: () => void; user: User | null }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-8 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl shadow-xl text-center text-white relative overflow-hidden"
            >
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 p-4 opacity-10"
                >
                    <Sparkles className="w-24 h-24" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Ready to make a splash?</h3>
                <p className="text-cyan-50 mb-6 max-w-sm mx-auto">Join thousands of people sharing their waves every day on Wavy.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/login" className="px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold hover:bg-cyan-50 transition-all shadow-lg active:scale-95">Log in</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-400 border border-cyan-400/30 transition-all active:scale-95">Create Account</Link>
                </div>
            </motion.div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, authorId: user.id }),
            });

            if (res.ok) {
                setContent('');
                onPostCreated();
            } else {
                const error = await res.json();
                alert(`Failed to create post: ${error.error}`);
            }
        } catch (error) {
            alert('An error occurred while creating the post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-cyan-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-0 py-2 border-none focus:ring-0 text-xl text-gray-900 placeholder-gray-400 resize-none min-h-[100px] outline-none"
                            maxLength={280}
                        />
                        <div className="flex justify-end items-center pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium ${content.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {content.length}/280
                                </span>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    disabled={!content.trim() || isSubmitting}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all shadow-md ${
                                        !content.trim() || isSubmitting 
                                        ? 'bg-gray-200 cursor-not-allowed shadow-none' 
                                        : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-100'
                                    }`}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                                </motion.button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

function AISummary() {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('/api/posts/summary');
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data.summary);
                }
            } catch (error) {
                console.error("Error fetching summary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse"
        >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        </motion.div>
    );
    if (!summary) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-purple-100 shadow-sm"
        >
            <h4 className="text-sm font-bold text-purple-900 flex items-center gap-2 mb-3">
                <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                </motion.div>
                Community Pulse
            </h4>
            <p className="text-purple-800 text-sm leading-relaxed">
                {summary}
            </p>
        </motion.div>
    );
}


// Main timeline component
export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <CreatePostForm onPostCreated={fetchPosts} user={user} />
      
      <AISummary />

      <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Recent Waves</h1>
          <div className="h-1 flex-1 bg-gray-100 ml-4 rounded-full"></div>
      </div>

      <motion.div 
        layout
        className="space-y-2"
      >
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                 <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-gray-500 font-medium">Catching latest waves...</p>
             </div>
        ) : posts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <PostCard post={post} />
                </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
          >
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <Waves className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">The ocean is calm...</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to create a ripple on Wavy.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}