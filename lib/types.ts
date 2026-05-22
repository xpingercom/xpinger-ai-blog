export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Source = {
  title: string;
  publisher: string;
  url: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  imagePrompt: string;
  sources: Source[];
  featuredGradient: string;
};

export type Trend = {
  keyword: string;
  score: number;
  category: string;
  reason: string;
  velocity: string;
};
