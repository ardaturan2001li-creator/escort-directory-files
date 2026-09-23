import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getModelBySlug, getRelatedModels, slugifyModelName } from '@/lib/db';
import { getServiceLabel, getServiceFacetSlug, getAttributeFacetSlug } from '@/lib/seoGenerator';
import i18nData from '@/data/i18n.json';
import ModelPhotoGallery from '@/components/ModelPhotoGallery';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    modelSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, modelSlug } = await params;
  const result = getModelBySlug(citySlug, modelSlug);
  if (!result) return { title: 'Model Not Found' };
  const { profile, city } = result;

  const rate = profile.rate_hourly ? `€${profile.rate_hourly}/h` : 'EUR';
  const title = `${profile.name} (${profile.age}) - ${city.name} VIP Escort & Companion`;
  const desc = `Book ${profile.name} in ${city.name}. ${rate}. Verified independent companion with ${profile.hair} hair, ${profile.bust || '75C'} bust. Available for hotel outcall & incall.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/${lang}/${city.slug}/model/${modelSlug}`,
    },
    openGraph: {
      title,
      description: desc,
      type: 'profile',
    },
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { lang, city: citySlug, modelSlug } = await params;
  const activeLang = ['tr', 'nl', 'de', 'en', 'fr', 'es', 'it', 'ar'].includes(lang) ? lang : 'en';
  const dict = (i18nData as any)[activeLang] || i18nData.en;

  const result = getModelBySlug(citySlug, modelSlug);
  if (!result) {
    notFound();
  }

  const { profile, city } = result;
  const relatedModels = getRelatedModels(citySlug, profile.name, 4);

  const rate1h = profile.rate_hourly || 250;
  const rate2h = Math.round(rate1h * 1.8);
  const rateOvernight = Math.round(rate1h * 4.5);

  const heightVal = profile.height || (profile.body === 'curvy' ? '167 cm' : profile.body === 'petite' ? '160 cm' : '170 cm');
  const bustVal = profile.bust || (profile.body === 'busty' ? '80D' : profile.body === 'curvy' ? '85C' : '75C');

  // Dynamic VIP Concierge Bio in 4 languages
  const bio = {
    tr: `${profile.name}, ${city.name} bölgesinde seçkin beylere birinci sınıf arkadaşlık ve unutulmaz anlar sunan bağımsız bir elit modeldir. ${profile.age} yaşında, ${profile.hair.toUpperCase()} saçlı ve kusursuz ${profile.body.toUpperCase()} vücut hatlarına sahip olan ${profile.name}, zarafeti ve doğal cazibesiyle tanınır. 5 yıldızlı otellere outcall ziyaretleri ve lüks özel incall randevuları kabul etmekte olup, mutlak gizlilik ve üst düzey hijyen kurallarına sadıktır.`,
    nl: `${profile.name} is een stijlvolle en onafhankelijke VIP escort gevestigd in ${city.name}. Met haar ${profile.age} jaar, prachtige ${profile.hair} haren en een verleidelijk ${profile.body} figuur biedt zij een ongeëvenaarde ervaring voor heren die op zoek zijn naar klasse en discrete passie. Beschikbaar voor hotel outcall en discrete ontvangst met de hoogste normen voor privacy en wederzijds respect.`,
    de: `${profile.name} ist eine exklusive und unabhängige High-Class Begleitdame in ${city.name}. Mit ${profile.age} Jahren, ${profile.hair}em Haar und einer bezaubernden ${profile.body}-Silhouette erfüllt sie höchste Ansprüche an Diskretion, Charme und Niveau. Buchbar für Hotelbesuche in 5-Sterne-Hotels sowie private Termine unter Einhaltung strengster Vertraulichkeit.`,
    en: `${profile.name} is a premier independent companion and elite escort based in ${city.name}. At ${profile.age} years old with stunning ${profile.hair} hair and an alluring ${profile.body} physique, she offers an intimate, unforgettable experience for discerning gentlemen. Available for luxury 5-star hotel outcalls and discreet private incall appointments with uncompromising privacy.`
  }[activeLang as 'tr' | 'nl' | 'de' | 'en'] || '';

  // Localized UI Labels
  const labels = {
    tr: {
      back: `${city.name} Modellerine Dön`,
      verifiedBadge: 'Doğrulanmış Bağımsız Model',
      directContact: 'Doğrudan İletişim & Rezervasyon',
      whatsappBtn: 'WhatsApp ile Mesaj Gönder',
      callBtn: 'Doğrudan Ara / SMS',
      ratesTitle: 'Fiyat Tarifeleri (EUR)',
      oneHour: '1 Saat Randevu',
      twoHours: '2 Saat Randevu',
      overnight: 'Gece Boyu (Overnight)',
      servicesTitle: 'Sunulan Hizmetler & Özel Servisler',
      bioTitle: `${profile.name} Hakkında Özel Biyografi`,
      attributesTitle: 'Fiziksel Özellikler & Detaylar',
      height: 'Boy',
      bust: 'Göğüs',
      hair: 'Saç Rengi',
      body: 'Vücut Tipi',
      age: 'Yaş',
      travel: 'Seyahat Edebilirlik',
      travelYes: 'Evet, Şehir Dışı / Yurt Dışı Seyahat Eder',
      travelNo: 'Yalnızca Şehir İçi',
      safeHarborTitle: 'Model Güvenli Liman (Safe Harbor)',
      safeHarborDesc: 'Bu profil size mi ait? Bilgilerinizi güncellemek, fotoğraf eklemek veya profilinizi kaldırmak için destek ekibimizle iletişime geçebilirsiniz.',
      claimBtn: 'Profili Sahiplen / Güncelle',
      relatedTitle: `${city.name} Bölgesindeki Diğer Popüler Modeller`,
      viewProfile: 'Profili İncele'
    },
    nl: {
      back: `Terug naar ${city.name} Escorts`,
      verifiedBadge: 'Geverifieerd Onafhankelijk Model',
      directContact: 'Direct Contact & Reservering',
      whatsappBtn: 'Stuur WhatsApp Bericht',
      callBtn: 'Bellen / SMS Sturen',
      ratesTitle: 'Tarieven (EUR)',
      oneHour: '1 Uur Afspraak',
      twoHours: '2 Uur Afspraak',
      overnight: 'Hele Nacht (Overnachting)',
      servicesTitle: 'Aangeboden Services & Wensen',
      bioTitle: `Over ${profile.name} - Exclusieve Biografie`,
      attributesTitle: 'Fysieke Kenmerken & Gegevens',
      height: 'Lengte',
      bust: 'Cupmaat',
      hair: 'Haarkleur',
      body: 'Lichaamstype',
      age: 'Leeftijd',
      travel: 'Kan Reizen',
      travelYes: 'Ja, Reizen Mogelijk',
      travelNo: 'Alleen Lokaal',
      safeHarborTitle: 'Model Safe Harbor Kennisgeving',
      safeHarborDesc: 'Is dit uw profiel? Wilt u uw gegevens bijwerken of dit profiel laten verwijderen? Neem contact met ons op.',
      claimBtn: 'Profiel Beheren / Claimen',
      relatedTitle: `Andere Populaire Modellen in ${city.name}`,
      viewProfile: 'Bekijk Profiel'
    },
    de: {
      back: `Zurück zu ${city.name} Escorts`,
      verifiedBadge: 'Verifiziertes Unabhängiges Model',
      directContact: 'Direktkontakt & Buchungsanfrage',
      whatsappBtn: 'WhatsApp Nachricht Senden',
      callBtn: 'Direkt Anrufen / SMS',
      ratesTitle: 'Honorare & Preise (EUR)',
      oneHour: '1 Stunde Treffen',
      twoHours: '2 Stunden Treffen',
      overnight: 'Über Nacht (Overnight)',
      servicesTitle: 'Angebotene Services & Fantasien',
      bioTitle: `Über ${profile.name} - Exklusive Biografie`,
      attributesTitle: 'Körpermaße & Details',
      height: 'Größe',
      bust: 'Oberweite',
      hair: 'Haarfarbe',
      body: 'Körpertyp',
      age: 'Alter',
      travel: 'Reisebereitschaft',
      travelYes: 'Ja, Reisen Möglich',
      travelNo: 'Nur Lokal',
      safeHarborTitle: 'Model Safe-Harbor Hinweis',
      safeHarborDesc: 'Gehört dieses Profil Ihnen? Möchten Sie Angaben aktualisieren oder das Profil löschen lassen? Kontaktieren Sie uns.',
      claimBtn: 'Profil Beanspruchen / Ändern',
      relatedTitle: `Weitere Beliebte Models in ${city.name}`,
      viewProfile: 'Profil Ansehen'
    },
    en: {
      back: `Back to ${city.name} Escorts`,
      verifiedBadge: 'Verified Independent Companion',
      directContact: 'Direct Contact & Booking Request',
      whatsappBtn: 'Send WhatsApp Message',
      callBtn: 'Direct Call / SMS',
      ratesTitle: 'Rates & Pricing (EUR)',
      oneHour: '1 Hour Appointment',
      twoHours: '2 Hours Appointment',
      overnight: 'Overnight Stay',
      servicesTitle: 'Included Services & Preferences',
      bioTitle: `About ${profile.name} - Verified Bio`,
      attributesTitle: 'Physical Attributes & Details',
      height: 'Height',
      bust: 'Bust',
      hair: 'Hair Color',
      body: 'Body Type',
      age: 'Age',
      travel: 'Travel Availability',
      travelYes: 'Yes, Available for Travel',
      travelNo: 'Local Appointments Only',
      safeHarborTitle: 'Model Safe Harbor & Verification',
      safeHarborDesc: 'Are you this companion? Would you like to update your details, photos, or request profile removal? Contact our concierge.',
      claimBtn: 'Claim / Update Profile',
      relatedTitle: `Other Popular Companions in ${city.name}`,
      viewProfile: 'View Profile'
    }
  }[activeLang as 'tr' | 'nl' | 'de' | 'en'];

  const whatsappText = encodeURIComponent(`Hello ${profile.name}, I found your verified profile on the ${city.name} European Companion Directory. Are you available?`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Breadcrumb Navigation with Primary Niche Hub */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 overflow-hidden truncate">
        <Link href={`/${lang}`} className="hover:text-white transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href={`/${lang}/${city.slug}`} className="hover:text-white transition-colors">
          {city.name}
        </Link>
        <span>&rsaquo;</span>
        <Link
          href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`}
          className="hover:text-white transition-colors capitalize text-neutral-300"
        >
          {profile.hair} Escorts
        </Link>
        <span>&rsaquo;</span>
        <span className="text-red-500 font-bold truncate">{profile.name}</span>
      </nav>

      {/* Back Button */}
      <div>
        <Link
          href={`/${lang}/${city.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
        >
          <span>&larr;</span> {labels.back}
        </Link>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Media & Badges (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ModelPhotoGallery
            name={profile.name}
            cityName={city.name}
            countryName={city.country}
            age={profile.age}
            hair={profile.hair}
            bust={profile.bust}
            photos={(profile as any).photos || []}
            realPics={profile.real_pics}
            hasVideo={profile.has_video}
            isPornstar={profile.is_pornstar}
          />

          {/* Quick Direct Contact Box */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider">
              {labels.directContact}
            </h3>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <span>💬</span> {labels.whatsappBtn}
            </a>

            <a
              href={`tel:+447000000000`}
              className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all"
            >
              <span>📞</span> {labels.callBtn}
            </a>

            <div className="text-[11px] text-center text-neutral-500 pt-1">
              Zero Agency Fees &middot; 100% Direct Model Arrangement
            </div>
          </div>
        </div>

        {/* Right Column: Rates, Specs, Bio & Services (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Title & Pricing Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Online & Available Now</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {profile.name} &mdash; {city.name}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Hourly Starting Rate</span>
              <span className="text-3xl font-black text-amber-400">
                €{rate1h}
              </span>
              <span className="text-xs text-neutral-400 font-semibold"> / hour</span>
            </div>
          </div>

          {/* Rates Table */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">💶</span> {labels.ratesTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 text-center">
                <div className="text-xs text-neutral-400 mb-1">{labels.oneHour}</div>
                <div className="text-xl font-black text-amber-400">€{rate1h}</div>
                <div className="text-[10px] text-neutral-500 mt-1">Incall / Outcall</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 text-center">
                <div className="text-xs text-neutral-400 mb-1">{labels.twoHours}</div>
                <div className="text-xl font-black text-amber-400">€{rate2h}</div>
                <div className="text-[10px] text-neutral-500 mt-1">Dinner Date & More</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 text-center">
                <div className="text-xs text-neutral-400 mb-1">{labels.overnight}</div>
                <div className="text-xl font-black text-amber-400">€{rateOvernight}</div>
                <div className="text-[10px] text-neutral-500 mt-1">Full Night VIP</div>
              </div>
            </div>
          </div>

          {/* Physical Attributes Grid */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-red-500">💎</span> {labels.attributesTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.age}</span>
                <span className="font-bold text-white">{profile.age} years old</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.height}</span>
                <span className="font-bold text-white">{heightVal}</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.bust}</span>
                <span className="font-bold text-white">{bustVal}</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.hair}</span>
                {getAttributeFacetSlug('hair', profile.hair) ? (
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair)}`} className="font-bold text-white hover:text-red-400 transition-colors capitalize underline decoration-neutral-700 underline-offset-2">
                    {profile.hair}
                  </Link>
                ) : (
                  <span className="font-bold text-white capitalize">{profile.hair}</span>
                )}
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.body}</span>
                {getAttributeFacetSlug('body', profile.body) ? (
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body)}`} className="font-bold text-white hover:text-red-400 transition-colors capitalize underline decoration-neutral-700 underline-offset-2">
                    {profile.body}
                  </Link>
                ) : (
                  <span className="font-bold text-white capitalize">{profile.body}</span>
                )}
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-400 block text-[11px]">{labels.travel}</span>
                <span className="font-bold text-emerald-400">{profile.can_travel ? labels.travelYes : labels.travelNo}</span>
              </div>
            </div>
          </div>

          {/* Services & Boundaries */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-red-500">✨</span> {labels.servicesTitle}
            </h3>

            <div className="flex flex-wrap gap-2">
              {profile.services.map((s) => {
                const facetSlug = getServiceFacetSlug(s);
                return facetSlug ? (
                  <Link
                    key={s}
                    href={`/${lang}/${city.slug}/${facetSlug}`}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 hover:border-red-500/80 hover:text-white hover:bg-neutral-800/90 transition-all shadow-sm"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    {getServiceLabel(s, lang)}
                  </Link>
                ) : (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    {getServiceLabel(s, lang)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Bespoke VIP Concierge Biography with Contextual Internal Linking */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">📝</span> {labels.bioTitle}
            </h3>
            <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
              {activeLang === 'tr' ? (
                <p>
                  <strong className="text-white">{profile.name}</strong>,{' '}
                  <Link href={`/${lang}/${city.slug}`} className="text-red-400 hover:underline font-semibold">{city.name} Escort</Link> rehberimizde yer alan doğrulanmış bağımsız bir VIP modeldir.{' '}
                  <span className="font-semibold text-white">{profile.age} yaşında</span> olup, doğal{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.hair === 'blonde' ? 'sarışın' : profile.hair === 'brunette' ? 'esmer' : profile.hair === 'redhead' ? 'kızıl' : 'siyah saçlı'}
                  </Link>{' '}
                  tonları, <strong className="text-white">{heightVal}</strong> boyu ve çekici{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body) || 'buyuk-gogus'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.body === 'busty' ? 'büyük göğüslü' : profile.body === 'slim' ? 'ince ve fit' : profile.body === 'curvy' ? 'balık etli' : 'minyon'}
                  </Link>{' '}
                  vücut yapısıyla dikkat çeker. {city.name} genelinde özellikle{' '}
                  <Link href={`/${lang}/${city.slug}/otele-gelen`} className="text-red-400 hover:underline font-semibold">5 yıldızlı otellere outcall ziyaretleri</Link>{' '}
                  ve lüks özel randevularda kusursuz bir arkadaşlık ve gizlilik sağlar.
                </p>
              ) : activeLang === 'de' ? (
                <p>
                  <strong className="text-white">{profile.name}</strong> ist ein exklusives und verifiziertes High-Class Model im{' '}
                  <Link href={`/${lang}/${city.slug}`} className="text-red-400 hover:underline font-semibold">{city.name} Escort Portal</Link>. Mit{' '}
                  <span className="font-semibold text-white">{profile.age} Jahren</span>, verführerischem{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.hair === 'blonde' ? 'blondem' : profile.hair === 'brunette' ? 'brünettem' : profile.hair === 'redhead' ? 'rotem' : 'schwarzem'} Haar
                  </Link>,{' '}
                  einer Körpergröße von <strong className="text-white">{heightVal}</strong> und einer harmonischen{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body) || 'buyuk-gogus'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.body === 'busty' ? 'großen Oberweite' : profile.body === 'slim' ? 'schlanken Figur' : profile.body === 'curvy' ? 'kurvigen Silhouette' : 'zierlichen Statur'}
                  </Link>{' '}
                  bietet sie unvergessliche Momente. Spezialisiert auf diskrete{' '}
                  <Link href={`/${lang}/${city.slug}/otele-gelen`} className="text-red-400 hover:underline font-semibold">Hotelbesuche (Outcall)</Link>{' '}
                  in renommierten Luxushotels in {city.name}.
                </p>
              ) : activeLang === 'nl' ? (
                <p>
                  <strong className="text-white">{profile.name}</strong> is een exclusief en geverifieerd VIP model in de{' '}
                  <Link href={`/${lang}/${city.slug}`} className="text-red-400 hover:underline font-semibold">{city.name} Escort Gids</Link>. Met haar{' '}
                  <span className="font-semibold text-white">{profile.age} jaar</span>, prachtige{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.hair === 'blonde' ? 'blonde' : profile.hair === 'brunette' ? 'donkere' : profile.hair === 'redhead' ? 'rode' : 'zwarte'} lokken
                  </Link>,{' '}
                  lengte van <strong className="text-white">{heightVal}</strong> en verleidelijke{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body) || 'buyuk-gogus'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.body === 'busty' ? 'volle boezem' : profile.body === 'slim' ? 'slanke' : profile.body === 'curvy' ? 'vrouwelijke vormen' : 'petite'} bouw
                  </Link>, staat zij garant voor klasse en discretie. Beschikbaar voor{' '}
                  <Link href={`/${lang}/${city.slug}/otele-gelen`} className="text-red-400 hover:underline font-semibold">hotel outcall bezoeken</Link>{' '}
                  en discrete ontmoetingen in {city.name}.
                </p>
              ) : (
                <p>
                  <strong className="text-white">{profile.name}</strong> is a verified, premier companion featured in the{' '}
                  <Link href={`/${lang}/${city.slug}`} className="text-red-400 hover:underline font-semibold">{city.name} Escort Directory</Link>. At{' '}
                  <span className="font-semibold text-white">{profile.age} years old</span> with gorgeous{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.hair} hair
                  </Link>,{' '}
                  a height of <strong className="text-white">{heightVal}</strong>, and an alluring{' '}
                  <Link href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body) || 'buyuk-gogus'}`} className="text-red-400 hover:underline font-semibold">
                    {profile.body} physique
                  </Link>, she brings charm and elegance to every encounter. Available for luxury{' '}
                  <Link href={`/${lang}/${city.slug}/otele-gelen`} className="text-red-400 hover:underline font-semibold">5-star hotel outcall visits</Link>{' '}
                  and bespoke private incall arrangements across {city.name}.
                </p>
              )}
            </div>
          </div>

          {/* Niche Hub Spiderweb (İç Linkleme Ağı) */}
          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-red-500">📍</span>
                {activeLang === 'tr' ? `${city.name} İlgili Popüler Niş Hub'lar` : activeLang === 'de' ? `Relevante Nischen-Hubs in ${city.name}` : activeLang === 'nl' ? `Relevante Niche Hubs in ${city.name}` : `Popular Niche Hubs in ${city.name}`}
              </h3>
              <span className="text-[11px] text-neutral-400 font-semibold">Programmatic SEO Network</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              <Link
                href={`/${lang}/${city.slug}/${getAttributeFacetSlug('hair', profile.hair) || 'sarisin'}`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>👱‍♀️</span>
                <span className="truncate">{city.name} {profile.hair.toUpperCase()} Escortlar</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/otele-gelen`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>🏨</span>
                <span className="truncate">{city.name} Otele Gelenler (Outcall)</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/${(getAttributeFacetSlug('hair', profile.hair) || 'sarisin')}-otele-gelen`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>🔥</span>
                <span className="truncate">{city.name} {profile.hair.toUpperCase()} & Otele Gelen</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/${getAttributeFacetSlug('body', profile.body) || 'buyuk-gogus'}`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>🍒</span>
                <span className="truncate">{city.name} {profile.body.toUpperCase()} Modeller</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/masaj`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>💆‍♀️</span>
                <span className="truncate">{city.name} Erotik Masaj</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/sevgili-tadinda`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>💖</span>
                <span className="truncate">{city.name} GFE Sevgili Tadında</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/${profile.age < 30 ? 'genc' : 'olgun'}`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>{profile.age < 30 ? '🔥' : '👑'}</span>
                <span className="truncate">{city.name} {profile.age < 30 ? 'Genç Modeller' : 'Olgun & MILF'}</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/anal`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>🍑</span>
                <span className="truncate">{city.name} Anal Hizmeti</span>
              </Link>

              <Link
                href={`/${lang}/${city.slug}/gece-kalan`}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/70 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>🌙</span>
                <span className="truncate">{city.name} Gece Kalan (Overnight)</span>
              </Link>
            </div>
          </div>

          {/* Safe Harbor Notice */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-2">
            <div className="font-bold text-neutral-400 flex items-center gap-1.5">
              <span>🛡️</span> {labels.safeHarborTitle}
            </div>
            <p className="text-neutral-500 leading-relaxed">
              {labels.safeHarborDesc}
            </p>
            <button className="text-red-400 hover:text-red-300 font-bold text-xs underline cursor-pointer">
              {labels.claimBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Related Models in City */}
      {relatedModels.length > 0 && (
        <section className="border-t border-neutral-800/80 pt-10 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-red-600"></span>
            {labels.relatedTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedModels.map((m) => (
              <div
                key={m.name}
                className="bg-[#0f0f14] border border-neutral-800 rounded-2xl p-4 hover:border-red-500/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-black text-red-500 text-lg">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base truncate">{m.name}</h4>
                    <p className="text-xs text-neutral-400">{m.age} yrs &middot; {m.hair} &middot; {m.bust}</p>
                  </div>
                </div>

                <Link
                  href={`/${lang}/${city.slug}/model/${slugifyModelName(m.name)}`}
                  className="mt-4 block w-full py-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-center text-xs font-bold text-white transition-colors"
                >
                  {labels.viewProfile}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
