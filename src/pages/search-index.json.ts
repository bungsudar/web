import type { APIRoute } from 'astro';
import {
  formatDateISO,
  getExcerpt,
  getPostUrl,
  getPublishedPosts,
  getReadingTime,
  getTaxonomyLabel,
  normalizeTaxonomy,
  stripMarkdown,
} from '../lib/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const index = posts.map((post) => {
    const categories = normalizeTaxonomy(post.data.categories);
    return {
      id: post.id,
      title: post.data.title,
      url: getPostUrl(post),
      date: formatDateISO(post.data.date),
      timestamp: post.data.date.toISOString(),
      summary: getExcerpt(post, 240),
      content: stripMarkdown(post.body || ''),
      tags: normalizeTaxonomy(post.data.tags),
      categories,
      categoryLabel: categories[0] ? getTaxonomyLabel('categories', categories[0]) : '',
      readingTime: getReadingTime(post).minutes,
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
