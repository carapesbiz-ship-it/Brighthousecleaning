/**
 * Central business information for Bright House Cleaning Services.
 * Update details here and they flow through the whole website
 * (header, footer, contact section, structured data, FAQ, etc.).
 */
import type { PhotoKey } from './photos';

export const site = {
  name: 'Bright House Cleaning Services',
  shortName: 'Bright House',
  tagline: 'Personalized cleaning across Metro Vancouver',
  owner: 'Cindy Albornoz',
  ownerFirstName: 'Cindy',
  url: 'https://brighthousecleaning.ca',
  locale: 'en_CA',

  phone: {
    display: '(778) 867-7889',
    href: 'tel:+17788677889',
    e164: '+17788677889',
  },
  email: 'brighthouse.csc@gmail.com',

  whatsapp: {
    number: '17788677889',
    defaultMessage: 'Hi Cindy! I’d like to request a cleaning quote.',
  },

  social: {
    instagram: 'https://www.instagram.com/brighthousecs/',
    instagramHandle: '@brighthousecs',
    facebook: 'https://www.facebook.com/profile.php?id=61557052281960',
  },

  hours: {
    days: 'Monday to Saturday',
    daysShort: 'Mon–Sat',
    time: '9:00 AM – 5:00 PM',
    // Used in structured data
    schema: { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '17:00' },
  },

  languages: ['English', 'Spanish'],

  seo: {
    title: 'Bright House Cleaning Services | Metro Vancouver Cleaning',
    description:
      'Personalized residential, deep, move-in/move-out, Airbnb, and commercial cleaning across Metro Vancouver. Insured, pet-friendly, and supplies included.',
  },

  trustBar: ['Insured', 'Supplies Included', 'Serving Metro Vancouver', 'English & Spanish'],
  heroTrust: ['Insured', 'Pet-friendly', 'Eco-friendly options', 'Supplies included'],
} as const;

/** Build a WhatsApp deep link with a pre-filled message. */
export function whatsappLink(message: string = site.whatsapp.defaultMessage): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const serviceAreas = [
  'Vancouver',
  'Burnaby',
  'Richmond',
  'Surrey',
  'New Westminster',
  'Coquitlam',
  'Port Coquitlam',
  'Port Moody',
  'Delta',
  'North Vancouver',
  'West Vancouver',
] as const;

export type ServiceId = 'regular' | 'deep' | 'move' | 'airbnb' | 'commercial';

export interface Service {
  id: ServiceId;
  name: string;
  price: string;
  /** Numeric starting price in CAD, used for structured data. */
  minPrice?: number;
  description: string;
  listLabel: string;
  inclusions: string[];
  extrasLabel?: string;
  extras?: string[];
  note?: string;
  /** Key into the photo map in src/data/photos.ts */
  photo?: PhotoKey;
  icon: 'home' | 'sparkle' | 'box' | 'key' | 'building';
}

export const services: Service[] = [
  {
    id: 'regular',
    name: 'Regular Cleaning',
    price: 'From $140 CAD',
    minPrice: 140,
    description: 'Reliable ongoing care to keep your home fresh, comfortable, and beautifully maintained.',
    listLabel: 'Includes',
    inclusions: ['Kitchen surfaces and sinks', 'Bathrooms', 'Dusting', 'Vacuuming', 'Mopping', 'Cleaning supplies included'],
    note: 'Available weekly, biweekly, or monthly.',
    photo: 'kitchenIsland',
    icon: 'home',
  },
  {
    id: 'deep',
    name: 'Deep Cleaning',
    price: 'From $200 CAD',
    minPrice: 200,
    description: 'A detailed reset for homes that need extra time, attention, and care.',
    listLabel: 'Includes',
    inclusions: [
      'Everything in Regular Cleaning',
      'Inside the oven',
      'Inside the refrigerator',
      'Interior windows',
      'Blinds',
      'Baseboards',
      'Grout',
      'Light fixtures',
      'Vacuuming and mopping',
    ],
    photo: 'showerTub',
    icon: 'sparkle',
  },
  {
    id: 'move',
    name: 'Move In / Move Out Cleaning',
    price: 'From $280 CAD',
    minPrice: 280,
    description: 'A thorough, customized clean to help you leave with confidence or settle into a fresh new home.',
    listLabel: 'Typical service can include',
    inclusions: [
      'Sanitizing countertops, sinks, and backsplashes',
      'Cleaning major appliances',
      'Toilets, showers, tubs, vanities, mirrors, and fixtures',
      'Dusting furniture, shelves, baseboards, ceiling fans, and light fixtures',
      'Vacuuming and mopping floors, including corners and edges',
      'Mirrors and interior windows',
      'Detailed attention to kitchens, bathrooms, bedrooms, and living areas',
    ],
    extrasLabel: 'Can be added to your quote',
    extras: [
      'Intensive appliance deep-cleaning',
      'Cabinet interiors and exteriors',
      'Wall washing',
      'Additional detailed baseboard work',
    ],
    note: 'Your final checklist and price are confirmed in your customized quote.',
    photo: 'emptyRoom',
    icon: 'box',
  },
  {
    id: 'airbnb',
    name: 'Airbnb Turnovers',
    price: 'Custom quote',
    description: 'Dependable turnovers that help create a clean, welcoming, guest-ready space.',
    listLabel: 'Focused on',
    inclusions: [
      'Cleaning between stays',
      'Kitchen and bathroom reset',
      'Floors and high-touch surfaces',
      'Consistent attention to presentation',
    ],
    icon: 'key',
  },
  {
    id: 'commercial',
    name: 'Commercial Cleaning',
    price: 'Custom quote',
    description: 'Flexible cleaning for offices and small commercial spaces across Metro Vancouver.',
    listLabel: 'What to expect',
    inclusions: [
      'Schedules customized around your hours',
      'Consistent, familiar service',
      'Tailored to the size and needs of your space',
      'Supplies brought to every visit',
    ],
    photo: 'office',
    icon: 'building',
  },
];

