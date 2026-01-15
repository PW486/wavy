import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * DEVELOPMENT ONLY: Resets the entire database.
 * Deletes all Likes, Posts, Users, and SummaryCache.
 */
export async function POST() {
  // In a real production app, you would add a secret key check here
  // if (request.headers.get('x-admin-key') !== process.env.ADMIN_KEY) { ... }

  try {
    // Delete in order of dependencies (child to parent)
    await prisma.like.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.summaryCache.deleteMany({});

    return NextResponse.json({ message: 'Database reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Database reset error:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}
