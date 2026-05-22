'use client';

import { useMemo, useState } from 'react';
import { trends } from '@/lib/data';

type Draft = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imagePrompt: string;
  sources: { title: string; publisher: string; url: string }[];
};

export default function AdminPage() {
  const [keyword, setKeyword] = useState('국민성장펀드');
  const [category, setCategory] = useState('경제/정책');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');

  const selectedTrend = useMemo(() => trends.find((trend) => trend.keyword === keyword), [keyword]);

  async function generateDraft() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category }),
      });
      if (!response.ok) throw new Error('초안 생성에 실패했습니다.');
      const data = await response.json();
      setDraft(data.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="logo"><span className="logo-mark">XP</span><span>Admin</span></div>
        <p className="subtle">트렌드 감지 → AI 초안 → 이미지 프롬프트 → 승인 발행 흐름을 관리합니다.</p>
        <div className="grid" style={{ marginTop: 28 }}>
          <a className="tag" href="#trends">오늘의 트렌드</a>
          <a className="tag" href="#draft">초안 생성</a>
          <a className="tag" href="#publish">발행 준비</a>
        </div>
      </aside>

      <section className="admin-main">
        <div className="section-head">
          <div>
            <div className="eyebrow">XPINGER CONTROL ROOM</div>
            <h1 style={{ fontSize: 56 }}>AI 블로그 운영실</h1>
            <p className="subtle">첫 버전은 안전하게 “자동 초안 + 사람 승인” 방식으로 설계했습니다.</p>
          </div>
        </div>

        <section id="trends" className="section" style={{ paddingTop: 12 }}>
          <div className="grid three">
            <div className="card card-pad"><div className="subtle">감지 키워드</div><div className="kpi">{trends.length}</div></div>
            <div className="card card-pad"><div className="subtle">최고 점수</div><div className="kpi">{Math.max(...trends.map((t) => t.score))}</div></div>
            <div className="card card-pad"><div className="subtle">발행 모드</div><div className="kpi">검토</div></div>
          </div>

          <div className="card card-pad" style={{ marginTop: 18 }}>
            <h2 style={{ fontSize: 32 }}>오늘의 후보 키워드</h2>
            {trends.map((trend) => (
              <button
                key={trend.keyword}
                className="trend"
                style={{ width: '100%', background: 'transparent', border: 0, textAlign: 'left', cursor: 'pointer' }}
                onClick={() => { setKeyword(trend.keyword); setCategory(trend.category); }}
              >
                <div>
                  <div className="meta"><span className="tag">{trend.category}</span><span>{trend.velocity}</span></div>
                  <h3 className="post-title" style={{ fontSize: 22 }}>{trend.keyword}</h3>
                  <p className="subtle" style={{ margin: 0 }}>{trend.reason}</p>
                </div>
                <div className="score">{trend.score}</div>
              </button>
            ))}
          </div>
        </section>

        <section id="draft" className="section">
          <div className="grid posts">
            <div className="card card-pad">
              <h2 style={{ fontSize: 32 }}>AI 초안 생성</h2>
              <p className="subtle">API 키가 없으면 mock 모드로 동작합니다. 나중에 OpenAI/Claude 키를 넣으면 실제 생성으로 전환합니다.</p>
              <div className="form">
                <label>
                  <span className="subtle">키워드</span>
                  <input className="input" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                </label>
                <label>
                  <span className="subtle">카테고리</span>
                  <input className="input" value={category} onChange={(event) => setCategory(event.target.value)} />
                </label>
                {selectedTrend && <p className="subtle">선택된 트렌드: {selectedTrend.reason}</p>}
                <button className="btn" onClick={generateDraft} disabled={loading}>{loading ? '생성 중...' : '초안 생성하기 →'}</button>
                {error && <p style={{ color: '#b42318' }}>{error}</p>}
              </div>
            </div>

            <div className="card card-pad" id="publish">
              <h2 style={{ fontSize: 32 }}>발행 체크리스트</h2>
              <p className="subtle">• 출처가 확인되었는가?</p>
              <p className="subtle">• 숫자/정책 내용이 과장되지 않았는가?</p>
              <p className="subtle">• 투자 조언처럼 보이는 문장이 없는가?</p>
              <p className="subtle">• 인물/기관 관련 표현이 명예훼손 위험 없이 균형적인가?</p>
              <button className="btn secondary" disabled>승인 후 발행 — DB 연결 후 활성화</button>
            </div>
          </div>

          {draft && (
            <div className="card card-pad" style={{ marginTop: 18 }}>
              <div className="meta"><span className="tag">초안</span><span>{category}</span></div>
              <h2 style={{ fontSize: 38, marginTop: 12 }}>{draft.title}</h2>
              <p className="subtle" style={{ fontSize: 18 }}>{draft.excerpt}</p>
              <div className="visual" style={{ borderRadius: 26, margin: '22px 0' }} />
              <h3>본문</h3>
              <article className="article-body" style={{ fontSize: 17 }}>{draft.content}</article>
              <h3>태그</h3>
              <p className="subtle">{draft.tags.map((tag) => `#${tag}`).join(' ')}</p>
              <h3>이미지 프롬프트</h3>
              <textarea className="textarea" readOnly value={draft.imagePrompt} />
              <h3>출처 후보</h3>
              {draft.sources.map((source) => <p className="subtle" key={source.title}>• {source.publisher} — {source.title}</p>)}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
