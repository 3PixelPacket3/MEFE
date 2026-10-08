import React, { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ lang: Language }> = ({ lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={t.pwaInstall}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E2725B]/15 text-[#E2725B] hover:bg-[#E2725B] hover:text-white transition shadow-sm border border-[#E2725B]/30 cursor-pointer min-h-[36px]"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.pwaInstall}</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#FDFBF7] p-6 shadow-2xl border border-[#E2725B]/20 text-[#3C2F2F]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E2725B]/20 flex items-center justify-center text-[#E2725B]">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif">{t.iosInstallTitle}</h3>
            </div>
            <p className="text-sm text-[#5C4D4D] mb-2">{t.iosInstallStep1}</p>
            <p className="text-sm text-[#5C4D4D] mb-6">{t.iosInstallStep2}</p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#3C2F2F] text-white text-sm font-medium hover:bg-[#251D1D] transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
