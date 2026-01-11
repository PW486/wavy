"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, User as UserIcon, Send, Sparkles } from 'lucide-react';

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

// PostCard component to display a single post
function PostCard({ post }: { post: Post }) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-inner">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-lg">@{post.author.username}</span>
              <span className="text-gray-400 text-sm">• {timeAgo(post.createdAt)}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-2">
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-red-50">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-cyan-50">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Reply</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-blue-50">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to create a new post
function CreatePostForm({ onPostCreated, user }: { onPostCreated: () => void; user: User | null }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="mb-8 p-8 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl shadow-xl text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to make a splash?</h3>
                <p className="text-cyan-50 mb-6 max-w-sm mx-auto">Join thousands of people sharing their waves every day on Wavy.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/login" className="px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold hover:bg-cyan-50 transition-all shadow-lg">Log in</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-400 border border-cyan-400/30 transition-all">Create Account</Link>
                </div>
            </div>
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
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
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
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <div className="flex gap-2">
                                <button type="button" className="p-2 text-cyan-500 hover:bg-indigo-50 rounded-full transition-colors">
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium ${content.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {content.length}/280
                                </span>
                                <button 
                                    type="submit" 
                                    disabled={!content.trim() || isSubmitting}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
                                        !content.trim() || isSubmitting 
                                        ? 'bg-gray-200 cursor-not-allowed shadow-none' 
                                        : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-100'
                                    }`}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
      
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Recent Waves</h1>
          <div className="h-1 flex-1 bg-gray-100 ml-4 rounded-full"></div>
      </div>

      <div className="space-y-2">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                 <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-gray-500 font-medium">Catching latest waves...</p>
             </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <Waves className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">The ocean is calm...</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to create a ripple on Wavy.</p>
          </div>
        )}
      </div>
    </div>
  );
}