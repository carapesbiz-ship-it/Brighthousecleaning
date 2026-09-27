# Bright House Cleaning Services — Website

Astro + TypeScript static site, ready for Netlify. Minimal JavaScript (one small script for the menu, hero slideshow, FAQ, gallery viewer and form validation).

## Run it

```bash
npm install
npm run dev       # http://localhost:4321  (development)
npm run build     # production build → dist/
npm run preview   # serve the production build at http://localhost:4321
```

## Where to edit things

| What | File |
| --- | --- |
| Phone, email, WhatsApp, social links, hours, SEO title/description | `src/data/site.ts` |
| Services, prices, FAQ, service areas, "Why choose us", steps | `src/data/site.ts` |
| Photos, alt text, gallery order, hero slides, hero video, Cindy's portrait | `src/data/photos.ts` |
| Colours, fonts, buttons | `src/styles/global.css` |
| Structured data (LocalBusiness / FAQ schema) | `src/data/schema.ts` |

## Adding the official logo

Place the files in `public/brand/` with these exact names:

- `bright-house-logo-blue.svg` — header (light backgrounds)
- `bright-house-logo-white.svg` — footer, 5-Star Promise, Meet Cindy card
- `bright-house-logo-blue.png` — optional; also added to structured data when present

They are picked up automatically at build time and shown unmodified. Until then a typographic name treatment is shown.

## Adding photos, a portrait, or a hero video

- **More photos:** add to `src/assets/photos/`, import in `src/data/photos.ts`, and add to `gallery` / `heroSlides`. Originals are never modified; Astro generates AVIF/WebP sizes.
- **Cindy's portrait:** import it in `src/data/photos.ts` and set `cindyPortrait` — it replaces the image in "Meet Cindy".
- **Hero video:** put a short muted MP4 in `public/media/` and set `heroVideo` in `src/data/photos.ts`.

## Deployment (Netlify)

`netlify.toml` is configured (`npm run build`, publish `dist`). The quote form uses **Netlify Forms** (`name="quote"`, honeypot `bot-field`) and redirects to `/thank-you/`. After the first deploy, set up email notifications under *Site configuration → Forms → Form notifications* in Netlify.

The canonical domain is `https://brighthousecleaning.ca` (`astro.config.mjs` and `src/data/site.ts`).
