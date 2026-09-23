'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CityData, Profile } from '@/lib/db';
import { Language, getDictionary } from '@/lib/getDictionary';
import { getPopularCombinations } from '@/lib/seoGenerator';

interface Props {
  city: CityData;
  lang: Language;
}

interface FilterOption {
  id: string;
  label: Record<string, string>;
  icon?: string;
}

const HAIR_OPTIONS: FilterOption[] = [
  { id: 'blonde', label: { tr: 'Sarışın', en: 'Blonde', nl: 'Blond', de: 'Blond' }, icon: '👱‍♀️' },
  { id: 'brunette', label: { tr: 'Esmer', en: 'Brunette', nl: 'Brunette', de: 'Brünett' }, icon: '👩' },
  { id: 'redhead', label: { tr: 'Kızıl', en: 'Redhead', nl: 'Roodharig', de: 'Rotschopf' }, icon: '👩‍🦰' },
  { id: 'black', label: { tr: 'Siyah Saçlı', en: 'Black Hair', nl: 'Zwart Haar', de: 'Schwarzes Haar' }, icon: '🖤' },
];

const BODY_OPTIONS: FilterOption[] = [
  { id: 'busty', label: { tr: 'Büyük Göğüslü', en: 'Busty', nl: 'Grote Borsten', de: 'Grosse Oberweite' }, icon: '🍒' },
  { id: 'slim', label: { tr: 'İnce / Fit', en: 'Slim & Fit', nl: 'Slank & Fit', de: 'Schlank' }, icon: '✨' },
  { id: 'curvy', label: { tr: 'Balık Etli', en: 'Curvy', nl: 'Volslank', de: 'Kurvig' }, icon: '⏳' },
  { id: 'petite', label: { tr: 'Minyon', en: 'Petite', nl: 'Petite', de: 'Zierlich' }, icon: '🌸' },
];

const AGE_OPTIONS: FilterOption[] = [
  { id: 'young', label: { tr: 'Genç (18-30)', en: 'Young (18-30)', nl: 'Jong (18-30)', de: 'Jung (18-30)' }, icon: '🔥' },
  { id: 'mature', label: { tr: 'Olgun / MILF (35+)', en: 'Mature / MILF', nl: 'Mature / MILF', de: 'Reif / MILF' }, icon: '👑' },
];

const LOCATION_OPTIONS: FilterOption[] = [
  { id: 'hotel_outcall', label: { tr: 'Otele Gelir', en: 'Hotel Outcall', nl: 'Hotel Outcall', de: 'Hotelbesuche' }, icon: '🏨' },
  { id: 'eve_gelen', label: { tr: 'Eve Gelen (Incall)', en: 'Incall / Home Visit', nl: 'Aan Huis / Incall', de: 'Hausbesuche & Incall' }, icon: '🏠' },
  { id: 'incall', label: { tr: 'Kendi Yeri / Stüdyo', en: 'Private Studio', nl: 'Eigen Plek', de: 'Eigener Raum' }, icon: '🛋️' },
  { id: 'overnight', label: { tr: 'Gece Kalan / Yatılı', en: 'Overnight', nl: 'Overnachting', de: 'Über Nacht' }, icon: '🌙' },
];

const NATIONALITY_OPTIONS: FilterOption[] = [
  { id: 'russian', label: { tr: 'Rus', en: 'Russian', nl: 'Russische', de: 'Russische' }, icon: '🇷🇺' },
  { id: 'ukrainian', label: { tr: 'Ukraynalı', en: 'Ukrainian', nl: 'Oekraïense', de: 'Ukrainische' }, icon: '🇺🇦' },
  { id: 'latin', label: { tr: 'Latin & Brezilya', en: 'Latin & Brazilian', nl: 'Latina', de: 'Latina' }, icon: '🇧🇷' },
  { id: 'asian', label: { tr: 'Asyalı & Thai', en: 'Asian & Thai', nl: 'Aziatische', de: 'Asiatische' }, icon: '🇹🇭' },
  { id: 'dutch', label: { tr: 'Hollandalı / Yerel', en: 'Dutch / Local', nl: 'Nederlandse', de: 'Niederländisch' }, icon: '🇳🇱' },
];

