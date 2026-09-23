'use client';

import React, { useState, useEffect } from 'react';

interface LangContent {
  badge: string;
  title: string;
  desc: string;
  compliance: string;
  btnAccept: string;
  btnExit: string;
}

const CONTENT: Record<string, LangContent> = {
  tr: {
    badge: '18+ YETİŞKİN REHBERİ',
    title: 'Yaş Doğrulaması & Yasal Uyarı',
    desc: 'Bu platform, yalnızca 18 yaşını doldurmuş reşit yetişkinler için bağımsız refakatçi ve eskort ilan rehberi hizmeti sunmaktadır.',
    compliance: 'Siteye giriş yaparak 18 yaşından büyük olduğunuzu ve bu tür yetişkin içeriklerini görüntülemenin bulunduğunuz bölgede yasal olduğunu beyan ve kabul edersiniz.',
    btnAccept: '18 Yaşından Büyüğüm — Giriş Yap',
    btnExit: 'Ayrıl (18 Yaşından Küçüğüm)'
  },
  nl: {
    badge: '18+ VOLWASSENEN GIDS',
    title: 'Leeftijdsverificatie & Juridische Kennisgeving',
    desc: 'Dit platform is een onafhankelijke informatieve escortgids uitsluitend bestemd voor volwassenen van 18 jaar en ouder.',
    compliance: 'Door de website te betreden verklaart u ten minste 18 jaar oud te zijn en dat het raadplegen van dergelijke advertenties legaal is in uw rechtsgebied.',
    btnAccept: 'Ik ben 18 jaar of ouder — Binnenkomen',
    btnExit: 'Verlaten (Onder 18)'
  },
  de: {
    badge: '18+ ERWACHSENENFÜHRER',
    title: 'Altersverifikation & Rechtlicher Hinweis',
    desc: 'Diese Plattform ist ein unabhängiger Begleitführer ausschließlich für volljährige Personen ab 18 Jahren.',
    compliance: 'Mit dem Betreten bestätigen Sie, dass Sie mindestens 18 Jahre alt sind und das Einsehen von Begleitinseraten in Ihrer Gerichtsbarkeit zulässig ist.',
    btnAccept: 'Ich bin mindestens 18 Jahre alt — Eintreten',
    btnExit: 'Verlassen (Unter 18)'
  },
  en: {
    badge: '18+ ADULT DIRECTORY',
    title: 'Age Verification & Legal Notice',
    desc: 'This website is an independent companion directory strictly intended for consenting adults (18 years of age and older).',
    compliance: 'By proceeding, you confirm that you are at least 18 years old and that viewing adult classifieds complies with all local laws and regulations in your jurisdiction.',
    btnAccept: 'I am 18 or Older — Enter Site',
    btnExit: 'Exit (I am under 18)'
  }
};

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    // Only trigger in browser
    try {
      const isVerified = localStorage.getItem('eu_dir_age_verified_v1');
      if (!isVerified) {
        setIsOpen(true);
      }
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/([a-z]{2})/);
      if (match && CONTENT[match[1]]) {
        setLang(match[1]);
      } else {
        setLang('en');
      }
    } catch (e) {
      // LocalStorage fallback
    }
  }, []);

  // Lock background scrolling completely while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const handleAccept = () => {
    try {
      localStorage.setItem('eu_dir_age_verified_v1', 'true');
    } catch (e) {}
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl w-screen h-[100dvh] overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#0f0f14] border border-neutral-800 shadow-2xl p-6 sm:p-8 text-center text-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        {/* 18+ Icon Badge */}
        <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 font-extrabold text-2xl tracking-wider shadow-inner">
          18+
        </div>

        {/* Tagline */}
        <span className="inline-block px-3 py-1 mb-2 text-[11px] font-bold tracking-widest uppercase rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
          {t.badge}
        </span>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
          {t.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-3">
          {t.desc}
        </p>

        {/* Compliance Legal Subtext */}
        <p className="text-xs text-neutral-400 leading-relaxed mb-6 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
          {t.compliance}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/50 hover:shadow-red-900/60 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            {t.btnAccept}
          </button>
          <button
            onClick={handleExit}
            className="py-3 px-5 rounded-xl font-medium text-sm bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-all duration-150 cursor-pointer"
          >
            {t.btnExit}
          </button>
        </div>

        {/* Micro Legal Footer */}
        <div className="mt-5 text-[11px] text-neutral-500">
          RTA (Restricted to Adults) &middot; Safe Harbor Compliant &middot; 2257 Record-Keeping Exempt
        </div>
      </div>
    </div>
  );
}
