import React from 'react';
import { Heart, ShieldCheck, FileText, Lock, Cookie } from 'lucide-react';
import { translations, Language } from '../i18n/translations';
import { MefeSymbol } from './MefeSymbol';
import { LegalTab } from './legal/LegalModal';

interface Props {
  lang: Language;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const Footer: React.FC<Props> = ({ lang, onOpenLegal }) => {
  const currentYear = new Date().getFullYear();
  const t = translations[lang] || translations.en;

  const handleLinkClick = (e: React.MouseEvent, tab: LegalTab) => {
    e.preventDefault();
    if (onOpenLegal) {
      onOpenLegal(tab);
    }
  };

  return (
    <footer className="mt-auto border-t border-[#EAE2DA] bg-[#F7F3EE] text-[#5C4D4D] text-xs pt-8 pb-20 md:pb-8 px-4 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand statement */}
        <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#E2725B] flex items-center justify-center text-white">
              <MefeSymbol className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="font-serif font-bold text-sm tracking-wide text-[#3C2F2F]">
              MEFE
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E2725B]/15 text-[#E2725B] font-bold">
              Mindful Style
            </span>
          </div>
          <p className="text-[11px] text-[#7A6A6A] max-w-sm leading-relaxed">
            Connecting daily personal style, color harmonies, and emotional well-being for mindful living.
          </p>
        </div>

        {/* Sensible, standard modern web links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:flex items-center gap-x-6 gap-y-3.5 text-center md:text-right font-medium text-xs">
          <button
            onClick={(e) => handleLinkClick(e, 'privacy')}
            className="flex items-center justify-center md:justify-end gap-1.5 hover:text-[#E2725B] transition py-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2725B]" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={(e) => handleLinkClick(e, 'terms')}
            className="flex items-center justify-center md:justify-end gap-1.5 hover:text-[#E2725B] transition py-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#8C7C7C]" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={(e) => handleLinkClick(e, 'security')}
            className="flex items-center justify-center md:justify-end gap-1.5 hover:text-[#E2725B] transition py-1 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#8C7C7C]" />
            <span>Data Security</span>
          </button>

          <button
            onClick={(e) => handleLinkClick(e, 'cookies')}
            className="flex items-center justify-center md:justify-end gap-1.5 hover:text-[#E2725B] transition py-1 cursor-pointer"
          >
            <Cookie className="w-3.5 h-3.5 text-[#8C7C7C]" />
            <span>Storage & Cookies</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-[#EAE2DA]/70 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7C7C] gap-2">
        <p>© {currentYear} MEFE. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3 h-3 text-[#E2725B] fill-current" /> for daily confidence & personal expression
        </p>
      </div>
    </footer>
  );
};
