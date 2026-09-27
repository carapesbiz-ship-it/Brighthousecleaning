// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro copies the original source photographs into dist/_astro even when
 * pages only use the optimized AVIF/WebP versions. This removes any image in
 * dist/_astro that no built file references, so full-size originals are not
 * published.
 * @returns {import('astro').AstroIntegration}
 */
function pruneUnreferencedImages() {
  return {
    name: 'prune-unreferenced-images',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const assets = path.join(out, '_astro');
        if (!fs.existsSync(assets)) return;

        /** @param {string} d @returns {string[]} */
        const walk = (d) =>
          fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
            const p = path.join(d, e.name);
            return e.isDirectory() ? walk(p) : [p];
          });
        const text = walk(out)
          .filter((f) => /\.(html|css|js|xml|json|webmanifest)$/.test(f))
          .map((f) => fs.readFileSync(f, 'utf8'))
          .join('\n');

        let removed = 0;
        for (const file of fs.readdirSync(assets)) {
          if (!/\.(jpe?g|png)$/i.test(file)) continue;
          if (!text.includes(file)) {
            fs.rmSync(path.join(assets, file));
            removed++;
          }
        }
        logger.info(`Removed ${removed} unreferenced original image(s) from _astro`);
      },
    },
  };
}

export default defineConfig({
  // Canonical domain (update if the final domain changes)
  site: 'https://brighthousecleaning.ca',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  image: {
    responsiveStyles: false,
  },
  prefetch: false,
  integrations: [pruneUnreferencedImages()],
});
