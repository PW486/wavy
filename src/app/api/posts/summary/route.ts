import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // 1. Fetch the recent 5 posts
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: { username: true },
        },
      },
    });

    if (posts.length === 0) {
      return NextResponse.json({ summary: "No posts available to summarize." });
    }

    const postsContent = posts.map(p => `@${p.author.username}: ${p.content}`).join('\n');

    // 2. Use Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the latest Gemini 3 model
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `You are a social media assistant for "Wavy". 
        Below are the 5 most recent posts (waves). 
        Please provide a concise, friendly, and engaging summary of what people are talking about in 2-3 sentences.
        
        Posts:
        ${postsContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return NextResponse.json({ summary: text });
      } catch (aiError) {
        console.error("Gemini API failed, falling back to manual summary:", aiError);
        // Fallthrough to manual summary
      }
    }

    // Fallback if no API key is found or API call failed
    const fallbackSummary = `Based on the last ${posts.length} waves, users like @${posts[0].author.username} are sharing their thoughts. (AI summary unavailable)`;

    return NextResponse.json({ summary: fallbackSummary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}