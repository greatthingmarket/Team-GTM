// src/pages/api/indexnow.ts
import type { APIRoute } from 'astro';
import { submitToIndexNow, submitSitemapToIndexNow } from '../../utils/indexnow';

export const prerender = false;

/**
 * POST /api/indexnow
 * Soumet une ou plusieurs URLs à IndexNow
 * 
 * Body JSON :
 * - { "url": "https://..." }          → Une seule URL
 * - { "urls": ["https://...", ...] }  → Plusieurs URLs
 * - { "sitemap": true }               → Tout le sitemap
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Cas 1 : Soumission du sitemap complet
    if (body.sitemap === true) {
      const result = await submitSitemapToIndexNow();
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cas 2 : Soumission d'une seule URL
    if (body.url) {
      const result = await submitToIndexNow(body.url);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cas 3 : Soumission de plusieurs URLs
    if (body.urls && Array.isArray(body.urls)) {
      const result = await submitToIndexNow(body.urls);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Aucun paramètre valide
    return new Response(
      JSON.stringify({
        error: 'Invalid request. Provide "url", "urls" array, or "sitemap: true"',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('IndexNow API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * GET /api/indexnow?url=...
 * Alternative GET pour tester rapidement
 */
export const GET: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing "url" parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await submitToIndexNow(targetUrl);
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};