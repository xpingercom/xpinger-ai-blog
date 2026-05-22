import type { MetadataRoute } from 'next';
import { categories, posts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xpinger.com';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
    ...categories.map((category) => ({ url: `${baseUrl}/category/${category.slug}`, lastModified: new Date() })),
    ...posts.map((post) => ({ url: `${baseUrl}/post/${post.slug}`, lastModified: new Date(post.publishedAt) })),
  ];
}