const ORIENTATION_OPTIONS: FilterOption[] = [
  { id: 'lesbian', label: { tr: 'Lezbiyen & İkili Şov', en: 'Lesbian & Duo Show', nl: 'Lesbisch / Duo', de: 'Lesbisch / Duo' }, icon: '👭' },
  { id: 'couples', label: { tr: 'Çiftlere Giden', en: 'For Couples', nl: 'Voor Koppels', de: 'Für Paare' }, icon: '👩‍❤️‍👨' },
];

const FANTASY_SERVICES: FilterOption[] = [
  { id: 'anal', label: { tr: 'Anal', en: 'Anal Sex', nl: 'Anale Seks', de: 'Analverkehr' }, icon: '🍑' },
  { id: 'oral', label: { tr: 'Oral / Blowjob', en: 'Oral / Blowjob', nl: 'Pijpen / Oraal', de: 'Oralverkehr' }, icon: '💋' },
  { id: 'cim', label: { tr: 'Ağza Boşalma (CIM)', en: 'Cum in Mouth (CIM)', nl: 'Zaad in Mond (CIM)', de: 'Besamung im Mund' }, icon: '💦' },
  { id: 'gfe', label: { tr: 'Sevgili Tadında (GFE)', en: 'Girlfriend Experience (GFE)', nl: 'Girlfriend Experience', de: 'GFE' }, icon: '💖' },
  { id: 'strapon', label: { tr: 'Strapon', en: 'Pegging / Strapon', nl: 'Strapon', de: 'Strapon' }, icon: '⚡' },
  { id: 'bdsm', label: { tr: 'BDSM / Dominant', en: 'BDSM / Mistress', nl: 'BDSM / Dominatrix', de: 'BDSM & Domina' }, icon: '⛓️' },
  { id: 'roleplay', label: { tr: 'Rol Play & Fantezi', en: 'Roleplay & Fantasies', nl: 'Rollenspel', de: 'Rollenspiele' }, icon: '🎭' },
  { id: 'massage', label: { tr: 'Erotik Masaj', en: 'Erotic Massage', nl: 'Erotische Massage', de: 'Erotische Massage' }, icon: '💆‍♀️' },
  { id: 'threesome', label: { tr: 'Grup / İkili (Duo)', en: 'Threesome / Duo', nl: 'Trio / Duo', de: 'Dreier / Duo' }, icon: '👯' },
];

