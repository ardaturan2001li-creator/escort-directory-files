import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, Language, SUPPORTED_LANGUAGES } from '@/lib/getDictionary';
import { getCityBySlug, getTopCities, Profile, slugifyModelName } from '@/lib/db';
import {
  parseMultiFacetQuery,
  generateCombinationTitle,
  generateBottomSeoArticle,
  getPopularCombinations,
  TagDef,
  getServiceLabel
} from '@/lib/seoGenerator';
import { getNearbyDistrictNames } from '@/lib/districts';
import VipAlertModal from '@/components/VipAlertModal';
import TopQuickFilterBar from '@/components/TopQuickFilterBar';
import { getGroupedCountriesWithCities } from '@/lib/countryCities';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const top = getTopCities(8);
  const sampleFacets = [
    'otele-gelen',
    'eve-gelen',
    'anal',
    'oral',
    'anal-yapan-oral',
    'sarisin',
    'gece-kalan',
    'masaj',
    'olgun',
    'genc',
    'sevgili-tadinda',
    'strapon',
    'konyaalti-anal-yapan-oral',
    'mitte-anal-yapan-oral',
    'mayfair-blonde-escorts'
  ];
  const params: { lang: string; city: string; facet: string }[] = [];
  const langs = ['en', 'de', 'tr', 'nl'];
  for (const l of langs) {
    for (const c of top) {
      for (const f of sampleFacets) {
        params.push({ lang: l, city: c.slug, facet: f });
      }
    }
  }
  return params;
}

export async function generateMetadata(props: { params: Promise<{ lang: string; city: string; facet: string }> }) {
  const params = await props.params;
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'Not Found' };
  const lang = (SUPPORTED_LANGUAGES.includes(params.lang as any) ? params.lang : 'en') as Language;
  const { district, tags } = parseMultiFacetQuery(city.slug, params.facet);
  const title = generateCombinationTitle(city.name, tags, lang, district?.name);
  const locationLabel = district ? `${district.name}, ${city.name}` : city.name;

  const descByLang: Record<string, string> = {
    tr: `${locationLabel} (${city.country}) bölgesinde ${title.toLowerCase()}. Doğrulanmış bağımsız modeller, 7/24 randevu ve tam gizlilik garantisi.`,
    en: `Verified independent companions and VIP escorts in ${locationLabel} (${city.country}) specializing in ${tags.map(t => t.labels.en).join(', ') || 'VIP services'}. 100% discrete encounters.`,
    de: `Geprüfte High-Class Begleitdamen und Escorts in ${locationLabel} (${city.country}). Diskrete Hotelbesuche und private Termine.`,
    fr: `Escortes indépendantes et vérifiées à ${locationLabel} (${city.country}). Réservation discrète en hôtel ou appartement privé.`,
    es: `Acompañantes y escorts verificadas en ${locationLabel} (${city.country}). Citas discretas en hotel o domicilio.`,
    it: `Escort e accompagnatrici verificate a ${locationLabel} (${city.country}). Massima riservatezza e contatti diretti.`,
    nl: `Geverifieerde onafhankelijke escorts in ${locationLabel} (${city.country}). Discrete hotel outcall en privé ontvangst.`,
    ar: `عارضات مرافقة مستقلات ومعتمدات في ${locationLabel} (${city.country}). سرية تامة وتواصل مباشر.`
  };

  return {
    title: `${title} - VIP Companion Directory`,
    description: descByLang[lang] || descByLang.en,
    alternates: {
      canonical: `/${lang}/${city.slug}/${params.facet}`,
    },
    openGraph: {
      title,
      description: descByLang[lang] || descByLang.en,
      type: 'website',
    }
  };
}

