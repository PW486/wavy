"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center mb-2">
        <p className="font-bold text-gray-900">{post.author.username}</p>
        <p className="text-gray-600 text-sm ml-2">
          - {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}

// Component to create a new post
function CreatePostForm({ onPostCreated, user }: { onPostCreated: () => void; user: User | null }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg shadow text-center">
                <p className="text-gray-800 mb-2 font-medium">Join the conversation!</p>
                <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                <span className="mx-2 text-gray-700">or</span>
                <Link href="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
                <span className="ml-1 text-gray-700">to post.</span>
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
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">What's on your mind?</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Type something..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                    rows={3}
                    maxLength={280}
                />
                <div className="flex justify-end items-center">
                    <span className="text-xs text-gray-600 mr-3">{content.length}/280</span>
                    <button 
                        type="submit" 
                        disabled={!content.trim() || isSubmitting}
                        className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${
                            !content.trim() || isSubmitting 
                            ? 'bg-blue-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 shadow-md'
                        }`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
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
    <div className="max-w-2xl mx-auto">
      <CreatePostForm onPostCreated={fetchPosts} user={user} />
      
      <div className="border-b border-gray-200 mb-6 pb-2">
          <h1 className="text-xl font-bold text-gray-800">Latest Posts</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="text-center py-10 text-gray-700">Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-700">No posts yet.</p>
              <p className="text-gray-600 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}