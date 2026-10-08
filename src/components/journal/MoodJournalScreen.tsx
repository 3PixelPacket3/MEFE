import React, { useState } from 'react';
import {
  Calendar,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Shirt,
  Check,
  X,
  Send,
  TrendingUp,
} from 'lucide-react';
import { JournalEntry, Outfit, ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { analyzeJournalSentiment } from '../../services/geminiService';
import confetti from 'canvas-confetti';

interface Props {
  entries: JournalEntry[];
  outfits: Outfit[];
  closetItems: ClosetItem[];
  onSaveEntry: (entry: JournalEntry) => void;
  userId: string;
  lang: Language;
}

const AVAILABLE_EMOTIONS = [
  'confident',
  'grounded',
  'energized',
  'poised',
  'serene',
  'anxious',
  'cozy',
  'unstoppable',
  'creative',
  'composed',
];

export const MoodJournalScreen: React.FC<Props> = ({
  entries,
  outfits,
  closetItems,
  onSaveEntry,
  userId,
  lang,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if today already has an entry
  const existingToday = entries.find((e) => e.date === todayStr);

  const [date, setDate] = useState(todayStr);
  const [moodScore, setMoodScore] = useState<number>(existingToday?.moodScore || 8);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    existingToday?.emotionsLogged || ['confident', 'grounded']
  );
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(
    existingToday?.outfitId || outfits[0]?.outfitId || null
  );
  const [entryText, setEntryText] = useState(existingToday?.entryText || '');
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang] || translations.en;

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find worn item IDs from linked outfit or direct items
      const linkedOutfit = outfits.find((o) => o.outfitId === selectedOutfitId);
      const wornItemIds = linkedOutfit ? linkedOutfit.itemIds : [];

      // Run AI sentiment analysis from Gemini
      const sentiment = await analyzeJournalSentiment(entryText, moodScore);

      const entry: JournalEntry = {
        journalId: `${userId}_${date}`,
        userId,
        date,
        moodScore,
        emotionsLogged:
          selectedEmotions.length > 0 ? selectedEmotions : sentiment.suggestedEmotions,
        outfitId: selectedOutfitId,
        wornItemIds,
        entryText: entryText.trim(),
        sentimentScore: sentiment.sentimentScore,
        aiProcessed: true,
        createdAt: new Date().toISOString(),
      };

      onSaveEntry(entry);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#E2725B', '#3C2F2F', '#FBBF24'],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return '✨ Terrific';
    if (score >= 6) return '🌿 Balanced';
    if (score >= 4) return '☁️ Reflective';
    return '🌧️ Low Energy';
  };

  const selectedOutfit = outfits.find((o) => o.outfitId === selectedOutfitId);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Screen Header */}
      <div>
        <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
          {t.journalTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6A6A]">
          {t.journalSubtitle}
        </p>
      </div>

      {/* Daily Input Card */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-7 rounded-3xl bg-white border border-[#EAE2DA] shadow-lg space-y-6"
      >
        {/* Date Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE2DA]">
          <div className="flex items-center gap-2 text-sm font-bold text-[#3C2F2F]">
            <Calendar className="w-4 h-4 text-[#E2725B]" />
            <span>Check-in Date:</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#D9CFC4] bg-[#F7F3EE] text-xs font-semibold text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
          />
        </div>

        {/* 1-10 Mood Slider styled in gradients of Red/Brown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D]">
              {t.moodRating}
            </label>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2725B]/15 text-[#E2725B] font-extrabold text-sm">
              <span>{moodScore}/10</span>
              <span className="text-xs font-semibold">({getMoodEmoji(moodScore)})</span>
            </div>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={moodScore}
              onChange={(e) => setMoodScore(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-[#8C7C7C] pt-1">
            <span>1 ({t.moodLow})</span>
            <span>5 ({t.moodMid})</span>
            <span>10 ({t.moodHigh})</span>
          </div>
        </div>

        {/* "What did you wear?" button (opens modal to select Closet item or Outfit) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-2">
            {t.whatDidYouWear}
          </label>
          <div className="p-3.5 rounded-2xl bg-[#F7F3EE] border border-[#EAE2DA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedOutfit?.previewImageUrl ? (
                <img
                  src={selectedOutfit.previewImageUrl}
                  alt={selectedOutfit.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#D9CFC4]"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#EAE2DA] flex items-center justify-center text-[#8C7C7C]">
                  <Shirt className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm text-[#3C2F2F]">
                  {selectedOutfit ? selectedOutfit.name : t.noOutfitLinked}
                </h4>
                <p className="text-xs text-[#E2725B] font-medium">
                  {selectedOutfit ? selectedOutfit.moodTarget : 'Tap to tag what you wore'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOutfitModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#D9CFC4] text-xs font-bold text-[#3C2F2F] hover:border-[#E2725B] transition shadow-2xs"
            >
              {selectedOutfit ? t.changeOutfit : 'Select'}
            </button>
          </div>
        </div>

        {/* Emotion Chips */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-2">
            {t.howAreYouFeeling}
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_EMOTIONS.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion);
              return (
                <button
                  type="button"
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                    isSelected
                      ? 'bg-[#E2725B] text-white shadow-xs'
                      : 'bg-[#F7F3EE] text-[#5C4D4D] hover:bg-[#EAE2DA] border border-[#D9CFC4]/50'
                  }`}
                >
                  #{emotion}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area for Journal Reflections */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1.5">
            {t.journalNotes}
          </label>
          <textarea
            rows={4}
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder={t.journalNotesPlaceholder}
            className="w-full p-3.5 rounded-2xl border border-[#D9CFC4] bg-[#FDFBF7] text-sm text-[#3C2F2F] placeholder-[#8C7C7C] focus:bg-white focus:outline-none focus:border-[#E2725B] focus:ring-2 focus:ring-[#E2725B]/15"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3C2F2F] hover:bg-[#251D1D] text-white text-sm font-bold shadow-lg shadow-[#3C2F2F]/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 cursor-pointer min-h-[46px]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isSubmitting ? 'Analyzing with Gemini...' : t.submitJournal}</span>
          </button>
        </div>
      </form>

      {/* Select Outfit Modal */}
      {isOutfitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#E2725B]/20 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2DA] mb-4">
              <h3 className="font-serif font-bold text-base text-[#3C2F2F]">
                {t.selectOutfitTitle}
              </h3>
              <button
                onClick={() => setIsOutfitModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8C7C7C] hover:bg-[#EAE2DA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedOutfitId(null);
                  setIsOutfitModalOpen(false);
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedOutfitId === null
                    ? 'border-[#E2725B] bg-[#E2725B]/10 font-bold'
                    : 'border-[#EAE2DA] bg-white'
                }`}
              >
                <span className="text-xs text-[#3C2F2F]">Skip Linking (Casual/Ungrouped)</span>
                {selectedOutfitId === null && <Check className="w-4 h-4 text-[#E2725B]" />}
              </button>

              {outfits.map((o) => {
                const isSelected = selectedOutfitId === o.outfitId;
                return (
                  <button
                    key={o.outfitId}
                    onClick={() => {
                      setSelectedOutfitId(o.outfitId);
                      setIsOutfitModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-[#E2725B] bg-[#E2725B]/10 font-bold shadow-xs'
                        : 'border-[#EAE2DA] bg-white hover:border-[#8C7C7C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {o.previewImageUrl ? (
                        <img
                          src={o.previewImageUrl}
                          alt={o.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#F7F3EE] flex items-center justify-center">
                          <Shirt className="w-4 h-4 text-[#8C7C7C]" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#3C2F2F]">{o.name}</p>
                        <p className="text-[10px] text-[#E2725B]">{o.moodTarget}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#E2725B]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* History Feed: Reverse-chronological, single-column scroll */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-[#3C2F2F]">
            {t.recentEntries}
          </h3>
          <span className="text-xs text-[#7A6A6A]">{entries.length} reflections archived</span>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-3xl bg-white border border-[#EAE2DA]">
            <p className="text-xs text-[#7A6A6A] italic">
              {t.noJournalEntries}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {entries.map((entry) => {
              const linkedOutfit = outfits.find((o) => o.outfitId === entry.outfitId);
              return (
                <div
                  key={entry.journalId}
                  className="p-5 rounded-3xl bg-white border border-[#EAE2DA] hover:border-[#E2725B] shadow-xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#3C2F2F]">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {entry.sentimentScore !== null && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-[#E2725B]" />
                          <span>Sentiment: {entry.sentimentScore > 0 ? `+${(entry.sentimentScore * 100).toFixed(0)}%` : `${(entry.sentimentScore * 100).toFixed(0)}%`}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3C2F2F] text-amber-200 font-bold text-xs">
                      <span>{entry.moodScore}/10</span>
                    </div>
                  </div>

                  {/* Linked Look snippet */}
                  {linkedOutfit && (
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F3EE] text-xs">
                      {linkedOutfit.previewImageUrl && (
                        <img
                          src={linkedOutfit.previewImageUrl}
                          alt={linkedOutfit.name}
                          className="w-7 h-7 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <span className="font-bold text-[#3C2F2F]">{linkedOutfit.name}</span>
                        <span className="text-[#8C7C7C] ml-1">({linkedOutfit.moodTarget})</span>
                      </div>
                    </div>
                  )}

                  {/* Reflections */}
                  <p className="text-xs sm:text-sm text-[#4A3E3E] leading-relaxed">
                    "{entry.entryText}"
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.emotionsLogged.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E2725B]/10 text-[#E2725B]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
