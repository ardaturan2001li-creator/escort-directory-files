import aiArticlesData from '../data/ai_articles_cache.json';
import { extractDistrictFromSlug, getNearbyDistrictNames, DistrictInfo, getCityDistricts } from './districts';

export interface TagDef {
  id: string;
  labels: Record<string, string>; // en, de, fr, es, it, nl, tr, ar
  matchType: 'service' | 'hair' | 'body' | 'age' | 'nationality' | 'feature';
  matchValue: string;
}

export interface MultiFacetResult {
  district: DistrictInfo | null;
  tags: TagDef[];
  originalSlug: string;
  isDistrictQuery: boolean;
}

const aiCache: Record<string, { heading: string; content: string }> = (aiArticlesData || {}) as Record<string, { heading: string; content: string }>;

function getAiArticle(lang: string, citySlug: string, facetSlug?: string) {
  const key = `${lang}_${citySlug.toLowerCase()}_${facetSlug || ''}`;
  return aiCache[key] || null;
}

export const TAGS_MAP: Record<string, TagDef> = {
  // --- Hizmet & Lokasyon Terimleri ---
  'otele-gelen': {
    id: 'otele-gelen',
    labels: {
      tr: 'Otele Gelen',
      en: 'Hotel Outcall',
      de: 'Hotel Hausbesuche',
      fr: 'Déplacement Hôtel (Outcall)',
      es: 'Salidas a Hotel (Outcall)',
      it: 'A Domicilio / Hotel',
      nl: 'Hotel Outcall',
      ar: 'زيارات فندقية'
    },
    matchType: 'service',
    matchValue: 'hotel_outcall'
  },
  'outcall': {
    id: 'outcall',
    labels: {
      tr: 'Otele & Adrese Gelen (Outcall)',
      en: 'Outcall Service',
      de: 'Outcall Service',
      fr: 'Service Outcall',
      es: 'Servicio Outcall',
      it: 'Servizio Outcall',
      nl: 'Outcall Service',
      ar: 'خدمة الزيارات الخارجية'
    },
    matchType: 'service',
    matchValue: 'hotel_outcall'
  },
  'eve-gelen': {
    id: 'eve-gelen',
    labels: {
      tr: 'Eve Gelen',
      en: 'Home Visit & Incall',
      de: 'Hausbesuche & Incall',
      fr: 'Visite à Domicile',
      es: 'Visitas a Domicilio',
      it: 'Visite a Domicilio',
      nl: 'Aan Huis / Incall',
      ar: 'زيارات منزلية'
    },
    matchType: 'service',
    matchValue: 'eve_gelen'
  },
  'kendi-yeri': {
    id: 'kendi-yeri',
    labels: {
      tr: 'Kendi Yeri Olan (Incall)',
      en: 'Private Studio (Incall)',
      de: 'Eigener Raum (Incall)',
      fr: 'Reçoit en Privé (Incall)',
      es: 'Lugar Propio (Incall)',
      it: 'Riceve in Privato (Incall)',
      nl: 'Incall / Eigen Plek',
      ar: 'استقبال خاص'
    },
    matchType: 'service',
    matchValue: 'incall'
  },
  'incall': {
    id: 'incall',
    labels: {
      tr: 'Kendi Yerinde (Incall)',
      en: 'Incall Service',
      de: 'Incall Service',
      fr: 'Service Incall',
      es: 'Servicio Incall',
      it: 'Servizio Incall',
      nl: 'Incall Service',
      ar: 'خدمة الاستقبال'
    },
    matchType: 'service',
    matchValue: 'incall'
  },
  'gece-kalan': {
    id: 'gece-kalan',
    labels: {
      tr: 'Gece Kalan / Yatılı',
      en: 'Overnight Stay',
      de: 'Über Nacht',
      fr: 'Nuit Complète (Overnight)',
      es: 'Noche Completa (Overnight)',
      it: 'Tutta la Notte (Overnight)',
      nl: 'Overnachting',
      ar: 'مبيت ليلي كامل'
    },
    matchType: 'service',
    matchValue: 'overnight'
  },
  'yatili': {
    id: 'yatili',
    labels: {
      tr: 'Yatılı Escort',
      en: 'Overnight Companion',
      de: 'Übernachtung',
      fr: 'Compagne de Nuit',
      es: 'Acompañante Nocturna',
      it: 'Accompagnatrice Notturna',
      nl: 'Hele Nacht',
      ar: 'مرافقة ليلية'
    },
    matchType: 'service',
    matchValue: 'overnight'
  },
  'overnight': {
    id: 'overnight',
    labels: {
      tr: 'Gece Kalan (Overnight)',
      en: 'Overnight VIP',
      de: 'Overnight VIP',
      fr: 'Overnight VIP',
      es: 'Overnight VIP',
      it: 'Overnight VIP',
      nl: 'Overnight VIP',
      ar: 'مبيت VIP'
    },
    matchType: 'service',
    matchValue: 'overnight'
  },
  'masaj': {
    id: 'masaj',
    labels: {
      tr: 'Masaj Yapan',
      en: 'Erotic & Tantra Massage',
      de: 'Erotik & Tantra Massage',
      fr: 'Massage Érotique & Tantrique',
      es: 'Masaje Erótico y Tántrico',
      it: 'Massaggio Erotico e Tantra',
      nl: 'Erotische Massage',
      ar: 'مساج استرخائي وتانترا'
    },
    matchType: 'service',
    matchValue: 'massage'
  },
  'erotik-masaj': {
    id: 'erotik-masaj',
    labels: {
      tr: 'Erotik Masaj',
      en: 'Sensual Massage',
      de: 'Tantra & Massage',
      fr: 'Massage Sensuel',
      es: 'Masaje Sensual',
      it: 'Massaggio Sensuale',
      nl: 'Sensuele Massage',
      ar: 'تدليك حسي'
    },
    matchType: 'service',
    matchValue: 'massage'
  },
  'mutlu-son': {
    id: 'mutlu-son',
    labels: {
      tr: 'Mutlu Son Masaj',
      en: 'Happy Ending Massage',
      de: 'Happy End Massage',
      fr: 'Massage Fin Heureuse',
      es: 'Masaje Final Feliz',
      it: 'Massaggio Happy End',
      nl: 'Happy End Massage',
      ar: 'مساج بنهاية سعيدة'
    },
    matchType: 'service',
    matchValue: 'massage'
  },
  'anal': {
    id: 'anal',
    labels: {
      tr: 'Anal Yapan',
      en: 'Anal Service',
      de: 'Analverkehr',
      fr: 'Sexe Anal',
      es: 'Sexo Anal',
      it: 'Sesso Anale',
      nl: 'Anale Seks',
      ar: 'جنس شرجي'
    },
    matchType: 'service',
    matchValue: 'anal'
  },
  'anal-yapan': {
    id: 'anal',
    labels: {
      tr: 'Anal Yapan',
      en: 'Anal Service',
      de: 'Analverkehr',
      fr: 'Sexe Anal',
      es: 'Sexo Anal',
      it: 'Sesso Anale',
      nl: 'Anale Seks',
      ar: 'جنس شرجي'
    },
    matchType: 'service',
    matchValue: 'anal'
  },
  'oral': {
    id: 'oral',
    labels: {
      tr: 'Oral Yapan',
      en: 'Oral Service',
      de: 'Oralverkehr',
      fr: 'Sexe Oral',
      es: 'Sexo Oral',
      it: 'Sesso Orale',
      nl: 'Oraal',
      ar: 'جنس فموي'
    },
    matchType: 'service',
    matchValue: 'oral'
  },
  'oral-yapan': {
    id: 'oral',
    labels: {
      tr: 'Oral Yapan',
      en: 'Oral Service',
      de: 'Oralverkehr',
      fr: 'Sexe Oral',
      es: 'Sexo Oral',
      it: 'Sesso Orale',
      nl: 'Oraal',
      ar: 'جنس فموي'
    },
    matchType: 'service',
    matchValue: 'oral'
  },
  'derin-bogaz': {
    id: 'derin-bogaz',
    labels: {
      tr: 'Derin Boğaz (Deepthroat)',
      en: 'Deepthroat',
      de: 'Deepthroat',
      fr: 'Gorge Profonde',
      es: 'Garganta Profunda',
      it: 'Gola Profonda',
      nl: 'Deepthroat',
      ar: 'ديب ثروت (حلق عميق)'
    },
    matchType: 'service',
    matchValue: 'deepthroat'
  },
  'deepthroat': {
    id: 'deepthroat',
    labels: {
      tr: 'Derin Boğaz (Deepthroat)',
      en: 'Deepthroat',
      de: 'Deepthroat',
      fr: 'Gorge Profonde',
      es: 'Garganta Profunda',
      it: 'Gola Profonda',
      nl: 'Deepthroat',
      ar: 'ديب ثروت (حلق عميق)'
    },
    matchType: 'service',
    matchValue: 'deepthroat'
  },
  'agza-bosalma-cim': {
    id: 'agza-bosalma-cim',
    labels: {
      tr: 'Ağza Boşalma (CIM)',
      en: 'Cum in Mouth (CIM)',
      de: 'Besamung im Mund (CIM)',
      fr: 'Éjaculation Buccale (CIM)',
      es: 'Corrida en la Boca (CIM)',
      it: 'Sperma in Bocca (CIM)',
      nl: 'Zaad in Mond (CIM)',
      ar: 'قذف في الفم (CIM)'
    },
    matchType: 'service',
    matchValue: 'cim'
  },
  'cim': {
    id: 'cim',
    labels: {
      tr: 'CIM (Ağza Boşalma)',
      en: 'CIM (Cum in Mouth)',
      de: 'CIM',
      fr: 'CIM',
      es: 'CIM',
      it: 'CIM',
      nl: 'CIM',
      ar: 'CIM'
    },
    matchType: 'service',
    matchValue: 'cim'
  },
  'yuze-bosalma': {
    id: 'yuze-bosalma',
    labels: {
      tr: 'Yüze Boşalma (CIF)',
      en: 'Cum on Face (CIF)',
      de: 'Besamung ins Gesicht (CIF)',
      fr: 'Éjaculation Faciale (CIF)',
      es: 'Corrida Facial (CIF)',
      it: 'Sperma sul Viso (CIF)',
      nl: 'Zaad op Gezicht (CIF)',
      ar: 'قذف على الوجه (CIF)'
    },
    matchType: 'service',
    matchValue: 'cif'
  },
  'cif': {
    id: 'cif',
    labels: {
      tr: 'CIF (Yüze Boşalma)',
      en: 'CIF (Cum on Face)',
      de: 'CIF',
      fr: 'CIF',
      es: 'CIF',
      it: 'CIF',
      nl: 'CIF',
      ar: 'CIF'
    },
    matchType: 'service',
    matchValue: 'cif'
  },
  'sevgili-tadinda': {
    id: 'sevgili-tadinda',
    labels: {
      tr: 'Sevgili Tadında (GFE)',
      en: 'Girlfriend Experience (GFE)',
      de: 'GFE (Girlfriend Experience)',
      fr: 'Girlfriend Experience (GFE)',
      es: 'Trato de Novia (GFE)',
      it: 'Esperienza da Fidanzata (GFE)',
      nl: 'GFE (Vriendin Ervaring)',
      ar: 'تجربة الحبيبة (GFE)'
    },
    matchType: 'service',
    matchValue: 'gfe'
  },
  'gfe': {
    id: 'gfe',
    labels: {
      tr: 'GFE (Sevgili Deneyimi)',
      en: 'GFE Escorts',
      de: 'GFE Escorts',
      fr: 'Escortes GFE',
      es: 'Escorts GFE',
      it: 'Escort GFE',
      nl: 'GFE Escorts',
      ar: 'عارضات GFE'
    },
    matchType: 'service',
    matchValue: 'gfe'
  },
  'strapon': {
    id: 'strapon',
    labels: {
      tr: 'Strapon Yapan',
      en: 'Strapon Service',
      de: 'Strapon Service',
      fr: 'Service Pegging / Strapon',
      es: 'Servicio Strapon',
      it: 'Servizio Strapon',
      nl: 'Strapon Service',
      ar: 'ستراب اون'
    },
    matchType: 'service',
    matchValue: 'strapon'
  },
  'bdsm': {
    id: 'bdsm',
    labels: {
      tr: 'BDSM & Fetiş',
      en: 'BDSM & Dominatrix',
      de: 'BDSM & Domina',
      fr: 'BDSM & Maîtresse',
      es: 'BDSM & Sumisión',
      it: 'BDSM & Dominazione',
      nl: 'BDSM & Meesteres',
      ar: 'بي دي إس إم وفيتيش'
    },
    matchType: 'service',
    matchValue: 'bdsm'
  },
  'ayak-fetisi': {
    id: 'ayak-fetisi',
    labels: {
      tr: 'Ayak Fetişi',
      en: 'Foot Fetish',
      de: 'Fußfetisch',
      fr: 'Fétichisme des Pieds',
      es: 'Fetichismo de Pies',
      it: 'Feticismo dei Piedi',
      nl: 'Voetfetisj',
      ar: 'فيتيش الأقدام'
    },
    matchType: 'service',
    matchValue: 'foot_fetish'
  },
  'duo': {
    id: 'duo',
    labels: {
      tr: 'Duo / İki Kız',
      en: 'Duo Escort with Girl',
      de: 'Duo mit Girl',
      fr: 'Duo avec Deux Filles',
      es: 'Dúo con Dos Chicas',
      it: 'Duo con Due Ragazze',
      nl: 'Duo met Meid',
      ar: 'عرض ثنائي (بنتين)'
    },
    matchType: 'service',
    matchValue: 'duo'
  },
  'grup': {
    id: 'grup',
    labels: {
      tr: 'Grup / Threesome',
      en: 'Threesome & Group',
      de: 'Dreier & Gruppe',
      fr: 'Trio & Groupe',
      es: 'Trío y Grupo',
      it: 'Trio e Gruppo',
      nl: 'Trio & Groep',
      ar: 'ثلاثي وجماعي'
    },
    matchType: 'service',
    matchValue: 'threesome'
  },

  // --- Milliyetler ---
  'rus': {
    id: 'rus',
    labels: {
      tr: 'Rus Escort',
      en: 'Russian Escort',
      de: 'Russische Escort',
      fr: 'Escorte Russe',
      es: 'Escort Rusa',
      it: 'Escort Russa',
      nl: 'Russische Escort',
      ar: 'عارضة روسية'
    },
    matchType: 'nationality',
    matchValue: 'russian'
  },
  'russian': {
    id: 'russian',
    labels: {
      tr: 'Rus Escort',
      en: 'Russian Escorts',
      de: 'Russische Escorts',
      fr: 'Escortes Russes',
      es: 'Escorts Rusas',
      it: 'Escort Russe',
      nl: 'Russische Escorts',
      ar: 'عارضات روسيات'
    },
    matchType: 'nationality',
    matchValue: 'russian'
  },
  'ukraynali': {
    id: 'ukraynali',
    labels: {
      tr: 'Ukraynalı Escort',
      en: 'Ukrainian Escort',
      de: 'Ukrainische Escort',
      fr: 'Escorte Ukrainienne',
      es: 'Escort Ucraniana',
      it: 'Escort Ucraina',
      nl: 'Oekraïense Escort',
      ar: 'عارضة أوكرانية'
    },
    matchType: 'nationality',
    matchValue: 'ukrainian'
  },
  'ukrainian': {
    id: 'ukrainian',
    labels: {
      tr: 'Ukraynalı Escort',
      en: 'Ukrainian Escorts',
      de: 'Ukrainische Escorts',
      fr: 'Escortes Ukrainiennes',
      es: 'Escorts Ucranianas',
      it: 'Escort Ucraine',
      nl: 'Oekraïense Escorts',
      ar: 'عارضات أوكرانيات'
    },
    matchType: 'nationality',
    matchValue: 'ukrainian'
  },
  'latin': {
    id: 'latin',
    labels: {
      tr: 'Latin Escort',
      en: 'Latina Escort',
      de: 'Latina Escort',
      fr: 'Escorte Latina',
      es: 'Escort Latina',
      it: 'Escort Latina',
      nl: 'Latina Escort',
      ar: 'عارضة لاتينية'
    },
    matchType: 'nationality',
    matchValue: 'latin'
  },
  'turk': {
    id: 'turk',
    labels: {
      tr: 'Türk Escort',
      en: 'Turkish Escort',
      de: 'Türkische Escort',
      fr: 'Escorte Turque',
      es: 'Escort Turca',
      it: 'Escort Turca',
      nl: 'Turkse Escort',
      ar: 'عارضة تركية'
    },
    matchType: 'nationality',
    matchValue: 'turkish'
  },
  'alman': {
    id: 'alman',
    labels: {
      tr: 'Alman Escort',
      en: 'German Escort',
      de: 'Deutsche Escort',
      fr: 'Escorte Allemande',
      es: 'Escort Alemana',
      it: 'Escort Tedesca',
      nl: 'Duitse Escort',
      ar: 'عارضة ألمانية'
    },
    matchType: 'nationality',
    matchValue: 'german'
  },

  // --- Saç Rengi ---
  'sarisin': {
    id: 'sarisin',
    labels: {
      tr: 'Sarışın',
      en: 'Blonde',
      de: 'Blond',
      fr: 'Blonde',
      es: 'Rubia',
      it: 'Bionda',
      nl: 'Blond',
      ar: 'شقراء'
    },
    matchType: 'hair',
    matchValue: 'blonde'
  },
  'blonde': {
    id: 'blonde',
    labels: {
      tr: 'Sarışın Escort',
      en: 'Blonde Escort',
      de: 'Blonde Escort',
      fr: 'Escorte Blonde',
      es: 'Escort Rubia',
      it: 'Escort Bionda',
      nl: 'Blonde Escort',
      ar: 'عارضة شقراء'
    },
    matchType: 'hair',
    matchValue: 'blonde'
  },
  'esmer': {
    id: 'esmer',
    labels: {
      tr: 'Esmer',
      en: 'Brunette',
      de: 'Brünett',
      fr: 'Brune',
      es: 'Morena',
      it: 'Mora / Castana',
      nl: 'Brunette',
      ar: 'سمراء'
    },
    matchType: 'hair',
    matchValue: 'brunette'
  },
  'brunette': {
    id: 'brunette',
    labels: {
      tr: 'Esmer Escort',
      en: 'Brunette Escorts',
      de: 'Brünette Escorts',
      fr: 'Escortes Brunes',
      es: 'Escorts Morenas',
      it: 'Escort More',
      nl: 'Brunette Escorts',
      ar: 'عارضات سمراوات'
    },
    matchType: 'hair',
    matchValue: 'brunette'
  },
  'kizil': {
    id: 'kizil',
    labels: {
      tr: 'Kızıl Saçlı',
      en: 'Redhead',
      de: 'Rotschopf',
      fr: 'Rousse',
      es: 'Pelirroja',
      it: 'Rossa',
      nl: 'Roodharig',
      ar: 'صهباء'
    },
    matchType: 'hair',
    matchValue: 'redhead'
  },
  'siyah-sacli': {
    id: 'siyah-sacli',
    labels: {
      tr: 'Siyah Saçlı',
      en: 'Black Hair',
      de: 'Schwarzes Haar',
      fr: 'Cheveux Noirs',
      es: 'Pelo Negro',
      it: 'Capelli Neri',
      nl: 'Zwart Haar',
      ar: 'شعر أسود'
    },
    matchType: 'hair',
    matchValue: 'black'
  },

  // --- Vücut & Yaş ---
  'genc': {
    id: 'genc',
    labels: {
      tr: 'Genç & Çıtır',
      en: 'Young & Petite',
      de: 'Jung & Knackig',
      fr: 'Jeune & Pétillante',
      es: 'Joven',
      it: 'Giovane',
      nl: 'Jong & Strak',
      ar: 'شابة وصغيرة'
    },
    matchType: 'age',
    matchValue: 'young'
  },
  'citir': {
    id: 'citir',
    labels: {
      tr: 'Genç Çıtır',
      en: 'Young VIP Girls',
      de: 'Junge Escorts',
      fr: 'Jeunes Filles VIP',
      es: 'Chicas Jóvenes VIP',
      it: 'Giovani VIP',
      nl: 'Jonge Meiden',
      ar: 'شابة مثيرة'
    },
    matchType: 'age',
    matchValue: 'young'
  },
  'young': {
    id: 'young',
    labels: {
      tr: 'Genç Model',
      en: 'Young Escort',
      de: 'Junge Begleitdame',
      fr: 'Jeune Escorte',
      es: 'Joven Escort',
      it: 'Giovane Escort',
      nl: 'Jonge Escort',
      ar: 'عارضة شابة'
    },
    matchType: 'age',
    matchValue: 'young'
  },
  'olgun': {
    id: 'olgun',
    labels: {
      tr: 'Olgun & MILF',
      en: 'Mature & MILF',
      de: 'Reif & MILF',
      fr: 'Mûre & MILF',
      es: 'Madura & MILF',
      it: 'Matura & MILF',
      nl: 'Mature / MILF',
      ar: 'ناضجة وميلف'
    },
    matchType: 'age',
    matchValue: 'mature'
  },
  'milf': {
    id: 'milf',
    labels: {
      tr: 'MILF Escort',
      en: 'MILF Escorts',
      de: 'MILF Escorts',
      fr: 'Escortes MILF',
      es: 'Escorts MILF',
      it: 'Escort MILF',
      nl: 'MILF Escorts',
      ar: 'عارضات ميلف'
    },
    matchType: 'age',
    matchValue: 'mature'
  },
  'buyuk-gogus': {
    id: 'buyuk-gogus',
    labels: {
      tr: 'Büyük Göğüslü',
      en: 'Busty & Big Boobs',
      de: 'Große Brüste',
      fr: 'Forte Poitrine',
      es: 'Pechugona (Busty)',
      it: 'Seno Prosperoso',
      nl: 'Grote Borsten',
      ar: 'صدر كبير'
    },
    matchType: 'body',
    matchValue: 'busty'
  },
  'busty': {
    id: 'busty',
    labels: {
      tr: 'İri Göğüslü (Busty)',
      en: 'Busty Escorts',
      de: 'Busty Escorts',
      fr: 'Escortes Poitrine Généreuse',
      es: 'Escorts Pechugonas',
      it: 'Escort Busty',
      nl: 'Busty Escorts',
      ar: 'عارضات صدر ممتلئ'
    },
    matchType: 'body',
    matchValue: 'busty'
  },
  'minyon': {
    id: 'minyon',
    labels: {
      tr: 'Minyon',
      en: 'Petite',
      de: 'Zierlich',
      fr: 'Petite / Fine',
      es: 'Petite / Menuda',
      it: 'Minuta',
      nl: 'Petite / Klein',
      ar: 'ناعمة وصغيرة الحجم'
    },
    matchType: 'body',
    matchValue: 'petite'
  },
  'petite': {
    id: 'petite',
    labels: {
      tr: 'Minyon Escort',
      en: 'Petite Escorts',
      de: 'Petite Escorts',
      fr: 'Escortes Petites',
      es: 'Escorts Pequeñas',
      it: 'Escort Minute',
      nl: 'Petite Escorts',
      ar: 'عارضات بتيت'
    },
    matchType: 'body',
    matchValue: 'petite'
  },
  'balik-etli': {
    id: 'balik-etli',
    labels: {
      tr: 'Balık Etli',
      en: 'Curvy',
      de: 'Kurvig',
      fr: 'Ronde & Pulpeuse',
      es: 'Curvilínea',
      it: 'Formosa / Curvy',
      nl: 'Volslank',
      ar: 'ممتلئة القوام'
    },
    matchType: 'body',
    matchValue: 'curvy'
  },
  'curvy': {
    id: 'curvy',
    labels: {
      tr: 'Kıvrımlı (Curvy)',
      en: 'Curvy Escorts',
      de: 'Kurvige Escorts',
      fr: 'Escortes Pulpeuses',
      es: 'Escorts Curvilíneas',
      it: 'Escort Curvy',
      nl: 'Curvy Escorts',
      ar: 'عارضات ممتلئات'
    },
    matchType: 'body',
    matchValue: 'curvy'
  },
  'fit-ince': {
    id: 'fit-ince',
    labels: {
      tr: 'Fit & İnce',
      en: 'Slim & Fit',
      de: 'Schlank & Fit',
      fr: 'Mince & Tonique',
      es: 'Delgada & En Forma',
      it: 'Magra e Tonica',
      nl: 'Slank & Fit',
      ar: 'رشيقة وجسم مشدود'
    },
    matchType: 'body',
    matchValue: 'slim'
  },
  'slim': {
    id: 'slim',
    labels: {
      tr: 'İnce Vücutlu (Slim)',
      en: 'Slim Escorts',
      de: 'Schlanke Escorts',
      fr: 'Escortes Minces',
      es: 'Escorts Delgadas',
      it: 'Escort Magre',
      nl: 'Slanke Escorts',
      ar: 'عارضات نحيفات'
    },
    matchType: 'body',
    matchValue: 'slim'
  },

  // --- Özel Nitelikler & Doğrulama ---
  'pornstar': {
    id: 'pornstar',
    labels: {
      tr: 'Pornstar / Yetişkin Yıldızı',
      en: 'Pornstar Escort',
      de: 'Pornostar Escort',
      fr: 'Actrice X / Pornstar',
      es: 'Actriz Porno / Pornstar',
      it: 'Pornostar Escort',
      nl: 'Pornoster Escort',
      ar: 'نجمة أفلام للبالغين'
    },
    matchType: 'feature',
    matchValue: 'is_pornstar'
  },
  'gercek-fotografli': {
    id: 'gercek-fotografli',
    labels: {
      tr: '%100 Gerçek Fotoğraflı',
      en: '100% Real Verified Photos',
      de: '100% Echte Fotos',
      fr: '100% Vraies Photos',
      es: '100% Fotos Reales',
      it: '100% Foto Reali',
      nl: '100% Echte Foto\'s',
      ar: 'صور حقيقية 100%'
    },
    matchType: 'feature',
    matchValue: 'real_pics'
  },
  'videolu': {
    id: 'videolu',
    labels: {
      tr: 'Doğrulama Videolu',
      en: 'With Video Verification',
      de: 'Mit Video',
      fr: 'Avec Vidéo',
      es: 'Con Vídeo',
      it: 'Con Video',
      nl: 'Met Video',
      ar: 'مع فيديو توثيق'
    },
    matchType: 'feature',
    matchValue: 'has_video'
  },
  'seyahat-eden': {
    id: 'seyahat-eden',
    labels: {
      tr: 'Seyahat Edebilen',
      en: 'Can Travel Worldwide',
      de: 'Reisebereit',
      fr: 'Disponible pour Déplacements',
      es: 'Disponible para Viajar',
      it: 'Disponibile a Viaggiare',
      nl: 'Reisbereid',
      ar: 'متاحة للسفر الدولي'
    },
    matchType: 'feature',
    matchValue: 'can_travel'
  },
  'cift-platform-onayli': {
    id: 'cift-platform-onayli',
    labels: {
      tr: '2+ Platformda Doğrulanmış',
      en: 'Multi-Platform Verified',
      de: 'Mehrfach Verifiziert',
      fr: 'Vérifiée Multi-Plateformes',
      es: 'Verificada en Múltiples Plataformas',
      it: 'Verificata Multi-Piattaforma',
      nl: 'Meervoudig Geverifieerd',
      ar: 'موثقة عبر عدة منصات'
    },
    matchType: 'feature',
    matchValue: 'is_multi_platform'
  }
};

