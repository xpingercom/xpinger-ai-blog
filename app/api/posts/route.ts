import { NextResponse } from 'next/server';
import { listPosts, saveDraft } from '@/lib/posts-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') === 'draft' ? 'draft' : searchParams.get('status') === 'published' ? 'published' : undefined;
  const posts = await listPosts(status);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await saveDraft(body);
    return NextResponse.json({ ok: true, post });
  } catch (error) {
    if (error instanceof Error && error.message === 'DB_NOT_CONFIGURED') {
      return NextResponse.json(
        { ok: false, code: 'DB_NOT_CONFIGURED', message: 'Supabase DB 연결이 필요합니다. SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 Vercel 환경변수에 추가해주세요.' },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
