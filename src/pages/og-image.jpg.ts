import type { APIRoute } from 'astro';
import sharp from 'sharp';
import path from 'node:path';

/**
 * Social sharing image (1200×630), generated at build time: the official
 * white logo (scaled proportionally, never altered) on Bright House Blue,
 * beside a photo of Cindy at work (her logo shirt, cloth and cabinet in frame).
 */
export const GET: APIRoute = async () => {
  const root = process.cwd();
  const panelW = 440;

  // Scale to 630px tall (945px wide), then keep Cindy, the shirt logo and her hand with the cloth.
  const photo = await sharp(path.join(root, 'src/assets/photos/cindy-kitchen-cabinets.webp'))
    .resize({ height: 630 })
    .extract({ left: 30, top: 0, width: 1200 - panelW, height: 630 })
    .toBuffer();

  const logoW = 320;
  const logo = await sharp(path.join(root, 'public/brand/bright-house-logo-white.svg'), { density: 600 })
    .resize({ width: logoW })
    .png()
    .toBuffer();
  const { height: logoH = 158 } = await sharp(logo).metadata();

  const panel = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <radialGradient id="g" cx="0.1" cy="0.05" r="0.9">
          <stop offset="0" stop-color="#3FC6F0" stop-opacity="0.28"/>
          <stop offset="1" stop-color="#3FC6F0" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#3E4095"/>
      <rect width="${panelW}" height="630" fill="url(#g)"/>
      <rect x="${panelW - 6}" width="6" height="630" fill="#3FC6F0"/>
    </svg>`,
  );

  const img = await sharp(panel)
    .composite([
      { input: photo, left: panelW, top: 0 },
      { input: logo, left: Math.round((panelW - 6 - logoW) / 2), top: Math.round((630 - logoH) / 2) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(img), { headers: { 'Content-Type': 'image/jpeg' } });
};
