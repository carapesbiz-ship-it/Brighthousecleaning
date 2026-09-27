import type { APIRoute } from 'astro';
import sharp from 'sharp';
import path from 'node:path';

/**
 * Social sharing image (1200×630), generated at build time from a real
 * Bright House photograph with a soft brand-colour frame.
 */
export const GET: APIRoute = async () => {
  const src = path.join(process.cwd(), 'src/assets/photos/kitchen-sink.webp');
  const photo = await sharp(src)
    .extract({ left: 0, top: 430, width: 1199, height: 820 })
    .resize(760, 630, { fit: 'cover', position: 'attention' })
    .toBuffer();

  const panel = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <radialGradient id="g" cx="0.15" cy="0.1" r="0.9">
          <stop offset="0" stop-color="#3FC6F0" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#3FC6F0" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#3E4095"/>
      <rect width="1200" height="630" fill="url(#g)"/>
      <path transform="translate(150 215) scale(8)" fill="#3FC6F0" d="M12 2c.6 5.3 2.7 7.4 8 8-5.3.6-7.4 2.7-8 8-.6-5.3-2.7-7.4-8-8 5.3-.6 7.4-2.7 8-8Z"/>
      <path transform="translate(300 170) scale(2.6)" fill="#FFFFFF" fill-opacity="0.7" d="M12 2c.6 5.3 2.7 7.4 8 8-5.3.6-7.4 2.7-8 8-.6-5.3-2.7-7.4-8-8 5.3-.6 7.4-2.7 8-8Z"/>
    </svg>`,
  );

  const img = await sharp(panel)
    .composite([{ input: photo, left: 440, top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(img), { headers: { 'Content-Type': 'image/jpeg' } });
};
