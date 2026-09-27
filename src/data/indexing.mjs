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
