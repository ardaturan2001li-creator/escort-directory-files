import Link from 'next/link';
import { getDictionary, Language } from '@/lib/getDictionary';
import { getAllCitySummaries, getTopCities, getFeaturedModels, slugifyModelName } from '@/lib/db';
import CityDirectory from '@/components/CityDirectory';
import TopQuickFilterBar from '@/components/TopQuickFilterBar';
import { getGroupedCountriesWithCities } from '@/lib/countryCities';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }, { lang: 'nl' }, { lang: 'de' }];
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const dict = getDictionary(params.lang);
  return {
    title: `${dict.title} - 22,000+ Verified Escorts Worldwide`,
    description: dict.subtitle,
  };
}

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = (params.lang || 'en') as Language;
  const dict = getDictionary(lang);
  const topCities = getTopCities(12);
  const allCities = getAllCitySummaries();
  const featuredModels = getFeaturedModels(16);
  const countryGroups = getGroupedCountriesWithCities();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-[#08080a]">
      {/* Top Bar (No Overflow, responsive wrap) */}
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
                href={`/${l.code}`}
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

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 text-center border-b border-neutral-800/80 bg-gradient-to-b from-red-950/25 via-[#0c0c12] to-[#08080a] w-full">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {dict.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {dict.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {dict.subtitle}
          </p>

          {/* Key Stats Bar */}
          <div className="pt-4 max-w-md mx-auto grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">22,600+</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider">Profiles</div>
            </div>
            <div className="border-x border-neutral-800">
              <div className="text-xl sm:text-2xl font-bold text-red-500">818</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider">Cities</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full space-y-10 overflow-hidden">
        {/* Top Quick Filter Bar: Country, City, Physical, Services & 1-Click Pills */}
        <TopQuickFilterBar
          lang={lang}
          countryGroups={countryGroups}
        />

        {/* Featured VIP Companions Grid */}
        {featuredModels.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  {lang === 'tr' ? 'ÖNE ÇIKAN VIP MODELLER' : lang === 'de' ? 'EMPFOHLENE VIP ESCORTS' : lang === 'nl' ? 'AANBEVOLEN VIP ESCORTS' : 'FEATURED VIP COMPANIONS'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {lang === 'tr' ? 'Doğrulanmış Avrupa VIP Modelleri' : lang === 'de' ? 'Geprüfte High-Class Begleitdamen' : lang === 'nl' ? 'Geverifieerde Onafhankelijke Escorts' : 'Verified European High-Class Escorts'}
                </h2>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl shrink-0">
                ✓ 100% Real HD Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {featuredModels.map((fm, idx) => {
                const p = fm.profile;
                const modelSlug = slugifyModelName(p.name);
                const internalUrl = `/${lang}/${fm.citySlug}/model/${modelSlug}`;
                const photoUrl = (p as any).photos && (p as any).photos.length > 0 ? (p as any).photos[0] : null;

                return (
                  <div
                    key={idx}
                    className="bg-[#0f0f14] border border-neutral-800/90 rounded-2xl p-3 sm:p-4 hover:border-red-500/80 transition-all hover:shadow-xl hover:shadow-red-950/25 flex flex-col justify-between group min-w-0 overflow-hidden"
                  >
                    <div>
                      {/* Visual Image / Avatar Header */}
                      <Link href={internalUrl} className="block relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 group-hover:scale-[1.01] transition-transform">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${p.name} - ${fm.cityName}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center text-center p-4">
                            <span className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-black text-2xl text-red-500 shadow-lg">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-semibold mt-2">VIP INDEPENDENT</span>
                          </div>
                        )}

                        {/* City pill overlay */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-bold text-neutral-200 shadow">
                          📍 {fm.cityName}
                        </div>

                        {/* Hourly rate pill overlay */}
                        {p.rate_hourly && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-neutral-700 text-[11px] font-extrabold text-amber-400 shadow">
                            €{p.rate_hourly}/h
                          </div>
                        )}

                        {p.is_pornstar && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-purple-950/90 border border-purple-500/60 text-[10px] font-bold text-purple-200 shadow">
                            🔞 Pornstar
                          </div>
                        )}
                      </Link>

                      {/* Model Header */}
                      <div className="mb-2">
                        <Link href={internalUrl} className="font-extrabold text-white truncate text-base hover:text-red-400 transition-colors block">
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {p.age} yrs • {p.height} • {p.bust}
                        </div>
                      </div>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(p.services || []).slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-medium text-neutral-300">
                            {s.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick Highlights / Top Cities */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="w-2 h-5 rounded-full bg-red-600 inline-block"></span>
              {dict.popular_title}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Top Hubs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 w-full">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${lang}/${city.slug}`}
                className="group p-3 bg-neutral-900/60 border border-neutral-800 hover:border-red-500/80 rounded-xl transition-all hover:bg-neutral-800 min-w-0 overflow-hidden"
              >
                <div className="font-bold text-white group-hover:text-red-400 transition-colors text-sm truncate">
                  {city.name}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {city.count} {dict.profiles_label}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Interactive Full City Directory with Live Search, Country & Alphabet Filters */}
        <section className="space-y-6 pt-4 border-t border-neutral-800/80 w-full">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {dict.all_cities_title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Search by city name, filter by European countries, or browse alphabetically.
            </p>
          </div>

          <CityDirectory cities={allCities} lang={lang} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#060608] py-8 text-center text-xs text-neutral-500 w-full">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>{dict.footer_text}</p>
          <p>© {new Date().getFullYear()} VIP ESCORT HUB. Global Directory & Companion Guide.</p>
        </div>
      </footer>
    </div>
  );
}
