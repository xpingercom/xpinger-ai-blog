import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'XPinger — AI Trend Briefing',
  description: 'AI가 한국의 오늘 이슈를 감지하고 쉽게 정리하는 트렌드 블로그.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xpinger.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <Link href="/" className="logo" aria-label="XPinger home">
              <span className="logo-mark">XP</span>
              <span>XPinger</span>
            </Link>
            <nav className="nav-links">
              <Link href="/category/economy-policy">경제/정책</Link>
              <Link href="/category/ai-tech">AI/테크</Link>
              <Link href="/category/finance">금융</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            <div className="logo"><span className="logo-mark">XP</span><span>XPinger</span></div>
            <p>AI가 초안을 만들고, 사람이 신뢰를 완성하는 한국 이슈 브리핑.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
