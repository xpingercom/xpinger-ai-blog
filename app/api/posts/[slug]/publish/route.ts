import { NextResponse } from 'next/server';
import { publishPost } from '@/lib/posts-store';

type Props = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const post = await publishPost(slug);
    if (!post) return NextResponse.json({ ok: false, message: '글을 찾을 수 없습니다.' }, { status: 404 });
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