// Clean non-semantic search terms like "-escortlar", "-escort", "-escorts", "-bayanlar", "-kizlar"
function cleanSuffixes(slug: string): string {
  return slug
    .replace(/(-escortlar|-escort|-escorts|-bayanlar|-kizlar|-dames|-damen)$/i, '')
    .replace(/^-(escortlar|-escort|-escorts|-bayanlar|-kizlar)/i, '');
}

// Multi-Facet Parser (District + All Service & Attribute Tags)
export function parseMultiFacetQuery(citySlug: string, rawSlug: string): MultiFacetResult {
  let cleaned = cleanSuffixes(rawSlug.toLowerCase());

  // 1. Check if a district exists in this city
  const { district, remainingSlug } = extractDistrictFromSlug(citySlug, cleaned);
  let workingSlug = remainingSlug;

  // 2. Extract matching tags from remaining slug
  const tags: TagDef[] = [];
  const addedIds = new Set<string>();
  const keys = Object.keys(TAGS_MAP).sort((a, b) => b.length - a.length);

  for (const k of keys) {
    if (workingSlug.includes(k)) {
      const tag = TAGS_MAP[k];
      if (!addedIds.has(tag.id)) {
        tags.push(tag);
        addedIds.add(tag.id);
      }
      workingSlug = workingSlug.replace(k, '');
    }
  }

  return {
    district,
    tags,
    originalSlug: rawSlug,
    isDistrictQuery: district !== null
  };
}

