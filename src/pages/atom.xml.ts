import type { APIRoute } from 'astro';
import { createAtomFeed } from '../lib/feed';

export const prerender = true;

export const GET: APIRoute = ({ site }) => createAtomFeed(site, '/atom.xml');
