import fs from 'fs';
import path from 'path';

export interface Profile {
  name: string;
  url: string;
  provider?: string;
  badge?: string;
  hair: 'blonde' | 'brunette' | 'redhead' | 'black';
  body: 'busty' | 'slim' | 'curvy' | 'petite';
  age_category: 'young' | 'mature';
  nationality?: 'russian' | 'ukrainian' | 'latin' | 'asian' | 'dutch' | 'turkish' | 'romanian';
  age: number;
  services: string[];
  height: string;
  bust: string;
  rate_hourly?: number;
  is_pornstar?: boolean;
  real_pics?: boolean;
  has_video?: boolean;
  can_travel?: boolean;
  verified_contact?: boolean;
  is_multi_platform?: boolean;
}

export interface CityData {
  slug: string;
  raw_slug: string;
  name: string;
  count: number;
  country: string;
  profiles: Profile[];
}

export interface CitySummary {
  slug: string;
  raw_slug: string;
  name: string;
  count: number;
  country: string;
}

let cachedDb: { cities: CityData[] } | null = null;
let lastDbMtime = 0;

function getDb(): { cities: CityData[] } {
  const dbPath = path.join(process.cwd(), 'data', 'directory_db.json');
  try {
    const stat = fs.statSync(dbPath);
    if (!cachedDb || stat.mtimeMs !== lastDbMtime) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const citiesList: CityData[] = Array.isArray(parsed.cities) ? parsed.cities : Object.values(parsed.cities || {});

      // Limit to top 10 profiles per city, prioritizing profiles with local HD photos
      for (const c of citiesList) {
        if (c.profiles && c.profiles.length > 0) {
          c.profiles.sort((a: any, b: any) => {
            const aLocal = (a.photos || []).some((x: string) => typeof x === 'string' && x.startsWith('/photos/')) ? 1 : 0;
            const bLocal = (b.photos || []).some((x: string) => typeof x === 'string' && x.startsWith('/photos/')) ? 1 : 0;
            return bLocal - aLocal;
          });
          c.profiles = c.profiles.slice(0, 10);
          c.count = c.profiles.length;
        }
      }

      cachedDb = { cities: citiesList };
      lastDbMtime = stat.mtimeMs;
    }
  } catch (e) {
    if (!cachedDb) {
      cachedDb = { cities: [] };
    }
  }
  return cachedDb!;
}

export const getAllCities = (): CityData[] => {
  return getDb().cities;
};

export const getAllCitySummaries = (): CitySummary[] => {
  return getDb().cities.map(c => ({
    slug: c.slug,
    raw_slug: c.raw_slug,
    name: c.name,
    count: c.count,
    country: c.country || 'Other International'
  }));
};

export const getCityBySlug = (slug: string): CityData | undefined => {
  const cities = getAllCities();
  return cities.find(c => c.slug.toLowerCase() === slug.toLowerCase());
};

export const getTopCities = (limit: number = 18): CitySummary[] => {
  const summaries = getAllCitySummaries();
  return summaries.slice(0, limit);
};

export const slugifyModelName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'model';
};

export const getModelBySlug = (citySlug: string, modelSlug: string): { profile: Profile; city: CityData } | null => {
  const city = getCityBySlug(citySlug);
  if (!city || !city.profiles) return null;
  const cleanSlug = modelSlug.toLowerCase();
  const profile = city.profiles.find(p => slugifyModelName(p.name) === cleanSlug);
  if (!profile) return null;
  return { profile, city };
};

export const getRelatedModels = (citySlug: string, currentModelName: string, limit: number = 4): Profile[] => {
  const city = getCityBySlug(citySlug);
  if (!city || !city.profiles) return [];
  return city.profiles
    .filter(p => p.name !== currentModelName)
    .slice(0, limit);
};

export interface FeaturedModel {
  profile: Profile;
  citySlug: string;
  cityName: string;
  cityCountry: string;
}

export const getFeaturedModels = (limit: number = 16): FeaturedModel[] => {
  const cities = getAllCities();
  const list: FeaturedModel[] = [];

  for (const c of cities) {
    if (c.profiles) {
      for (const p of c.profiles) {
        if ((p as any).photos && (p as any).photos.length > 0) {
          list.push({
            profile: p,
            citySlug: c.slug,
            cityName: c.name,
            cityCountry: c.country
          });
        }
      }
    }
  }

  // Sort: prioritize profiles with local HD photos
  list.sort((a, b) => {
    const aPhotos = (a.profile as any).photos || [];
    const bPhotos = (b.profile as any).photos || [];
    const aLocal = aPhotos.some((x: string) => typeof x === 'string' && x.startsWith('/photos/')) ? 1 : 0;
    const bLocal = bPhotos.some((x: string) => typeof x === 'string' && x.startsWith('/photos/')) ? 1 : 0;
    return bLocal - aLocal;
  });

  return list.slice(0, limit);
};
