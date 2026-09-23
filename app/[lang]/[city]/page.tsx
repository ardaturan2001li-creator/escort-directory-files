import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, Language } from '@/lib/getDictionary';
import { getCityBySlug, getTopCities } from '@/lib/db';
import CityFilterView from '@/components/CityFilterView';
import TopQuickFilterBar from '@/components/TopQuickFilterBar';
import { getGroupedCountriesWithCities } from '@/lib/countryCities';

export async function generateStaticParams() {
  const top = getTopCities(30);
  const params: { lang: string; city: string }[] = [];
  const langs = ['en', 'tr', 'nl', 'de'];
  for (const l of langs) {
    for (const c of top) {
      params.push({ lang: l, city: c.slug });
    }
  }
  return params;
}

export async function generateMetadata(props: { params: Promise<{ lang: string; city: string }> }) {
  const params = await props.params;
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'Destination Not Found' };
  const dict = getDictionary(params.lang);
  return {
    title: `${city.name} Escort İlanları - Otele Gelen, Anal, Sarışın, GFE & VIP Modeller`,
    description: `${city.name} (${city.country}) bölgesinde otele gelen, anal ve oral hizmeti sunan, gece kalan doğrulanmış bağımsız eskort bayanlar ve elit ajanslar.`,
  };
}

export default async function CityPage(props: { params: Promise<{ lang: string; city: string }> }) {
  const params = await props.params;
  const lang = (params.lang || 'en') as Language;
  const city = getCityBySlug(params.city);

  if (!city) {
    notFound();
  }

  const otherCities = getTopCities(12).filter((c) => c.slug !== city.slug);
  const countryGroups = getGroupedCountriesWithCities();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-[#08080a]">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-[#0d0d12]/90 backdrop-blur sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-red-600/30 shrink-0">
              E
            </span>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
              VIP<span className="text-red-500">ESCORT</span>HUB
            </span>
          </Link>

          {/* Language Switcher */}
          <nav aria-label="Language" className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs font-semibold shrink-0">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}/${city.slug}`}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  lang === l.code
                    ? 'bg-red-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main City Content with Deep Faceted Filter Engine */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8 overflow-hidden">
        {/* Top Quick Filter Bar: Country, City, Physical, Services & 1-Click Pills */}
        <TopQuickFilterBar
          lang={lang}
          currentCountry={city.country}
          currentCitySlug={city.slug}
          countryGroups={countryGroups}
        />

        {/* Deep Interactive Filter Component */}
        <CityFilterView city={city} lang={lang} />

        {/* Nearby Cities / Internal Linking */}
        <section className="border-t border-neutral-800/80 pt-10">
          <h3 className="text-xl font-bold text-white mb-4">
            Diğer Popüler Şehirler & Bölgeler
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 w-full">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/${lang}/${c.slug}`}
                className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white transition-colors flex items-center justify-between min-w-0 overflow-hidden"
              >
                <span className="truncate">{c.name}</span>
                <span className="text-neutral-500 text-[10px] ml-1 shrink-0 font-mono">
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#060608] py-8 text-center text-xs text-neutral-500 w-full">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>Global VIP Escort & Companion Directory. Strictly 18+.</p>
          <p>© {new Date().getFullYear()} VIP ESCORT HUB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
