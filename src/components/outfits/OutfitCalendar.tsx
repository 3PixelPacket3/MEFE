import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Sparkles, Plus, X, Check } from 'lucide-react';
import { Outfit, ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';

interface Props {
  outfits: Outfit[];
  closetItems: ClosetItem[];
  onScheduleOutfit: (outfitId: string, dateStr: string) => void;
  lang: Language;
}

export const OutfitCalendar: React.FC<Props> = ({
  outfits,
  closetItems,
  onScheduleOutfit,
  lang,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const t = translations[lang] || translations.en;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dStr);
    setIsDrawerOpen(true);
  };

  const getOutfitsForDate = (dStr: string) => {
    return outfits.filter((o) => o.scheduledDates && o.scheduledDates.includes(dStr));
  };

  const selectedDayOutfits = getOutfitsForDate(selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-[#EAE2DA] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#3C2F2F]">
            {monthNames[month]} {year}
          </h3>
          <p className="text-xs text-[#7A6A6A]">
            Tap any date to assign or view your planned daily ensembles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl border border-[#EAE2DA] hover:bg-[#F7F3EE] flex items-center justify-center text-[#5C4D4D] transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl border border-[#EAE2DA] hover:bg-[#F7F3EE] flex items-center justify-center text-[#5C4D4D] transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-3xl border border-[#EAE2DA] p-4 sm:p-6 shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center font-bold text-xs text-[#8C7C7C] pb-3 border-b border-[#EAE2DA]">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-3">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] rounded-xl bg-[#FAF8F5]/50" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayOutfits = getOutfitsForDate(dStr);
            const isToday = new Date().toISOString().split('T')[0] === dStr;
            const isSelected = selectedDateStr === dStr;

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#E2725B] bg-[#E2725B]/10 ring-2 ring-[#E2725B]'
                    : isToday
                    ? 'border-[#3C2F2F] bg-[#F7F3EE]'
                    : 'border-[#EAE2DA] hover:border-[#8C7C7C] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-[#3C2F2F] text-white' : 'text-[#3C2F2F]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayOutfits.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#E2725B]" />
                  )}
                </div>

                {/* Outfit preview pills */}
                <div className="space-y-1 mt-1">
                  {dayOutfits.slice(0, 2).map((o) => (
                    <div
                      key={o.outfitId}
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3C2F2F] text-amber-200 truncate"
                    >
                      {o.name}
                    </div>
                  ))}
                  {dayOutfits.length > 2 && (
                    <span className="text-[8px] font-semibold text-[#8C7C7C]">
                      +{dayOutfits.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Drawer for day outfit inspection / assignment */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E2725B]/20 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-5 bg-[#3C2F2F] text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                  Daily Style Schedule
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#5C4D4D] mb-2">
                  Scheduled for this date:
                </h4>
                {selectedDayOutfits.length === 0 ? (
                  <p className="text-xs text-[#8C7C7C] italic py-2">
                    {t.noOutfitsScheduled}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayOutfits.map((o) => (
                      <div
                        key={o.outfitId}
                        className="p-3 rounded-2xl bg-white border border-[#EAE2DA] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {o.previewImageUrl && (
                            <img
                              src={o.previewImageUrl}
                              alt={o.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <h5 className="font-bold text-sm text-[#3C2F2F]">{o.name}</h5>
                            <p className="text-xs text-[#E2725B] font-medium">{o.moodTarget}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign another outfit */}
              <div className="pt-3 border-t border-[#EAE2DA]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#5C4D4D] mb-2">
                  Assign a Saved Outfit to this Date:
                </h4>
                <div className="space-y-2">
                  {outfits.map((o) => {
                    const isAlready = o.scheduledDates?.includes(selectedDateStr);
                    return (
                      <button
                        key={o.outfitId}
                        onClick={() => onScheduleOutfit(o.outfitId, selectedDateStr)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                          isAlready
                            ? 'bg-[#E2725B]/10 border-[#E2725B]'
                            : 'bg-white border-[#EAE2DA] hover:border-[#8C7C7C]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {o.previewImageUrl && (
                            <img
                              src={o.previewImageUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <span className="text-xs font-bold text-[#3C2F2F]">{o.name}</span>
                        </div>
                        {isAlready ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#E2725B]">
                            <Check className="w-3.5 h-3.5" /> Assigned
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-[#7A6A6A]">
                            + Assign
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAE2DA] bg-[#F7F3EE] flex justify-end">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#3C2F2F] text-white text-xs font-bold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
