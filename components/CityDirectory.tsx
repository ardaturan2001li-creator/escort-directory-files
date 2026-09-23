'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CitySummary } from '@/lib/db';
import { Language } from '@/lib/getDictionary';

interface Props {
  cities: CitySummary[];
  lang: Language;
}

const COUNTRIES = [
  { id: 'ALL', label: 'All Regions', flag: '🌍' },
  { id: 'Netherlands', label: 'Netherlands', flag: '🇳🇱' },
  { id: 'Germany', label: 'Germany', flag: '🇩🇪' },
  { id: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
  { id: 'France', label: 'France', flag: '🇫🇷' },
  { id: 'Italy', label: 'Italy', flag: '🇮🇹' },
  { id: 'Spain', label: 'Spain', flag: '🇪🇸' },
  { id: 'Turkey', label: 'Turkey', flag: '🇹🇷' },
  { id: 'Belgium', label: 'Belgium', flag: '🇧🇪' },
  { id: 'Switzerland & Austria', label: 'CH & AT', flag: '🇨🇭' },
  { id: 'Other International', label: 'Global', flag: '🌐' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CityDirectory({ cities, lang }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'count' | 'name'>('count');
  const [visibleLimit, setVisibleLimit] = useState(48);

  // Filter & Sort
  const filteredCities = useMemo(() => {
    let result = cities;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.country && c.country.toLowerCase().includes(q))
      );
    }

    // Country Filter
    if (selectedCountry !== 'ALL') {
      result = result.filter((c) => c.country === selectedCountry);
    }

    // Alphabet Filter
    if (selectedLetter !== 'ALL') {
      result = result.filter((c) =>
        c.name.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'count') {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [cities, search, selectedCountry, selectedLetter, sortBy]);

  const hasActiveFilters =
    search.trim() !== '' || selectedCountry !== 'ALL' || selectedLetter !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setSelectedCountry('ALL');
    setSelectedLetter('ALL');
    setVisibleLimit(48);
  };

  const visibleCities = filteredCities.slice(0, visibleLimit);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Search & Main Controls Box */}
      <div className="bg-[#0f0f15] border border-neutral-800/90 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleLimit(48);
              }}
              placeholder="Live search 800+ cities (e.g. Amsterdam, Berlin, Rome)..."
              className="w-full pl-11 pr-10 py-3 bg-neutral-950 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs text-neutral-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-950 border border-neutral-700/80 text-neutral-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="count">Most Profiles (Popüler)</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Country / Region Tabs (Scrollable on mobile) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Filter by Country / Region:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700">
            {COUNTRIES.map((c) => {
              const isSelected = selectedCountry === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCountry(c.id);
                    setVisibleLimit(48);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400'
                      : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alphabet Bar */}
        <div className="space-y-2 pt-2 border-t border-neutral-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              A-Z Letter Filter:
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-red-400 hover:text-red-300 hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => {
                setSelectedLetter('ALL');
                setVisibleLimit(48);
              }}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                selectedLetter === 'ALL'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map((char) => {
              const isSelected = selectedLetter === char;
              return (
                <button
                  key={char}
                  onClick={() => {
                    setSelectedLetter(char);
                    setVisibleLimit(48);
                  }}
                  className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Status & Results Counter */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <div>
          Showing <span className="text-white font-bold">{visibleCities.length}</span> of{' '}
          <span className="text-red-400 font-bold">{filteredCities.length}</span> destinations
          {selectedCountry !== 'ALL' && <span> in <strong className="text-white">{selectedCountry}</strong></span>}
          {selectedLetter !== 'ALL' && <span> starting with <strong className="text-white">"{selectedLetter}"</strong></span>}
          {search && <span> matching <strong className="text-white">"{search}"</strong></span>}
        </div>
        <div>Total Database: {cities.length} Cities</div>
      </div>

      {/* Cities Grid with min-w-0 protection against overflow */}
      {visibleCities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 w-full">
          {visibleCities.map((city) => (
            <Link
              key={city.slug}
              href={`/${lang}/${city.slug}`}
              className="group p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800 hover:border-red-500/70 transition-all flex flex-col justify-between min-w-0 overflow-hidden shadow-sm hover:-translate-y-0.5"
            >
              <div className="min-w-0">
                <div className="font-bold text-white group-hover:text-red-400 transition-colors text-sm truncate">
                  {city.name}
                </div>
                <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                  {city.country || 'Global'}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-800/50 text-[11px]">
                <span className="text-red-400 font-semibold">{city.count} listings</span>
                <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
          <div className="text-3xl">🔍</div>
          <div className="text-lg font-bold text-white">No cities match your filter</div>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms or clear selected country/alphabet filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCities.length < filteredCities.length && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setVisibleLimit((prev) => prev + 48)}
            className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs font-bold text-white transition-all shadow hover:border-red-500"
          >
            Load More Destinations ({filteredCities.length - visibleCities.length} remaining) &darr;
          </button>
        </div>
      )}
    </div>
  );
}
