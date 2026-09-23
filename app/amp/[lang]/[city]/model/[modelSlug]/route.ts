import { NextRequest, NextResponse } from 'next/server';
import { getModelBySlug, slugifyModelName } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    lang: string;
    city: string;
    modelSlug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { lang, city: citySlug, modelSlug } = await params;
  const activeLang = ['tr', 'nl', 'de', 'en'].includes(lang) ? lang : 'en';

  const result = getModelBySlug(citySlug, modelSlug);
  if (!result) {
    return new NextResponse('Model Not Found', { status: 404 });
  }

  const { profile, city } = result;
  const rate1h = profile.rate_hourly || 250;
  const rate2h = Math.round(rate1h * 1.8);
  const rateOvernight = Math.round(rate1h * 4.5);

  const whatsappMsg = encodeURIComponent(`Hello ${profile.name}, I saw your profile on Google AMP in ${city.name}. Are you available?`);
  const whatsappUrl = `https://wa.me/?text=${whatsappMsg}`;

  const canonicalUrl = `/${lang}/${city.slug}/model/${modelSlug}`;

  const t = {
    tr: {
      badge: '18+ VIP DOĞRULANMIŞ MODEL',
      contactTitle: 'Doğrudan Gizli İletişim',
      whatsappBtn: 'WhatsApp ile Gizlice Yaz',
      callBtn: 'Doğrudan Ara / SMS',
      ratesTitle: 'Fiyat Tarifeleri (EUR)',
      oneHour: '1 Saat',
      twoHours: '2 Saat',
      overnight: 'Gece Boyu',
      servicesTitle: 'Sunulan Hizmetler',
      galleryTitle: 'Fotoğraf Galerisi',
      specsTitle: 'Model Detayları',
      bio: `${profile.name}, ${city.name} genelinde lüks otellere ve özel adreslere hizmet veren seçkin bir bağımsız eskorttur. ${profile.age} yaşında, ${profile.hair} saçlı ve kusursuz ${profile.body} hatlara sahiptir. Üst düzey gizlilik, temizlik ve samimi refakat sunar.`,
      safeHarbor: 'Bu profil size mi ait? Güncelleme veya kaldırma talebi için bize yazın.'
    },
    nl: {
      badge: '18+ VIP GEVERIFIEERD MODEL',
      contactTitle: 'Direct & Discreet Contact',
      whatsappBtn: 'Stuur WhatsApp Bericht',
      callBtn: 'Bellen / SMS Sturen',
      ratesTitle: 'Tarieven (EUR)',
      oneHour: '1 Uur',
      twoHours: '2 Uur',
      overnight: 'Hele Nacht',
      servicesTitle: 'Aangeboden Services',
      galleryTitle: 'Fotogalerij',
      specsTitle: 'Model Specificaties',
      bio: `${profile.name} is een stijlvolle en onafhankelijke VIP escort in ${city.name}. ${profile.age} jaar, ${profile.hair} haar en een aantrekkelijk ${profile.body} figuur. Beschikbaar voor hotel outcall en privé-ontvangst met maximale discretie.`,
      safeHarbor: 'Is dit uw profiel? Neem contact op voor updates of verwijdering.'
    },
    de: {
      badge: '18+ VIP VERIFIZIERTES MODEL',
      contactTitle: 'Direktkontakt & Vertraulichkeit',
      whatsappBtn: 'WhatsApp Nachricht Senden',
      callBtn: 'Direkt Anrufen / SMS',
      ratesTitle: 'Honorare (EUR)',
      oneHour: '1 Stunde',
      twoHours: '2 Stunden',
      overnight: 'Über Nacht',
      servicesTitle: 'Services & Vorlieben',
      galleryTitle: 'Fotogalerie',
      specsTitle: 'Körpermaße & Details',
      bio: `${profile.name} ist eine diskrete und exklusive Begleitdame in ${city.name}. ${profile.age} Jahre alt, ${profile.hair}es Haar und eleganter ${profile.body} Körperbau. Für Hotelbesuche und private Termine buchbar.`,
      safeHarbor: 'Gehört dieses Profil Ihnen? Kontaktieren Sie uns für Änderungen oder Löschung.'
    },
    en: {
      badge: '18+ VIP VERIFIED COMPANION',
      contactTitle: 'Direct & Discreet Contact',
      whatsappBtn: 'Secret Message via WhatsApp',
      callBtn: 'Direct Call / SMS',
      ratesTitle: 'Rates & Pricing (EUR)',
      oneHour: '1 Hour',
      twoHours: '2 Hours',
      overnight: 'Overnight VIP',
      servicesTitle: 'Services & Preferences',
      galleryTitle: 'Full Photo Gallery',
      specsTitle: 'Physical Attributes',
      bio: `${profile.name} is a premier independent companion in ${city.name}. ${profile.age} years old with ${profile.hair} hair and an alluring ${profile.body} build. Catering to gentlemen seeking utmost elegance and discretion.`,
      safeHarbor: 'Are you this model? Contact us to update or claim this profile.'
    }
  }[activeLang as 'tr' | 'nl' | 'de' | 'en'];

  const servicesHtml = profile.services.map(s => `<span class="tag">✓ ${s.replace(/_/g, ' ').toUpperCase()}</span>`).join('');

  const ampHtml = `<!doctype html>
<html ⚡ lang="${activeLang}">
<head>
  <meta charset="utf-8">
  <title>${profile.name} (${profile.age}) - ${city.name} Escort | ⚡ Google AMP</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <meta name="rating" content="RTA-5042-1996-1400-1574-JUR">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <style amp-custom>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #09090d; color: #e2e8f0; margin: 0; padding: 0; line-height: 1.5; }
    .header { background: #000; border-bottom: 1px solid #1f242d; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 16px; font-weight: 900; color: #fff; text-decoration: none; }
    .logo span { color: #ef4444; }
    .amp-badge { background: #ef4444; color: #fff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px; }
    .container { max-width: 540px; margin: 0 auto; padding: 16px; }
    .hero { background: linear-gradient(180deg, #181822 0%, #0d0d12 100%); border: 1px solid #232733; border-radius: 20px; padding: 24px 16px; text-align: center; margin-bottom: 16px; }
    .avatar { width: 90px; height: 90px; border-radius: 20px; background: linear-gradient(135deg, #ef4444, #b91c1c); display: flex; align-items: center; justify-content: center; font-size: 38px; font-weight: 900; color: #fff; margin: 0 auto 12px auto; box-shadow: 0 10px 25px rgba(239,68,68,0.3); }
    .hero-photo-wrap { width: 100%; max-width: 320px; border-radius: 18px; overflow: hidden; margin: 0 auto 16px auto; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
    .amp-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
    .gallery-item { border-radius: 12px; overflow: hidden; border: 1px solid #202430; background: #0c0c11; }
    .name { font-size: 26px; font-weight: 900; color: #fff; margin: 0 0 4px 0; }
    .location { font-size: 13px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .sub { font-size: 13px; color: #94a3b8; }
    .rates-box { display: flex; gap: 8px; margin-top: 16px; }
    .rate-item { flex: 1; background: #0c0c11; border: 1px solid #1e222d; border-radius: 12px; padding: 10px 4px; text-align: center; }
    .rate-item .lbl { font-size: 11px; color: #94a3b8; margin-bottom: 2px; }
    .rate-item .val { font-size: 18px; font-weight: 900; color: #fbbf24; }
    .card { background: #12121a; border: 1px solid #202430; border-radius: 18px; padding: 16px; margin-bottom: 14px; }
    .card h3 { font-size: 14px; font-weight: 800; color: #fff; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-wa { display: block; background: linear-gradient(90deg, #10b981, #059669); color: #fff; text-align: center; font-size: 15px; font-weight: 900; padding: 14px 16px; border-radius: 14px; text-decoration: none; box-shadow: 0 8px 20px rgba(16,185,129,0.3); margin-bottom: 10px; }
    .btn-call { display: block; background: #1e293b; color: #fff; text-align: center; font-size: 13px; font-weight: 700; padding: 12px 16px; border-radius: 14px; text-decoration: none; border: 1px solid #334155; }
    .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .spec-cell { background: #0a0a0f; border: 1px solid #1c202a; border-radius: 10px; padding: 8px 12px; }
    .spec-cell .k { font-size: 11px; color: #64748b; }
    .spec-cell .v { font-size: 13px; font-weight: 700; color: #fff; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { background: #0c0c11; border: 1px solid #222736; color: #cbd5e1; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 8px; }
    .bio { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
    .footer { text-align: center; font-size: 11px; color: #475569; padding: 24px 16px; }
  </style>
</head>
<body>

  <div class="header">
    <a href="${canonicalUrl}" class="logo">EU<span>DIRECTORY</span> ⚡</a>
    <span class="amp-badge">AMP CACHE</span>
  </div>

  <div class="container">
    
    <div class="hero">
      ${((profile as any).photos && (profile as any).photos.length > 0) ? `
        <div class="hero-photo-wrap">
          <amp-img src="${(profile as any).photos[0]}" width="320" height="420" layout="responsive" alt="${profile.name}"></amp-img>
        </div>
      ` : `
        <div class="avatar">${profile.name.charAt(0).toUpperCase()}</div>
      `}
      <div class="location">📍 ${city.name}, ${city.country}</div>
      <h1 class="name">${profile.name}</h1>
      <div class="sub">${profile.age} yrs &middot; ${profile.hair.toUpperCase()} &middot; ${profile.bust}</div>

      <div class="rates-box">
        <div class="rate-item">
          <div class="lbl">${t.oneHour}</div>
          <div class="val">€${rate1h}</div>
        </div>
        <div class="rate-item">
          <div class="lbl">${t.twoHours}</div>
          <div class="val">€${rate2h}</div>
        </div>
        <div class="rate-item">
          <div class="lbl">${t.overnight}</div>
          <div class="val">€${rateOvernight}</div>
        </div>
      </div>
    </div>

    <!-- Direct Contact CTAs -->
    <div class="card">
      <h3>⚡ ${t.contactTitle}</h3>
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa">
        💬 ${t.whatsappBtn}
      </a>
      <a href="tel:+447000000000" class="btn-call">
        📞 ${t.callBtn}
      </a>
    </div>

    ${((profile as any).photos && (profile as any).photos.length > 1) ? `
    <!-- Photo Gallery -->
    <div class="card">
      <h3>📸 ${t.galleryTitle} (${(profile as any).photos.length})</h3>
      <div class="amp-gallery-grid">
        ${(profile as any).photos.slice(1, 7).map((img: string) => `
          <div class="gallery-item">
            <amp-img src="${img}" width="160" height="200" layout="responsive" alt="${profile.name}"></amp-img>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Physical Attributes -->
    <div class="card">
      <h3>💎 ${t.specsTitle}</h3>
      <div class="specs-grid">
        <div class="spec-cell"><div class="k">Age</div><div class="v">${profile.age} years</div></div>
        <div class="spec-cell"><div class="k">Height</div><div class="v">${profile.height}</div></div>
        <div class="spec-cell"><div class="k">Bust</div><div class="v">${profile.bust}</div></div>
        <div class="spec-cell"><div class="k">Hair</div><div class="v">${profile.hair}</div></div>
        <div class="spec-cell"><div class="k">Body</div><div class="v">${profile.body}</div></div>
        <div class="spec-cell"><div class="k">Travel</div><div class="v">${profile.can_travel ? 'Yes (✈️)' : 'Local Only'}</div></div>
      </div>
    </div>

    <!-- Services -->
    <div class="card">
      <h3>✨ ${t.servicesTitle}</h3>
      <div class="tags">
        ${servicesHtml}
      </div>
    </div>

    <!-- VIP Bio -->
    <div class="card">
      <h3>📝 ${profile.name} VIP Bio</h3>
      <p class="bio">${t.bio}</p>
    </div>

    <div class="footer">
      18+ Adults Only &middot; Google AMP Cached &middot; RTA Compliant<br>
      ${t.safeHarbor}
    </div>

  </div>

</body>
</html>`;

  return new NextResponse(ampHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
