import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../consts';

export type PostEntry = CollectionEntry<'posts'>;
export type DateInput = Date | string | number;
export type TaxonomyKind = 'tags' | 'categories';

export interface PublishedPostOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
  limit?: number;
  now?: DateInput;
}

export interface PostFilter {
  category?: string;
  tag?: string;
  query?: string;
}

export interface ReadingTime {
  /** Estimated whole minutes, with a minimum of one minute. */
  minutes: number;
  /** CJK characters plus space-delimited non-CJK words. */
  words: number;
  text: string;
}

export interface TaxonomyTerm {
  name: string;
  value: string;
  slug: string;
  url: string;
  count: number;
}

export interface AdjacentPosts {
  /** The chronologically older article. */
  previous: PostEntry | null;
  /** The chronologically newer article. */
  next: PostEntry | null;
  older: PostEntry | null;
  newer: PostEntry | null;
}

const SHANGHAI_TIME_ZONE = SITE.timezone;
const CJK_CHARACTER = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const NON_CJK_WORD = /[\p{Letter}\p{Number}]+(?:['’_-][\p{Letter}\p{Number}]+)*/gu;

const dateFormatters = {
  long: new Intl.DateTimeFormat(SITE.locale, {
    dateStyle: 'long',
    timeZone: SHANGHAI_TIME_ZONE,
  }),
  short: new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: SHANGHAI_TIME_ZONE,
    year: 'numeric',
  }),
  datetime: new Intl.DateTimeFormat(SITE.locale, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: SHANGHAI_TIME_ZONE,
  }),
} as const;

/**
 * Parse historical dates without an explicit offset as Asia/Shanghai time.
 * Content collection dates have already been coerced by Astro, but this also
 * keeps direct string use deterministic on build machines in other time zones.
 */
export function toDate(value: DateInput): Date {
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value === 'number') return new Date(value);

  const input = value.trim();
  const hasExplicitOffset = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(input);
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input);
  const normalized = input.replace(' ', 'T');
  return new Date(hasExplicitOffset ? normalized : `${normalized}${isDateOnly ? 'T00:00:00' : ''}+08:00`);
}

