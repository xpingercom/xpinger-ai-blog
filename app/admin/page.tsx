'use client';

import { useEffect, useMemo, useState } from 'react';
import { trends } from '@/lib/data';
import { slugify } from '@/lib/slug';

type Draft = {
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  tags: string[];
  imagePrompt: string;
  sources: { title: string; publisher: string; url: string }[];
};

type SavedPost = Draft & {
  slug: string;
  status: 'draft' | 'published';
  publishedAt?: string;
};

type AdSlot = {
  id: 'top-banner' | 'in-article';
  name: string;
  enabled: boolean;
  label: string;
  body: string;
  html?: string;
};

type Step = 'select' | 'generate' | 'review';
type AdminTab = 'draft' | 'ads' | 'posts';

const setupItems = [
  { label: '도메인 연결', value: '완료', ok: true, detail: 'xpinger.com 정상 연결' },
  { label: 'AI 글 생성', value: '완료', ok: true, detail: 'OpenAI 실제 생성 모드 연결 완료' },
  { label: 'DB 저장', value: 'Supabase 필요', ok: false, detail: '환경변수 연결 후 저장/발행이 영구 보관됩니다.' },
  { label: '광고 관리', value: '준비됨', ok: true, detail: '상단/본문 광고 2곳을 관리자에서 수정합니다.' },
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

function Message({ text, tone = 'info' }: { text: string; tone?: 'info' | 'error' | 'success' }) {
  const color = tone === 'error' ? '#b42318' : tone === 'success' ? '#067647' : '#475467';
  const bg = tone === 'error' ? '#fff1f0' : tone === 'success' ? '#ecfdf3' : '#f8fafc';
  return <p style={{ color, background: bg, border: '1px solid var(--line)', borderRadius: 14, padding: 12 }}>{text}</p>;
}

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('draft');
  const [keyword, setKeyword] = useState('국민성장펀드');
  const [category, setCategory] = useState('경제/정책');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedSlug, setSavedSlug] = useState('');
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [ads, setAds] = useState<AdSlot[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedTrend = useMemo(() => trends.find((trend) => trend.keyword === keyword), [keyword]);
  const currentStep: Step = draft ? 'review' : keyword ? 'generate' : 'select';

  useEffect(() => {
    refreshPosts();
    refreshAds();
  }, []);

  async function refreshPosts() {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch {
      // 목록은 보조 기능이라 조용히 무시합니다.
    }
  }

  async function refreshAds() {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data.ads || []);
    } catch {
      // 광고 기본값은 서버에서 표시됩니다.
    }
  }

  function updateDraft(field: keyof Draft, value: string) {
    if (!draft) return;
    if (field === 'tags') {
      setDraft({ ...draft, tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) });
      return;
    }
    setDraft({ ...draft, [field]: value });
  }

  async function generateDraft() {
    setLoading(true);
    setError('');
    setNotice('');
    setCopied(false);
    setSavedSlug('');
    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category }),
      });
      if (!response.ok) throw new Error('초안 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      const data = await response.json();
      setDraft({ ...data.draft, category, slug: slugify(data.draft.title) });
      setNotice(data.mode === 'openai' ? 'OpenAI로 실제 초안을 생성했습니다.' : 'Mock 초안을 생성했습니다.');
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

  async function saveDraft() {
    if (!draft) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = { ...draft, slug: draft.slug || slugify(draft.title), category };
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '초안 저장에 실패했습니다.');
      setSavedSlug(data.post.slug);
      setDraft({ ...draft, slug: data.post.slug });
      setNotice('초안을 저장했습니다. 이제 발행할 수 있습니다.');
      await refreshPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function publishCurrent() {
    const slug = savedSlug || draft?.slug;
    if (!slug) return setError('먼저 초안을 저장해주세요.');
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/publish`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '발행에 실패했습니다.');
      setNotice(`발행 완료: /post/${data.post.slug}`);
      await refreshPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '발행 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  function updateAd(index: number, patch: Partial<AdSlot>) {
    setAds((current) => current.map((ad, i) => (i === index ? { ...ad, ...patch } : ad)));
  }

  async function saveAds() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '광고 저장에 실패했습니다.');
      setAds(data.ads || ads);
      setNotice('광고 설정을 저장했습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '광고 저장 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="logo"><span className="logo-mark">XP</span><span>Admin</span></div>
        <p className="subtle">XPinger 운영실입니다. 초안 생성, 저장/발행, 광고 위치를 관리합니다.</p>
        <div className="grid" style={{ marginTop: 28 }}>
          <button className="tag" onClick={() => setTab('draft')}>글 작성/발행</button>
          <button className="tag" onClick={() => setTab('ads')}>광고 관리</button>
          <button className="tag" onClick={() => setTab('posts')}>글 목록</button>
          <a className="tag" href="/" target="_blank">사이트 보기</a>
        </div>
      </aside>

      <section className="admin-main">
        <section className="hero" style={{ padding: '18px 0 34px' }}>
          <div className="eyebrow">XPINGER CONTROL ROOM</div>
          <h1 style={{ fontSize: 58 }}>초안 생성부터 광고 관리까지 한곳에서.</h1>
          <p>AI가 글 초안을 만들고, 관리자가 확인한 뒤 저장/발행합니다. 광고는 상단 배너와 본문 중간 2곳만 심플하게 운영합니다.</p>
          <div className="hero-actions">
            <button className="btn" onClick={() => setTab('draft')}>글 작성하기 →</button>
            <button className="btn secondary" onClick={() => setTab('ads')}>광고 관리</button>
          </div>
        </section>

        {error && <Message text={error} tone="error" />}
        {notice && <Message text={notice} tone="success" />}

        {tab === 'draft' && (
          <>
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="grid three">
                <StepCard number={1} title="이슈 선택" description="오늘 뜨는 키워드 중 하나를 고릅니다." active={currentStep === 'select' || currentStep === 'generate'} />
                <StepCard number={2} title="AI 초안 생성" description="제목, 본문, 태그, 이미지 프롬프트를 만듭니다." active={currentStep === 'generate'} />
                <StepCard number={3} title="저장/발행" description="내용을 수정하고 저장한 뒤 공개 발행합니다." active={currentStep === 'review'} />
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <h2>1단계. 오늘의 이슈 선택</h2>
                  <p className="subtle">후보를 누르면 키워드가 자동 입력됩니다.</p>
                </div>
              </div>

              <div className="grid posts">
                <div className="card card-pad">
                  {trends.map((trend) => (
                    <button
                      key={trend.keyword}
                      className="trend"
                      style={{ width: '100%', background: trend.keyword === keyword ? '#f7f9ff' : 'transparent', border: 0, textAlign: 'left', cursor: 'pointer', borderRadius: 18, paddingLeft: 14, paddingRight: 14 }}
                      onClick={() => { setKeyword(trend.keyword); setCategory(trend.category); setDraft(null); setCopied(false); setSavedSlug(''); }}
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
                  </div>
                </div>
              </div>

              {draft ? (
                <div className="card card-pad" style={{ marginTop: 18 }}>
                  <div className="section-head">
                    <div>
                      <div className="meta"><span className="tag">3단계 검토</span><span>{category}</span></div>
                      <h2 style={{ fontSize: 38, marginTop: 12 }}>초안 수정/발행</h2>
                      <p className="subtle">제목과 본문을 직접 고친 뒤 저장하고 발행하세요.</p>
                    </div>
                    <button className="btn secondary" onClick={copyDraft}>{copied ? '복사 완료' : '초안 복사'}</button>
                  </div>

                  <div className="form">
                    <label><span className="subtle">URL 슬러그</span><input className="input" value={draft.slug || ''} onChange={(event) => updateDraft('slug', event.target.value)} /></label>
                    <label><span className="subtle">제목</span><input className="input" value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} /></label>
                    <label><span className="subtle">요약</span><textarea className="input textarea" value={draft.excerpt} onChange={(event) => updateDraft('excerpt', event.target.value)} /></label>
                    <label><span className="subtle">본문</span><textarea className="input textarea tall" value={draft.content} onChange={(event) => updateDraft('content', event.target.value)} /></label>
                    <label><span className="subtle">태그 — 쉼표로 구분</span><input className="input" value={draft.tags.join(', ')} onChange={(event) => updateDraft('tags', event.target.value)} /></label>
                    <label><span className="subtle">이미지 프롬프트</span><textarea className="input textarea" value={draft.imagePrompt} onChange={(event) => updateDraft('imagePrompt', event.target.value)} /></label>
                  </div>

                  <div className="hero-actions" style={{ marginTop: 22 }}>
                    <button className="btn secondary" onClick={saveDraft} disabled={saving}>{saving ? '처리 중...' : '초안 저장'}</button>
                    <button className="btn" onClick={publishCurrent} disabled={saving}>{saving ? '처리 중...' : '발행하기'}</button>
                    {savedSlug && <a className="btn secondary" href={`/post/${savedSlug}`} target="_blank">발행 글 보기</a>}
                  </div>
                </div>
              ) : (
                <div className="card card-pad" style={{ marginTop: 18 }}>
                  <h2 style={{ fontSize: 30 }}>아직 초안이 없습니다.</h2>
                  <p className="subtle">위에서 키워드를 선택하고 “AI 초안 생성하기”를 눌러보세요.</p>
                </div>
              )}
            </section>
          </>
        )}

        {tab === 'ads' && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <h2>광고 관리</h2>
                <p className="subtle">광고는 딱 2곳입니다. ① 메인 상단 배너 ② 글 본문 중간. HTML 코드를 넣으면 애드센스/제휴 배너도 표시할 수 있습니다.</p>
              </div>
              <button className="btn" onClick={saveAds} disabled={saving}>{saving ? '저장 중...' : '광고 설정 저장'}</button>
            </div>
            <div className="grid posts">
              {ads.map((ad, index) => (
                <div className="card card-pad" key={ad.id}>
                  <div className="meta"><span className="tag">{ad.id}</span><span>{ad.enabled ? 'ON' : 'OFF'}</span></div>
                  <h3 className="post-title">{ad.name}</h3>
                  <div className="form">
                    <label><span className="subtle">사용 여부</span><select className="input" value={ad.enabled ? 'on' : 'off'} onChange={(event) => updateAd(index, { enabled: event.target.value === 'on' })}><option value="on">ON</option><option value="off">OFF</option></select></label>
                    <label><span className="subtle">작은 라벨</span><input className="input" value={ad.label} onChange={(event) => updateAd(index, { label: event.target.value })} /></label>
                    <label><span className="subtle">기본 문구</span><textarea className="input textarea" value={ad.body} onChange={(event) => updateAd(index, { body: event.target.value })} /></label>
                    <label><span className="subtle">광고 HTML 코드 — 선택사항</span><textarea className="input textarea tall" value={ad.html || ''} onChange={(event) => updateAd(index, { html: event.target.value })} placeholder="애드센스/배너 HTML 코드를 넣으면 기본 문구 대신 표시됩니다." /></label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'posts' && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <h2>글 목록</h2>
                <p className="subtle">Supabase 연결 전에는 샘플 발행 글만 보입니다. 연결 후 저장/발행 글이 여기에 나타납니다.</p>
              </div>
              <button className="btn secondary" onClick={refreshPosts}>새로고침</button>
            </div>
            <div className="grid posts">
              {posts.map((post) => (
                <div className="card card-pad" key={post.slug}>
                  <div className="meta"><span className="tag">{post.status}</span><span>{post.category}</span></div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="subtle">{post.excerpt}</p>
                  <a className="btn secondary" href={`/post/${post.slug}`} target="_blank">보기</a>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-head">
            <div>
              <h2>연결 상태</h2>
              <p className="subtle">복잡한 설정은 하나씩 연결하면 됩니다.</p>
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
