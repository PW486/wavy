import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, User as UserIcon } from 'lucide-react';

interface Post {
  id: number;
  content: string;
  createdAt: string | Date;
  author: {
    username: string;
  };
}

export function PostCard({ post }: { post: Post }) {
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
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          <div className="flex items-center gap-6 pt-1 border-t border-gray-50 mt-2">
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-red-50">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-cyan-50">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Reply</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors group/btn">
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
