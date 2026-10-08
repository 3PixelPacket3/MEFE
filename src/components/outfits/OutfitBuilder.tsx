import React, { useState } from 'react';
import { Plus, X, Sparkles, Check, Trash2, Calendar as CalIcon, Heart, Move } from 'lucide-react';
import { ClosetItem, Outfit } from '../../types';
import { translations, Language } from '../../i18n/translations';
import confetti from 'canvas-confetti';

interface Props {
  closetItems: ClosetItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  userId: string;
  lang: Language;
}

export const OutfitBuilder: React.FC<Props> = ({
  closetItems,
  onSaveOutfit,
  userId,
  lang,
}) => {
  const [selectedItems, setSelectedItems] = useState<ClosetItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [moodTarget, setMoodTarget] = useState('High Confidence');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDragOver, setIsDragOver] = useState(false);

  const t = translations[lang] || translations.en;

  const toggleItem = (item: ClosetItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.itemId === item.itemId);
      if (exists) {
        return prev.filter((i) => i.itemId !== item.itemId);
      } else {
        return [...prev, item];
      }
    });
  };

  const addItemById = (itemId: string) => {
    const item = closetItems.find((ci) => ci.itemId === itemId);
    if (!item) return;
    setSelectedItems((prev) => {
      if (prev.some((i) => i.itemId === itemId)) return prev;
      return [...prev, item];
    });
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      addItemById(itemId);
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    const newOutfit: Outfit = {
      outfitId: `outfit_${Date.now()}`,
      userId,
      name: outfitName.trim() || `Styled Ensemble #${Math.floor(Math.random() * 899 + 100)}`,
      itemIds: selectedItems.map((i) => i.itemId),
      moodTarget: moodTarget.trim() || 'High Confidence',
      scheduledDates: scheduleDate ? [scheduleDate] : [],
      previewImageUrl: selectedItems[0]?.imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveOutfit(newOutfit);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E2725B', '#3C2F2F', '#FBBF24'],
    });

    // Reset
    setSelectedItems([]);
    setOutfitName('');
  };

  return (
    <div className="space-y-6">
      {/* Top 50%: Blank interactive canvas / drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-inner transition-colors duration-200 ${
          isDragOver
            ? 'border-[#E2725B] bg-[#E2725B]/10 ring-4 ring-[#E2725B]/20'
            : 'border-[#D9CFC4] bg-[#F7F3EE]'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#E2725B] text-white flex items-center justify-center text-xs font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif font-bold text-sm text-[#3C2F2F]">
              {t.tabBuilder} ({selectedItems.length} pieces staged)
            </span>
          </div>
          {selectedItems.length > 0 && (
            <button
              onClick={() => setSelectedItems([])}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearCanvas}</span>
            </button>
          )}
        </div>

        {selectedItems.length === 0 ? (
          <div className="my-auto text-center py-10 px-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center text-[#C2B4A8] mb-3 shadow-xs">
              <Move className="w-7 h-7 text-[#E2725B]" />
            </div>
            <p className="font-serif text-base text-[#3C2F2F] font-bold mb-1">
              Drag & Drop or Tap Clothing Items Below
            </p>
            <p className="text-xs text-[#7A6A6A] max-w-sm mx-auto">
              {t.emptyCanvas}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
            {selectedItems.map((item) => (
              <div
                key={item.itemId}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-white border border-[#EAE2DA] shadow-md animate-in zoom-in-90"
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => toggleItem(item)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-[10px] font-bold truncate">{item.name}</p>
                  <p className="text-[9px] text-[#E2725B]">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Outfit Name & Mood Target Bar */}
        {selectedItems.length > 0 && (
          <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-[#EAE2DA] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                  {t.outfitName}
                </label>
                <input
                  type="text"
                  required
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder={t.outfitNamePlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9CFC4] text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                  {t.moodTarget}
                </label>
                <input
                  type="text"
                  value={moodTarget}
                  onChange={(e) => setMoodTarget(e.target.value)}
                  placeholder={t.moodTargetPlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9CFC4] text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                  {t.scheduleDate}
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9CFC4] text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3C2F2F] hover:bg-[#251D1D] text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t.saveOutfit}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom 50%: Scrollable carousel of Closet items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#3C2F2F]">
            {t.selectFromCloset}
          </h3>
          <span className="text-xs text-[#7A6A6A]">{closetItems.length} items (drag or tap to stage)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {closetItems.map((item) => {
            const isSelected = selectedItems.some((i) => i.itemId === item.itemId);
            return (
              <div
                key={item.itemId}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.itemId)}
                onClick={() => toggleItem(item)}
                className={`group relative rounded-2xl overflow-hidden aspect-[3/4] border text-left transition flex flex-col justify-end p-2 cursor-grab active:cursor-grabbing select-none ${
                  isSelected
                    ? 'border-[#E2725B] ring-2 ring-[#E2725B] shadow-lg'
                    : 'border-[#EAE2DA] hover:border-[#8C7C7C] bg-white'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                {isSelected && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E2725B] text-white flex items-center justify-center text-xs font-bold shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="relative text-[11px] font-bold text-white line-clamp-1">
                  {item.name}
                </span>
                <span className="relative text-[9px] uppercase font-semibold text-amber-200">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
