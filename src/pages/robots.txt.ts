import type { APIRoute } from 'astro';
import { isIndexable } from '../data/indexing.mjs';
import { site } from '../data/site';

export const GET: APIRoute = () => {
  const body = isIndexable()
    ? `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${site.url}/sitemap.xml\n`
    : // Preview / staging build: keep every crawler out.
      `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
