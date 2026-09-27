import type { APIRoute } from 'astro';
import { isIndexable } from '../data/indexing.mjs';
import { site } from '../data/site';

export const GET: APIRoute = () => {
  const body = isIndexable()
    ? // /thank-you/ and 404 stay crawlable so their noindex meta can be read;
      // they are excluded from the sitemap.
      `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
    : // Preview / staging build: keep every crawler out.
      `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
