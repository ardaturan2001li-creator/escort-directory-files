import i18n from '../data/i18n.json';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'tr' | 'ar';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'fr', 'es', 'it', 'nl', 'tr', 'ar'];

export const getDictionary = (lang: string) => {
  const supported: Record<string, typeof i18n['en']> = i18n as any;
  return supported[lang] || supported['en'];
};
