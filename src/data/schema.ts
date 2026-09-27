import fs from 'node:fs';
import path from 'node:path';
import { faqs, serviceAreas, services, site } from './site';

const hasLogoPng = fs.existsSync(path.join(process.cwd(), 'public/brand/bright-house-logo-blue.png'));

/** LocalBusiness structured data — deliberately no street address, ratings, or reviews. */
export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    additionalType: 'https://en.wikipedia.org/wiki/Cleaning_company',
    name: site.name,
    alternateName: site.shortName,
    description: site.seo.description,
    url: `${site.url}/`,
    image: `${site.url}/og-image.jpg`,
    ...(hasLogoPng ? { logo: `${site.url}/brand/bright-house-logo-blue.png` } : {}),
    telephone: site.phone.e164,
    email: site.email,
    priceRange: 'From $140 CAD',
    currenciesAccepted: 'CAD',
    founder: { '@type': 'Person', name: site.owner },
    knowsLanguage: ['en', 'es'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.hours.schema.dayOfWeek,
        opens: site.hours.schema.opens,
        closes: site.hours.schema.closes,
      },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Metro Vancouver, British Columbia, Canada' },
      ...serviceAreas.map((name) => ({ '@type': 'City', name: `${name}, BC` })),
    ],
    sameAs: [site.social.instagram, site.social.facebook],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cleaning services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.description },
        ...(s.minPrice
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: s.minPrice,
                priceCurrency: 'CAD',
              },
            }
          : {}),
      })),
    },
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: 'en-CA',
    publisher: { '@id': `${site.url}/#business` },
  };
}
