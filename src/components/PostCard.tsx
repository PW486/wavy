"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, User as UserIcon } from 'lucide-react';

interface Post {
  id: number;
  content: string;
  createdAt: string | Date;
  author: {
    username: string;
  };
  likes: { userId: number }[];
}

export function PostCard({ post, currentUserId: initialUserId }: { post: Post; currentUserId?: number }) {
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(initialUserId);
  const [liked, setLiked] = useState(false); // Initialize false, update in effect
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // If initialUserId is provided, use it. Otherwise try localStorage.
    let userId = initialUserId;
    if (!userId) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        userId = JSON.parse(storedUser).id;
      }
    }
    
    if (userId) {
        setCurrentUserId(userId);
        setLiked(post.likes.some(l => l.userId === userId));
    }
  }, [initialUserId, post.likes]);

  const timeAgo = (date: string | Date) => {
    const d = new Date(date);
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    // Optimistic update
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      // Revert on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Link href={`/${post.author.username}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-inner cursor-pointer hover:opacity-90 transition-opacity">
              <UserIcon className="w-6 h-6" />
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Link href={`/${post.author.username}`} className="group/name">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-cyan-800 to-gray-900 bg-[length:200%_auto] hover:bg-[right_center] transition-all duration-500 text-lg">
                  @{post.author.username}
                </span>
              </Link>
              <span className="text-gray-400 text-sm font-medium">• {timeAgo(post.createdAt)}</span>
            </div>
          </div>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          <div className="flex items-center gap-6 pt-1 border-t border-gray-50 mt-2">
            <button 
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={`flex items-center gap-1.5 transition-colors group/btn ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <div className={`p-2 rounded-full group-hover/btn:bg-red-50 ${liked ? 'bg-red-50' : ''}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm font-medium">{likeCount > 0 ? likeCount : 'Like'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
