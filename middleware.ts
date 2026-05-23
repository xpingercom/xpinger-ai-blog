import { NextRequest, NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="XPinger Admin"',
    },
  });
}

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminUser = process.env.ADMIN_USER || 'admin';

  // 환경변수가 없으면 개발 편의를 위해 통과. 운영에서는 반드시 ADMIN_PASSWORD 설정.
  if (!adminPassword) return NextResponse.next();

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return unauthorized();

  const encoded = authHeader.replace('Basic ', '');
  const decoded = atob(encoded);
  const [user, password] = decoded.split(':');

  if (user === adminUser && password === adminPassword) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/ads/:path*', '/api/generate-draft', '/api/cron/:path*'],
};
