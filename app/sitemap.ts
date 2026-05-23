import type { MetadataRoute } from 'next';
import { categories } from '@/lib/data';
import { listPosts } from '@/lib/posts-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xpinger.com';
  const posts = await listPosts('published');
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
    ...categories.map((category) => ({ url: `${baseUrl}/category/${category.slug}`, lastModified: new Date() })),
    ...posts.map((post) => ({ url: `${baseUrl}/post/${post.slug}`, lastModified: new Date(post.publishedAt) })),
  ];
}
