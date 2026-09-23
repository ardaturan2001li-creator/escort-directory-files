'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CountryGroup } from '@/lib/countryCities';
import { Language } from '@/lib/getDictionary';

interface Props {
  lang: Language;
  currentCountry?: string;
  currentCitySlug?: string;
  currentFacetSlug?: string;
  countryGroups: CountryGroup[];
}

export default function TopQuickFilterBar({
  lang,
  currentCountry,
  currentCitySlug,
  currentFacetSlug,
  countryGroups,
}: Props) {
  const router = useRouter();

  // Determine initial country based on current page
  const initialCountry = useMemo(() => {
    if (currentCountry) {
      const match = countryGroups.find(
        (g) => g.country.toLowerCase() === currentCountry.toLowerCase()
      );
      if (match) return match.country;
    }
    if (currentCitySlug) {
      for (const g of countryGroups) {
        if (g.cities.some((c) => c.slug.toLowerCase() === currentCitySlug.toLowerCase())) {
          return g.country;
        }
      }
    }
    return countryGroups[0]?.country || 'Germany';
  }, [currentCountry, currentCitySlug, countryGroups]);

  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);

  // Filter cities by selected country
  const availableCities = useMemo(() => {
    const group = countryGroups.find((g) => g.country === selectedCountry);
    return group ? group.cities : [];
  }, [countryGroups, selectedCountry]);

  // Initial city selection
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>(() => {
    if (currentCitySlug) return currentCitySlug;
    return availableCities[0]?.slug || 'berlin';
  });

  // Extract initial active physical or service tags from current facet
  const initialPhysical = useMemo(() => {
    if (!currentFacetSlug) return '';
    const s = currentFacetSlug.toLowerCase();
    if (s.includes('sarisin') || s.includes('blonde')) return 'sarisin';
    if (s.includes('esmer') || s.includes('brunette')) return 'esmer';
    if (s.includes('kizil') || s.includes('redhead')) return 'kizil';
    if (s.includes('siyah-sacli') || s.includes('black')) return 'siyah-sacli';
    if (s.includes('buyuk-gogus') || s.includes('busty')) return 'buyuk-gogus';
    if (s.includes('minyon') || s.includes('petite')) return 'minyon';
    if (s.includes('genc') || s.includes('citir') || s.includes('young')) return 'genc';
    if (s.includes('olgun') || s.includes('milf') || s.includes('mature')) return 'olgun';
    return '';
  }, [currentFacetSlug]);

  const initialService = useMemo(() => {
    if (!currentFacetSlug) return '';
    const s = currentFacetSlug.toLowerCase();
    if (s.includes('otele-gelen') || s.includes('outcall')) return 'otele-gelen';
    if (s.includes('eve-gelen') || s.includes('incall')) return 'eve-gelen';
    if (s.includes('masaj') || s.includes('massage')) return 'masaj';
    if (s.includes('anal')) return 'anal';
    if (s.includes('oral')) return 'oral';
    if (s.includes('sevgili') || s.includes('gfe')) return 'sevgili-tadinda';
    if (s.includes('gece-kalan') || s.includes('overnight') || s.includes('yatili')) return 'gece-kalan';
    if (s.includes('strapon')) return 'strapon';
    return '';
  }, [currentFacetSlug]);

  const [selectedPhysical, setSelectedPhysical] = useState<string>(initialPhysical);
  const [selectedService, setSelectedService] = useState<string>(initialService);

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    const grp = countryGroups.find((g) => g.country === countryName);
    if (grp && grp.cities.length > 0) {
      setSelectedCitySlug(grp.cities[0].slug);
    }
  };

  const uiTexts: Record<string, {
    countryLabel: string;
    cityLabel: string;
    physicalLabel: string;
    serviceLabel: string;
    searchBtn: string;
    quickPillsLabel: string;
    allOption: string;
  }> = {
    tr: {
      countryLabel: 'Ülke Seçimi',
      cityLabel: 'Şehir Seçimi',
      physicalLabel: 'Fiziksel Özellik',
      serviceLabel: 'Hizmet / Servis',
      searchBtn: 'Filtrele & Listele',
      quickPillsLabel: 'Hızlı Erişim:',
      allOption: 'Tümü (Seçilmedi)',
    },
    en: {
      countryLabel: 'Select Country',
      cityLabel: 'Select City',
      physicalLabel: 'Physical Look',
      serviceLabel: 'Service & Concept',
      searchBtn: 'Filter & Explore',
      quickPillsLabel: 'Quick Access:',
      allOption: 'All (Any)',
    },
    de: {
      countryLabel: 'Land wählen',
      cityLabel: 'Stadt wählen',
      physicalLabel: 'Aussehen & Typ',
      serviceLabel: 'Service & Wünsche',
      searchBtn: 'Filtern & Suchen',
      quickPillsLabel: 'Schnellauswahl:',
      allOption: 'Alle (Beliebig)',
    },
    nl: {
      countryLabel: 'Kies Land',
      cityLabel: 'Kies Stad',
      physicalLabel: 'Uiterlijk & Type',
      serviceLabel: 'Diensten',
      searchBtn: 'Filteren & Zoeken',
      quickPillsLabel: 'Snelfilters:',
      allOption: 'Alle (Geen voorkeur)',
    },
  };

  const ui = uiTexts[lang] || uiTexts.en;

  const physicalOptions = [
    { id: 'sarisin', label: { tr: 'Sarışın', en: 'Blonde', de: 'Blond', nl: 'Blond' }, icon: '👱‍♀️' },
    { id: 'esmer', label: { tr: 'Esmer', en: 'Brunette', de: 'Brünett', nl: 'Brunette' }, icon: '👩' },
    { id: 'kizil', label: { tr: 'Kızıl Saçlı', en: 'Redhead', de: 'Rotschopf', nl: 'Roodharig' }, icon: '👩‍🦰' },
    { id: 'siyah-sacli', label: { tr: 'Siyah Saçlı', en: 'Black Hair', de: 'Schwarzes Haar', nl: 'Zwart Haar' }, icon: '🖤' },
    { id: 'buyuk-gogus', label: { tr: 'Büyük Göğüslü', en: 'Busty', de: 'Große Brüste', nl: 'Grote Borsten' }, icon: '🍒' },
    { id: 'minyon', label: { tr: 'Minyon & Fit', en: 'Petite & Slim', de: 'Zierlich & Schlank', nl: 'Petite & Slank' }, icon: '🌸' },
    { id: 'genc', label: { tr: 'Genç (18-25 Yaş)', en: 'Young (18-25)', de: 'Jung (18-25)', nl: 'Jong (18-25)' }, icon: '🔥' },
    { id: 'olgun', label: { tr: 'Olgun / MILF (35+)', en: 'Mature / MILF', de: 'Reif / MILF', nl: 'Mature / MILF' }, icon: '👑' },
  ];

  const serviceOptions = [
    { id: 'otele-gelen', label: { tr: 'Otele Gelen (Outcall)', en: 'Hotel Outcall', de: 'Hotelbesuche', nl: 'Hotel Outcall' }, icon: '🏨' },
    { id: 'eve-gelen', label: { tr: 'Eve Gelen / Kendi Yeri', en: 'Incall / Home Visit', de: 'Hausbesuche & Incall', nl: 'Aan Huis / Incall' }, icon: '🏠' },
    { id: 'masaj', label: { tr: 'Erotik Masaj', en: 'Erotic Massage', de: 'Erotische Massage', nl: 'Erotische Massage' }, icon: '💆‍♀️' },
    { id: 'anal', label: { tr: 'Anal Hizmeti', en: 'Anal Service', de: 'Analverkehr', nl: 'Anale Seks' }, icon: '🍑' },
    { id: 'oral', label: { tr: 'Oral / Blowjob', en: 'Oral / Blowjob', de: 'Oralverkehr', nl: 'Oraal' }, icon: '💋' },
    { id: 'sevgili-tadinda', label: { tr: 'Sevgili Tadında (GFE)', en: 'GFE Experience', de: 'GFE Experience', nl: 'Girlfriend Experience' }, icon: '💖' },
    { id: 'gece-kalan', label: { tr: 'Gece Kalan / Yatılı', en: 'Overnight Stay', de: 'Über Nacht', nl: 'Overnachting' }, icon: '🌙' },
    { id: 'strapon', label: { tr: 'Strapon & Fantezi', en: 'Strapon Service', de: 'Strapon Service', nl: 'Strapon Service' }, icon: '⚡' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitySlug) return;

    let targetFacet = '';
    if (selectedPhysical && selectedService) {
      targetFacet = `${selectedPhysical}-${selectedService}`;
    } else if (selectedPhysical) {
      targetFacet = selectedPhysical;
    } else if (selectedService) {
      targetFacet = selectedService;
    }

    const targetUrl = targetFacet
      ? `/${lang}/${selectedCitySlug}/${targetFacet}`
      : `/${lang}/${selectedCitySlug}`;

    router.push(targetUrl);
  };

  const quickPills = [
    { slug: 'sarisin', label: lang === 'tr' ? '👱‍♀️ Sarışın' : lang === 'de' ? '👱‍♀️ Blonde' : lang === 'nl' ? '👱‍♀️ Blond' : '👱‍♀️ Blonde' },
    { slug: 'otele-gelen', label: lang === 'tr' ? '🏨 Otele Gelen' : lang === 'de' ? '🏨 Hotelbesuche' : lang === 'nl' ? '🏨 Hotel Outcall' : '🏨 Outcall' },
    { slug: 'buyuk-gogus', label: lang === 'tr' ? '🍒 Büyük Göğüs' : lang === 'de' ? '🍒 Große Brüste' : lang === 'nl' ? '🍒 Grote Borsten' : '🍒 Busty' },
    { slug: 'masaj', label: lang === 'tr' ? '💆‍♀️ Erotik Masaj' : '💆‍♀️ Massage' },
    { slug: 'sevgili-tadinda', label: lang === 'tr' ? '💖 Sevgili Tadında (GFE)' : '💖 GFE' },
    { slug: 'genc', label: lang === 'tr' ? '🔥 Genç & Çıtır' : lang === 'de' ? '🔥 Junge Escorts' : lang === 'nl' ? '🔥 Jonge Meiden' : '🔥 Young' },
    { slug: 'anal', label: lang === 'tr' ? '🍑 Anal Yapan' : '🍑 Anal' },
    { slug: 'gece-kalan', label: lang === 'tr' ? '🌙 Gece Kalan' : lang === 'de' ? '🌙 Über Nacht' : lang === 'nl' ? '🌙 Overnachting' : '🌙 Overnight' },
    { slug: 'eve-gelen', label: lang === 'tr' ? '🏠 Eve Gelen' : lang === 'de' ? '🏠 Hausbesuche' : lang === 'nl' ? '🏠 Aan Huis' : '🏠 Incall' },
    { slug: 'olgun', label: lang === 'tr' ? '👑 Olgun & MILF' : '👑 Mature' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#12121a]/95 via-[#0e0e14]/95 to-[#12121a]/95 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur space-y-4 mb-6">
      {/* 4 MAIN SELECTORS + ACTION BUTTON */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* 1. Ülke Seçimi */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span>🌍</span> {ui.countryLabel}
          </label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full appearance-none bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-red-500 transition-colors pr-8 cursor-pointer"
            >
              {countryGroups.map((g) => (
                <option key={g.country} value={g.country} className="bg-neutral-900 text-white">
                  {(g.label as any)[lang] || (g.label as any).en || g.country} ({g.totalModels})
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 2. Şehir Seçimi */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span>🏙️</span> {ui.cityLabel}
          </label>
          <div className="relative">
            <select
              value={selectedCitySlug}
              onChange={(e) => setSelectedCitySlug(e.target.value)}
              className="w-full appearance-none bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-red-500 transition-colors pr-8 cursor-pointer"
            >
              {availableCities.map((c) => (
                <option key={c.slug} value={c.slug} className="bg-neutral-900 text-white">
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 3. Fiziksel Özellik Seçimi */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span>✨</span> {ui.physicalLabel}
          </label>
          <div className="relative">
            <select
              value={selectedPhysical}
              onChange={(e) => setSelectedPhysical(e.target.value)}
              className="w-full appearance-none bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-red-500 transition-colors pr-8 cursor-pointer"
            >
              <option value="" className="bg-neutral-900 text-neutral-400">
                {ui.allOption}
              </option>
              {physicalOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-neutral-900 text-white">
                  {opt.icon} {(opt.label as any)[lang] || (opt.label as any).en}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 4. Servis & Hizmet Seçimi */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span>💎</span> {ui.serviceLabel}
          </label>
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full appearance-none bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-red-500 transition-colors pr-8 cursor-pointer"
            >
              <option value="" className="bg-neutral-900 text-neutral-400">
                {ui.allOption}
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-neutral-900 text-white">
                  {opt.icon} {(opt.label as any)[lang] || (opt.label as any).en}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 5. Arama & Filtreleme Aksiyon Butonu */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer h-[42px]"
          >
            <span>🔍</span>
            <span>{ui.searchBtn}</span>
          </button>
        </div>
      </form>

      {/* QUICK POPULAR PILLS ROW */}
      <div className="pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 overflow-hidden">
        <span className="text-[11px] font-bold text-neutral-400 shrink-0">
          {ui.quickPillsLabel}
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {quickPills.map((pill) => {
            const pillTargetUrl = `/${lang}/${selectedCitySlug}/${pill.slug}`;
            const isActive = currentFacetSlug && currentFacetSlug.toLowerCase().includes(pill.slug);

            return (
              <Link
                key={pill.slug}
                href={pillTargetUrl}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/60 shadow-sm shadow-red-950/40'
                    : 'bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                {pill.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
