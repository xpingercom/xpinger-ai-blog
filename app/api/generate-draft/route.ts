import { NextRequest, NextResponse } from 'next/server';
import { generateDraft } from '@/lib/ai/writer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const keyword = String(body.keyword || '오늘의 이슈');
    const category = String(body.category || '경제/정책');
    const sources = Array.isArray(body.sources) ? body.sources : undefined;
    const result = await generateDraft({ keyword, category, sources });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '초안 생성 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