// Backward compatible combination parser
export function parseCombinationSlug(rawSlug: string): TagDef[] {
  const result: TagDef[] = [];
  const addedIds = new Set<string>();
  const keys = Object.keys(TAGS_MAP).sort((a, b) => b.length - a.length);
  let remaining = cleanSuffixes(rawSlug.toLowerCase());

  for (const k of keys) {
    if (remaining.includes(k)) {
      const tag = TAGS_MAP[k];
      if (!addedIds.has(tag.id)) {
        result.push(tag);
        addedIds.add(tag.id);
      }
      remaining = remaining.replace(k, '');
    }
  }

  return result;
}

// Generate natural, localized Title across all 8 languages
export function generateCombinationTitle(
  cityName: string,
  tags: TagDef[],
  lang: string,
  districtName?: string
): string {
  const activeLang = ['tr', 'en', 'de', 'fr', 'es', 'it', 'nl', 'ar'].includes(lang) ? lang : 'en';
  const labels = tags.map(t => t.labels[activeLang] || t.labels['en'] || t.labels['tr']).join(' ');
  const location = districtName ? `${cityName} ${districtName}` : cityName;

  if (tags.length === 0) {
    if (activeLang === 'tr') return `${location} Escort İlanları`;
    if (activeLang === 'de') return `Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
    if (activeLang === 'fr') return `Escortes à ${districtName ? districtName + ', ' : ''}${cityName}`;
    if (activeLang === 'es') return `Escorts en ${districtName ? districtName + ', ' : ''}${cityName}`;
    if (activeLang === 'it') return `Escort a ${districtName ? districtName + ', ' : ''}${cityName}`;
    if (activeLang === 'nl') return `Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
    if (activeLang === 'ar') return `عارضات في ${districtName ? districtName + '، ' : ''}${cityName}`;
    return `Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
  }

  switch (activeLang) {
    case 'tr':
      return `${location} ${labels} Escortlar`;
    case 'de':
      return `${labels} Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
    case 'fr':
      return `Escortes ${labels} à ${districtName ? districtName + ', ' : ''}${cityName}`;
    case 'es':
      return `Escorts ${labels} en ${districtName ? districtName + ', ' : ''}${cityName}`;
    case 'it':
      return `Escort ${labels} a ${districtName ? districtName + ', ' : ''}${cityName}`;
    case 'nl':
      return `${labels} Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
    case 'ar':
      return `عارضات ${labels} في ${districtName ? districtName + '، ' : ''}${cityName}`;
    case 'en':
    default:
      return `${labels} Escorts in ${districtName ? districtName + ', ' : ''}${cityName}`;
  }
}

// 350-450 word programmatic SEO guide for bottom of page across all 8 languages
// ============================================================================
// RICH CITY SEO KNOWLEDGE BASE (City DNA for Anti-Duplicate Programmatic SEO)
// ============================================================================
export interface CitySeoDna {
  character: Record<string, string>;
  districts: string[];
  hotels: string[];
  vibe: Record<string, string>;
  transport: Record<string, string>;
  rates: string;
}

export const CITY_SEO_DNA: Record<string, CitySeoDna> = {
  berlin: {
    character: {
      tr: "Almanya’nın avangart sanat, diplomasi, teknoloji ve efsanevi gece hayatı başkenti",
      en: "Germany's avant-garde cultural, diplomatic, and legendary cosmopolitan nightlife capital",
      de: "Deutschlands avantgardistische Kultur-, Diplomatie- und legendäre Nachtleben-Metropole",
      nl: "Duitslands avant-gardistische culturele, diplomatieke en bruisende uitgaanshoofdstad"
    },
    districts: ["Mitte", "Charlottenburg", "Kurfürstendamm (Ku'damm)", "Prenzlauer Berg", "Potsdamer Platz", "Kreuzberg"],
    hotels: ["Hotel Adlon Kempinski", "The Ritz-Carlton Berlin", "Soho House Berlin", "Waldorf Astoria Berlin", "Regent Berlin"],
    vibe: {
      tr: "Spree nehri kıyısındaki gurme restoranlardan Ku'damm lüks butiklerine, tekno kulüpler sonrası özel süit buluşmalarına kadar özgür ve seçkin bir atmosfer",
      en: "from gourmet dining along the River Spree and Ku'damm designer boutiques to discreet post-party luxury suite rendezvous",
      de: "von exquisiten Dinners an der Spree über Ku'damm-Boutiquen bis hin zu diskreten Suite-Treffen nach exklusiven Clubnächten",
      nl: "van dineren aan de Spree en Ku'damm luxe boetieks tot discrete privé-afspraken in luxe hotelsuites"
    },
    transport: {
      tr: "BER Havalimanı ve Hauptbahnhof bağlantılarıyla 5 yıldızlı süitlere hızlı VIP transfer imkanı",
      en: "direct VIP outcall arrivals to 5-star suites via BER Airport and Hauptbahnhof express connections",
      de: "schnelle VIP-Anreise in 5-Sterne-Suiten über den BER Flughafen und Hauptbahnhof",
      nl: "snelle VIP-aankomst in 5-sterrensuites via BER Airport en Hauptbahnhof verbindingen"
    },
    rates: "180€ - 450€"
  },
  stuttgart: {
    character: {
      tr: "Baden-Württemberg’in lüks otomotiv sanayisi, uluslararası ticaret fuarları ve yüksek sermayeli iş dünyası merkezi",
      en: "the automotive executive capital, international trade fair hub, and high-net-worth economic powerhouse of Baden-Württemberg",
      de: "die Automobil- und Wirtschaftshochburg Baden-Württembergs mit globalen Konzernen und führendem Messewesen",
      nl: "het centrum van de luxe auto-industrie, internationale beurzen en welvarende zakengemeenschap van Baden-Württemberg"
    },
    districts: ["Stuttgart-Mitte", "Bad Cannstatt", "Vaihingen", "Degerloch", "Killesberg", "Möhringen"],
    hotels: ["Steigenberger Graf Zeppelin", "Althoff Hotel am Schlossgarten", "Le Méridien Stuttgart", "Mövenpick Hotel Stuttgart Airport"],
    vibe: {
      tr: "Porsche ve Mercedes-Benz üst düzey yönetici ziyaretleri, Messe Stuttgart fuar toplantıları ve Schlossplatz çevresindeki prestijli akşam yemekleri",
      en: "executive business trips, Messe Stuttgart trade fairs, and prestigious corporate dinners around Schlossplatz and Königsstraße",
      de: "diskrete Führungskräfte-Termine, Messe Stuttgart Fachbesuche und elegante Geschäftsessen rund um den Schlossplatz",
      nl: "zakelijke bezoeken van topmanagers, Messe Stuttgart beursafspraken en prestigieuze diners rond de Schlossplatz"
    },
    transport: {
      tr: "STR Havalimanı ve B10 / B27 güzergahında iş otellerine ve rezidanslara dakik outcall transferi",
      en: "punctual outcall transfers to executive suites and business hotels along STR Airport and the B10/B27 corridors",
      de: "pünktliche Outcall-Transfers zu Business-Hotels entlang des STR Flughafens und der B10/B27",
      nl: "stipt hotel outcall vervoer naar zakenhotels rondom STR Airport en de B10/B27 routes"
    },
    rates: "180€ - 420€"
  },
  munich: {
    character: {
      tr: "Bavyera’nın aristokrat zarafeti, yüksek finans dünyası ve lüks yaşam tarzı merkezi",
      en: "Bavaria's affluent cultural capital, high-finance center, and luxury lifestyle hub",
      de: "Bayerns aristokratische Metropole für Hochfinanz, exklusiven Lebensstil und High-Society",
      nl: "het Beierse centrum van aristocratische elegantie, topfinanciering en exclusieve levensstijl"
    },
    districts: ["Schwabing", "Maxvorstadt", "Bogenhausen", "Altstadt-Lehel", "Glockenbachviertel"],
    hotels: ["Hotel Bayerischer Hof", "The Charles Hotel (Rocco Forte)", "Hotel Vier Jahreszeiten Kempinski", "Mandarin Oriental Munich"],
    vibe: {
      tr: "Maximilianstraße lüks alışveriş caddesi, Englischer Garten çevresindeki şık villalar ve şampanya eşliğinde VIP buluşmalar",
      en: "Maximilianstraße haute-couture boutiques, historic palatial surroundings, and champagne-fueled private penthouse encounters",
      de: "Haute-Couture auf der Maximilianstraße, vornehme Residenzen rund um den Englischen Garten und Champagner-Rendezvous",
      nl: "luxe winkelen aan de Maximilianstraße en champagne-ontmoetingen in exclusieve penthouses"
    },
    transport: {
      tr: "MUC Havalimanı ve Ludwigsvorstadt üzerinden 5 yıldızlı otellere sessiz ve gizli ulaşım",
      en: "discreet chauffeur arrivals to 5-star suites via MUC Munich Airport and central express arteries",
      de: "diskrete Chauffeur-Anreise zu 5-Sterne-Hotels über den Flughafen MUC und Stadtadern",
      nl: "discrete transfers naar 5-sterrenhotels via MUC Airport"
    },
    rates: "220€ - 500€"
  },
  frankfurt: {
    character: {
      tr: "Avrupa Merkez Bankası’na ev sahipliği yapan kıtanın finansal gökdelen ve bankacılık başkenti",
      en: "the high-rise banking capital of continental Europe and home of the European Central Bank",
      de: "die Banken- und Wolkenkratzermetropole Europas sowie Sitz der Europäischen Zentralbank",
      nl: "de wolkenkrabber- en bankenhoofdstad van Europa en zetel van de Europese Centrale Bank"
    },
    districts: ["Bankenviertel", "Westend-Süd", "Innenstadt", "Sachsenhausen", "Nordend"],
    hotels: ["Jumeirah Frankfurt", "Steigenberger Frankfurter Hof", "Roomers Frankfurt", "Sofitel Frankfurt Opera", "Villa Kennedy"],
    vibe: {
      tr: "Gökdelen süitlerinde Main nehri manzaralı randevular, uluslararası finans zirveleri ve yoğun iş temposunu unutturan tutkulu buluşmalar",
      en: "penthouse suites overlooking the River Main skyline, corporate elite unwinding after financial trading hours, and high-energy nightlife",
      de: "Penthouse-Suiten mit Main-Skylineblick, Entspannung für Führungskräfte nach Börsenschluss und stilsichere Privatabende",
      nl: "penthouse-suites met uitzicht op de skyline van de Main en ontspanning na beursuren"
    },
    transport: {
      tr: "FRA Frankfurt Havalimanı ve Hauptbahnhof çevresindeki lüks iş otellerine anında outcall servisi",
      en: "rapid outcall response to luxury financial district suites and FRA Airport hotels",
      de: "blitzschneller Outcall-Service zu Bankenviertel-Suiten und FRA-Flughafenhotels",
      nl: "snelle outcall naar financiële suites en FRA Airport hotels"
    },
    rates: "200€ - 480€"
  },
  hamburg: {
    character: {
      tr: "Kuzey Almanya’nın köklü Hansa ticaret geleneği, zengin liman kültürü ve seçkin eğlence dünyası",
      en: "Northern Germany's wealthy Hanseatic maritime hub, world-class port, and sophisticated leisure scene",
      de: "Norddeutschlands traditionsreiche Hanse- und Hafenmetropole mit maritimem Weltklasse-Charme",
      nl: "Noord-Duitslands welvarende Hanzestad met een rijke haven en exclusieve vrijetijdsbesteding"
    },
    districts: ["HafenCity", "Eppendorf", "Rotherbaum", "Alster", "Winterhude", "St. Pauli"],
    hotels: ["The Fontenay", "Hotel Atlantic Hamburg (Autograph)", "Fairmont Hotel Vier Jahreszeiten", "Grand Elysée"],
    vibe: {
      tr: "Binnenalster manzaralı su kenarı süitleri, Elbphilharmonie konser geceleri ve Speicherstadt çevresinde unutulmaz romantik anlar",
      en: "scenic Binnenalster lakefront suites, Elbphilharmonie evening dates, and atmospheric historic Speicherstadt private rendezvous",
      de: "romantische Suiten an der Binnenalster, Abende nach der Elbphilharmonie und exklusive Speicherstadt-Treffen",
      nl: "luxe suites aan de Binnenalster en avondafspraken na concerten in de Elbphilharmonie"
    },
    transport: {
      tr: "HAM Havalimanı ve Jungfernstieg bölgesindeki lüks rezidanslara kusursuz zamanlamayla varış",
      en: "smooth outcall access to luxury Jungfernstieg residences and HAM Airport suites",
      de: "makellose Anfahrt zu Residenzen am Jungfernstieg und Hotels nahe Flughafen HAM",
      nl: "perfecte transfers naar luxe residenties aan de Jungfernstieg en HAM Airport"
    },
    rates: "190€ - 450€"
  },
  london: {
    character: {
      tr: "Dünyanın finans, moda, kraliyet zarafeti ve küresel lüks yaşam merkezi",
      en: "the world's preeminent financial, aristocratic, high-fashion, and luxury capital",
      de: "die weltweite Metropole für Finanzen, High-Fashion, königliche Eleganz und globalen Luxus",
      nl: "de toonaangevende wereldstad voor financiën, mode, koninklijke elegantie en luxe"
    },
    districts: ["Mayfair", "Knightsbridge", "Chelsea", "Kensington", "Canary Wharf", "Soho", "Westminster"],
    hotels: ["The Ritz London", "Claridge's", "The Dorchester", "Corinthia London", "The Connaught", "Bulgari Hotel London"],
    vibe: {
      tr: "Mayfair özel üyeler kulübü çıkışı randevular, West End tiyatro akşamları ve Knightsbridge süitlerinde mutlak gizlilik",
      en: "private Mayfair members club evenings, West End theatre dates, and discrete Knightsbridge penthouse rendezvous",
      de: "exklusive Abende nach Mayfair Member-Clubs, West-End-Theaterbegleitungen und diskrete Suiten in Knightsbridge",
      nl: "private member club avonden in Mayfair, West End theaterdates en discrete Knightsbridge penthouses"
    },
    transport: {
      tr: "LHR Heathrow, London City Havalimanı ve lüks şoförlü transferlerle süitlere doğrudan ulaşım",
      en: "private chauffeur transfers directly to 5-star hotel suites from LHR Heathrow and London City Airport",
      de: "diskrete Chauffeurdienste direkt zu Suiten über LHR Heathrow und London City Airport",
      nl: "privé-chauffeurs rechtstreeks naar 5-sterrensuites vanaf LHR Heathrow en London City"
    },
    rates: "250€ - 600€"
  },
  amsterdam: {
    character: {
      tr: "Hollanda’nın tarihi kanalları, özgürlükçü hoşgörüsü ve uluslararası ticaret merkezi",
      en: "the Netherlands' iconic historic canal metropolis, liberal lifestyle, and corporate financial capital",
      de: "Niederlandes berühmte Grachtenmetropole mit weltoffenem Lebensstil und internationalem Handelszentrum",
      nl: "Nederlands iconische grachtenhoofdstad, tolerante levensstijl en internationaal handelscentrum"
    },
    districts: ["Centrum", "De Pijp", "Oud-Zuid", "Zuidas (Financial District)", "Jordaan"],
    hotels: ["Waldorf Astoria Amsterdam", "Conservatorium Hotel", "Hotel Okura Amsterdam", "Pulitzer Amsterdam"],
    vibe: {
      tr: "Herengracht kıyısındaki tarihi konak süitleri, Zuidas uluslararası iş yemekleri ve açık fikirli samimi atmosfer",
      en: "historic canal mansion suites along Herengracht, high-energy Zuidas corporate dinners, and uninhibited intimate warmth",
      de: "stilvolle Grachtenhaus-Suiten an der Herengracht, internationale Zuidas-Geschäftsessen und ungezwungene Leidenschaft",
      nl: "historische herenhuizen aan de Herengracht, diners op de Zuidas en ongeëvenaarde warme intimiteit"
    },
    transport: {
      tr: "Schiphol (AMS) Havalimanı ve Ring A10 üzerinden lüks otellere 20 dakikada hızlı varış",
      en: "rapid 20-minute outcall arrivals from Schiphol AMS Airport and central canal routes",
      de: "schnelle 20-Minuten-Anfahrt ab Schiphol AMS und Ring A10 zu allen Luxushotels",
      nl: "snelle 20-minuten transfers vanaf Schiphol AMS en de Ring A10"
    },
    rates: "200€ - 450€"
  },
  brussels: {
    character: {
      tr: "Avrupa Birliği ve NATO’nun diplomatik karar merkezi, çok dilli kozmopolit başkent",
      en: "the diplomatic heart of the European Union and NATO, a multilingual cosmopolitan epicenter",
      de: "das diplomatische Herz der Europäischen Union und NATO, eine mehrsprachige Weltmetropole",
      nl: "het diplomatieke hart van de Europese Unie en de NAVO, een meertalige kosmopolitische metropool"
    },
    districts: ["Quartier Louise", "Sablon", "Ixelles", "Schuman (EU Quarter)", "Uccle"],
    hotels: ["Hotel Amigo (Rocco Forte)", "Steigenberger Wiltcher's", "The Hotel Brussels", "Sofitel Brussels Europe"],
    vibe: {
      tr: "Avenue Louise lüks butikleri, Grand Place çevresindeki şık şarap barları ve diplomatik süit randevuları",
      en: "Avenue Louise luxury shopping, Grand Place wine bars, and high-level diplomatic suite meetings",
      de: "Luxusshopping auf der Avenue Louise, feine Weinbars am Sablon und diskrete Diplomaten-Treffen",
      nl: "winkelen aan de Louizalaan, wijnbarretjes op de Zavel en discrete diplomatieke ontmoetingen"
    },
    transport: {
      tr: "BRU Zaventem Havalimanı ve Gare du Midi hızlı tren hattı üzerinden süitlere anında transfer",
      en: "seamless transfers via BRU Zaventem Airport and Gare du Midi Eurostar terminal",
      de: "reibungslose Transfers über den Flughafen BRU Zaventem und Gare du Midi Eurostar",
      nl: "vlotte transfers via BRU Zaventem Airport en Brussel-Zuid Eurostar"
    },
    rates: "180€ - 420€"
  },
  paris: {
    character: {
      tr: "Dünyanın aşk, moda, lüks gastronomi ve haute-couture başkenti",
      en: "the world's eternal capital of romance, haute-couture fashion, and Michelin-starred gastronomy",
      de: "die ewige Welthauptstadt der Romantik, Haute Couture und erlesenen Gastronomie",
      nl: "de wereldhoofdstad van romantiek, haute couture en gastronomie"
    },
    districts: ["Champs-Élysées", "Le Marais", "Saint-Germain-des-Prés", "16th Arrondissement", "Opéra"],
    hotels: ["Ritz Paris", "Le Meurice", "Four Seasons Hotel George V", "Hôtel de Crillon", "Le Bristol Paris"],
    vibe: {
      tr: "Eyfel Kulesi manzaralı teras süitleri, Şanzelize caddesinde akşam gezintileri ve Fransız zarafetiyle unutulmaz randevular",
      en: "terrace suites facing the Eiffel Tower, golden-triangle luxury dining, and uncompromising Parisian sensuality",
      de: "Terrassen-Suiten mit Eiffelturmblick, Gourmet-Dinner im goldenen Dreieck und unvergessliche Pariser Sinnlichkeit",
      nl: "terrassuites met uitzicht op de Eiffeltoren en onvergetelijke Parijse sensualiteit"
    },
    transport: {
      tr: "CDG ve Orly havalimanları üzerinden 8. Bölge saray otellerine özel şoförlü VIP varış",
      en: "VIP chauffeur arrivals to 8th Arrondissement palace hotels from CDG and Orly airports",
      de: "VIP-Chauffeur zu den Palasthotels im 8. Arrondissement ab CDG und Orly",
      nl: "VIP-transfers naar paleishotels in het 8e arrondissement vanaf CDG en Orly"
    },
    rates: "250€ - 650€"
  }
};

// Fallback generator for other European & world cities
function getCityDna(citySlug: string, cityName: string, country: string): CitySeoDna {
  const norm = citySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const k of Object.keys(CITY_SEO_DNA)) {
    if (norm.includes(k) || k.includes(norm)) {
      return CITY_SEO_DNA[k];
    }
  }

  // Dynamic procedural DNA generation for any unlisted city
  return {
    character: {
      tr: `${country} sınırları içinde ticaret, kültür ve sosyal yaşamın seçkin duraklarından biri olan ${cityName}`,
      en: `one of the most vibrant commercial and cultural centers in ${country}, ${cityName}`,
      de: `eines der lebendigsten Wirtschafts- und Kulturzentren in ${country}, ${cityName}`,
      nl: `een van de meest dynamische zakelijke en culturele bestemmingen in ${country}, ${cityName}`
    },
    districts: [`${cityName} City Centre`, `${cityName} Business District`, `${cityName} Historic Quarter`, `${cityName} West`],
    hotels: [`Grand Hotel ${cityName}`, `Radisson Blu ${cityName}`, `Hilton ${cityName}`, `Boutique Hotel ${cityName}`],
    vibe: {
      tr: `${cityName} genelinde kaliteli akşam yemekleri, 5 yıldızlı süit konaklamaları ve iş seyahatlerini ayrıcalıklı kılan bağımsız arkadaşlıklar`,
      en: `refined private evenings, luxury hotel suite arrangements, and companion dates enhancing business travels in ${cityName}`,
      de: `stilvolle private Abende, luxuriöse Suiten-Arrangements und exklusive Begleitung während des Aufenthalts in ${cityName}`,
      nl: `stijlvolle privé-avonden, luxe suites en exclusieve dates die elk verblijf in ${cityName} verrijken`
    },
    transport: {
      tr: `merkezi transfer hatları ve lüks taksi ile süitlere gizli ve dakik ulaşım`,
      en: `discreet, punctual transfers directly to executive suites and residential quarters`,
      de: `diskrete und pünktliche Anreise direkt zu Suiten und Residenzen`,
      nl: `discrete en tijdige transfers naar hotelsuites en privé-residenties`
    },
    rates: "180€ - 400€"
  };
}

// Deterministic string hash for seed generation
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 350-500 word programmatic SEO guide for bottom of page with Anti-Duplicate Blueprint Architecture
export function generateBottomSeoArticle(
  cityName: string,
  country: string,
  tags: TagDef[],
  lang: string,
  facetSlug?: string,
  districtName?: string
) {
  const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const activeLang = ['tr', 'en', 'de', 'fr', 'es', 'it', 'nl', 'ar'].includes(lang) ? lang : 'en';

  // 1. Check AI Cache if specific handcrafted copy exists
  const aiArticle = getAiArticle(activeLang, citySlug, facetSlug);
  if (aiArticle && aiArticle.content) {
    return {
      heading: aiArticle.heading || generateCombinationTitle(cityName, tags, activeLang, districtName),
      content: aiArticle.content
    };
  }

  const dna = getCityDna(citySlug, cityName, country);
  const labels = tags.map(t => t.labels[activeLang] || t.labels['en'] || t.labels['tr']).join(' ');
  const locTitle = districtName ? `${districtName}, ${cityName}` : cityName;

  // Compute deterministic seed based on city + facet + lang to choose blueprint & variations
  const seedKey = `${citySlug}_${facetSlug || 'all'}_${activeLang}`;
  const seed = stringHash(seedKey);
  const blueprint = seed % 3; // 3 completely distinct article structures

  const district1 = dna.districts[seed % dna.districts.length];
  const district2 = dna.districts[(seed + 1) % dna.districts.length];
  const hotel1 = dna.hotels[seed % dna.hotels.length];
  const hotel2 = dna.hotels[(seed + 1) % dna.hotels.length];

  // Specific narrative nuance based on active tags
  const isBlonde = tags.some(t => t.id === 'sarisin' || t.matchValue === 'blonde');
  const isBrunette = tags.some(t => t.id === 'esmer' || t.matchValue === 'brunette');
  const isRedhead = tags.some(t => t.id === 'kizil' || t.matchValue === 'redhead');
  const isOutcall = tags.some(t => t.id === 'otele-gelen' || t.id === 'outcall' || t.matchValue === 'hotel_outcall');
  const isIncall = tags.some(t => t.id === 'eve-gelen' || t.matchValue === 'incall');
  const isYoung = tags.some(t => t.id === 'genc' || t.id === 'citir' || t.matchValue === 'young' || t.matchValue === 'slim');
  const isMature = tags.some(t => t.id === 'olgun' || t.matchValue === 'mature');
  const isAnal = tags.some(t => t.id === 'anal');
  const isMassage = tags.some(t => t.id === 'masaj');
  const isOvernight = tags.some(t => t.id === 'gece-kalan' || t.id === 'overnight');

  // --- TURKISH (tr) DYNAMIC GENERATION ---
  if (activeLang === 'tr') {
    let facetIntro = "";
    if (isBlonde) {
      facetIntro = `${cityName} genelinde sarışın modeller; doğal Slav, İskandinav ve Alman kökenli kadınsı zarafetleri, pürüzsüz tenleri ve büyüleyici sarı saçlarıyla seçkin beylerin ilk tercihi konumundadır. Gerek ${hotel1} süitinde romantik bir şampanya eşliğinde, gerekse ${district1} semtindeki seçkin akşam yemeklerinde göz alıcı bir partner arayanlar için sarışın eskortlar benzersiz bir auraya sahiptir.`;
    } else if (isBrunette) {
      facetIntro = `${cityName} esmer modelleri; Akdeniz ve Latin cazibesini yansıtan derin bakışları, buğday tenleri ve tutkulu mizaçlarıyla bilinir. ${district1} bölgesindeki akşam buluşmalarında sıcak kanlı yaklaşımları ve yüksek auralarıyla beylere samimi anlar yaşatırlar.`;
    } else if (isRedhead) {
      facetIntro = `${cityName} kızıl saçlı bağımsız modelleri; porselen beyazı tenleri ve nadir bulunan tutkulu çekicilikleriyle alışılmışın dışında, alev gibi bir deneyim arayan beylerin gözdesidir.`;
    } else if (isYoung) {
      facetIntro = `${cityName} genç ve çıtır modelleri; tükenmeyen enerjileri, samimi ve doğal tavırlarıyla kasmayan, taze bir heyecan sunar. Günlük hayatın ve iş stresinin yorgunluğunu unutturan neşeli bir buluşma vaat ederler.`;
    } else if (isMature) {
      facetIntro = `${cityName} olgun escort bayanları; yılların getirdiği kadınsı özgüven, derin sohbet kabiliyeti ve yatakta sınır tanımayan tecrübeleriyle ne istediğini çok iyi bilen beylere hitap eder.`;
    } else {
      facetIntro = `${cityName} bölgesinde bağımsız VIP eşlikçiler; zarafetleri, yüksek hijyen standartları ve koşulsuz gizlilik anlayışlarıyla kaliteli vakit geçirmek isteyen seçkin beylere birinci sınıf bir servis sunar.`;
    }

    let serviceNuance = "";
    if (isOutcall) {
      serviceNuance = `${cityName} sınırları içinde otele gelen (outcall) randevularda profesyonellik esastır. Model ${hotel1} veya ${hotel2} gibi 5 yıldızlı otellerin lobi karmaşasına girmeden doğrudan oda kapınıza şık ve dikkat çekmeyen bir tarzda teşrif eder. Lobiye inme zorunluluğu olmaksızın, oda numaranızı teyit etmeniz yeterlidir.`;
    } else if (isAnal) {
      serviceNuance = `Anal fantezi içeren randevularda hijyen, hazırlık ve karşılıklı uyum en temel unsurdur. ${cityName} bölgesindeki bağımsız modeller aceleye getirmeden, rahatlatıcı masaj ve erotik ön sevişmeyle başlayan tutkulu bir deneyim sunar.`;
    } else if (isMassage) {
      serviceNuance = `Erotik masaj seanslarında tantrik ve nuru teknikleri harmanlanarak vücudunuzdaki tüm kas gerginliği ve iş stresi boşaltılır. Sıcak aromatik yağlar eşliğinde ten tene temasın zirvesi yaşanır.`;
    } else if (isOvernight) {
      serviceNuance = `Gece boyu süren (overnight) konaklamalarda gece boyunca sınırsız yakınlık, birlikte yenen oda servisi akşam yemeği ve sabahın ilk ışıklarında paylaşılan tatlı bir uyanış randevusu sizi bekler.`;
    } else {
      serviceNuance = `Randevunuz boyunca karşılıklı saygı, tam gizlilik ve kişisel sınırların korunması esastır. İster ${district1} semtinde bir akşam yemeği eşliği, ister baş başa özel anlar olsun, modeliniz tam zamanında ve kusursuz bir şıklıkla hazır bulunur.`;
    }

    if (blueprint === 0) {
      return {
        heading: `${locTitle} Bölgesinde ${labels || 'VIP'} Eşlikçi Seçenekleri ve Prestijli Buluşma Rehberi`,
        content: `
          <p class="mb-4">
            <strong>${locTitle}</strong>, ${dna.character.tr} olarak öne çıkar. Şehirde ${dna.vibe.tr}. Bu prestijli atmosferde kaliteli ve unutulmaz anlar yaşamak isteyen beyler için <strong>${labels || 'VIP modeller'}</strong>, beklentilerin ötesinde bir hizmet sunmaktadır.
          </p>
          <p class="mb-4">
            ${facetIntro}
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">${hotel1} ve ${hotel2} Süitlerinde 5 Yıldızlı Outcall Protokolü</h3>
          <p class="mb-4">
            ${serviceNuance} ${dna.transport.tr}. Rezervasyon esnasında otelinizin adını, oda numaranızı ve istediğiniz zaman dilimini önceden bildirmeniz kusursuz bir buluşmanın ilk adımıdır.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">${cityName} Şeffaf Fiyat Tarifeleri ve Doğrudan WhatsApp Rezervasyonu</h3>
          <p class="mb-4">
            ${cityName} pazarında bağımsız modellerin saatlik tarifeleri genellikle <strong>${dna.rates}</strong>, gece boyu konaklamalar ise <strong>900€ - 2.200€</strong> seviyesindedir. Araya komisyoncu, kulüp veya ajans girmeden doğrudan modelin şahsi WhatsApp hattına mesaj atarak teyit sağlayabilirsiniz.
          </p>
          <div class="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
            <strong>18+ Yasal Uyarı & Gizlilik:</strong> Platformumuzdaki tüm bağımsız modeller 18 yaşını doldurmuş reşit bireylerdir. Tüm görüşmeler karşılıklı rıza ve mutlak gizlilik esasına dayanır.
          </div>
        `
      };
    } else if (blueprint === 1) {
      return {
        heading: `${labels || 'VIP Escort'} Arayanlar İçin ${locTitle} Yerel Yaşam ve Rezervasyon Kılavuzu`,
        content: `
          <p class="mb-4">
            İş seyahati, tatil veya yerel ikamet sebebiyle <strong>${locTitle}</strong> lokasyonunda bulunan beyefendiler için en doğru eşlikçiyi bulmak özen gerektirir. ${dna.character.tr} olan bu şehirde, ${district1} ve ${district2} gibi seçkin semtler özel buluşmalar için ideal noktaları barındırır.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">${cityName} Semtlerinde Doğal Cazibe: ${labels || 'Özel Tercihler'}</h3>
          <p class="mb-4">
            ${facetIntro}
          </p>
          <p class="mb-4">
            ${serviceNuance}
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">${hotel1} Çevresinde Lüks ve Güvenli Randevu Kuralları</h3>
          <p class="mb-4">
            Randevularınızda gizlilik en büyük önceliğimizdir. ${dna.transport.tr}. Modelinizin kişisel sınırlarına saygı göstermek ve randevu detaylarını açıkça teyit etmek her iki taraf için de keyifli bir deneyim sağlar.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Aracısız Fiyat Politikası (${dna.rates})</h3>
          <p class="mb-4">
            Doğrudan bağımsız çalışan modellerle iletişim kurmak size gereksiz ajans masraflarından arındırılmış net fiyatlar sunar. Tek tıkla WhatsApp butonuna tıklayarak modelin müsaitlik durumunu sorgulayabilirsiniz.
          </p>
        `
      };
    } else {
      return {
        heading: `${cityName} Lüks Randevu Kültürü: ${labels || 'Seçkin Eşlikçiler'}`,
        content: `
          <p class="mb-4">
            ${cityName} ziyaretinizi unutulmaz kılacak en özel detay, yanınızda size eşlik edecek zarif ve kültürlü bir partnerdir. ${dna.character.tr} olan bu metropolde, ${dna.vibe.tr}.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">${district1} ve ${district2} Semtlerinde Benzersiz ${labels} Deneyimi</h3>
          <p class="mb-4">
            ${facetIntro}
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Otel ve Rezidans Ziyaretlerinde Kusursuz Hizmet</h3>
          <p class="mb-4">
            ${serviceNuance} ${hotel1} veya ${hotel2} gibi lüks noktalarda konaklıyorsanız, modelinizin oda kapısına dakik şekilde gelmesi için önceden bilgi vermeniz yeterlidir.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Ortalama Ücretler ve Hızlı Rezervasyon</h3>
          <p class="mb-4">
            Standart saatlik seanslar ${dna.rates} aralığındadır. Sayfamızdaki doğrulanmış ilanlar üzerinden modelin gerçek fotoğraflarını inceleyebilir ve doğrudan WhatsApp ile temasa geçebilirsiniz.
          </p>
        `
      };
    }
  }

  // --- ENGLISH (en) DYNAMIC GENERATION ---
  if (activeLang === 'en') {
    let enIntro = isBlonde
      ? `In ${cityName}, blonde companions are universally acclaimed for their radiant Scandinavian, Slavic, and Germanic allure. Whether accompanying you to a high-profile corporate dinner in ${district1} or sharing vintage champagne in a luxury suite at ${hotel1}, their statuesque presence and natural blonde beauty create an unforgettable impression.`
      : isBrunette
      ? `Brunette escorts in ${cityName} exude Mediterranean elegance and fiery sensuality. Their warm conversational depth makes them the consummate dinner companion across ${district1} before retiring to private moments.`
      : isYoung
      ? `Young, fresh companions in ${cityName} bring spontaneous passion and high-energy excitement, melting away corporate stress with genuine smiles and natural affection.`
      : isMature
      ? `Mature and experienced courtesans in ${cityName} cater to discerning gentlemen seeking supreme sophistication, intellectual rapport, and unhurried sensual mastery.`
      : `Independent elite companions in ${cityName} represent the highest standards of refinement, punctuality, and immaculate personal hygiene for discerning international travelers.`;

    let enService = isOutcall
      ? `Hotel outcall etiquette in ${cityName} is refined for absolute discretion. When booking an outcall to ${hotel1} or ${hotel2}, companions arrive elegantly attired directly at your suite door without lingering in hotel lobbies.`
      : isAnal
      ? `Anal intimacy requires unhurried chemistry, mutual trust, and absolute cleanliness. ${cityName}'s verified companions approach this preference with sensual passion and gentle pacing.`
      : isMassage
      ? `Sensual tantric and body-to-body massages in ${cityName} relieve executive tension, combining heated organic oils with full tactile intimacy.`
      : isOvernight
      ? `Overnight engagements in ${cityName} include private late-night room service, continuous intimacy, and a leisurely morning breakfast.`
      : `Companions arrive punctually styled to perfection across ${district1} and ${district2}, ensuring complete privacy.`;

    if (blueprint === 0) {
      return {
        heading: `VIP Guide to ${labels || 'Elite Companions'} in ${locTitle} (${country})`,
        content: `
          <p class="mb-4">
            <strong>${locTitle}</strong> stands as ${dna.character.en}. The city's lifestyle thrives ${dna.vibe.en}. For international executives and travelers desiring elite companionship, <strong>${labels || 'verified companions'}</strong> offer an unparalleled experience.
          </p>
          <p class="mb-4">${enIntro}</p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">5-Star Hotel Outcalls at ${hotel1} & ${hotel2}</h3>
          <p class="mb-4">${enService} ${dna.transport.en}.</p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Transparent Rates & Direct Booking (${dna.rates})</h3>
          <p class="mb-4">
            Independent rates in ${cityName} typically span <strong>${dna.rates} per hour</strong> and <strong>€1,000 - €2,400 for overnight bookings</strong>. Zero agency fees apply when booking directly via WhatsApp.
          </p>
          <div class="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
            <strong>18+ Verification Notice:</strong> All companions are self-employed adults over 18 years old. All rendezvous are strictly consensual agreements between adults.
          </div>
        `
      };
    } else {
      return {
        heading: `The ${cityName} Companion Blueprint: Experiencing ${labels || 'VIP Escorts'} in ${locTitle}`,
        content: `
          <p class="mb-4">
            Navigating ${locTitle} requires insider knowledge of premier meeting grounds. From ${district1} to ${district2}, ${cityName} offers bespoke luxury for gentlemen seeking ${labels || 'high-class companionship'}.
          </p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">The Charm of ${labels || 'Independent Companions'} in ${cityName}</h3>
          <p class="mb-4">${enIntro}</p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Discreet Suite Appointments Across ${hotel1}</h3>
          <p class="mb-4">${enService}</p>
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Direct Contact & Rates</h3>
          <p class="mb-4">
            Average verified hourly rates are ${dna.rates}. Simply tap the WhatsApp button to verify real-time availability.
          </p>
        `
      };
    }
  }

  // --- GERMAN (de) DYNAMIC GENERATION ---
  if (activeLang === 'de') {
    let deIntro = isBlonde
      ? `In ${cityName} erfreuen sich blonde High-Class Begleitdamen größter Beliebtheit. Ihre natürliche skandinavische, slawische oder deutsche Eleganz, makellose Ausstrahlung und charmante Umgangsformen machen sie zu perfekten Partnerinnen für exklusive Stunden im ${hotel1} oder ein niveauvolles Geschäftsessen in ${district1}.`
      : `Verifizierte Escorts in ${cityName} bieten anspruchsvollen Gentlemen erstklassige Diskretion, Stilgefühl und sinnliche Stunden fernab des geschäftlichen Alltags.`;

    let deService = isOutcall
      ? `Hotelbesuche (Outcall) im Raum ${cityName} erfolgen unter strengster Vertraulichkeit. Damen erscheinen pünktlich und unauffällig elegant gekleidet direkt an Ihrer Suite im ${hotel1} oder ${hotel2}.`
      : `Ob private Termine in ${district1} oder ein elegantes Dinner-Date: gegenseitiger Respekt und absolute Vertraulichkeit stehen an oberster Stelle.`;

    return {
      heading: `Exklusiver Begleitführer für ${labels || 'High-Class Escorts'} in ${locTitle}`,
      content: `
        <p class="mb-4">
          Willkommen im führenden VIP-Portal für <strong>${locTitle}</strong>. In ${dna.character.de} erwarten Sie handverlesene unabhängige Models für unvergessliche Begegnungen. ${dna.vibe.de}.
        </p>
        <p class="mb-4">${deIntro}</p>
        <h3 class="text-xl font-bold text-white mt-6 mb-3">Hotelbesuche im ${hotel1} & Diskrete Treffen in ${district1}</h3>
        <p class="mb-4">${deService} ${dna.transport.de}.</p>
        <h3 class="text-xl font-bold text-white mt-6 mb-3">Faire Honorare & Direkter Kontakt (${dna.rates})</h3>
        <p class="mb-4">
          Die Stundensätze für unabhängige Damen in ${cityName} bewegen sich üblicherweise zwischen <strong>${dna.rates}</strong>, Übernachtungen bei <strong>1.000€ bis 2.200€</strong>.
        </p>
      `
    };
  }

  // --- DUTCH (nl) DYNAMIC GENERATION ---
  if (activeLang === 'nl') {
    let nlIntro = isBlonde
      ? `Blonde escorts in ${cityName} zijn uiterst gewild vanwege hun natuurlijke Scandinavische, Slavische en elegante uitstraling. Of het nu gaat om een intiem glas champagne in een suite van ${hotel1} of een exclusief diner in ${district1}, hun klasse en charme maken elke afspraak onvergetelijk.`
      : `Geverifieerde onafhankelijke escorts in ${cityName} bieden veeleisende heren een ongeëvenaarde ervaring van luxe, discretie en oprechte passie.`;

    return {
      heading: `Gids voor ${labels || 'Exclusieve Escorts'} in ${locTitle}`,
      content: `
        <p class="mb-4">
          Welkom bij de toonaangevende VIP gids voor <strong>${locTitle}</strong>. Als ${dna.character.nl} biedt ${cityName} ${dna.vibe.nl}.
        </p>
        <p class="mb-4">${nlIntro}</p>
        <h3 class="text-xl font-bold text-white mt-6 mb-3">Hotel Outcall naar ${hotel1} & ${hotel2}</h3>
        <p class="mb-4">
          Bij een hotelbezoek in ${district1} staat discretie voorop. Modellen arriveren stijlvol en stipt aan uw hotelkamerdeur. ${dna.transport.nl}.
        </p>
        <h3 class="text-xl font-bold text-white mt-6 mb-3">Transparante Tarieven (${dna.rates})</h3>
        <p class="mb-4">
          Gemiddelde tarieven in ${cityName} liggen tussen <strong>${dna.rates} per uur</strong>. Direct contact via WhatsApp zonder bemiddelingskosten.
        </p>
      `
    };
  }

  // Other languages fallback with city-specific DNA
  return {
    heading: `VIP Guide to ${labels || 'Companions'} in ${locTitle}`,
    content: `
      <p class="mb-4">
        Welcome to the definitive VIP concierge directory for <strong>${locTitle}</strong> (${country}). Connecting you with verified independent models specializing in <strong>${labels || 'luxury companionship'}</strong>.
      </p>
      <h3 class="text-xl font-bold text-white mt-6 mb-3">Luxury Encounters in ${district1} and ${hotel1}</h3>
      <p class="mb-4">
        ${dna.vibe.en || 'Discreet 5-star hotel outcalls and private appointments.'} Typical rates in ${cityName} range from ${dna.rates}.
      </p>
    `
  };
}

