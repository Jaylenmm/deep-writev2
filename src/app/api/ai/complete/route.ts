import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 256,
      temperature: 0.7,
    });

    const completion = chat.choices[0]?.message?.content ?? '';
    return NextResponse.json({ completion });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
