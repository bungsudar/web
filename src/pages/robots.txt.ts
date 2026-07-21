import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL(SITE.url);
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', siteUrl).href}`, ''].join(
    '\n',
  );

  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