export function getPopularCombinations(
  cityName: string,
  lang: string = 'tr',
  citySlug?: string,
  districtKey?: string
): { slug: string; label: string }[] {
  const normCity = citySlug || cityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const neighborDistricts = districtKey ? getNearbyDistrictNames(normCity, districtKey) : [];
  const cityDistricts = getCityDistricts(normCity);

  const prefix = districtKey ? `${districtKey}-` : '';
  const distLabel = districtKey ? `${districtKey.charAt(0).toUpperCase() + districtKey.slice(1)} ` : '';

  const combinations = [
    {
      slug: `${prefix}anal-yapan-oral`,
      label: `${distLabel}${cityName} Anal ve Oral Yapan Escortlar`
    },
    {
      slug: `${prefix}sarisin-genc-anal`,
      label: `${distLabel}${cityName} Genç Sarışın Anal Escortlar`
    },
    {
      slug: `${prefix}eve-gelen-sarisin`,
      label: `${distLabel}${cityName} Eve Gelen Sarışın Escortlar`
    },
    {
      slug: `${prefix}gece-kalan-rus-escortlar`,
      label: `${distLabel}${cityName} Gece Kalan Rus Escortlar`
    },
    {
      slug: `${prefix}masaj-yapan-olgun`,
      label: `${distLabel}${cityName} Masaj Yapan Olgun Escortlar`
    },
    {
      slug: `${prefix}buyuk-gogus-otele-gelen`,
      label: `${distLabel}${cityName} Büyük Göğüslü Otele Gelenler`
    },
    {
      slug: `${prefix}sevgili-tadinda-minyon`,
      label: `${distLabel}${cityName} Sevgili Tadında Minyon Modeller`
    },
    {
      slug: `${prefix}agza-bosalma-cim-anal`,
      label: `${distLabel}${cityName} CIM ve Anal Yapan Escortlar`
    }
  ];

  // If we have neighbor districts, add direct links to them to build the proximity spiderweb
  if (neighborDistricts.length > 0) {
    for (const nd of neighborDistricts.slice(0, 4)) {
      const ndSlug = nd.toLowerCase().replace(/[^a-z0-9]/g, '-');
      combinations.push({
        slug: `${ndSlug}-anal-yapan-oral`,
        label: `${nd} Anal ve Oral Escortlar`
      });
      combinations.push({
        slug: `${ndSlug}-sarisin-genc-escortlar`,
        label: `${nd} Sarışın Genç Escortlar`
      });
    }
  } else if (cityDistricts.length > 0) {
    // Add top districts of the city
    for (const d of cityDistricts.slice(0, 4)) {
      combinations.push({
        slug: `${d.key}-anal-yapan-oral`,
        label: `${d.name} Anal ve Oral Escortlar`
      });
    }
  }

  return combinations;
}

