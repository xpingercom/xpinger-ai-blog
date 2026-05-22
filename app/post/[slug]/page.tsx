import { notFound } from 'next/navigation';
import { getPost, posts } from '@/lib/data';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} | XPinger`, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <main className="container article">
      <div className="meta"><span className="tag">{post.category}</span><span>{post.publishedAt}</span><span>{post.readingTime}</span></div>
      <h1 style={{ marginTop: 18 }}>{post.title}</h1>
      <p className="subtle" style={{ fontSize: 21 }}>{post.excerpt}</p>
      <div className={`visual bg-gradient-to-br ${post.featuredGradient}`} style={{ borderRadius: 34, margin: '34px 0' }} />
      <article className="article-body">{post.content}</article>
      <section className="card card-pad" style={{ marginTop: 38 }}>
        <h2 style={{ fontSize: 28 }}>참고 출처</h2>
        {post.sources.map((source) => (
          <p key={source.title} className="subtle">• {source.publisher} — {source.title}</p>
        ))}
      </section>
      <section className="card card-pad" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 28 }}>이미지 생성 프롬프트</h2>
        <p className="subtle">{post.imagePrompt}</p>
      </section>
    </main>
  );
}
