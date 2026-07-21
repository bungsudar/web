import type { APIRoute } from 'astro';
import { createRssFeed } from '../lib/feed';

export const prerender = true;

export const GET: APIRoute = ({ site }) => createRssFeed(site, '/feed.xml');