export const SERVICE_TRANSLATIONS: Record<string, Record<string, string>> = {
  hotel_outcall: {
    en: 'Hotel Outcall',
    de: 'Hotelbesuche',
    fr: 'Déplacement Hôtel',
    es: 'Salidas a Hotel',
    it: 'A Domicilio / Hotel',
    nl: 'Hotel Outcall',
    tr: 'Otele Gelen',
    ar: 'زيارات فندقية'
  },
  otele_gelen: {
    en: 'Hotel Outcall',
    de: 'Hotelbesuche',
    fr: 'Déplacement Hôtel',
    es: 'Salidas a Hotel',
    it: 'A Domicilio / Hotel',
    nl: 'Hotel Outcall',
    tr: 'Otele Gelen',
    ar: 'زيارات فندقية'
  },
  incall: {
    en: 'Private Studio (Incall)',
    de: 'Privater Empfang (Incall)',
    fr: 'Réception Privée (Incall)',
    es: 'Lugar Propio (Incall)',
    it: 'Riceve in Privato (Incall)',
    nl: 'Incall / Eigen Plek',
    tr: 'Kendi Yeri (Incall)',
    ar: 'استقبال خاص'
  },
  eve_gelen: {
    en: 'Incall / Home Visit',
    de: 'Hausbesuche / Incall',
    fr: 'Visite à Domicile',
    es: 'Visitas a Domicilio',
    it: 'Visite a Domicilio',
    nl: 'Aan Huis / Incall',
    tr: 'Eve Gelen',
    ar: 'زيارات منزلية'
  },
  anal: {
    en: 'Anal Sex',
    de: 'Analverkehr',
    fr: 'Sexe Anal',
    es: 'Sexo Anal',
    it: 'Sesso Anale',
    nl: 'Anale Seks',
    tr: 'Anal',
    ar: 'جنس شرجي'
  },
  oral: {
    en: 'Oral Sex',
    de: 'Oralverkehr',
    fr: 'Sexe Oral',
    es: 'Sexo Oral',
    it: 'Sesso Orale',
    nl: 'Oraal',
    tr: 'Oral',
    ar: 'جنس فموي'
  },
  overnight: {
    en: 'Overnight Stay',
    de: 'Über Nacht',
    fr: 'Nuit Complète',
    es: 'Noche Completa',
    it: 'Tutta la Notte',
    nl: 'Overnachting',
    tr: 'Gece Konaklama',
    ar: 'مبيت ليلي كامل'
  },
  massage: {
    en: 'Sensual & Tantra Massage',
    de: 'Erotik & Tantra Massage',
    fr: 'Massage Sensuel & Tantrique',
    es: 'Masaje Sensual y Tántrico',
    it: 'Massaggio Sensuale e Tantra',
    nl: 'Sensuele Massage',
    tr: 'Erotik Masaj',
    ar: 'تدليك حسي وتانترا'
  },
  mutlu_son: {
    en: 'Happy Ending Massage',
    de: 'Happy End Massage',
    fr: 'Massage Fin Heureuse',
    es: 'Masaje Final Feliz',
    it: 'Massaggio Happy End',
    nl: 'Happy End Massage',
    tr: 'Mutlu Son Masaj',
    ar: 'مساج بنهاية سعيدة'
  },
  gfe: {
    en: 'Girlfriend Experience (GFE)',
    de: 'Girlfriend Experience (GFE)',
    fr: 'Girlfriend Experience (GFE)',
    es: 'Trato de Novia (GFE)',
    it: 'Esperienza da Fidanzata (GFE)',
    nl: 'GFE (Vriendin Ervaring)',
    tr: 'Sevgili Tadında (GFE)',
    ar: 'تجربة الحبيبة (GFE)'
  },
  cim: {
    en: 'Cum in Mouth (CIM)',
    de: 'Besamung im Mund (CIM)',
    fr: 'Éjaculation Buccale (CIM)',
    es: 'Corrida en la Boca (CIM)',
    it: 'Sperma in Bocca (CIM)',
    nl: 'Zaad in Mond (CIM)',
    tr: 'Ağza Boşalma (CIM)',
    ar: 'قذف في الفم (CIM)'
  },
  cif: {
    en: 'Cum on Face (CIF)',
    de: 'Besamung ins Gesicht (CIF)',
    fr: 'Éjaculation Faciale (CIF)',
    es: 'Corrida Facial (CIF)',
    it: 'Sperma sul Viso (CIF)',
    nl: 'Zaad op Gezicht (CIF)',
    tr: 'Yüze Boşalma (CIF)',
    ar: 'قذف على الوجه (CIF)'
  },
  roleplay: {
    en: 'Roleplay & Uniform',
    de: 'Rollenspiele & Kostüme',
    fr: 'Jeux de Rôle & Costumes',
    es: 'Juegos de Rol y Disfraces',
    it: 'Giochi di Ruolo',
    nl: 'Rollenspel',
    tr: 'Rol Yapma & Kostüm',
    ar: 'ألعاب أدوار'
  },
  strapon: {
    en: 'Strapon Service',
    de: 'Strapon Service',
    fr: 'Service Pegging / Strapon',
    es: 'Servicio Strapon',
    it: 'Servizio Strapon',
    nl: 'Strapon Service',
    tr: 'Strapon',
    ar: 'ستراب اون'
  },
  bdsm: {
    en: 'BDSM & Dominatrix',
    de: 'BDSM & Domina',
    fr: 'BDSM & Maîtresse',
    es: 'BDSM y Sumisión',
    it: 'BDSM e Dominazione',
    nl: 'BDSM & Meesteres',
    tr: 'BDSM & Fetiş',
    ar: 'بي دي إس إم'
  },
  threesome: {
    en: 'Threesome & Duo',
    de: 'Dreier & Duo',
    fr: 'Trio & Duo',
    es: 'Trío y Dúo',
    it: 'Trio e Duo',
    nl: 'Trio & Duo',
    tr: 'Grup & Threesome',
    ar: 'جنس ثلاثي'
  },
  lesbian: {
    en: 'Lesbian Show',
    de: 'Lesbische Show',
    fr: 'Spectacle Lesbien',
    es: 'Show Lésbico',
    it: 'Spettacolo Lesbo',
    nl: 'Lesbische Show',
    tr: 'Lezbiyen Şov',
    ar: 'عرض مثلي'
  },
  couples: {
    en: 'For Couples',
    de: 'Für Paare',
    fr: 'Pour Couples',
    es: 'Para Parejas',
    it: 'Per Coppie',
    nl: 'Voor Koppels',
    tr: 'Çiftlere Giden',
    ar: 'للأزواج'
  },
  owo: {
    en: 'Oral Without Condom',
    de: 'Französisch Pur (OWO)',
    fr: 'Sexe Oral sans Préservatif',
    es: 'Oral sin Preservativo',
    it: 'Orale Senza Profilattico',
    nl: 'Oraal Zonder Condoom',
    tr: 'Kondomsuz Oral',
    ar: 'جنس فموي طبيعي'
  },
  deepthroat: {
    en: 'Deepthroat',
    de: 'Deepthroat',
    fr: 'Gorge Profonde',
    es: 'Garganta Profunda',
    it: 'Gola Profonda',
    nl: 'Deepthroat',
    tr: 'Derin Boğaz (Deepthroat)',
    ar: 'حلق عميق'
  }
};