export default function CityFilterView({ city, lang }: Props) {
  const dict = getDictionary(lang);

  // Quick feature toggles
  const [filterRealPics, setFilterRealPics] = useState(false);

  // Price range filter
  const [priceRange, setPriceRange] = useState<'all' | 'under150' | '150to250' | '250to400' | 'above400'>('all');

  // Search keyword (model name or fantasy)
  const [searchQuery, setSearchQuery] = useState('');

  // Standard filters
  const [selectedHair, setSelectedHair] = useState<string[]>([]);
  const [selectedBody, setSelectedBody] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedNat, setSelectedNat] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetFilters = () => {
    setFilterRealPics(false);
    setPriceRange('all');
    setSearchQuery('');
    setSelectedHair([]);
    setSelectedBody([]);
    setSelectedAge([]);
    setSelectedServices([]);
    setSelectedNat([]);
  };

  const hasFilters =
    filterRealPics ||
    priceRange !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedHair.length > 0 ||
    selectedBody.length > 0 ||
    selectedAge.length > 0 ||
    selectedServices.length > 0 ||
    selectedNat.length > 0;

  const filteredProfiles = useMemo(() => {
    return city.profiles.filter((p) => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesServices = p.services && p.services.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesServices) return false;
      }

      // Quick feature toggles
      if (filterRealPics && !p.real_pics) return false;

      // Price ranges
      if (priceRange !== 'all' && p.rate_hourly) {
        if (priceRange === 'under150' && p.rate_hourly > 150) return false;
        if (priceRange === '150to250' && (p.rate_hourly < 150 || p.rate_hourly > 250)) return false;
        if (priceRange === '250to400' && (p.rate_hourly < 250 || p.rate_hourly > 400)) return false;
        if (priceRange === 'above400' && p.rate_hourly < 400) return false;
      }

      // Standard filters
      if (selectedHair.length > 0 && !selectedHair.includes(p.hair)) return false;
      if (selectedBody.length > 0 && !selectedBody.includes(p.body)) return false;
      if (selectedAge.length > 0 && !selectedAge.includes(p.age_category)) return false;
      if (selectedNat.length > 0 && (!p.nationality || !selectedNat.includes(p.nationality))) return false;
      if (selectedServices.length > 0) {
        const hasAllServices = selectedServices.every((s) => p.services && p.services.includes(s));
        if (!hasAllServices) return false;
      }
      return true;
    });
  }, [
    city.profiles,
    searchQuery,
    filterRealPics,
    priceRange,
    selectedHair,
    selectedBody,
    selectedAge,
    selectedServices,
    selectedNat
  ]);

  const dynamicTitle = useMemo(() => {
    if (!hasFilters) {
      if (lang === 'en') return `Escorts & Companions in ${city.name}`;
      if (lang === 'nl') return `Escorts & Modellen in ${city.name}`;
      if (lang === 'de') return `Escorts & Begleitungen in ${city.name}`;
      return `${city.name} Escort İlanları`;
    }

    const tags: string[] = [];
    if (filterRealPics) tags.push(lang === 'nl' ? 'Echte Foto\'s' : lang === 'de' ? 'Echte Fotos' : lang === 'en' ? 'Real Pics' : 'Gerçek Fotoğraflı');
    if (selectedServices.includes('hotel_outcall')) tags.push(lang === 'nl' ? 'Hotel Outcall' : lang === 'de' ? 'Hotelbesuche' : lang === 'en' ? 'Hotel Outcall' : 'Otele Gelen');
    if (selectedServices.includes('eve_gelen')) tags.push(lang === 'nl' ? 'Aan Huis' : lang === 'de' ? 'Hausbesuche' : lang === 'en' ? 'Incall' : 'Eve Gelen');
    if (selectedServices.includes('massage')) tags.push(lang === 'nl' ? 'Massage' : lang === 'de' ? 'Massage' : lang === 'en' ? 'Massage' : 'Masaj Yapan');
    if (selectedServices.includes('anal')) tags.push(lang === 'nl' ? 'Anaal' : lang === 'de' ? 'Anal' : lang === 'en' ? 'Anal' : 'Anal Yapan');
    if (selectedServices.includes('cim')) tags.push('CIM');
    if (selectedServices.includes('gfe')) tags.push('GFE');
    if (selectedHair.includes('blonde')) tags.push(lang === 'nl' ? 'Blonde' : lang === 'de' ? 'Blonde' : lang === 'en' ? 'Blonde' : 'Sarışın');
    if (selectedHair.includes('brunette')) tags.push(lang === 'nl' ? 'Brunette' : lang === 'de' ? 'Brünette' : lang === 'en' ? 'Brunette' : 'Esmer');
    if (selectedBody.includes('busty')) tags.push(lang === 'nl' ? 'Grote Borsten' : lang === 'de' ? 'Grosse Oberweite' : lang === 'en' ? 'Busty' : 'Büyük Göğüslü');

    if (lang === 'en' || lang === 'nl' || lang === 'de') {
      return `${tags.join(' ')} Escorts in ${city.name}`;
    }
    return `${city.name} ${tags.join(' ')} Escortlar`;
  }, [city.name, lang, hasFilters, filterRealPics, selectedServices, selectedHair, selectedBody]);

  const popularCombinations = useMemo(() => getPopularCombinations(city.name, lang), [city.name, lang]);

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* City Title Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
            📍 {city.name}, {city.country}
          </span>
          <span className="text-xs text-neutral-400">
            {filteredProfiles.length} {dict.models_listed}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {dynamicTitle}
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl">
          {dict.directory_intro_desc}
        </p>
      </div>

      {/* QUICK SEARCH & QUICK TOGGLES (Skyscanner Bar) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
        {/* Instant Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.search_model_placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 border border-neutral-700"
            >
              <span>✕</span> {dict.reset_filters}
            </button>
          )}
        </div>

        {/* Quick Attribute Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800/80">
          <span className="text-xs font-bold text-neutral-400 mr-1">{dict.quick_filters_label}</span>
          
          <button
            onClick={() => setFilterRealPics(!filterRealPics)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterRealPics
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-1 ring-emerald-400'
                : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <span>📸</span> {dict.filter_real_pics}
          </button>
        </div>

        {/* Skyscanner Hourly Rate Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/80">
          <span className="text-xs font-bold text-neutral-400 mr-1">{dict.hourly_rate_label}</span>
          
          {[
            { id: 'all', label: dict.rate_all },
            { id: 'under150', label: '< 150€' },
            { id: '150to250', label: '150€ - 250€' },
            { id: '250to400', label: '250€ - 400€' },
            { id: 'above400', label: '400€+ VIP' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setPriceRange(r.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                priceRange === r.id
                  ? 'bg-amber-500 text-black font-extrabold shadow'
                  : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER ACCORDION TOGGLE */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <span>⚙️ {dict.detailed_filter_panel}</span>
          <span>{isFilterOpen ? `▲ ${dict.hide}` : `▼ ${dict.expand}`}</span>
        </button>

        <div className="text-xs text-neutral-400 font-medium">
          <strong className="text-red-400">{filteredProfiles.length}</strong> {dict.total_profiles_found}
        </div>
      </div>

      {/* EXPANDED FILTER PANEL */}
      {isFilterOpen && (
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
          {/* 1. Lokasyon ve Buluşma */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span>📍</span> {dict.meeting_location}
            </div>
            <div className="flex flex-wrap gap-2">
              {LOCATION_OPTIONS.map((opt) => {
                const active = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleItem(selectedServices, setSelectedServices, opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label[lang] || opt.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Özel Servisler ve Fanteziler */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span>🔥</span> {dict.services_fantasies}
            </div>
            <div className="flex flex-wrap gap-2">
              {FANTASY_SERVICES.map((opt) => {
                const active = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleItem(selectedServices, setSelectedServices, opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label[lang] || opt.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Milliyet ve Köken */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span>🌍</span> {dict.nationality_origin}
            </div>
            <div className="flex flex-wrap gap-2">
              {NATIONALITY_OPTIONS.map((opt) => {
                const active = selectedNat.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleItem(selectedNat, setSelectedNat, opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label[lang] || opt.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Fiziksel Özellikler (Saç & Vücut) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-900">
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span>💇‍♀️</span> {dict.hair_color}
              </div>
              <div className="flex flex-wrap gap-2">
                {HAIR_OPTIONS.map((opt) => {
                  const active = selectedHair.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleItem(selectedHair, setSelectedHair, opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        active
                          ? 'bg-red-600 text-white ring-2 ring-red-400'
                          : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label[lang] || opt.label.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span>⏳</span> {dict.body_type}
              </div>
              <div className="flex flex-wrap gap-2">
                {BODY_OPTIONS.map((opt) => {
                  const active = selectedBody.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleItem(selectedBody, setSelectedBody, opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        active
                          ? 'bg-red-600 text-white ring-2 ring-red-400'
                          : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label[lang] || opt.label.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILES GRID */}
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-4">
          <div className="text-4xl">🔍</div>
          <div className="text-lg font-bold text-white">{dict.no_profiles_title}</div>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {dict.no_profiles_desc}
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            {dict.reset_all_filters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {filteredProfiles.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#0f0f14] border border-neutral-800/90 rounded-2xl p-4 sm:p-5 hover:border-red-500/80 transition-all hover:shadow-xl hover:shadow-red-950/25 flex flex-col justify-between group min-w-0 overflow-hidden"
            >
              <div>
                {/* Header with Provider Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate ${
                    p.provider === 'Amorette VIP'
                      ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                      : p.is_multi_platform
                      ? 'bg-red-950/80 border-red-500/60 text-red-300 font-extrabold'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}>
                    {p.is_multi_platform ? (lang === 'nl' ? '⭐ 2+ Platforms' : lang === 'de' ? '⭐ 2+ Plattformen' : '⭐ 2+ Platforms') : p.provider || '🌐 EscortDirectory'}
                  </span>

                  {p.rate_hourly && (
                    <span className="text-xs font-black text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                      €{p.rate_hourly}{dict.rate_suffix}
                    </span>
                  )}
                </div>

                {/* Visual Image / Avatar Header */}
                <Link
                  href={`/${lang}/${city.slug}/model/${p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'model'}`}
                  className="block relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 group-hover:scale-[1.01] transition-transform"
                >
                  {(p as any).photos && (p as any).photos.length > 0 ? (
                    <img
                      src={(p as any).photos[0]}
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

                  {p.rate_hourly && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-neutral-700 text-[11px] font-extrabold text-amber-400 shadow">
                      €{p.rate_hourly}{dict.rate_suffix}
                    </div>
                  )}

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
                  <Link
                    href={`/${lang}/${city.slug}/model/${p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'model'}`}
                    className="font-extrabold text-white truncate text-base hover:text-red-400 transition-colors block"
                  >
                    {p.name}
                  </Link>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {p.age} {dict.age_unit} • {p.height} • {dict.bust_label} {p.bust}
                  </div>
                </div>

                {/* Feature & Trait Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.is_pornstar && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/60 text-[10px] font-bold text-purple-300">
                      🔞 {dict.filter_pornstar}
                    </span>
                  )}
                  {p.has_video && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/60 text-[10px] font-bold text-blue-300">
                      🎥 {dict.filter_video}
                    </span>
                  )}
                  {p.real_pics && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-semibold text-emerald-400">
                      ✓ {dict.filter_real_pics}
                    </span>
                  )}
                  {p.can_travel && (
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-medium text-neutral-300">
                      ✈️ {dict.filter_travel}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-semibold text-neutral-300">
                    {p.hair.toUpperCase()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-semibold text-neutral-300">
                    {p.body.toUpperCase()}
                  </span>
                </div>

                {/* Services List */}
                <div className="space-y-1 mb-4 bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800/60">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">{dict.services_title}</div>
                  <div className="flex flex-wrap gap-1">
                    {p.services.slice(0, 6).map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-neutral-900 text-neutral-300">
                        {s.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                    {p.services.length > 6 && (
                      <span className="text-[10px] px-1 py-0.5 text-neutral-500 font-bold">
                        +{p.services.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Listing CTA */}
              <Link
                href={`/${lang}/${city.slug}/model/${p.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'model'}`}
                className="w-full text-center py-2.5 px-3 rounded-xl bg-neutral-800/90 hover:bg-red-600 text-xs font-bold text-neutral-200 hover:text-white transition-all border border-neutral-700/60 block mt-2"
              >
                {dict.view_listing_cta}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* POPULAR COMBINATIONS (PROGRAMMATIC SEO SILO MESH) */}
      <section className="border-t border-neutral-800/80 pt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-red-600"></span>
            {city.name} {dict.popular_combinations_title}
          </h3>
          <span className="text-xs text-neutral-400">{dict.geo_seo_pages}</span>
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

      {/* BOTTOM SEO INFORMATION ARTICLE (Fully Localized) */}
      <section className="border-t border-neutral-800/80 pt-8 text-neutral-400 text-sm leading-relaxed space-y-4">
        {lang === 'nl' ? (
          <>
            <h2 className="text-2xl font-black text-white">
              {city.name} Escort Services, Afspraakmogelijkheden en Discrete Veiligheidsnormen
            </h2>
            <p>
              Als een van de meest bezochte bestemmingen in Europa biedt <strong>{city.name} ({city.country})</strong> veeleisende heren en zakenreizigers een breed scala aan betrouwbare escort- en gezelschapsdiensten. Onafhankelijke modellen en erkende bureaus verzorgen hotelbezoeken (outcall), ontvangst op eigen discrete locaties (incall), overnachtingen en op maat gemaakte fantasieën.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Hotel Outcall en Ontvangst Aan Huis (Incall)</h3>
            <p>
              Voor gasten die verblijven in tophotels of luxe residenties in {city.name} garandeert hotel outcall het hoogste niveau van comfort en discretie. Modellen arriveren stijlvol gekleed zonder op te vallen bij de receptie of in de hotellobby. Vermeld bij uw aanvraag vooraf uw specifieke wensen (zoals erotische massage, orale verwenning, GFE of overnachting).
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Tarieven, Hygiëne en Wederzijds Respect</h3>
            <p>
              Persoonlijke hygiëne en duidelijke grenzen staan bij elke afspraak centraal. Uurtarieven variëren afhankelijk van de ervaring van het model, de duur en de gewenste services. Alle profielen op ons platform worden geverifieerd voor maximale betrouwbaarheid en authentieke foto\'s.
            </p>
          </>
        ) : lang === 'de' ? (
          <>
            <h2 className="text-2xl font-black text-white">
              {city.name} Escort Service, Buchungsoptionen und Diskrete Sicherheitsstandards
            </h2>
            <p>
              Als eine der führenden Metropolen in Europa bietet <strong>{city.name} ({city.country})</strong> anspruchsvollen Geschäftsreisenden und Genießern erstklassige Escort- und Begleitservices. Unabhängige Damen und renommierte Agenturen bieten Hausbesuche (Incall), diskrete Hotelbesuche (Outcall), Übernachtungen und maßgeschneiderte Fantasien.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Hotelbesuche (Outcall) und Empfang im Privaten Raum (Incall)</h3>
            <p>
              Gäste in 5-Sterne-Hotels oder privaten Suiten in {city.name} schätzen den hohen Komfort und die vollkommene Diskretion des Outcall-Services. Die Models erscheinen stilvoll und unauffällig im Hotel. Besprechen Sie gewünschte Vorlieben (wie erotische Massage, Oralverkehr, GFE oder Übernachtung) vertrauensvoll im Vorfeld.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Honorare, Hygiene und Gegenseitige Wertschätzung</h3>
            <p>
              Körperhygiene und gegenseitiger Respekt haben bei jeder Verabredung oberste Priorität. Stundensätze richten sich nach Dauer, Exklusivität und gewünschten Dienstleistungen. Alle Profile in unserem Verzeichnis durchlaufen eine strenge Prüfung auf echte Fotos und direkte Erreichbarkeit.
            </p>
          </>
        ) : lang === 'en' ? (
          <>
            <h2 className="text-2xl font-black text-white">
              {city.name} Escort Services, Booking Etiquette & Verified Standards
            </h2>
            <p>
              As one of Europe\'s premier destinations, <strong>{city.name} ({city.country})</strong> provides discerning gentlemen with an elite spectrum of independent escorts and high-class agencies. Whether seeking 5-star hotel outcall, private in-studio appointments, overnight stays, or refined romantic companions, our verified platform ensures seamless arrangements.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Hotel Outcall & Private Incall Process in {city.name}</h3>
            <p>
              For visitors staying at upscale boutique suites or luxury accommodations, outcall escorts guarantee absolute discretion. Models arrive elegantly dressed, seamlessly blending in with hotel lobbies. Please specify your preferences (such as GFE, erotic massage, CIM, or overnight) when making your initial inquiry.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Rates, Hygiene & Discretion Standards</h3>
            <p>
              Personal hygiene and mutual boundaries are respected at all times. Hourly rates depend on duration and specific requested services. Multi-platform verified profiles ensure authentic photos and direct communication with zero agency middleman fees.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white">
              {city.name} Escort Hizmetleri, Randevu Çeşitleri ve Güvenlik Standartları
            </h2>
            <p>
              Avrupa\'nın en çok tercih edilen destinasyonlarından biri olan <strong>{city.name} ({city.country})</strong>, elit beyler ve iş seyahatindeki misafirler için geniş bir arkadaşlık ve eskort yelpazesi sunmaktadır. Şehirde bağımsız çalışan modeller ve ajanslar; otel ziyaretleri (outcall), kendi mekanlarında ağırlama (incall), tüm gece süren konaklama (overnight) ve özel fanteziler içeren seanslarla her zevke hitap etmektedir.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Otel ve Eve Gelen (Outcall / Incall) Süreci</h3>
            <p>
              {city.name} genelindeki lüks otellerde veya özel rezidanslarda kalan misafirler için otele gelen ve eve gelen eskortlar maksimum konfor ve gizlilik sağlar. Randevu talebinde bulunurken oda numarası, kalınan otelin adı ve istenen hizmetler (örneğin erotik masaj, oral, ağza boşalma, anal veya sevgili tadında samimiyet) net olarak belirtilmelidir. Modeller kapıda son derece şık, dikkat çekmeyen ve günlük kıyafetlerle belirmekte, böylece tam bir gizlilik muhafaza edilmektedir.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Fiyatlandırma, Hijyen ve Karşılıklı Güven</h3>
            <p>
              Escort seanslarında hijyen ve karşılıklı sınırların korunması bir numaralı önceliktir. Saatlik ücretler modelin sunduğu servislere, tecrübesine ve talep edilen fantezi türlerine göre değişir. Tüm listelemeler ve bağımsız model profilleri en yüksek gizlilik ve güvenlik standartlarına göre doğrulanmaktadır.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
