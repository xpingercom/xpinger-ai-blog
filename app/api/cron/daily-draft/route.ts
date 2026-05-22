import { NextRequest, NextResponse } from 'next/server';
import { trends } from '@/lib/data';
import { generateDraft } from '@/lib/ai/writer';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const topTrend = [...trends].sort((a, b) => b.score - a.score)[0];
  const result = await generateDraft({ keyword: topTrend.keyword, category: topTrend.category });

  // TODO: Supabase 연결 후 drafts 테이블에 저장.
  return NextResponse.json({
    ok: true,
    mode: result.mode,
    selectedTrend: topTrend,
    draft: result.draft,
    note: 'DB 연결 전이므로 응답으로만 반환합니다. Supabase 연결 후 drafts 테이블에 저장됩니다.',
  });
}
