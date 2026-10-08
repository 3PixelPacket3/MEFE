import React, { useState } from 'react';
import { Calendar, Layers } from 'lucide-react';
import { Outfit, ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { OutfitBuilder } from './OutfitBuilder';
import { OutfitCalendar } from './OutfitCalendar';

interface Props {
  outfits: Outfit[];
  closetItems: ClosetItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  onScheduleOutfit: (outfitId: string, dateStr: string) => void;
  userName: string;
  userId: string;
  lang: Language;
}

export const OutfitsScreen: React.FC<Props> = ({
  outfits,
  closetItems,
  onSaveOutfit,
  onScheduleOutfit,
  userName,
  userId,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'calendar'>('builder');

  const t = translations[lang] || translations.en;

  return (
    <div className="space-y-6 relative pb-16">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
            {t.navOutfits}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6A6A]">
            Design signature ensembles, coordinate daily silhouettes, and plan upcoming calendar dates.
          </p>
        </div>

        {/* Tab Toggle: [Builder] | [Calendar] */}
        <div className="flex items-center p-1 bg-[#F7F3EE] border border-[#D9CFC4] rounded-2xl">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-[#3C2F2F] text-white shadow-xs'
                : 'text-[#5C4D4D] hover:text-[#3C2F2F]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.tabBuilder}</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#3C2F2F] text-white shadow-xs'
                : 'text-[#5C4D4D] hover:text-[#3C2F2F]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.tabCalendar}</span>
          </button>
        </div>
      </div>

      {/* Main View Content */}
      {activeTab === 'builder' ? (
        <OutfitBuilder
          closetItems={closetItems}
          onSaveOutfit={onSaveOutfit}
          userId={userId}
          lang={lang}
        />
      ) : (
        <OutfitCalendar
          outfits={outfits}
          closetItems={closetItems}
          onScheduleOutfit={onScheduleOutfit}
          lang={lang}
        />
      )}
    </div>
  );
};
