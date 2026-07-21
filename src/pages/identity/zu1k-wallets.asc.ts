import type { APIRoute } from 'astro';
import { signedWalletMessage } from '../../data/identity';

export const GET: APIRoute = () => new Response(signedWalletMessage, {
  headers: {
    'Cache-Control': 'public, max-age=3600',
    'Content-Disposition': 'attachment; filename="zu1k-wallets.asc"',
    'Content-Type': 'application/pgp-signature; charset=utf-8',
  },
});
