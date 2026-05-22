import { NextResponse } from 'next/server';
import { trends } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    generatedAt: new Date().toISOString(),
    trends,
  });
}
