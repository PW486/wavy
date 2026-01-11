import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { content, authorId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json({ error: 'Content and authorId are required' }, { status: 400 });
    }

    // In a real app, you'd get the authorId from the authenticated user's session
    const post = await prisma.post.create({
      data: {
        content,
        authorId: Number(authorId),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
