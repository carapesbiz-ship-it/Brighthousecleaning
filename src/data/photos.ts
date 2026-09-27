/**
 * Real Bright House photographs. Originals live in src/assets/photos and are
 * never modified; Astro generates optimized AVIF/WebP versions at build time.
 *
 * To add or swap a photo: drop the file into src/assets/photos, import it
 * below, and reference its key wherever it is used (hero, services, gallery).
 */
import type { ImageMetadata } from 'astro';
import kitchen from '../assets/photos/kitchen-sink.webp';
import microwave from '../assets/photos/microwave-detail.webp';
import stairs from '../assets/photos/stairs-vacuum.webp';
import shower from '../assets/photos/shower-floor-b.webp';
import sinkDetail from '../assets/photos/details/sink-detail.webp';
import stairsDetail from '../assets/photos/details/stairs-detail.webp';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  /** CSS object-position used for responsive crops */
  position?: string;
}

export const photos = {
  kitchen: {
    src: kitchen,
    alt: 'A Bright House cleaner in a branded cap wiping down a modern kitchen sink beside built-in stainless steel appliances',
    position: '50% 45%',
  },
  microwave: {
    src: microwave,
    alt: 'A Bright House cleaner wiping the inside of a built-in microwave in a kitchen with wood-grain cabinetry',
    position: '50% 55%',
  },
  stairs: {
    src: stairs,
    alt: 'A Bright House cleaner vacuuming dark hardwood stairs beneath a large black-and-white painting',
    position: '50% 40%',
  },
  shower: {
    src: shower,
    alt: 'A freshly cleaned walk-in shower with white wall tiles and a light marble mosaic floor',
    position: '50% 55%',
  },
  sinkDetail: {
    src: sinkDetail,
    alt: 'Close-up of a gloved hand polishing a stainless steel sink with a microfibre cloth',
    position: '40% 50%',
  },
  stairsDetail: {
    src: stairsDetail,
    alt: 'Close-up of a cordless vacuum cleaning along the edge of a hardwood stair tread',
    position: '60% 60%',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Hero rotation (first image loads eagerly). */
export const heroSlides: PhotoKey[] = ['kitchen', 'microwave', 'stairs'];

/**
 * Optional short, muted hero video. Place the file in /public/media and set
 * e.g. { src: '/media/hero.mp4', poster: 'kitchen' } to replace the slideshow.
 */
export const heroVideo: { src: string; poster: PhotoKey } | null = null;

/**
 * Optional portrait of Cindy for the "Meet Cindy" section. Import the photo
 * above and set it here, e.g. { src: cindyPortrait, alt: 'Cindy Albornoz…' }.
 */
export const cindyPortrait: Photo | null = null;

/** Curated gallery, in display order. */
export const gallery: { key: PhotoKey; caption: string; shape: 'tall' | 'wide' | 'square' }[] = [
  { key: 'kitchen', caption: 'Kitchen care, down to the sink', shape: 'tall' },
  { key: 'stairsDetail', caption: 'Edges and corners on every stair', shape: 'square' },
  { key: 'shower', caption: 'A fresh, bright shower', shape: 'tall' },
  { key: 'microwave', caption: 'Inside the appliances', shape: 'tall' },
  { key: 'sinkDetail', caption: 'Polished fixtures', shape: 'wide' },
  { key: 'stairs', caption: 'Floors and stairways', shape: 'tall' },
];
