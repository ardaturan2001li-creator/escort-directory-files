'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/taxonomy';

interface Props {
  lang: 'en' | 'tr' | 'nl' | 'de';
  activeCitySlug?: string;
  activeCityName?: string;
  activeCategorySlug?: string;
  activeProvider?: string;
}

export default function FacetedFilterBar({
  lang,
  activeCitySlug,
  activeCityName,
  activeCategorySlug,
  activeProvider = 'all',
}: Props) {
  const router = useRouter();

  const allLabel = {
    en: 'All Experiences',
    nl: 'Alle Ervaringen',
    de: 'Alle Erlebnisse',
    tr: 'Tüm Deneyimler',
  }[lang] || 'All';

  const filterHeading = {
    en: 'Experience & Occasion (Amorette Standard)',
    nl: 'Ervaring & Gelegenheid (Amorette Standaard)',
    de: 'Erlebnis & Anlass (Amorette Standard)',
    tr: 'Deneyim & Randevu Konsepti (Amorette Standardı)',
  }[lang] || 'Filter by Occasion';

  const providersHeading = {
    en: 'Verified Networks (Skyscanner Aggregator)',
    nl: 'Geverifieerde Netwerken (Skyscanner)',
    de: 'Verifizierte Netzwerke (Skyscanner)',
    tr: 'Doğrulanan Ağlar (Skyscanner)',
  }[lang] || 'Providers';

  const providers = [
    { id: 'all', name: 'All Networks (Skyscanner)', icon: '⚡' },
    { id: 'EuroGirlsEscort', name: 'EuroGirlsEscort', icon: '✈️' },
    { id: 'Amorette VIP Agency', name: 'Amorette VIP', icon: '💎' },
    { id: 'EscortDirectory', name: 'EscortDirectory', icon: '🌐' },
  ];

  return (
    <div className="w-full bg-[#121217]/90 border border-neutral-800/90 rounded-2xl p-4 md:p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* 1. SKYSCANNER PROVIDER AGGREGATOR ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-neutral-300">
            {providersHeading}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {providers.map((p) => {
            const isSelected = (activeProvider || 'all') === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  if (p.id === 'all') {
                    url.searchParams.delete('provider');
                  } else {
                    url.searchParams.set('provider', p.id);
                  }
                  router.push(url.pathname + url.search);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-neutral-100 text-black shadow-sm'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. OCCASIONS / AMORETTE TAXONOMY ROW */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-400">
              {filterHeading}
            </span>
            {activeCityName && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                📍 {activeCityName}
              </span>
            )}
          </div>

          {activeCategorySlug && activeCitySlug && (
            <Link
              href={`/${lang}/${activeCitySlug}`}
              className="text-xs text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>✕</span>
              <span>Reset filter</span>
            </Link>
          )}
        </div>

        {/* Categories Scrollable Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* All button */}
          {activeCitySlug ? (
            <Link
              href={`/${lang}/${activeCitySlug}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                !activeCategorySlug
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40'
                  : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <span>✨</span>
              <span>{allLabel}</span>
            </Link>
          ) : (
            <Link
              href={`/${lang}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                !activeCategorySlug
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40'
                  : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <span>✨</span>
              <span>{allLabel}</span>
            </Link>
          )}

          {/* Category Pills */}
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategorySlug === cat.slug;
            const href = activeCitySlug
              ? `/${lang}/${activeCitySlug}/${cat.slug}`
              : `/${lang}?category=${cat.slug}`;

            const catName = cat.name[lang] || cat.name.en;

            return (
              <Link
                key={cat.slug}
                href={href}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-lg shadow-amber-600/30'
                    : 'bg-neutral-900/80 text-neutral-300 border border-neutral-800/80 hover:border-amber-500/40 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <span className="text-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span>{catName}</span>
                {cat.type === 'persona' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    VIP
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
