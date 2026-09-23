import { getAllCities, CityData } from './db';

export interface CityOption {
  name: string;
  slug: string;
  count: number;
}

export interface CountryGroup {
  country: string;
  label: Record<string, string>;
  totalModels: number;
  cities: CityOption[];
}

const COUNTRY_LABELS: Record<string, Record<string, string>> = {
  'Germany': { tr: '🇩🇪 Almanya', en: '🇩🇪 Germany', de: '🇩🇪 Deutschland', nl: '🇩🇪 Duitsland' },
  'Netherlands': { tr: '🇳🇱 Hollanda', en: '🇳🇱 Netherlands', de: '🇳🇱 Niederlande', nl: '🇳🇱 Nederland' },
  'United Kingdom': { tr: '🇬🇧 İngiltere / UK', en: '🇬🇧 United Kingdom', de: '🇬🇧 Grossbritannien', nl: '🇬🇧 Verenigd Koninkrijk' },
  'Belgium': { tr: '🇧🇪 Belçika', en: '🇧🇪 Belgium', de: '🇧🇪 Belgien', nl: '🇧🇪 België' },
  'France': { tr: '🇫🇷 Fransa', en: '🇫🇷 France', de: '🇫🇷 Frankreich', nl: '🇫🇷 Frankrijk' },
  'Spain': { tr: '🇪🇸 İspanya', en: '🇪🇸 Spain', de: '🇪🇸 Spanien', nl: '🇪🇸 Spanje' },
  'Italy': { tr: '🇮🇹 İtalya', en: '🇮🇹 Italy', de: '🇮🇹 Italien', nl: '🇮🇹 Italië' },
  'Switzerland & Austria': { tr: '🇨🇭/🇦🇹 İsviçre & Avusturya', en: '🇨🇭/🇦🇹 Switzerland & Austria', de: '🇨🇭/🇦🇹 Schweiz & Österreich', nl: '🇨🇭/🇦🇹 Zwitserland & Oostenrijk' },
  'Turkey': { tr: '🇹🇷 Türkiye', en: '🇹🇷 Turkey', de: '🇹🇷 Türkei', nl: '🇹🇷 Turkije' },
  'Other International': { tr: '🌍 Diğer Ülkeler', en: '🌍 Other Countries', de: '🌍 Andere Länder', nl: '🌍 Andere Landen' }
};

export function getGroupedCountriesWithCities(): CountryGroup[] {
  const allCities = getAllCities();
  const grouped: Record<string, CityOption[]> = {};

  for (const c of allCities) {
    const co = c.country || 'Other International';
    if (!grouped[co]) grouped[co] = [];
    const pCount = c.count || (c.profiles ? c.profiles.length : 0);
    grouped[co].push({
      name: c.name,
      slug: c.slug,
      count: pCount
    });
  }

  const result: CountryGroup[] = Object.entries(grouped).map(([co, cities]) => {
    cities.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return {
      country: co,
      label: COUNTRY_LABELS[co] || { tr: co, en: co, de: co, nl: co },
      totalModels: cities.reduce((sum, x) => sum + x.count, 0),
      cities
    };
  });

  result.sort((a, b) => {
    if (a.country === 'Other International') return 1;
    if (b.country === 'Other International') return -1;
    return b.totalModels - a.totalModels;
  });

  return result;
}
