export interface CategoryInfo {
  slug: string;
  icon: string;
  type: 'occasion' | 'persona';
  name: {
    en: string;
    nl: string;
    de: string;
    tr: string;
  };
  badge: {
    en: string;
    nl: string;
    de: string;
    tr: string;
  };
  description: {
    en: string;
    nl: string;
    de: string;
    tr: string;
  };
  etiquette: {
    en: string[];
    nl: string[];
    de: string[];
    tr: string[];
  };
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'dinner-date',
    icon: '🥂',
    type: 'occasion',
    name: {
      en: 'Dinner Date & Gastronomy',
      nl: 'Diner Date & Gastronomie',
      de: 'Dinner Date & Gastronomie',
      tr: 'Akşam Yemeği & Gastronomi'
    },
    badge: {
      en: 'Michelin & Fine Dining Companion',
      nl: 'Michelin & Fine Dining Partner',
      de: 'Gourmet & Haute Cuisine Begleitung',
      tr: 'Seçkin Restoran & Akşam Yemeği Eşliği'
    },
    description: {
      en: 'Sophisticated companions who combine elegance, conversational etiquette, and immaculate style for memorable evenings at top-tier culinary destinations.',
      nl: 'Elegante dames met gevoel voor etiquette, stijl en diepgaande conversaties voor onvergetelijke diners in toprestaurants.',
      de: 'Stilvolle Damen mit erstklassigen Umgangsformen, Eloquenz und weltgewandtem Auftreten für unvergessliche Restaurantabende.',
      tr: 'Seçkin restoranlarda kusursuz sofra adabı, derin sohbet yeteneği ve zarafetiyle size eşlik edecek asil modeller.'
    },
    etiquette: {
      en: [
        'Reserve tables at upscale venues in advance',
        'Dress code is smart casual to formal black tie',
        'Minimum booking duration typically 3 to 4 hours',
        'Respect discrete communication and personal boundaries'
      ],
      nl: [
        'Reserveer tijdig bij gerenommeerde eetgelegenheden',
        'Kledingvoorschrift is stijlvol elegant of cocktail',
        'Minimale afspraakduur is doorgaans 3 tot 4 uur',
        'Discretie en wederzijds respect staan voorop'
      ],
      de: [
        'Tischreservierung in gehobenen Lokalitäten empfohlen',
        'Dresscode: Elegant, smart-casual oder Abendgarderobe',
        'Mindestbuchungsdauer beträgt meist 3 bis 4 Stunden',
        'Höchste Diskretion und gegenseitige Wertschätzung'
      ],
      tr: [
        'Nezih mekanlarda önceden rezervasyon yaptırılması tavsiye edilir',
        'Kıyafet konsepti şık veya resmi akşam giyimidir',
        'Genellikle minimum 3-4 saatlik randevu süresi geçerlidir',
        'Kişisel mahremiyet ve gizlilik kurallarına özen gösterilir'
      ]
    }
  },
  {
    slug: 'girlfriend-experience',
    icon: '💖',
    type: 'occasion',
    name: {
      en: 'Girlfriend Experience (GFE)',
      nl: 'Girlfriend Experience (GFE)',
      de: 'Girlfriend Experience (GFE)',
      tr: 'Sevgili Hissi (GFE)'
    },
    badge: {
      en: 'Intimate, Affectionate & Genuine',
      nl: 'Intiem, Warm & Natuurlijk',
      de: 'Intim, Zärtlich & Natürlich',
      tr: 'Sıcak, Tutkulu & Doğal Yakınlık'
    },
    description: {
      en: 'An immersive, romantic encounter focused on genuine warmth, emotional intimacy, tender caresses, and passionate connection.',
      nl: 'Een intieme en romantische ontmoeting gekenmerkt door oprechte genegenheid, tederheid en ongehaaste passie.',
      de: 'Eine romantische und intime Verabredung mit echter Zärtlichkeit, innigen Momenten und natürlicher Anziehung.',
      tr: 'Yapaylıktan uzak, gerçek bir sevgili şefkati, duygusal samimiyet ve tutkulu dokunuşlarla dolu özel anlar.'
    },
    etiquette: {
      en: [
        'Focus on relaxed, unhurried atmospheres',
        'Mutual chemistry and respect are essential',
        'Hygiene and personal care are paramount',
        'Overnight and weekend bookings provide the deepest experience'
      ],
      nl: [
        'Neem de tijd en ontspan samen zonder tijdsdruk',
        'Persoonlijke klik en respect zijn cruciaal',
        'Persoonlijke verzorging heeft de hoogste prioriteit',
        'Overnight boekingen versterken de intieme beleving'
      ],
      de: [
        'Entspannte Atmosphäre ohne Hektik genießen',
        'Persönliche Chemie und Höflichkeit sind der Schlüssel',
        'Gepflegtes Auftreten und Körperhygiene sind Voraussetzung',
        'Übernachtungs-Buchungen vertiefen das Erlebnis'
      ],
      tr: [
        'Aceleye getirilmemiş, huzurlu bir ortam yaratılmalıdır',
        'Karşılıklı sempati ve saygı vazgeçilmezdir',
        'Kişisel bakım ve hijyen en üst standartta tutulur',
        'Gecelik konaklamalar en derin yakınlığı sunar'
      ]
    }
  },
  {
    slug: 'travel-companion',
    icon: '✈️',
    type: 'occasion',
    name: {
      en: 'Travel Companion & City Trip',
      nl: 'Reispartner & Citytrip',
      de: 'Reisebegleitung & Städtetrip',
      tr: 'Seyahat & Tatil Eşliği'
    },
    badge: {
      en: 'Worldwide VIP Jetset Escort',
      nl: 'Wereldwijde Exclusieve Reizen',
      de: 'Weltweite Jetset Reisebegleitung',
      tr: 'Yurt Dışı & Şehirlerarası Seyahat Eşliği'
    },
    description: {
      en: 'Charming, worldly travel partners ready to join you on luxury weekend getaways, yacht charters, or international resort escapes.',
      nl: 'Kosmopolitische reisgenotes die u vergezellen op luxueuze weekendtrips, jachtvakanties of internationale bestemmingen.',
      de: 'Weltgewandte Begleiterinnen für exklusive Wochenendausflüge, Kreuzfahrten, Yachtreisen und Urlaubsresorts.',
      tr: 'Lüks hafta sonu kaçamaklarında, yat turlarında veya uluslararası tatillerde size eşlik edecek seçkin seyahat partnerleri.'
    },
    etiquette: {
      en: [
        'First class or business travel arrangements expected',
        'Separate bedroom or private suite requested unless mutually agreed',
        'Book at least 1 to 2 weeks in advance',
        'Cover all accommodation and travel expenses'
      ],
      nl: [
        'Comfortabele reisklasse en verzorging voorzien',
        'Eigen kamer of luxe suite gewenst tenzij anders overeengekomen',
        'Boek minimaal 1 tot 2 weken van tevoren',
        'Alle reis- en verblijfskosten zijn voor rekening van de boeker'
      ],
      de: [
        'Reiseorganisation auf gehobenem Niveau erwartet',
        'Eigenes Zimmer oder Suite erwünscht, sofern nicht anders vereinbart',
        'Buchung idealerweise 1 bis 2 Wochen im Voraus',
        'Übernahme aller anfallenden Reise- und Unterbringungskosten'
      ],
      tr: [
        'Ulaşım ve transferlerin konforlu şekilde organize edilmesi beklenir',
        'Aksi kararlaştırılmadıkça ayrı oda veya lüks süit tahsis edilir',
        'Rezervasyonun 1-2 hafta önceden planlanması tavsiye edilir',
        'Tüm seyahat ve konaklama masrafları davet sahibi tarafından karşılanır'
      ]
    }
  },
  {
    slug: 'business-support',
    icon: '💼',
    type: 'occasion',
    name: {
      en: 'Business Support & Trade Fairs',
      nl: 'Zakelijke Begeleiding & Beurs',
      de: 'Messe- & Businessbegleitung',
      tr: 'İş Yemekleri & Fuar Temsili'
    },
    badge: {
      en: 'Corporate Events & VIP Galas',
      nl: 'Zakelijke Evenementen & Galas',
      de: 'Firmen-Events & VIP Kongresse',
      tr: 'Kurumsal Davetler & Fuar Eşliği'
    },
    description: {
      en: 'Intelligent, multilingual hostesses capable of mingling seamlessly at corporate receptions, high-profile galas, and industry expos.',
      nl: 'Meertalige en intelligente dames die zich moeiteloos mengen in zakelijke netwerkevenementen, congressen en galas.',
      de: 'Mehrsprachige, hochgebildete Damen für geschäftliche Empfänge, Messen, Kongresse und Gala-Abende.',
      tr: 'Çok dilli, yüksek eğitimli ve kurumsal kültüre hakim; gala, kokteyl ve kongrelerde prestijinizi artıracak modeller.'
    },
    etiquette: {
      en: [
        'Provide briefing regarding industry and guest profile',
        'Strict discretion regarding all business discussions',
        'Sophisticated business casual or cocktail attire',
        'Inquire about spoken languages before booking'
      ],
      nl: [
        'Korte toelichting over de aard van het evenement gewenst',
        'Absolute geheimhouding betreffende zakelijke onderwerpen',
        'Gepaste zakelijke kleding of cocktailjurk',
        'Controleer vooraf de gewenste talenkennis'
      ],
      de: [
        'Vorab-Briefing über den Anlass und die Gästestruktur',
        'Strikte Verschwiegenheit über alle geschäftlichen Inhalte',
        'Business-Casual oder klassische Abendmode',
        'Sprachkenntnisse passend zum Anlass abstimmen'
      ],
      tr: [
        'Etkinlik ve davetli profili hakkında kısa ön bilgilendirme yapılır',
        'Ticari ve işle ilgili konularda mutlak gizlilik garanti edilir',
        'İş dünyasına uygun resmi veya kokteyl şıklığı esastır',
        'Gereksinim duyulan yabancı diller randevu öncesinde teyit edilir'
      ]
    }
  },
  {
    slug: 'couples-service',
    icon: '👫',
    type: 'occasion',
    name: {
      en: 'Couples Service & Duo Date',
      nl: 'Koppels Service & Duo Date',
      de: 'Pärchen-Service & Duo Date',
      tr: 'Çiftlere Özel & İkili Randevu'
    },
    badge: {
      en: 'Sensual Exploration for Couples',
      nl: 'Sensueel Avontuur voor Stellen',
      de: 'Sinnliches Erlebnis für Paare',
      tr: 'Çiftler İçin Ortak Fantezi & Eşlik'
    },
    description: {
      en: 'Open-minded, understanding companions ready to explore refined fantasies together with sophisticated couples or as a breathtaking two-model duo.',
      nl: 'Ruimdenkende en empathische dames om samen met koppels erotische verlangens te ontdekken of voor een duo-afspraak met twee modellen.',
      de: 'Aufgeschlossene, einfühlsame Begleiterinnen zur gemeinsamen Entfaltung von Fantasien für Paare oder als exklusives Duo.',
      tr: 'Önyargısız, anlayışlı ve çiftlerin sınırlarına saygılı; ortak fantezileri paylaşmak veya iki modelle VIP deneyim yaşamak isteyenler için.'
    },
    etiquette: {
      en: [
        'Clear communication of mutual boundaries beforehand',
        'Patience and relaxed pacing allow comfort for both partners',
        'Warm, welcoming atmosphere in a private setting',
        'Double confirmation of all preferences'
      ],
      nl: [
        'Bespreek elkaars grenzen en verwachtingen vooraf duidelijk',
        'Creëer een ontspannen sfeer waarin iedereen zich op zijn gemak voelt',
        'Privacy en comfort in een vertrouwde omgeving',
        'Wederzijds respect voor alle aanwezigen'
      ],
      de: [
        'Klare Absprache über Wünsche und Grenzen im Vorfeld',
        'Entspannte Atmosphäre, in der sich beide Partner wohlfühlen',
        'Höchste Diskretion in privatem, ruhigem Rahmen',
        'Verständnis und Einfühlungsvermögen stehen im Mittelpunkt'
      ],
      tr: [
        'Randevu öncesinde sınırların ve beklentilerin açıkça konuşulması gerekir',
        'Her iki partnerin de rahat hissedeceği samimi ve huzurlu bir ortam sağlanır',
        'Özel süit veya güvenli ev ortamı tercih edilir',
        'Karşılıklı rıza ve saygı en temel kuraldır'
      ]
    }
  },
  {
    slug: 'hotel-outcall',
    icon: '🏨',
    type: 'occasion',
    name: {
      en: '5-Star Hotel & Outcall',
      nl: '5-Sterren Hotel & Outcall',
      de: 'Hotel- & Hausbesuche (Outcall)',
      tr: '5 Yıldızlı Otel Ziyareti (Outcall)'
    },
    badge: {
      en: 'Discreet In-Room Luxury Service',
      nl: 'Discrete Kamerservice op Niveau',
      de: 'Diskrete Suite- & Hotelbegleitung',
      tr: 'Odaya Özel Prestijli Hizmet'
    },
    description: {
      en: 'Convenient, prompt visits to leading international luxury hotels and upscale private residences with maximum discretion.',
      nl: 'Stijlvolle bezoeken aan tophotels en exclusieve privé-accommodaties met gegarandeerde discretie.',
      de: 'Bequeme und diskrete Besuche in renommierten Luxushotels und noblen Privatunterkünften.',
      tr: 'Lüks 5 yıldızlı oteller ve özel rezidanslar için gizliliği en üst seviyede tutulan oda servisi eşliği.'
    },
    etiquette: {
      en: [
        'Provide hotel name and confirmed room number',
        'Pre-inform hotel reception or greet at lobby if security is tight',
        'Outcall travel fees may apply based on distance',
        'Ensure a clean, private, and secure suite environment'
      ],
      nl: [
        'Geef hotelnaam en geverifieerd kamernummer door',
        'Meld bezoek aan bij de receptie indien vereist door het hotel',
        'Reiskostenvergoeding afhankelijk van de afstand',
        'Zorg voor een rustige en verzorgde suite'
      ],
      de: [
        'Angabe von Hotelname und Zimmernummer erforderlich',
        'Eventuelle Sicherheitsregelungen des Hotels beachten',
        'Fahrtkostenpauschale je nach Anfahrtsweg üblich',
        'Ein gepflegtes und ungestörtes Hotelzimmer bereitstellen'
      ],
      tr: [
        'Otel adı ve doğrulanmış oda numarası paylaşılmalıdır',
        'Güvenlikli otellerde resepsiyona haber verilmesi veya lobide karşılama gerekebilir',
        'Mesafeye göre ulaşım ücreti talep edilebilir',
        'Sessiz, konforlu ve hijyenik bir süit ortamı sağlanır'
      ]
    }
  },
  {
    slug: 'sensual-massage',
    icon: '🌸',
    type: 'occasion',
    name: {
      en: 'Sensual Wellness & Tantra',
      nl: 'Sensuele Wellness & Massage',
      de: 'Sinnliche Massage & Tantra',
      tr: 'Duyusal Masaj & Tantra'
    },
    badge: {
      en: 'Full Body Relaxation & Erotic Touch',
      nl: 'Volledige Lichaamsontspanning',
      de: 'Körperharmonie & Erotische Berührung',
      tr: 'Tüm Vücut Rahatlama & Duyusal Dokunuş'
    },
    description: {
      en: 'Holistic sensual therapy blending warming oils, body-to-body sliding techniques, and gentle erotic awareness to dissolve all stress.',
      nl: 'Heerlijke ontspanningsmassages met warme oliën en zachte aanrakingen om alle dagelijkse spanning los te laten.',
      de: 'Wohltuende sinnliche Massagen mit warmen Aromaölen und sanften Berührungen für tiefe körperliche Entspannung.',
      tr: 'Sıcak aromatik yağlar, vücut teması ve yumuşak dokunuşlarla günün tüm yorgunluğunu unutturan duyusal rahatlama seansı.'
    },
    etiquette: {
      en: [
        'Warm shower prior to session is required',
        'Relax and communicate preferred pressure and sensitivity',
        'Soft background music and dimmed lighting enhance the mood',
        'Strictly respectful, non-aggressive attitude'
      ],
      nl: [
        'Een warme douche vooraf is gewenst',
        'Communiceer eventuele gevoeligheden of voorkeuren',
        'Zachte sfeerverlichting en rustgevende muziek aanbevolen',
        'Respectvol en ontspannen gedrag'
      ],
      de: [
        'Eine warme Dusche vor Beginn der Massage ist selbstverständlich',
        'Gewünschte Intensität und Schwerpunkte gerne mitteilen',
        'Sanftes Licht und ruhige Musik schaffen die ideale Stimmung',
        'Stets respektvolles und achtsames Miteinander'
      ],
      tr: [
        'Seans öncesinde sıcak bir duş alınması zorunludur',
        'Masaj baskısı ve hassas bölgeler baştan belirtilebilir',
        'Loş ışık ve dinlendirici müzik atmosferi tamamlar',
        'Nezaketli ve sakin bir yaklaşım şarttır'
      ]
    }
  },
  {
    slug: 'student-models',
    icon: '🎓',
    type: 'persona',
    name: {
      en: 'Student Escorts & Young Ladies',
      nl: 'Studenten Escort & Jonge Dames',
      de: 'Studentinnen & Junge Begleiterinnen',
      tr: 'Öğrenci & Genç Modeller'
    },
    badge: {
      en: 'Fresh, Intelligent & Naturally Beautiful',
      nl: 'Fris, Intelligent & Natuurlijk',
      de: 'Jung, Intelligent & Unvoreingenommen',
      tr: 'Genç, Doğal ve Canlı Enerji'
    },
    description: {
      en: 'University students and young ambitious women with radiant smiles, modern mindsets, and a refreshing spontaneity.',
      nl: 'Universiteitsstudentes en jonge dames met een open blik, spontane glimlach en natuurlijke charme.',
      de: 'Akademisch geprägte junge Frauen mit erfrischender Natürlichkeit, Neugier und charmantem Lächeln.',
      tr: 'Üniversite öğrencisi, entelektüel merakı yüksek, samimi tebessümü ve taze enerjisiyle büyüleyen genç modeller.'
    },
    etiquette: {
      en: [
        'Flexible scheduling around university exam periods',
        'Polite, encouraging, and gentlemanly approach',
        'Casual dining, cinema, or trendy lounge dates are ideal',
        'Discretion regarding educational background'
      ],
      nl: [
        'Houd rekening met collegeroosters en tentamenweken',
        'Gentleman-achtige en respectvolle houding',
        'Gezellige restaurants, terrasjes of lounges zijn populair',
        'Volledige privacy rondom studie en privéleven'
      ],
      de: [
        'Rücksichtnahme auf Studienzeiten und Prüfungsphasen',
        'Ein charmanter und rücksichtsvoller Umgangston',
        'Trendige Cafés, Bars oder zwanglose Abende passen ideal',
        'Diskreter Schutz der studentischen Identität'
      ],
      tr: [
        'Sınav ve ders programlarına saygı duyulmalıdır',
        'Kibar, koruyucu ve beyefendi bir tutum sergilenir',
        'Popüler kafeler, sinema veya şık kokteyl mekanları için uygundur',
        'Eğitim ve özel hayatına dair gizlilik korunur'
      ]
    }
  },
  {
    slug: 'vip-lifestyle',
    icon: '💎',
    type: 'persona',
    name: {
      en: 'VIP High-Class Lifestyle',
      nl: 'VIP High-Class Lifestyle',
      de: 'High-Class VIP Lifestyle',
      tr: 'VIP & Lüks Yaşam Tarzı'
    },
    badge: {
      en: 'Top-Tier Elite Models & Supermodels',
      nl: 'Topklasse Elite Modellen',
      de: 'Elite Models & Premium Klasse',
      tr: 'En Üst Segment Elit Modeller'
    },
    description: {
      en: 'International fashion models, fitness influencers, and high-society companions catering exclusively to discerning gentlemen.',
      nl: 'Internationale fotomodellen en stijliconen voor veeleisende heren die alleen genoegen nemen met de allerhoogste standaard.',
      de: 'Internationale Fotomodelle und exklusive Damen für anspruchsvolle Herren, die das Außergewöhnliche suchen.',
      tr: 'Podyum ve moda dünyasından, yüksek zevklere hitap eden, kusursuz fiziğe ve zarafete sahip elit modeller.'
    },
    etiquette: {
      en: [
        'Strict VIP verification and deposit required',
        '5-star accommodations and limousine transfers expected',
        'Strict non-disclosure agreements honored',
        'Luxury gifts and gestures warmly received'
      ],
      nl: [
        'Verificatieprocedure en aanbetaling gebruikelijk',
        'Luxe hotels en representatief vervoer verwacht',
        'Geheimhouding en discretie gegarandeerd',
        'Waardering en galante manieren staan centraal'
      ],
      de: [
        'Verifizierung und Anzahlung bei Erstbuchung Standard',
        'Unterbringung in 5-Sterne-Hotels und Limousinenservice passend',
        'Höchste Vertraulichkeit ist beidseitig selbstverständlich',
        'Exklusives Ambiente und stilvolles Auftreten'
      ],
      tr: [
        'İlk randevularda ön doğrulama ve depozito prosedürü uygulanabilir',
        '5 yıldızlı oteller ve VIP transfer organizasyonları tercih edilir',
        'Karşılıklı mutlak gizlilik sözleşmesi esastır',
        'Lüks hediyeler ve centilmenlik takdirle karşılanır'
      ]
    }
  }
];

export const getAllCategories = (): CategoryInfo[] => CATEGORIES;

export const getCategoryBySlug = (slug: string): CategoryInfo | undefined => {
  return CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
};