export const pricingDisclaimer =
  'Starting prices are in Canadian dollars. Final pricing depends on the size and condition of the property, number of bedrooms and bathrooms, service frequency, and selected add-ons.';

export const differentiators = [
  {
    title: 'Personally Led by Cindy',
    text: 'You receive attentive, consistent service from the person behind the business.',
  },
  {
    title: 'Thoughtful Attention to Detail',
    text: 'The goal is not simply to clean, but to create a home that feels fresh, ordered, and comfortable.',
  },
  {
    title: 'Familiar, Consistent Service',
    text: 'Cindy generally works with the same regular assistant rather than sending rotating teams.',
  },
  {
    title: 'Supplies Included',
    text: 'Professional cleaning supplies are brought to every appointment.',
  },
  {
    title: 'Care for Your Home',
    text: 'Pet-friendly service and eco-friendly product options are available.',
  },
];

export const steps = [
  {
    title: 'Tell us about your space',
    text: 'Choose your service and share a few details about your home or business.',
  },
  {
    title: 'Receive your personalized quote',
    text: 'We’ll review the size, condition, priorities, and timing before confirming your price.',
  },
  {
    title: 'Enjoy a brighter space',
    text: 'We arrive prepared with the supplies needed to give your space thoughtful, detailed care.',
  },
];

export const faqs = [
  {
    q: 'What areas do you serve?',
    a: 'We serve clients throughout Metro Vancouver, including Vancouver, Burnaby, Richmond, Surrey, New Westminster, Coquitlam, Port Coquitlam, Port Moody, Delta, North Vancouver, West Vancouver, and surrounding communities.',
  },
  {
    q: 'Do you bring your own cleaning supplies?',
    a: 'Yes. Cleaning supplies are included with your service. If you have product sensitivities or special preferences, let us know when requesting your quote.',
  },
  {
    q: 'Are your products eco-friendly?',
    a: 'Eco-friendly product options are available. Tell us about your preferences when booking so we can plan the right approach for your space.',
  },
  {
    q: 'Are you pet-friendly?',
    a: 'Yes. We’re happy to work in homes with pets. Please share any special instructions before your appointment.',
  },
  {
    q: 'How often can I schedule Regular Cleaning?',
    a: 'Regular Cleaning is available weekly, biweekly, or monthly, depending on availability and the needs of your home.',
  },
  {
    q: 'What is included in Deep Cleaning?',
    a: 'Deep Cleaning includes everything in Regular Cleaning, plus detailed work such as the inside of the oven and refrigerator, interior windows, blinds, baseboards, grout, and light fixtures.',
  },
  {
    q: 'How is my final price determined?',
    a: 'Prices shown on the website are starting prices. Your final quote depends on the size and condition of the property, number of bedrooms and bathrooms, service frequency, and any additional work requested.',
  },
  {
    q: 'What does Move In / Move Out Cleaning include?',
    a: 'Each service is customized to the property. It typically includes detailed kitchen, bathroom, bedroom, living-area, floor, and dusting work. Cabinet interiors, wall washing, or intensive appliance cleaning can be added to the quote when needed.',
  },
  {
    q: 'Are you insured?',
    a: 'Yes. Bright House Cleaning Services is insured.',
  },
  {
    q: 'What if I’m not completely satisfied?',
    a: 'Contact us within 24 hours of your cleaning and we’ll make it right at no extra charge under our 5-Star Promise.',
  },
  {
    q: 'Do you provide service in Spanish?',
    a: 'Yes. Bright House can assist clients in both English and Spanish.',
  },
];

export const nav = [
  { label: 'Home', href: '/#top' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];
