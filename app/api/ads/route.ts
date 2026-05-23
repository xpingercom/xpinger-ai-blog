import { NextResponse } from 'next/server';
import { listAds, updateAds } from '@/lib/ads-store';

export async function GET() {
  const ads = await listAds();
  return NextResponse.json({ ads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ads = await updateAds(body.ads || []);
    return NextResponse.json({ ok: true, ads });
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
