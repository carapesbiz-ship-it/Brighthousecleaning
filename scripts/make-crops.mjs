/**
 * Generates privacy-safe crops from the original photographs.
 * The originals in src/assets/photos are never modified; crops are written
 * to src/assets/photos/crops and then optimized by Astro at build time.
 *
 *   node scripts/make-crops.mjs
 */
import sharp from 'sharp';

const crops = [
  {
    // Kitchen island. The mirror on the left edge shows a person's reflection
    // (x ≈ 340–375); the crop starts well to the right of it.
    src: '08-1000201881.jpg',
    out: '08-kitchen-island.jpg',
    region: { left: 430, top: 380, width: 722, height: 1000 },
  },
  {
    // Glass shower. Removes the cleaning bottles (left) and the toilet edge (right).
    src: '03-1000201886.jpg',
    out: '03-glass-shower.jpg',
    region: { left: 340, top: 0, width: 740, height: 1536 },
  },
];

for (const c of crops) {
  const info = await sharp(`src/assets/photos/${c.src}`)
    .extract(c.region)
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(`src/assets/photos/crops/${c.out}`);
  console.log(`${c.out}: ${info.width}×${info.height}`);
}