export default async function FacetCityPage(props: { params: Promise<{ lang: string; city: string; facet: string }> }) {
  const params = await props.params;
  const lang = (SUPPORTED_LANGUAGES.includes(params.lang as any) ? params.lang : 'en') as Language;
  const city = getCityBySlug(params.city);

  if (!city) {
    notFound();
  }

  const { district, tags, originalSlug } = parseMultiFacetQuery(city.slug, params.facet);

  // If both tags and district are empty, this slug is unrecognized
  if (tags.length === 0 && !district) {
    notFound();
  }

  // Get neighboring districts if a district was requested
  const neighborDistricts = district ? getNearbyDistrictNames(city.slug, district.key) : [];

  // Scoring engine: evaluate every profile against all requested tags
  const scoredProfiles = city.profiles.map((p: Profile) => {
    let score = 0;
    const matchedTags: TagDef[] = [];

    for (const tag of tags) {
      let isMatch = false;
      if (tag.matchType === 'service') {
        if (p.services && p.services.includes(tag.matchValue)) isMatch = true;
      } else if (tag.matchType === 'hair') {
        if (p.hair === tag.matchValue) isMatch = true;
      } else if (tag.matchType === 'body') {
        if (p.body === tag.matchValue) isMatch = true;
      } else if (tag.matchType === 'age') {
        if (p.age_category === tag.matchValue) isMatch = true;
      } else if (tag.matchType === 'nationality') {
        if (p.nationality === tag.matchValue) isMatch = true;
      } else if (tag.matchType === 'feature') {
        if (tag.matchValue === 'is_pornstar' && p.is_pornstar) isMatch = true;
        else if (tag.matchValue === 'real_pics' && p.real_pics) isMatch = true;
        else if (tag.matchValue === 'has_video' && p.has_video) isMatch = true;
        else if (tag.matchValue === 'can_travel' && p.can_travel) isMatch = true;
        else if (tag.matchValue === 'is_multi_platform' && p.is_multi_platform) isMatch = true;
      }

      if (isMatch) {
        score += 1;
        matchedTags.push(tag);
      }
    }

    return { profile: p, score, matchedTags };
  });

  // Strict matches (Match ALL tags)
  const exactMatches = scoredProfiles
    .filter((sp) => tags.length === 0 || sp.score === tags.length)
    .map((sp) => sp);

  const isExact = exactMatches.length >= 3;

  // Smart Proximity & Partial Match List:
  // If exact matches are few or zero:
  // 1. Prioritize profiles matching most tags (min score 1)
  // 2. Fall back to top city profiles
  let displayProfiles = exactMatches;
  let isFallback = false;

  if (!isExact) {
    isFallback = true;
    const partialMatches = scoredProfiles
      .filter((sp) => sp.score >= 1)
      .sort((a, b) => b.score - a.score);

    if (partialMatches.length > 0) {
      displayProfiles = partialMatches;
    } else {
      // General fallback to city profiles
      displayProfiles = scoredProfiles.slice(0, 16);
    }
  }

  const pageTitle = generateCombinationTitle(city.name, tags, lang, district?.name);
  const seoArticle = generateBottomSeoArticle(city.name, city.country, tags, lang, params.facet, district?.name);
  const popularCombinations = getPopularCombinations(city.name, lang, city.slug, district?.key);
  const countryGroups = getGroupedCountriesWithCities();

  const locationBadge = district ? `${district.name}, ${city.name}` : city.name;

  // Localized UI helper messages
  const uiTexts: Record<string, {
    allCityEscorts: string;
    home: string;
    verifiedModels: string;
    districtBadge: string;
    fallbackTitle: string;
    fallbackDesc: string;
    matchedCriteria: string;
    viewProfileBtn: string;
    directContactBtn: string;
    relatedTitle: string;
    geoTitle: string;
    guideBadge: string;
    fromPrice: string;
    hour: string;
    servicesLabel: string;
  }> = {
    tr: {
      allCityEscorts: `← Tüm ${city.name} İlanları`,
      home: 'Ana Sayfa',
      verifiedModels: 'doğrulanmış VIP model listeleniyor',
      districtBadge: 'İlçe & Bölge',
      fallbackTitle: '📍 Akıllı Bölge & Kriter Önerisi',
      fallbackDesc: `Bu kriterlerin tümünü (${tags.map(t => t.labels.tr).join(' + ')}) aynı anda içeren ilanlar sınırlı sayıda. Size ${district ? `en yakın çevre ilçelerdeki (${neighborDistricts.slice(0, 3).join(', ') || city.name}) ve ` : ''}benzer hizmetleri (örn. sadece ${tags[0]?.labels.tr || 'Oral'} veya ${tags[1]?.labels.tr || 'Anal'}) sunan en popüler doğrulanmış modeller önerilmektedir:`,
      matchedCriteria: 'Eşleşen Kriterler:',
      viewProfileBtn: 'Profili & Foto Galeri İncele →',
      directContactBtn: 'İletişim & Randevu',
      relatedTitle: `${locationBadge} İlgili Popüler Arama Kombinasyonları`,
      geoTitle: 'Related Categories',
      guideBadge: 'VIP Rehber & Fiyatlandırma',
      fromPrice: 'Başlangıç',
      hour: 'saat',
      servicesLabel: 'Öne Çıkan Hizmetler:'
    },
    en: {
      allCityEscorts: `← All ${city.name} Escorts`,
      home: 'Home',
      verifiedModels: 'verified VIP companions listed',
      districtBadge: 'District & Area',
      fallbackTitle: '📍 Smart Proximity & Service Recommendation',
      fallbackDesc: `Direct exact matches containing all combined criteria (${tags.map(t => t.labels.en).join(' + ')}) are currently limited. Below are top-rated verified companions from ${district ? `nearby districts (${neighborDistricts.slice(0, 3).join(', ') || city.name}) and ` : ''}offering individual matching services (e.g. ${tags[0]?.labels.en || 'Oral'} or ${tags[1]?.labels.en || 'Anal'}): `,
      matchedCriteria: 'Matched Criteria:',
      viewProfileBtn: 'View Profile & Full Gallery →',
      directContactBtn: 'Contact & Booking',
      relatedTitle: `Popular Search Combinations in ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'VIP Guide & Pricing Table',
      fromPrice: 'From',
      hour: 'hr',
      servicesLabel: 'Key Services:'
    },
    de: {
      allCityEscorts: `← Alle Escorts in ${city.name}`,
      home: 'Startseite',
      verifiedModels: 'geprüfte VIP-Modelle gelistet',
      districtBadge: 'Bezirk & Stadtteil',
      fallbackTitle: '📍 Empfehlungen aus Nachbarbezirken & Einzelservices',
      fallbackDesc: `Exakte Treffer für alle kombinierten Kriterien (${tags.map(t => t.labels.de).join(' + ')}) sind derzeit begrenzt. Nachfolgend finden Sie Damen aus ${district ? `angrenzenden Stadtteilen (${neighborDistricts.slice(0, 3).join(', ') || city.name}) und ` : ''}mit passenden Einzelservices:`,
      matchedCriteria: 'Erfüllte Kriterien:',
      viewProfileBtn: 'Profil & Fotogalerie ansehen →',
      directContactBtn: 'Kontakt & Buchung',
      relatedTitle: `Beliebte Suchkombinationen in ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'VIP Ratgeber & Tarife',
      fromPrice: 'Ab',
      hour: 'Std',
      servicesLabel: 'Services:'
    },
    fr: {
      allCityEscorts: `← Toutes les escortes à ${city.name}`,
      home: 'Accueil',
      verifiedModels: 'modèles VIP vérifiés',
      districtBadge: 'Quartier & Arrondissement',
      fallbackTitle: '📍 Recommandations Proximité & Prestations Similaires',
      fallbackDesc: `Les correspondances exactes pour l'ensemble des critères sont limitées. Voici les escortes des quartiers voisins (${neighborDistricts.slice(0, 3).join(', ') || city.name}) offrant des prestations équivalentes:`,
      matchedCriteria: 'Critères Correspondants:',
      viewProfileBtn: 'Voir le Profil & Photos →',
      directContactBtn: 'Contacter le Modèle',
      relatedTitle: `Combinaisons Populaires à ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'Guide VIP & Tarifs',
      fromPrice: 'À partir de',
      hour: 'h',
      servicesLabel: 'Prestations:'
    },
    es: {
      allCityEscorts: `← Todas las escorts en ${city.name}`,
      home: 'Inicio',
      verifiedModels: 'modelos VIP verificadas',
      districtBadge: 'Distrito & Zona',
      fallbackTitle: '📍 Recomendación por Proximidad y Servicios',
      fallbackDesc: `Coincidencias simultáneas para todos los criterios limitadas. Mostramos acompañantes de distritos cercanos (${neighborDistricts.slice(0, 3).join(', ') || city.name}) con servicios similares:`,
      matchedCriteria: 'Criterios Coincidentes:',
      viewProfileBtn: 'Ver Perfil y Galería →',
      directContactBtn: 'Contacto Directo',
      relatedTitle: `Búsquedas Populares en ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'Guía VIP & Tarifas',
      fromPrice: 'Desde',
      hour: 'h',
      servicesLabel: 'Servicios:'
    },
    it: {
      allCityEscorts: `← Tutte le escort a ${city.name}`,
      home: 'Home',
      verifiedModels: 'modelle VIP verificate',
      districtBadge: 'Quartiere & Zona',
      fallbackTitle: '📍 Suggerimenti di Prossimità e Servizi Simili',
      fallbackDesc: `Corrispondenze esatte limitate. Ecco le modelle delle zone vicine (${neighborDistricts.slice(0, 3).join(', ') || city.name}) che offrono servizi corrispondenti:`,
      matchedCriteria: 'Criteri Soddisfatti:',
      viewProfileBtn: 'Visualizza Profilo & Foto →',
      directContactBtn: 'Contatto Diretto',
      relatedTitle: `Ricerche Correlate a ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'Guida VIP & Prezzi',
      fromPrice: 'Da',
      hour: 'ora',
      servicesLabel: 'Servizi:'
    },
    nl: {
      allCityEscorts: `← Alle escorts in ${city.name}`,
      home: 'Home',
      verifiedModels: 'geverifieerde VIP modellen',
      districtBadge: 'Stadsdeel & Wijk',
      fallbackTitle: '📍 Slimme Nabijheids- en Service Aanbeveling',
      fallbackDesc: `Exacte overeenkomsten voor alle criteria tegelijk zijn beperkt. Hieronder vindt u modellen uit nabijgelegen wijken (${neighborDistricts.slice(0, 3).join(', ') || city.name}) met vergelijkbare services:`,
      matchedCriteria: 'Overeenkomende Criteria:',
      viewProfileBtn: 'Bekijk Profiel & Galerij →',
      directContactBtn: 'Direct Contact',
      relatedTitle: `Populaire Zoekcombinaties in ${locationBadge}`,
      geoTitle: 'Related Categories',
      guideBadge: 'VIP Gids & Tarieven',
      fromPrice: 'Vanaf',
      hour: 'uur',
      servicesLabel: 'Diensten:'
    },
    ar: {
      allCityEscorts: `← كل عارضات ${city.name}`,
      home: 'الرئيسية',
      verifiedModels: 'عارضات معتمدات',
      districtBadge: 'الحي والمنطقة',
      fallbackTitle: '📍 اقتراحات الأحياء المجاورة والخدمات المماثلة',
      fallbackDesc: `التطابق التام لجميع المعايير في هذا الحي محدود حالياً. فيما يلي عارضات معتمدات من الأحياء المجاورة (${neighborDistricts.slice(0, 3).join('، ') || city.name}) يقدمن خدمات مطابقة:`,
      matchedCriteria: 'المعايير المتوفرة:',
      viewProfileBtn: 'عرض الملف والصور →',
      directContactBtn: 'تواصل مباشر',
      relatedTitle: `عمليات البحث الشائعة في ${locationBadge}`,
      geoTitle: 'أقسام الدليل',
      guideBadge: 'دليل VIP والأسعار',
      fromPrice: 'يبدأ من',
      hour: 'ساعة',
      servicesLabel: 'الخدمات المتاحة:'
    }
  };

  const ui = uiTexts[lang] || uiTexts.en;

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

          <div className="flex items-center gap-3">
            <VipAlertModal
              cityName={city.name}
              districtName={district?.name}
              tags={tags.map(t => ({ id: t.id, label: t.labels[lang] || t.labels.en || t.labels.tr }))}
              lang={lang}
            />
            <Link
              href={`/${lang}/${city.slug}`}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-semibold transition-colors"
            >
              {ui.allCityEscorts}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-red-950/25 via-neutral-900/40 to-transparent border-b border-neutral-800/60 py-8 px-4 w-full">
        <div className="max-w-7xl mx-auto space-y-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-400 overflow-hidden truncate">
            <Link href={`/${lang}`} className="hover:text-red-400">{ui.home}</Link>
            <span>/</span>
            <Link href={`/${lang}/${city.slug}`} className="hover:text-red-400">{city.name}</Link>
            {district && (
              <>
                <span>/</span>
                <span className="text-amber-400 font-medium">{district.name}</span>
              </>
            )}
            <span>/</span>
            <span className="text-white font-bold truncate">{pageTitle}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
            <div>
              {/* Active Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {district && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1">
                    🏛️ {district.name}
                  </span>
                )}
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-0.5 rounded-md bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-bold"
                  >
                    ✓ {t.labels[lang] || t.labels.en || t.labels.tr}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {pageTitle}
              </h1>

              {/* Fallback notification banner if exact matches are partial */}
              {isFallback && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 max-w-3xl">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    {ui.fallbackTitle}
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {ui.fallbackDesc}
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm font-semibold text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-4 py-2.5 rounded-xl shrink-0 shadow flex items-center gap-2">
              <span className="text-red-400 font-black text-base">{displayProfiles.length}</span>
              <span>{ui.verifiedModels}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8 overflow-hidden">
        {/* Top Quick Filter Bar: Country, City, Physical, Services & 1-Click Pills */}
        <TopQuickFilterBar
          lang={lang}
          currentCountry={city.country}
          currentCitySlug={city.slug}
          currentFacetSlug={params.facet}
          countryGroups={countryGroups}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
          {displayProfiles.map((sp, idx: number) => {
            const p = sp.profile;
            const modelSlug = slugifyModelName(p.name);
            const internalUrl = `/${lang}/${city.slug}/model/${modelSlug}`;
            const hasPhotos = (p as any).photos && (p as any).photos.length > 0;
            const photoUrl = hasPhotos ? (p as any).photos[0] : null;

            return (
              <div
                key={idx}
                className="bg-[#0f0f14] border border-neutral-800 rounded-2xl p-4 sm:p-5 hover:border-red-500/80 transition-all hover:shadow-xl hover:shadow-red-950/25 flex flex-col justify-between group min-w-0 overflow-hidden"
              >
                <div>
                  {/* Visual Image / Avatar Header */}
                  <Link href={internalUrl} className="block relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 group-hover:scale-[1.01] transition-transform">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${p.name} - ${city.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center text-center p-4">
                        <span className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-black text-2xl text-red-500 shadow-lg">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-semibold mt-2">VIP INDEPENDENT</span>
                      </div>
                    )}

                    {/* Hourly rate pill overlay */}
                    {p.rate_hourly && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-neutral-700 text-[11px] font-extrabold text-amber-400 shadow">
                        €{p.rate_hourly}/{ui.hour}
                      </div>
                    )}

                    {/* Pornstar or Video badge */}
                    {p.is_pornstar && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-950/90 border border-purple-500/60 text-[10px] font-bold text-purple-200 shadow">
                        🔞 Pornstar
                      </div>
                    )}
                    {p.has_video && !p.is_pornstar && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-950/90 border border-blue-500/60 text-[10px] font-bold text-blue-200 shadow">
                        🎥 Video
                      </div>
                    )}
                  </Link>

                  {/* Model Header */}
                  <div className="mb-2">
                    <Link href={internalUrl} className="font-extrabold text-white truncate text-base hover:text-red-400 transition-colors block">
                      {p.name}
                    </Link>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {p.age} {lang === 'tr' ? 'yaş' : 'yrs'} • {p.height} • {lang === 'tr' ? 'Göğüs' : 'Bust'}: {p.bust}
                    </div>
                  </div>

                  {/* Specific Matched Features Badges */}
                  {sp.matchedTags.length > 0 && (
                    <div className="space-y-1 mb-3 bg-neutral-950/90 p-2 rounded-xl border border-neutral-800">
                      <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        {ui.matchedCriteria}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sp.matchedTags.map((mt) => (
                          <span
                            key={mt.id}
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                          >
                            ✓ {mt.labels[lang] || mt.labels.en || mt.labels.tr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Features Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.real_pics && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-semibold text-emerald-400">
                        ✓ {lang === 'tr' ? 'Gerçek Foto' : '100% Real'}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-semibold text-neutral-300">
                      {p.hair.toUpperCase()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-semibold text-neutral-300">
                      {p.body.toUpperCase()}
                    </span>
                    {p.nationality && (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-semibold text-neutral-300">
                        {p.nationality.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Services List Preview */}
                  <div className="space-y-1 mb-4 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800/60">
                    <div className="text-[9px] font-bold text-neutral-500 uppercase">{ui.servicesLabel}</div>
                    <div className="flex flex-wrap gap-1">
                      {p.services.slice(0, 5).map((s: string) => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-neutral-900 text-neutral-300">
                          {getServiceLabel(s, lang)}
                        </span>
                      ))}
                      {p.services.length > 5 && (
                        <span className="text-[9px] px-1 py-0.5 text-neutral-500 font-medium">
                          +{p.services.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <Link
                  href={internalUrl}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-red-600 hover:to-rose-600 text-xs font-bold text-neutral-200 hover:text-white transition-all border border-neutral-700/60 block shadow"
                >
                  {ui.viewProfileBtn}
                </Link>
              </div>
            );
          })}
        </div>

        {/* RELATED COMBINATIONS (POPULAR COMBINATIONS) */}
        <section className="border-t border-neutral-800/80 pt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-red-600"></span>
              {ui.relatedTitle}
            </h3>
            <span className="text-xs text-neutral-400">{ui.geoTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {popularCombinations.map((c) => (
              <Link
                key={c.slug}
                href={`/${lang}/${city.slug}/${c.slug}`}
                className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-500/70 hover:text-red-400 text-xs font-medium text-neutral-300 transition-all flex items-center justify-between group min-w-0"
              >
                <span className="truncate">{c.label}</span>
                <span className="text-neutral-500 group-hover:text-red-400 text-xs ml-1 shrink-0">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* VIP LEAD CAPTURE BAR */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900/90 to-neutral-950 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-bold text-white">
              {lang === 'tr'
                ? `${locationBadge} Bölgesinde Tam Aradığınız Özelliklerde Escort Bulamadınız mı?`
                : `Couldn't find the exact match in ${locationBadge}?`}
            </div>
            <p className="text-xs text-neutral-400 max-w-xl">
              {lang === 'tr'
                ? 'VIP Radara kaydolun; bu semte veya kriterlerinize uygun yeni bağımsız model eklendiğinde WhatsApp veya Telegram ile ilk siz haberdar olun.'
                : 'Subscribe to VIP alerts to receive instant discrete notifications when a verified model matches this query.'}
            </p>
          </div>
          <VipAlertModal
            cityName={city.name}
            districtName={district?.name}
            tags={tags.map(t => ({ id: t.id, label: t.labels[lang] || t.labels.en || t.labels.tr }))}
            lang={lang}
          />
        </section>

        {/* COMPREHENSIVE CONTENT AT THE BOTTOM (350-500 WORDS) */}
        <section className="border-t border-neutral-800/80 pt-10">
          <div className="bg-[#0b0b10] border border-neutral-800/90 rounded-2xl p-6 md:p-10 text-neutral-300 leading-relaxed text-sm md:text-base space-y-4 shadow-xl">
            <div className="inline-block px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              {ui.guideBadge}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-6">
              {seoArticle.heading}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: seoArticle.content }} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#060608] py-8 text-center text-xs text-neutral-500 w-full">
        <p>© {new Date().getFullYear()} VIP ESCORT HUB. Strictly 18+ Adult Directory.</p>
      </footer>
    </div>
  );
}