export function formatDate(value: DateInput, style: keyof typeof dateFormatters = 'long'): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '';

  if (style !== 'short') return dateFormatters[style].format(date);

  // `en-CA` is normally ISO-like, but formatToParts avoids locale differences
  // between Node/ICU builds.
  const parts = Object.fromEntries(
    dateFormatters.short
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatDateTime(value: DateInput): string {
  return formatDate(value, 'datetime');
}

export function formatPostDate(post: PostEntry, style: keyof typeof dateFormatters = 'long'): string {
  return formatDate(post.data.date, style);
}

/** Return the local ISO-8601 date in Asia/Shanghai (YYYY-MM-DD). */
export function formatDateISO(value: DateInput): string {
  return formatDate(value, 'short');
}

function cleanPathSegment(segment: string): string {
  return segment.trim().replace(/^\.+$|[?#]/g, '-');
}

export function getPostSlug(post: PostEntry | string): string {
  const raw = typeof post === 'string' ? post : post.data.slug || post.id;
  const normalized = raw
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/^posts\//i, '')
    .replace(/\.mdx?$/i, '')
    .replace(/\/index$/i, '');

  return normalized
    .split('/')
    .map(cleanPathSegment)
    .filter(Boolean)
    .join('/');
}

export function encodePath(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function getPostUrl(post: PostEntry | string): string {
  const slug = getPostSlug(post);
  return slug ? `/posts/${encodePath(slug)}/` : '/posts/';
}

export function getAbsolutePostUrl(post: PostEntry | string, site: URL | string = SITE.url): string {
  return new URL(getPostUrl(post), site).href;
}

export function sortPostsByDate(
  posts: readonly PostEntry[],
  direction: 'asc' | 'desc' = 'desc',
): PostEntry[] {
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...posts].sort((a, b) => {
    const dateDifference = a.data.date.getTime() - b.data.date.getTime();
    if (dateDifference !== 0) return dateDifference * multiplier;
    return a.id.localeCompare(b.id, SITE.locale) * multiplier;
  });
}

export const getSortedPosts = sortPostsByDate;

export function isPublishedPost(
  post: PostEntry,
  { includeDrafts = false, includeFuture = false, now = new Date() }: PublishedPostOptions = {},
): boolean {
  if (!includeDrafts && post.data.draft) return false;
  return includeFuture || post.data.date.getTime() <= toDate(now).getTime();
}

export async function getPublishedPosts(options: PublishedPostOptions = {}): Promise<PostEntry[]> {
  const posts = await getCollection('posts');
  const published = sortPostsByDate(posts.filter((post) => isPublishedPost(post, options)));
  return options.limit === undefined ? published : published.slice(0, Math.max(0, options.limit));
}

export async function getAllPosts(options: Omit<PublishedPostOptions, 'includeDrafts'> = {}): Promise<PostEntry[]> {
  return getPublishedPosts({ ...options, includeDrafts: true, includeFuture: options.includeFuture ?? true });
}

function taxonomyKey(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase(SITE.locale);
}

const TAXONOMY_LABELS: Record<TaxonomyKind, Record<string, string>> = {
  categories: {
    coding: '编程',
    cryptography: '密码学',
    event: '事件',
    experience: '经验',
    learn: '学习',
    life: '生活',
    popular: '当下流行',
    reverse: '逆向',
    share: '分享',
    thinking: '思考',
    tutorial: '教程',
    'web-security': 'Web 安全',
    writing: '文字',
  },
  tags: {
    coding: '编程',
    cryptography: '密码学',
    event: '事件',
    learn: '学习',
    life: '生活',
    macro: '宏',
    mitm: 'MITM',
    network: '网络',
    psychology: '心理学',
    reverse: '逆向',
    share: '分享',
    'social-engineering': '社会工程学',
    thinking: '思考',
    tutorial: '教程',
    ulimit: 'Ulimit',
    'web-security': 'Web 安全',
    writing: '文字',
  },
};

export function getTaxonomyLabel(kind: TaxonomyKind, value: string): string {
  return TAXONOMY_LABELS[kind][taxonomyKey(value)] ?? value;
}

export function normalizeTaxonomy(values: string | readonly string[] | null | undefined): string[] {
  if (!values) return [];

  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const rawValue of typeof values === 'string' ? [values] : values) {
    const value = rawValue.normalize('NFKC').replace(/\s+/g, ' ').trim();
    const key = taxonomyKey(value);
    if (!value || seen.has(key)) continue;
    seen.add(key);
    normalized.push(value);
  }
  return normalized;
}

export function slugifyTaxonomy(value: string): string {
  const slug = normalizeTaxonomy(value)[0] ?? '';
  return slug
    .toLocaleLowerCase(SITE.locale)
    .split(/[\\/]+/)
    .map((segment) => segment
      .replace(/['’]/g, '')
      .replace(/[^\p{Letter}\p{Number}\p{Mark}+._~-]+/gu, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .join('/');
}

export const getTaxonomySlug = slugifyTaxonomy;

export function getTaxonomyUrl(kind: TaxonomyKind, value: string): string {
  return `/${kind}/${encodePath(slugifyTaxonomy(value))}/`;
}

export function filterPostsByTaxonomy(
  posts: readonly PostEntry[],
  kind: TaxonomyKind,
  term: string,
): PostEntry[] {
  const expected = slugifyTaxonomy(term);
  return posts.filter((post) =>
    normalizeTaxonomy(post.data[kind]).some((value) => slugifyTaxonomy(value) === expected),
  );
}

export function filterPosts(posts: readonly PostEntry[], filter: PostFilter = {}): PostEntry[] {
  let result = [...posts];
  if (filter.category) result = filterPostsByTaxonomy(result, 'categories', filter.category);
  if (filter.tag) result = filterPostsByTaxonomy(result, 'tags', filter.tag);

  const query = filter.query?.normalize('NFKC').trim().toLocaleLowerCase(SITE.locale);
  if (query) {
    result = result.filter((post) => {
      const searchable = [
        post.data.title,
        post.data.description,
        post.data.summary,
        ...normalizeTaxonomy(post.data.tags),
        ...normalizeTaxonomy(post.data.categories),
        stripMarkdown(post.body || ''),
      ]
        .filter(Boolean)
        .join(' ')
        .normalize('NFKC')
        .toLocaleLowerCase(SITE.locale);
      return searchable.includes(query);
    });
  }

  return sortPostsByDate(result);
}

export function collectTaxonomy(
  posts: readonly PostEntry[],
  kind: TaxonomyKind,
  sort: 'name' | 'count' = 'name',
): TaxonomyTerm[] {
  const terms = new Map<string, { value: string; count: number }>();
  for (const post of posts) {
    for (const name of normalizeTaxonomy(post.data[kind])) {
      const slug = slugifyTaxonomy(name);
      const current = terms.get(slug);
      terms.set(slug, { value: current?.value ?? name, count: (current?.count ?? 0) + 1 });
    }
  }

  const result = [...terms.entries()].map(([slug, term]) => ({
    ...term,
    name: getTaxonomyLabel(kind, term.value),
    slug,
    url: getTaxonomyUrl(kind, term.value),
  }));

  return result.sort((a, b) =>
    sort === 'count'
      ? b.count - a.count || a.name.localeCompare(b.name, SITE.locale)
      : a.name.localeCompare(b.name, SITE.locale),
  );
}

export function getTags(posts: readonly PostEntry[], sort: 'name' | 'count' = 'name'): TaxonomyTerm[] {
  return collectTaxonomy(posts, 'tags', sort);
}

export function getCategories(posts: readonly PostEntry[], sort: 'name' | 'count' = 'name'): TaxonomyTerm[] {
  return collectTaxonomy(posts, 'categories', sort);
}

export const getTaxonomyCounts = collectTaxonomy;

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, (entity, key: string) => {
    if (key.startsWith('#')) {
      const hexadecimal = key[1]?.toLocaleLowerCase() === 'x';
      const codePoint = Number.parseInt(key.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    }
    return namedEntities[key.toLocaleLowerCase()] ?? entity;
  });
}

/** Convert Markdown to compact plain text without throwing away code contents. */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';

  const text = markdown
    .replace(/^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/\{\{[%<][\s\S]*?[>%]\}\}/g, ' ')
    .replace(/^\s*(```+|~~~+).*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, ' $1 ')
    .replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, ' ')
    .replace(/<((?:https?:\/\/|mailto:)[^>]+)>/gi, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/`([^`]+)`/g, ' $1 ')
    .replace(/\[\^[^\]]+\]/g, ' ')
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]\s+|\d+[.)]\s+)/gm, ' ')
    .replace(/^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/gm, ' ')
    .replace(/[|]/g, ' ')
    .replace(/(\*\*|__|~~|==)(.*?)\1/g, '$2')
    .replace(/[*_~]/g, '')
    .replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, '$1')
    .replace(/\$\$?|\^/g, ' ');

  return decodeHtmlEntities(text).replace(/\s+/g, ' ').trim();
}

export const getPlainText = stripMarkdown;

export function truncateText(value: string, length = 180): string {
  const text = value.trim();
  const characters = Array.from(text);
  if (characters.length <= length) return text;

  const truncated = characters.slice(0, Math.max(0, length)).join('').replace(/[\s,，、;；:：.!！?？]+$/u, '');
  return `${truncated}…`;
}

export function getExcerpt(post: PostEntry | string, length = 180): string {
  const source =
    typeof post === 'string'
      ? post
      : post.data.summary || post.data.description || post.body || '';
  return truncateText(stripMarkdown(source), length);
}

export function getReadingTime(post: PostEntry | string): ReadingTime {
  const source = typeof post === 'string' ? post : post.body || '';
  const plainText = stripMarkdown(source);
  const cjkCount = plainText.match(CJK_CHARACTER)?.length ?? 0;
  const nonCjkText = plainText.replace(CJK_CHARACTER, ' ');
  const nonCjkWordCount = nonCjkText.match(NON_CJK_WORD)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil(cjkCount / 500 + nonCjkWordCount / 220));

  return {
    minutes,
    words: cjkCount + nonCjkWordCount,
    text: `${minutes} 分钟阅读`,
  };
}

export const calculateReadingTime = getReadingTime;

/**
 * Posts are ordered newest first. `previous` is therefore the older article
 * and `next` is the newer article, matching conventional article navigation.
 */
export function getAdjacentPosts(posts: readonly PostEntry[], current: PostEntry | string): AdjacentPosts {
  const sorted = sortPostsByDate(posts);
  const currentSlug = getPostSlug(current);
  const index = sorted.findIndex((post) => getPostSlug(post) === currentSlug);
  const older = index >= 0 ? sorted[index + 1] ?? null : null;
  const newer = index > 0 ? sorted[index - 1] ?? null : null;
  return { previous: older, next: newer, older, newer };
}
