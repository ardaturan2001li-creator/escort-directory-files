import { MetadataRoute } from 'next';
import { getCities } from '@/lib/taxonomy';

const baseUrl = 'https://escortguide.vercel.app';
const languages = ['en', 'de', 'fr', 'es', 'it', 'nl', 'tr', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of languages) {
    entries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
    
    // City pages
    for (const city of cities) {
      entries.push({
        url: `${baseUrl}/${lang}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  return entries;
}
