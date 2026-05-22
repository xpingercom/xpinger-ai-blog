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

type Step = 'select' | 'generate' | 'review' | 'publish';

const setupItems = [
  { label: '도메인 연결', value: '완료', ok: true, detail: 'xpinger.com 정상 연결' },
  { label: 'AI 글 생성', value: 'Mock 모드', ok: false, detail: 'OpenAI API 키를 넣으면 실제 AI 생성으로 전환' },
  { label: 'DB 저장', value: '준비 중', ok: false, detail: 'Supabase 연결 후 초안/글 저장 가능' },
  { label: '이미지 생성', value: '준비 중', ok: false, detail: '이미지 API 연결 후 대표 이미지 자동 생성' },
];

function StepCard({ number, title, description, active }: { number: number; title: string; description: string; active: boolean }) {
  return (
    <div className="card card-pad" style={{ borderColor: active ? '#111' : undefined, background: active ? '#fff' : 'rgba(255,255,255,.62)' }}>
      <div className="score" style={{ width: 40, height: 40, borderRadius: 14 }}>{number}</div>
      <h3 className="post-title" style={{ fontSize: 21 }}>{title}</h3>
      <p className="subtle" style={{ margin: 0 }}>{description}</p>
    </div>
  );
}

export default function AdminPage() {
  const [keyword, setKeyword] = useState('국민성장펀드');
  const [category, setCategory] = useState('경제/정책');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedTrend = useMemo(() => trends.find((trend) => trend.keyword === keyword), [keyword]);
  const currentStep: Step = draft ? 'review' : keyword ? 'generate' : 'select';

  async function generateDraft() {
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category }),
      });
      if (!response.ok) throw new Error('초안 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      const data = await response.json();
      setDraft(data.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function copyDraft() {
    if (!draft) return;
    const text = `# ${draft.title}\n\n${draft.excerpt}\n\n${draft.content}\n\n태그: ${draft.tags.map((tag) => `#${tag}`).join(' ')}\n\n이미지 프롬프트:\n${draft.imagePrompt}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="logo"><span className="logo-mark">XP</span><span>Admin</span></div>
        <p className="subtle">XPinger 운영실입니다. 지금은 쉽게 테스트하는 단계입니다.</p>
        <div className="grid" style={{ marginTop: 28 }}>
          <a className="tag" href="#start">시작하기</a>
          <a className="tag" href="#draft">초안 만들기</a>
          <a className="tag" href="#status">연결 상태</a>
        </div>
      </aside>

      <section className="admin-main">
        <section id="start" className="hero" style={{ padding: '18px 0 34px' }}>
          <div className="eyebrow">XPINGER CONTROL ROOM</div>
          <h1 style={{ fontSize: 58 }}>오늘 글 하나를 쉽게 만들어보세요.</h1>
          <p>아래 순서대로 진행하면 됩니다. 지금은 테스트 단계라서 실제 발행은 아직 하지 않고, AI 초안을 만들어 확인하는 흐름입니다.</p>
          <div className="hero-actions">
            <a className="btn" href="#draft">초안 만들러 가기 →</a>
            <a className="btn secondary" href="/" target="_blank">사이트 보기</a>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="grid three">
            <StepCard number={1} title="이슈 선택" description="오늘 뜨는 키워드 중 하나를 고릅니다." active={currentStep === 'select' || currentStep === 'generate'} />
            <StepCard number={2} title="AI 초안 생성" description="버튼을 누르면 제목, 본문, 태그를 만듭니다." active={currentStep === 'generate'} />
            <StepCard number={3} title="검토 후 발행" description="내용을 확인하고 나중에 DB 연결 후 발행합니다." active={currentStep === 'review'} />
          </div>
        </section>

        <section id="draft" className="section">
          <div className="section-head">
            <div>
              <h2>1단계. 오늘의 이슈 선택</h2>
              <p className="subtle">아래 후보를 누르면 키워드가 자동으로 입력됩니다.</p>
            </div>
          </div>

          <div className="grid posts">
            <div className="card card-pad">
              {trends.map((trend) => (
                <button
                  key={trend.keyword}
                  className="trend"
                  style={{ width: '100%', background: trend.keyword === keyword ? '#f7f9ff' : 'transparent', border: 0, textAlign: 'left', cursor: 'pointer', borderRadius: 18, paddingLeft: 14, paddingRight: 14 }}
                  onClick={() => { setKeyword(trend.keyword); setCategory(trend.category); setDraft(null); setCopied(false); }}
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

            <div className="card card-pad">
              <h2 style={{ fontSize: 32 }}>2단계. 초안 생성</h2>
              <p className="subtle">선택된 키워드로 블로그 초안을 만듭니다.</p>
              <div className="form">
                <label>
                  <span className="subtle">키워드</span>
                  <input className="input" value={keyword} onChange={(event) => { setKeyword(event.target.value); setDraft(null); }} />
                </label>
                <label>
                  <span className="subtle">카테고리</span>
                  <input className="input" value={category} onChange={(event) => setCategory(event.target.value)} />
                </label>
                {selectedTrend && <p className="subtle">선택됨: {selectedTrend.reason}</p>}
                <button className="btn" onClick={generateDraft} disabled={loading}>{loading ? '초안 만드는 중...' : 'AI 초안 생성하기 →'}</button>
                {error && <p style={{ color: '#b42318' }}>{error}</p>}
              </div>
            </div>
          </div>

          {draft ? (
            <div className="card card-pad" style={{ marginTop: 18 }}>
              <div className="section-head">
                <div>
                  <div className="meta"><span className="tag">3단계 검토</span><span>{category}</span></div>
                  <h2 style={{ fontSize: 38, marginTop: 12 }}>{draft.title}</h2>
                  <p className="subtle" style={{ fontSize: 18 }}>{draft.excerpt}</p>
                </div>
                <button className="btn secondary" onClick={copyDraft}>{copied ? '복사 완료' : '초안 복사'}</button>
              </div>

              <div className="visual" style={{ borderRadius: 26, margin: '22px 0' }} />
              <h3>본문</h3>
              <article className="article-body" style={{ fontSize: 17 }}>{draft.content}</article>

              <div className="grid posts" style={{ marginTop: 24 }}>
                <div className="card card-pad">
                  <h3>태그</h3>
                  <p className="subtle">{draft.tags.map((tag) => `#${tag}`).join(' ')}</p>
                </div>
                <div className="card card-pad">
                  <h3>이미지 프롬프트</h3>
                  <p className="subtle">{draft.imagePrompt}</p>
                </div>
              </div>

              <div className="card card-pad" style={{ marginTop: 18 }}>
                <h3>발행 전 체크</h3>
                <p className="subtle">✓ 출처가 확인되었는지 확인하기</p>
                <p className="subtle">✓ 숫자/정책 내용이 과장되지 않았는지 확인하기</p>
                <p className="subtle">✓ 투자 조언처럼 보이는 문장이 없는지 확인하기</p>
                <button className="btn secondary" disabled>발행하기 — DB 연결 후 활성화</button>
              </div>
            </div>
          ) : (
            <div className="card card-pad" style={{ marginTop: 18 }}>
              <h2 style={{ fontSize: 30 }}>아직 초안이 없습니다.</h2>
              <p className="subtle">위에서 키워드를 선택하고 “AI 초안 생성하기”를 눌러보세요.</p>
            </div>
          )}
        </section>

        <section id="status" className="section">
          <div className="section-head">
            <div>
              <h2>연결 상태</h2>
              <p className="subtle">복잡한 설정은 나중에 하나씩 연결하면 됩니다.</p>
            </div>
          </div>
          <div className="grid three">
            {setupItems.map((item) => (
              <div className="card card-pad" key={item.label}>
                <div className="meta"><span className="tag">{item.ok ? 'OK' : 'NEXT'}</span></div>
                <h3 className="post-title" style={{ fontSize: 22 }}>{item.label}</h3>
                <div className="kpi" style={{ fontSize: 26 }}>{item.value}</div>
                <p className="subtle">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
