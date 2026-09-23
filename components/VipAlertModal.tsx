'use client';

import React, { useState } from 'react';

interface TagItem {
  id: string;
  label: string;
}

interface VipAlertModalProps {
  cityName: string;
  districtName?: string;
  tags: TagItem[];
  lang: string;
  dict?: any;
}

export default function VipAlertModal({
  cityName,
  districtName,
  tags,
  lang,
  dict
}: VipAlertModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [channel, setChannel] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Localized texts with graceful fallbacks
  const texts: Record<string, {
    triggerBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    targetCriteria: string;
    selectChannel: string;
    inputPlaceholderWhatsapp: string;
    inputPlaceholderTelegram: string;
    privacyNote: string;
    submitBtn: string;
    successTitle: string;
    successMsg: string;
    closeBtn: string;
  }> = {
    tr: {
      triggerBtn: '🔔 Aradığın Kriterde Yeni Escort Gelince Haber Ver',
      modalTitle: 'VIP Escort Radarı & Anlık Bildirim',
      modalSubtitle: `${districtName ? districtName + ', ' : ''}${cityName} bölgesinde tam bu kriterlere uyan yeni bir doğrulanmış bağımsız model listelendiğinde ilk sizin haberiniz olsun.`,
      targetCriteria: 'Kayıt Edilecek Kriterler:',
      selectChannel: 'Bildirim Kanalı Seçin:',
      inputPlaceholderWhatsapp: 'WhatsApp Numaranız (Örn: +90 532 123 45 67)',
      inputPlaceholderTelegram: 'Telegram Kullanıcı Adınız (Örn: @vipkullanici)',
      privacyNote: '🔒 %100 Gizlilik Garantisi. Numaranız üçüncü şahıslarla paylaşılmaz, spam yapılmaz. Yalnızca eşleşen yeni ilan geldiğinde bildirim iletilir.',
      submitBtn: 'Bildirimlerimi Aktif Et',
      successTitle: '✓ VIP Radara Başarıyla Kaydedildiniz!',
      successMsg: `Bu kriterlere (${[districtName, ...tags.map(t => t.label)].filter(Boolean).join(', ')}) uyan yeni bir profil sisteme yüklendiğinde anında bildirim alacaksınız.`,
      closeBtn: 'Kapat'
    },
    en: {
      triggerBtn: '🔔 Alert Me When New Escorts Match This Search',
      modalTitle: 'VIP Concierge Alert & Live Radar',
      modalSubtitle: `Be the first to know when a newly verified independent escort matching these exact criteria is listed in ${districtName ? districtName + ', ' : ''}${cityName}.`,
      targetCriteria: 'Subscribed Search Criteria:',
      selectChannel: 'Preferred Notification Channel:',
      inputPlaceholderWhatsapp: 'WhatsApp Number (e.g. +44 7700 900123)',
      inputPlaceholderTelegram: 'Telegram Username (e.g. @vip_user)',
      privacyNote: '🔒 100% Discretion Guarantee. Your contact details are encrypted and never shared. Strictly no spam.',
      submitBtn: 'Activate VIP Alerts',
      successTitle: '✓ Successfully Subscribed to VIP Radar!',
      successMsg: `You will receive an instant discrete alert as soon as a new companion matching (${[districtName, ...tags.map(t => t.label)].filter(Boolean).join(', ')}) goes live.`,
      closeBtn: 'Close'
    },
    de: {
      triggerBtn: '🔔 Benachrichtigen, wenn neue passende Escorts eintreffen',
      modalTitle: 'VIP Begleit-Radar & Benachrichtigung',
      modalSubtitle: `Erfahren Sie sofort, sobald eine neue geprüfte VIP-Dame mit diesen Kriterien in ${districtName ? districtName + ', ' : ''}${cityName} online geht.`,
      targetCriteria: 'Gespeicherte Suchkriterien:',
      selectChannel: 'Bevorzugter Kanal:',
      inputPlaceholderWhatsapp: 'WhatsApp Nummer (z.B. +49 170 1234567)',
      inputPlaceholderTelegram: 'Telegram Nutzername (z.B. @vip_user)',
      privacyNote: '🔒 100% Diskretionsgarantie. Keine Weitergabe, kein Spam. Ausschließlich diskrete Benachrichtigung bei Neuzugängen.',
      submitBtn: 'VIP Benachrichtigung Aktivieren',
      successTitle: '✓ Erfolgreich für VIP Radar angemeldet!',
      successMsg: `Sie erhalten eine diskrete Nachricht, sobald ein Profil mit Ihren Kriterien freigeschaltet wird.`,
      closeBtn: 'Schließen'
    },
    nl: {
      triggerBtn: '🔔 Waarschuw mij bij nieuwe passende escorts',
      modalTitle: 'VIP Escort Radar & Meldingen',
      modalSubtitle: `Ontvang als eerste bericht zodra een nieuw geverifieerd model met deze voorkeuren online komt in ${districtName ? districtName + ', ' : ''}${cityName}.`,
      targetCriteria: 'Geselecteerde Criteria:',
      selectChannel: 'Voorkeurskanaal:',
      inputPlaceholderWhatsapp: 'WhatsApp Nummer (bijv. +31 6 12345678)',
      inputPlaceholderTelegram: 'Telegram Gebruikersnaam (bijv. @vip_user)',
      privacyNote: '🔒 100% Discretie gegarandeerd. Geen spam.',
      submitBtn: 'Activeer VIP Meldingen',
      successTitle: '✓ VIP Radar Ingeschakeld!',
      successMsg: `U ontvangt direct discreet bericht bij nieuwe passende profielen.`,
      closeBtn: 'Sluiten'
    },
    fr: {
      triggerBtn: '🔔 M\'alerter lorsqu\'une nouvelle escorte correspond',
      modalTitle: 'Radar VIP & Alertes Nouveautés',
      modalSubtitle: `Soyez averti dès qu\'une nouvelle accompagnatrice correspondant à ces critères arrive à ${districtName ? districtName + ', ' : ''}${cityName}.`,
      targetCriteria: 'Critères Enregistrés:',
      selectChannel: 'Canal de notification:',
      inputPlaceholderWhatsapp: 'Numéro WhatsApp (ex: +33 6 12 34 56 78)',
      inputPlaceholderTelegram: 'Identifiant Telegram (ex: @vip_user)',
      privacyNote: '🔒 100% Discrétion garantie. Aucune publicité non sollicitée.',
      submitBtn: 'Activer les Alertes VIP',
      successTitle: '✓ Alerte VIP Activée!',
      successMsg: `Vous serez notifié dès qu\'un nouveau profil correspondant sera publié.`,
      closeBtn: 'Fermer'
    },
    es: {
      triggerBtn: '🔔 Avisarme cuando haya nuevas acompañantes',
      modalTitle: 'Radar VIP & Alertas de Acompañantes',
      modalSubtitle: `Sé el primero en enterarte cuando se publique una acompañante verificada con estos criterios en ${districtName ? districtName + ', ' : ''}${cityName}.`,
      targetCriteria: 'Criterios Registrados:',
      selectChannel: 'Canal preferido:',
      inputPlaceholderWhatsapp: 'Número de WhatsApp (ej: +34 600 123 456)',
      inputPlaceholderTelegram: 'Usuario de Telegram (ej: @vip_user)',
      privacyNote: '🔒 100% Discreción garantizada. Cero spam.',
      submitBtn: 'Activar Alertas VIP',
      successTitle: '✓ ¡Radar VIP Activado!',
      successMsg: `Recibirás un aviso discreto en cuanto se registre un nuevo perfil coincidente.`,
      closeBtn: 'Cerrar'
    },
    it: {
      triggerBtn: '🔔 Avvisami quando arrivano nuove escort corrispondenti',
      modalTitle: 'Radar VIP & Notifiche Immediate',
      modalSubtitle: `Ricevi un avviso non appena viene pubblicata una modella verificata con queste preferenze a ${districtName ? districtName + ', ' : ''}${cityName}.`,
      targetCriteria: 'Criteri Registrati:',
      selectChannel: 'Canale preferito:',
      inputPlaceholderWhatsapp: 'Numero WhatsApp (es: +39 340 1234567)',
      inputPlaceholderTelegram: 'Username Telegram (es: @vip_user)',
      privacyNote: '🔒 Garanzia di massima riservatezza al 100%.',
      submitBtn: 'Attiva Notifiche VIP',
      successTitle: '✓ Radar VIP Attivato!',
      successMsg: `Ti invieremo un messaggio discreto per i nuovi annunci corrispondenti.`,
      closeBtn: 'Chiudi'
    },
    ar: {
      triggerBtn: '🔔 أبلغني عند انضمام عارضات جدد بهذه المواصفات',
      modalTitle: 'رادار التنبيهات الفورية لكبار الشخصيات',
      modalSubtitle: `كن أول من يعلم عند انضمام عارضة مستقلة معتمدة تطابق هذه المعايير في ${districtName ? districtName + '، ' : ''}${cityName}.`,
      targetCriteria: 'المعايير المحددة:',
      selectChannel: 'قناة التنبيه المفضلة:',
      inputPlaceholderWhatsapp: 'رقم الواتساب (مثال: 971501234567+)',
      inputPlaceholderTelegram: 'معرف تيليجرام (مثال: vip_user@)',
      privacyNote: '🔒 سرية وخصوصية بنسبة 100%. لا نشارك بياناتك نهائياً.',
      submitBtn: 'تفعيل تنبيهات VIP',
      successTitle: '✓ تم تفعيل الرادار بنجاح!',
      successMsg: `سنخطرك فوراً عند توفر عارضة جديدة تطابق بحثك.`,
      closeBtn: 'إغلاق'
    }
  };

  const t = texts[lang] || texts.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setIsLoading(true);
    try {
      const existing = JSON.parse(localStorage.getItem('vip_alerts') || '[]');
      existing.push({
        city: cityName,
        district: districtName || null,
        tags: tags.map(item => item.id),
        channel,
        contact: contactValue.trim(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('vip_alerts', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setContactValue('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-950/40 hover:shadow-red-600/30 transition-all cursor-pointer border border-red-500/50 group shrink-0"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <span className="group-hover:scale-[1.02] transition-transform">
          {t.triggerBtn}
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-[#0e0e14] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-neutral-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  VIP Concierge Alert
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t.modalTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {t.modalSubtitle}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 text-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Active Tags Chips */}
            <div className="space-y-1.5 bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800/80">
              <span className="text-[11px] font-semibold text-neutral-400 block">
                {t.targetCriteria}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-700">
                  📍 {cityName}
                </span>
                {districtName && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-500/50">
                    🏛️ {districtName}
                  </span>
                )}
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded-md bg-red-950/70 text-red-300 text-xs font-bold border border-red-500/40"
                  >
                    ✓ {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Form or Success State */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Channel Radio Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.selectChannel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel('whatsapp')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        channel === 'whatsapp'
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 shadow-sm shadow-emerald-950'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>💬</span> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('telegram')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        channel === 'telegram'
                          ? 'bg-sky-950/60 border-sky-500/80 text-sky-300 shadow-sm shadow-sky-950'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>✈️</span> Telegram
                    </button>
                  </div>
                </div>

                {/* Input Field */}
                <div>
                  <input
                    type="text"
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={
                      channel === 'whatsapp'
                        ? t.inputPlaceholderWhatsapp
                        : t.inputPlaceholderTelegram
                    }
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>

                {/* Privacy Guarantee Note */}
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {t.privacyNote}
                </p>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading || !contactValue.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-red-950 transition-all cursor-pointer"
                >
                  {isLoading ? '...' : t.submitBtn}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 text-2xl flex items-center justify-center mx-auto animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-white">
                  {t.successTitle}
                </h4>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  {t.successMsg}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-700 transition-colors cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
