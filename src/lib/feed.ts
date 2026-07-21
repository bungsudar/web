import rss from '@astrojs/rss';
import { SITE } from '../consts';
import {
  getAbsolutePostUrl,
  getExcerpt,
  getPublishedPosts,
  normalizeTaxonomy,
  type PostEntry,
} from './content';

export const FEED_ITEM_LIMIT = 20;
export const FEED_STYLESHEET_PATH = '/xsl/feed.xsl';

export interface FeedPost {
  title: string;
  url: string;
  publishedAt: Date;
  summary: string;
  categories: string[];
}

export function getSiteUrl(site?: URL | null): URL {
  return site ?? new URL(SITE.url);
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function toFeedPost(post: PostEntry, site?: URL | null): FeedPost {
  return {
    title: post.data.title,
    url: getAbsolutePostUrl(post, getSiteUrl(site)),
    publishedAt: post.data.date,
    summary: getExcerpt(post, 320),
    categories: normalizeTaxonomy([
      ...normalizeTaxonomy(post.data.categories),
      ...normalizeTaxonomy(post.data.tags),
    ]),
  };
}

export async function getFeedPosts(site?: URL | null): Promise<FeedPost[]> {
  const posts = await getPublishedPosts({ limit: FEED_ITEM_LIMIT });
  return posts.map((post) => toFeedPost(post, site));
}

export async function createRssFeed(site?: URL | null, selfPath = '/rss.xml'): Promise<Response> {
  const siteUrl = getSiteUrl(site);
  const posts = await getFeedPosts(siteUrl);
  const newestDate = posts[0]?.publishedAt ?? new Date();
  const copyright = `© ${SITE.since}–${new Date().getFullYear()} ${SITE.author}`;

  const response = await rss({
    title: SITE.title,
    description: SITE.description,
    site: siteUrl,
    stylesheet: FEED_STYLESHEET_PATH,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${escapeXml(SITE.locale)}</language>`,
      `<lastBuildDate>${newestDate.toUTCString()}</lastBuildDate>`,
      `<atom:link href="${escapeXml(new URL(selfPath, siteUrl).href)}" rel="self" type="application/rss+xml" />`,
      `<managingEditor>${escapeXml(`${SITE.email} (${SITE.author})`)}</managingEditor>`,
      `<webMaster>${escapeXml(`${SITE.email} (${SITE.author})`)}</webMaster>`,
      `<copyright>${escapeXml(copyright)}</copyright>`,
      '<generator>Astro</generator>',
    ].join(''),
    items: posts.map((post) => ({
      title: post.title,
      link: post.url,
      pubDate: post.publishedAt,
      description: post.summary,
      author: SITE.email,
      categories: post.categories,
    })),
  });

  return withFeedHeaders(response, 'application/rss+xml');
}

export async function createAtomFeed(site?: URL | null, selfPath = '/atom.xml'): Promise<Response> {
  const siteUrl = getSiteUrl(site);
  const posts = await getFeedPosts(siteUrl);
  const updated = (posts[0]?.publishedAt ?? new Date()).toISOString();
  const selfUrl = new URL(selfPath, siteUrl).href;
  const homeUrl = siteUrl.href;
  const iconUrl = new URL('/favicon-32x32.png', siteUrl).href;
  const copyright = `© ${SITE.since}–${new Date().getFullYear()} ${SITE.author}`;

  const entries = posts
    .map(
      (post) => `
  <entry>
    <title type="text">${escapeXml(post.title)}</title>
    <link href="${escapeXml(post.url)}" rel="alternate" type="text/html" />
    <id>${escapeXml(post.url)}</id>
    <published>${post.publishedAt.toISOString()}</published>
    <updated>${post.publishedAt.toISOString()}</updated>
    <summary type="text">${escapeXml(post.summary)}</summary>
    ${post.categories.map((category) => `<category term="${escapeXml(category)}" />`).join('')}
  </entry>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="${FEED_STYLESHEET_PATH}" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(SITE.locale)}">
  <title type="text">${escapeXml(SITE.title)}</title>
  <subtitle type="text">${escapeXml(SITE.description)}</subtitle>
  <id>${escapeXml(homeUrl)}</id>
  <link href="${escapeXml(homeUrl)}" rel="alternate" type="text/html" />
  <link href="${escapeXml(selfUrl)}" rel="self" type="application/atom+xml" />
  <updated>${updated}</updated>
  <generator uri="https://astro.build/">Astro</generator>
  <icon>${escapeXml(iconUrl)}</icon>
  <rights>${escapeXml(copyright)}</rights>
  <author>
    <name>${escapeXml(SITE.author)}</name>
    <email>${escapeXml(SITE.email)}</email>
    <uri>${escapeXml(homeUrl)}</uri>
  </author>${entries}
</feed>
`;

  return withFeedHeaders(new Response(xml), 'application/atom+xml');
}

function withFeedHeaders(response: Response, mediaType: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('Content-Type', `${mediaType}; charset=utf-8`);
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
