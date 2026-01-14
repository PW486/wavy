import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, userId } = body;

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      },
    });

    if (like) {
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
