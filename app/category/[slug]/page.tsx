import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/lib/data';
import { listPosts } from '@/lib/posts-store';
import { PostCard } from '@/components/PostCard';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const posts = await listPosts('published');
  const filtered = posts.filter((post) => post.category === category.name);
  return (
    <main className="container">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="eyebrow">CATEGORY</div>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </section>
      <section className="section">
        <div className="grid posts">
          {filtered.length ? filtered.map((post) => <PostCard post={post} key={post.slug} />) : <p className="subtle">아직 발행된 글이 없습니다.</p>}
        </div>
      </section>
    </main>
  );
}
