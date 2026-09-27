// @ts-check
import { defineConfig } from 'astro/config';

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
});
