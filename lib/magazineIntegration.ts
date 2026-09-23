import fs from 'fs';
import path from 'path';

export interface MagazineStory {
  id: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  titles: {
    tr: string;
    nl: string;
    de: string;
    en?: string;
  };
  excerpts: {
    tr: string;
    nl: string;
    de: string;
    en?: string;
  };
}

let cachedStories: MagazineStory[] | null = null;

export function getAllMagazineStories(): MagazineStory[] {
  if (cachedStories) return cachedStories;

  const candidatePaths = [
    path.join(process.cwd(), '..', 'sexual-magazine-portal', 'stories.json'),
    'C:\\Users\\ijust\\.gemini\\antigravity\\scratch\\sexual-magazine-portal\\stories.json'
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        cachedStories = JSON.parse(raw);
        return cachedStories!;
      } catch (err) {
        console.error('Failed to parse stories.json:', err);
      }
    }
  }

  return [];
}

export function getStoriesForCity(cityName: string, limit: number = 3): MagazineStory[] {
  const stories = getAllMagazineStories();
  if (stories.length === 0) return [];

  const normalizedCity = cityName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const matches = stories.filter(s => {
    const slugNorm = s.slug.toLowerCase();
    const titleNorm = ((s.titles?.nl || '') + ' ' + (s.titles?.tr || '') + ' ' + (s.titles?.de || '')).toLowerCase();
    return slugNorm.includes(normalizedCity) || titleNorm.includes(cityName.toLowerCase());
  });

  if (matches.length >= limit) {
    return matches.slice(0, limit);
  }

  // If fewer than limit, supplement with general top stories
  const remaining = stories.filter(s => !matches.includes(s));
  return [...matches, ...remaining].slice(0, limit);
}
