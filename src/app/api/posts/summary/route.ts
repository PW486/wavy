import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CACHE_KEY = "latest_summary";
const ONE_HOUR = 60 * 60 * 1000;

async function getAIResponse(postsContent: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a social media assistant for "Wavy". 
    Below are the 5 most recent posts (waves). 
    Please provide a concise, friendly, and engaging summary of what people are talking about in 2-3 sentences.
    
    Posts:
    ${postsContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (aiError) {
    console.error("Gemini API failed:", aiError);
    return null;
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { username: true } } },
    });

    if (posts.length === 0) {
      return NextResponse.json({ summary: "No posts available to summarize." });
    }

    // Check Cache
    const cachedSummary = await prisma.summaryCache.findUnique({
      where: { postIds: CACHE_KEY }
    });

    if (cachedSummary && (Date.now() - new Date(cachedSummary.createdAt).getTime() < ONE_HOUR)) {
      return NextResponse.json({ summary: cachedSummary.content, cached: true });
    }

    // Generate New Summary
    const postsContent = posts.map(p => `@${p.author.username}: ${p.content}`).join('\n---\n');
    const aiText = await getAIResponse(postsContent);

    if (aiText) {
      await prisma.summaryCache.upsert({
        where: { postIds: CACHE_KEY },
        update: { content: aiText, createdAt: new Date() },
        create: { content: aiText, postIds: CACHE_KEY }
      });
      return NextResponse.json({ summary: aiText, cached: false });
    }

    // Fallback
    const fallbackSummary = `Based on the last ${posts.length} waves, users like @${posts[0].author.username} are sharing their thoughts. (AI summary unavailable)`;
    return NextResponse.json({ summary: fallbackSummary });

  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
