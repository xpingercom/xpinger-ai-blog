export function slugify(input: string) {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019]/g, '')
    .replace(/[\u201c\u201d]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return normalized || `post-${Date.now()}`;
}
