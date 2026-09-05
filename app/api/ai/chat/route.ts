import { NextResponse } from 'next/server';
import { getGeminiAIResponse } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message field is required and must be a string.' },
        { status: 400 }
      );
    }

    const aiResponseText = await getGeminiAIResponse(message, history || []);

    return NextResponse.json({
      text: aiResponseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API /api/ai/chat Error:', error);
    return NextResponse.json({
      text: "FreshSip AI is taking a quick break. You can still explore our menu and filter by health goals!",
      timestamp: new Date().toISOString(),
    });
  }
}
