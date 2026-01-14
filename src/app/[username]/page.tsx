import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from '../header';
import { PostCard } from '@/components/PostCard';
import { User as UserIcon, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: { username: true },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-600 mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Timeline</span>
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                  <UserIcon className="w-12 h-12" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl font-black tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900">
                    @{user.username}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Joined {joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-8 pt-6 border-t border-gray-50">
                <div className="text-center sm:text-left">
                  <div className="text-xl font-black text-gray-900">{user.posts.length}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Waves</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-black text-gray-900">0</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Following</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-black text-gray-900">0</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* User's Posts */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Waves</h2>
            <div className="h-1 flex-1 bg-gray-100 ml-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {user.posts.length > 0 ? (
              user.posts.map((post) => (
                <PostCard key={post.id} post={{
                    ...post,
                    createdAt: post.createdAt.toISOString()
                }} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No waves yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
