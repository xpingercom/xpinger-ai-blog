import Link from 'next/link';
import { categories, posts, trends } from '@/lib/data';
import { PostCard } from '@/components/PostCard';
import { TrendList } from '@/components/TrendList';

export default function HomePage() {
  const [featured, ...rest] = posts;
  return (
    <main>
      <section className="hero container">
        <div className="eyebrow">AI TREND BRIEFING FOR KOREA</div>
        <h1>오늘 한국에서 뜨는 이슈를 AI가 먼저 정리합니다.</h1>
        <p>XPinger는 뉴스, 검색 흐름, 공식 자료를 바탕으로 매일의 핵심 키워드를 감지하고 블로그 초안과 대표 이미지를 자동 생성하는 AI 트렌드 블로그입니다.</p>
        <div className="hero-actions">
          <Link className="btn" href="/admin">오늘 이슈 분석하기 →</Link>
          <Link className="btn secondary" href="/post/national-growth-fund-explained">샘플 글 보기</Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>오늘의 핫 키워드</h2>
            <p className="subtle">검색 상승률, 뉴스량, 최근성, 출처 신뢰도를 기준으로 점수화합니다.</p>
          </div>
        </div>
        <TrendList trends={trends} />
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>AI가 작성한 최신 브리핑</h2>
            <p className="subtle">초안은 AI가 만들고, 중요한 이슈는 사람 검토 후 발행합니다.</p>
          </div>
        </div>
        <div className="grid posts">
          <PostCard post={featured} large />
          <div className="grid">{rest.map((post) => <PostCard key={post.slug} post={post} />)}</div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>카테고리</h2></div>
        <div className="grid three">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} className="card card-pad" key={category.slug}>
              <span className="tag">XPinger</span>
              <h3 className="post-title">{category.name}</h3>
              <p className="subtle">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
