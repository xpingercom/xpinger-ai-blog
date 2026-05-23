import { posts as samplePosts } from './data';
import { slugify } from './slug';
import { hasSupabase, supabaseRequest } from './supabase-rest';
import type { Post, Source } from './types';

export type PostStatus = 'draft' | 'published';

export type StoredPost = Post & {
  id?: string;
  status: PostStatus;
  createdAt?: string;
  updatedAt?: string;
};

type SupabasePostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[] | null;
  status: string;
  image_prompt: string | null;
  sources?: Source[] | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function toPost(row: SupabasePostRow): StoredPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    status: row.status === 'published' ? 'published' : 'draft',
    publishedAt: row.published_at?.slice(0, 10) || row.created_at.slice(0, 10),
    readingTime: `${Math.max(1, Math.ceil(row.content.length / 650))}분`,
    featuredGradient: 'from-blue-50 via-sky-100 to-indigo-100',
    imagePrompt: row.image_prompt || '',
    sources: row.sources || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sample(status: PostStatus = 'published'): StoredPost[] {
  return samplePosts.map((post) => ({ ...post, status }));
}

export async function listPosts(status?: PostStatus): Promise<StoredPost[]> {
  if (!hasSupabase()) {
    return status === 'draft' ? [] : sample('published');
  }

  const search = new URLSearchParams({
    select: '*',
    order: 'published_at.desc.nullslast,created_at.desc',
  });
  if (status) search.set('status', `eq.${status}`);

  const rows = await supabaseRequest<SupabasePostRow[]>('posts', { search: search.toString() });
  return rows.map(toPost);
}

export async function getPublishedPost(slug: string): Promise<StoredPost | undefined> {
  if (!hasSupabase()) return sample('published').find((post) => post.slug === slug);

  const rows = await supabaseRequest<SupabasePostRow[]>('posts', {
    search: new URLSearchParams({ select: '*', slug: `eq.${slug}`, status: 'eq.published', limit: '1' }).toString(),
  });
  return rows[0] ? toPost(rows[0]) : undefined;
}

export async function saveDraft(input: Partial<StoredPost> & { title: string; content: string; category: string }) {
  if (!hasSupabase()) {
    throw new Error('DB_NOT_CONFIGURED');
  }

  const now = new Date().toISOString();
  const slug = input.slug || slugify(input.title);
  const payload = {
    title: input.title,
    slug,
    excerpt: input.excerpt || '',
    content: input.content,
    category: input.category,
    tags: input.tags || [],
    status: 'draft',
    image_prompt: input.imagePrompt || '',
    sources: input.sources || [],
    updated_at: now,
  };

  const rows = await supabaseRequest<SupabasePostRow[]>('posts', {
    method: 'POST',
    search: 'on_conflict=slug',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  });

  return toPost(rows[0]);
}

export async function publishPost(slug: string) {
  if (!hasSupabase()) {
    throw new Error('DB_NOT_CONFIGURED');
  }

  const now = new Date().toISOString();
  const rows = await supabaseRequest<SupabasePostRow[]>('posts', {
    method: 'PATCH',
    search: new URLSearchParams({ slug: `eq.${slug}` }).toString(),
    body: { status: 'published', published_at: now, updated_at: now },
    prefer: 'return=representation',
  });

  return rows[0] ? toPost(rows[0]) : null;
}
