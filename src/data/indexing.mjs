/**
 * Search-engine indexing guard.
 *
 * The site is indexable ONLY when Netlify builds the production context AND
 * the site's primary URL is the official domain. Every other build — Deploy
 * Previews, branch deploys, *.netlify.app production URLs, local builds —
 * is marked noindex (meta robots, X-Robots-Tag header, and robots.txt).
 *
 * Netlify sets CONTEXT and URL automatically at build time.
 */
export const LIVE_ORIGINS = ['https://brighthousecleaning.ca', 'https://www.brighthousecleaning.ca'];

export function isIndexable(env = process.env) {
  const url = (env.URL || '').replace(/\/+$/, '');
  return env.CONTEXT === 'production' && LIVE_ORIGINS.includes(url);
}

const FINAL_ORIGIN = 'https://brighthousecleaning.ca';
const clean = (u) => (u || '').trim().replace(/\/+$/, '');

/**
 * Origin used for social-sharing metadata (og:url, og:image, twitter:image),
 * so link previews work on whatever URL is actually being shared.
 *
 * - Production: Netlify's primary URL (`URL`). Once brighthousecleaning.ca is
 *   the primary domain, this becomes the final domain automatically.
 * - Deploy Previews / branch deploys: that deploy's own URL
 *   (`DEPLOY_PRIME_URL`), then `URL`.
 * - Local builds: the final domain.
 *
 * Canonical URLs, the sitemap and structured data always use the final domain.
 */
export function socialOrigin(env = process.env) {
  const candidates =
    env.CONTEXT === 'production' ? [env.URL, env.DEPLOY_PRIME_URL] : [env.DEPLOY_PRIME_URL, env.URL];
  return clean(candidates.find((u) => clean(u).startsWith('https://'))) || FINAL_ORIGIN;
}