export function getServiceLabel(serviceKey: string, lang: string = 'en'): string {
  const normKey = serviceKey.toLowerCase().trim();
  const entry = SERVICE_TRANSLATIONS[normKey];
  if (entry) {
    return entry[lang] || entry['en'] || entry['tr'] || normKey;
  }
  // Fallback: capitalize words
  return normKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export const SERVICE_TO_FACET_SLUG: Record<string, string> = {
  hotel_outcall: 'outcall',
  incall: 'incall',
  massage: 'masaj',
  anal: 'anal',
  oral: 'oral',
  overnight: 'overnight',
  gfe: 'sevgili-tadinda',
  cim: 'cim',
  cif: 'cif',
  roleplay: 'fantezi-kostum',
  strapon: 'strapon',
  bdsm: 'bdsm',
  threesome: 'grup-fantezi',
  couples: 'ciftlere-ozel',
  lesbian: 'lezbiyen-show',
  owo: 'prezervatifsiz-oral',
  deepthroat: 'derin-bogaz'
};

export function getServiceFacetSlug(serviceKey: string): string | null {
  const norm = serviceKey.toLowerCase().trim();
  return SERVICE_TO_FACET_SLUG[norm] || null;
}

export function getAttributeFacetSlug(type: 'hair' | 'body' | 'age', value: string): string | null {
  const norm = (value || '').toLowerCase().trim();
  if (type === 'hair') {
    if (norm.includes('blond') || norm.includes('sari')) return 'sarisin';
    if (norm.includes('brun') || norm.includes('esmer') || norm.includes('brown')) return 'esmer';
    if (norm.includes('red') || norm.includes('kizil')) return 'kizil';
    if (norm.includes('black') || norm.includes('siyah')) return 'siyah-sacli';
  }
  if (type === 'body') {
    if (norm.includes('slim') || norm.includes('citir') || norm.includes('skinny')) return 'citir';
    if (norm.includes('curv') || norm.includes('balik')) return 'balik-etli';
    if (norm.includes('athletic') || norm.includes('fit')) return 'fit';
    if (norm.includes('bbw') || norm.includes('dolgun')) return 'dolgun';
  }
  if (type === 'age') {
    if (norm.includes('young') || norm.includes('genc')) return 'genc';
    if (norm.includes('mature') || norm.includes('olgun')) return 'olgun';
  }
  return null;
}
