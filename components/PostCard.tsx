import Link from 'next/link';
import type { Post } from '@/lib/types';

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className="card">
      <Link href={`/post/${post.slug}`}>
        <div className={`visual bg-gradient-to-br ${post.featuredGradient}`} />
        <div className="card-pad">
          <div className="meta"><span className="tag">{post.category}</span><span>{post.publishedAt}</span><span>{post.readingTime}</span></div>
          <h3 className="post-title" style={{ fontSize: large ? 32 : undefined }}>{post.title}</h3>
          <p className="subtle">{post.excerpt}</p>
          <div className="meta" style={{ marginTop: 18 }}>{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        </div>
      </Link>
    </article>
  );
}
