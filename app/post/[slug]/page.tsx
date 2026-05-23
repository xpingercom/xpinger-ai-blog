import { notFound } from 'next/navigation';
import { getPublishedPost, listPosts } from '@/lib/posts-store';
import { listAds } from '@/lib/ads-store';
import { AdSlot } from '@/components/AdSlot';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await listPosts('published');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return { title: `${post.title} | XPinger`, description: post.excerpt };
}

function splitContent(content: string) {
  const paragraphs = content.split('\n\n').filter(Boolean);
  const middle = Math.max(1, Math.ceil(paragraphs.length / 2));
  return { before: paragraphs.slice(0, middle), after: paragraphs.slice(middle) };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, ads] = await Promise.all([getPublishedPost(slug), listAds()]);
  if (!post) notFound();

  const inArticleAd = ads.find((ad) => ad.id === 'in-article');
  const { before, after } = splitContent(post.content);

  return (
    <main className="container article">
      <div className="meta"><span className="tag">{post.category}</span><span>{post.publishedAt}</span><span>{post.readingTime}</span></div>
      <h1 style={{ marginTop: 18 }}>{post.title}</h1>
      <p className="subtle" style={{ fontSize: 21 }}>{post.excerpt}</p>
      <div className={`visual bg-gradient-to-br ${post.featuredGradient}`} style={{ borderRadius: 34, margin: '34px 0' }} />
      <article className="article-body">
        {before.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <AdSlot ad={inArticleAd} />
        {after.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
      <section className="card card-pad" style={{ marginTop: 38 }}>
        <h2 style={{ fontSize: 28 }}>참고 출처</h2>
        {post.sources.length ? post.sources.map((source) => (
          <p key={source.title} className="subtle">• {source.publisher} — {source.title}</p>
        )) : <p className="subtle">출처는 관리자 검토 후 추가됩니다.</p>}
      </section>
      <section className="card card-pad" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 28 }}>이미지 생성 프롬프트</h2>
        <p className="subtle">{post.imagePrompt}</p>
      </section>
    </main>
  );
}
