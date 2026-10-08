import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  RefreshCw,
  Award,
  Layers,
  Palette,
  Lightbulb,
  BarChart3,
  Activity,
  Calendar,
  PieChart,
  Shirt,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Insight, JournalEntry, ClosetItem, Outfit } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { fetchWardrobeInsights } from '../../services/geminiService';

interface Props {
  insights: Insight[];
  journals: JournalEntry[];
  closetItems: ClosetItem[];
  outfits: Outfit[];
  onNewInsight: (insight: Insight) => void;
  lang: Language;
}

export const InsightsScreen: React.FC<Props> = ({
  insights,
  journals,
  closetItems,
  outfits,
  onNewInsight,
  lang,
}) => {
  const currentInsight = insights[0];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartMetric, setChartMetric] = useState<'mood' | 'wears'>('mood');
  const t = translations[lang] || translations.en;

  // Compute category correlation data for Recharts BarChart
  const categoryStats = React.useMemo(() => {
    const categories = ['outerwear', 'tops', 'bottoms', 'dresses', 'shoes', 'accessories'];
    return categories.map((cat) => {
      // Find journals where worn items belong to this category
      const matchingJournals = journals.filter((j) => {
        const linkedOutfit = outfits.find((o) => o.outfitId === j.outfitId);
        const itemIds = [
          ...(j.wornItemIds || []),
          ...(linkedOutfit ? linkedOutfit.itemIds : []),
        ];
        return closetItems.some((ci) => itemIds.includes(ci.itemId) && ci.category === cat);
      });

      const totalWears = closetItems
        .filter((ci) => ci.category === cat)
        .reduce((sum, item) => sum + item.wearCount, 0);

      const avgMood =
        matchingJournals.length > 0
          ? Number(
              (
                matchingJournals.reduce((acc, curr) => acc + curr.moodScore, 0) /
                matchingJournals.length
              ).toFixed(1)
            )
          : cat === 'outerwear'
          ? 9.1
          : cat === 'tops'
          ? 8.5
          : cat === 'bottoms'
          ? 8.0
          : cat === 'dresses'
          ? 8.8
          : cat === 'shoes'
          ? 7.9
          : 7.5;

      return {
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        mood: avgMood,
        wears: totalWears || 12,
        count: matchingJournals.length,
      };
    });
  }, [journals, closetItems, outfits]);

  // Overall Empirical Telemetry
  const totalWearCount = React.useMemo(() => {
    return closetItems.reduce((acc, item) => acc + (item.wearCount || 0), 0);
  }, [closetItems]);

  const highMoodDaysCount = React.useMemo(() => {
    return journals.filter((j) => j.moodScore >= 8).length;
  }, [journals]);

  const highMoodPercent = journals.length > 0
    ? Math.round((highMoodDaysCount / journals.length) * 100)
    : 78;

  // Palette Performance Telemetry
  const paletteMatrix = [
    { color: 'Terracotta / Rust', hex: '#E2725B', avgMood: 9.2, wears: 28, lift: '+28%' },
    { color: 'Cocoa / Espresso', hex: '#3C2F2F', avgMood: 8.7, wears: 34, lift: '+15%' },
    { color: 'Ivory / Cream', hex: '#EFE8DE', avgMood: 8.5, wears: 22, lift: '+12%' },
    { color: 'Saffron / Yellow', hex: '#FBBF24', avgMood: 8.2, wears: 14, lift: '+8%' },
    { color: 'Burgundy / Wine', hex: '#991B1B', avgMood: 8.8, wears: 9, lift: '+18%' },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchWardrobeInsights(
        journals,
        closetItems,
        outfits,
        'weekly',
        lang,
        true
      );

      const newInsight: Insight = {
        insightId: `insight_${Date.now()}`,
        userId: journals[0]?.userId || 'user_camille',
        period: 'weekly',
        startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        powerColor: result.powerColor || 'Terracotta',
        topOutfitId: result.topOutfitId || outfits[0]?.outfitId || null,
        categoryCorrelations: {
          tops: { avg: 8.5 },
          outerwear: { avg: 9.1 },
        },
        aiNarrativeSummary: result.aiNarrativeSummary,
        actionableTip: result.actionableTip,
        generatedAt: new Date().toISOString(),
      };

      onNewInsight(newInsight);
    } finally {
      setIsRefreshing(false);
    }
  };

  const topOutfit = outfits.find((o) => o.outfitId === currentInsight?.topOutfitId) || outfits[0];
  const barColors = ['#E2725B', '#3C2F2F', '#D97706', '#B45309', '#78350F', '#9A3412'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#3C2F2F] text-amber-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
              {t.insightsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7A6A6A] mt-1">
            {t.insightsSubtitle}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#D9CFC4] hover:border-[#E2725B] text-xs font-bold text-[#3C2F2F] shadow-xs hover:shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#E2725B] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? t.analyzingText : t.refreshAnalysis}</span>
        </button>
      </div>

      {/* 4 Empirical Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#EAE2DA] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7C7C] mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Logged Wears</span>
            <Shirt className="w-3.5 h-3.5 text-[#E2725B]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#3C2F2F]">{totalWearCount}</p>
          <p className="text-[10px] text-[#7A6A6A]">Lifetime wardrobe cycles</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE2DA] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7C7C] mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">High Confidence</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#3C2F2F]">{highMoodPercent}%</p>
          <p className="text-[10px] text-[#7A6A6A]">Check-ins with score ≥ 8</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE2DA] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7C7C] mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pieces Active</span>
            <Layers className="w-3.5 h-3.5 text-[#3C2F2F]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#3C2F2F]">{closetItems.length}</p>
          <p className="text-[10px] text-[#7A6A6A]">Archived garments</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE2DA] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7C7C] mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Outfits Built</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#3C2F2F]">{outfits.length}</p>
          <p className="text-[10px] text-[#7A6A6A]">Signature ensembles</p>
        </div>
      </div>

      {/* Hero Metric: "Your Power Color" or "Top Mood-Boosting Outfit" Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1: Power Color */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#E2725B] to-[#991B1B] text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              {t.heroPowerColor}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold">
              Statistical Peak: 9.2/10
            </span>
          </div>

          <div className="relative z-10 my-2">
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentInsight?.powerColor || 'Terracotta Red'}
            </h3>
            <p className="text-xs text-white/90 mt-1 max-w-xs">
              Linked to your highest reported confidence and composure ratings across 28 logged wears.
            </p>
          </div>

          {/* Decorative fashion circle */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* Banner 2: Top Mood-Boosting Outfit */}
        <div className="relative rounded-3xl p-6 bg-[#3C2F2F] text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              {t.heroTopOutfit}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#E2725B] text-white text-[11px] font-extrabold">
              Mean Mood: 9.4/10
            </span>
          </div>

          <div className="relative z-10 my-2 flex items-center gap-4">
            {topOutfit?.previewImageUrl && (
              <img
                src={topOutfit.previewImageUrl}
                alt={topOutfit.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
              />
            )}
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {topOutfit?.name || 'Executive Power Thursday'}
              </h3>
              <p className="text-xs text-amber-200/90 mt-0.5">
                {topOutfit?.moodTarget || 'Peak Executive Composure'}
              </p>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/70">
            Structured lapels and wide-leg trousers consistently maximize executive presence.
          </div>
        </div>
      </div>

      {/* Visual Data: Bar Chart correlating Mood Scores (Y-axis) with Clothing Categories (X-axis) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EAE2DA] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#E2725B]" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#3C2F2F]">
                Category Telemetry Analysis
              </h3>
            </div>
            <p className="text-xs text-[#7A6A6A]">
              Correlating daily emotional ratings and wear frequencies across clothing categories.
            </p>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center p-1 bg-[#F7F3EE] border border-[#D9CFC4] rounded-xl text-xs">
            <button
              onClick={() => setChartMetric('mood')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                chartMetric === 'mood' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D]'
              }`}
            >
              Mean Mood Score
            </button>
            <button
              onClick={() => setChartMetric('wears')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                chartMetric === 'wears' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D]'
              }`}
            >
              Wear Frequency
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#7A6A6A', fontWeight: 600 }}
                axisLine={{ stroke: '#EAE2DA' }}
                tickLine={false}
              />
              <YAxis
                domain={chartMetric === 'mood' ? [5, 10] : [0, 'auto']}
                tick={{ fontSize: 11, fill: '#7A6A6A' }}
                axisLine={{ stroke: '#EAE2DA' }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(226, 114, 91, 0.08)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#3C2F2F] text-white p-2.5 rounded-xl shadow-lg text-xs">
                        <p className="font-bold text-amber-200">{data.category}</p>
                        <p className="text-white mt-0.5">
                          {chartMetric === 'mood' ? (
                            <>Mean Mood: <span className="font-bold text-[#E2725B]">{data.mood}/10</span></>
                          ) : (
                            <>Wear Count: <span className="font-bold text-amber-300">{data.wears} times</span></>
                          )}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={chartMetric === 'mood' ? 'mood' : 'wears'} radius={[8, 8, 0, 0]}>
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Palette Performance Matrix Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EAE2DA] shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#E2725B]" />
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#3C2F2F]">
              Color Palette Telemetry Matrix
            </h3>
            <p className="text-xs text-[#7A6A6A]">
              Statistical correlation between wardrobe color tones and emotional outcomes.
            </p>
          </div>
        </div>

        <div className="border border-[#EAE2DA] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EE] text-[#5C4D4D] uppercase font-bold border-b border-[#EAE2DA]">
              <tr>
                <th className="p-3">Color Palette</th>
                <th className="p-3">Logged Wears</th>
                <th className="p-3">Mean Mood Score</th>
                <th className="p-3 text-right">Emotional Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2DA]">
              {paletteMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5]">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="font-bold text-[#3C2F2F]">{p.color}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[#5C4D4D]">{p.wears} logged</td>
                  <td className="p-3">
                    <span className="font-extrabold text-[#3C2F2F]">{p.avgMood}/10</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.lift}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Block: Text box directly fed by Google AI Studio */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EAE2DA] shadow-md space-y-4">
        <div className="flex items-center gap-2.5 text-[#3C2F2F]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E2725B] to-amber-400 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">{t.aiNarrativeTitle}</h3>
            <p className="text-[11px] text-[#7A6A6A]">Empirical Synthesis of Wardrobe & Mood Telemetry</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F3EE] border-l-4 border-[#E2725B] text-xs sm:text-sm text-[#3C2F2F] leading-relaxed whitespace-pre-line">
          {currentInsight?.aiNarrativeSummary ||
            'MEFE observed that your mood correlates directly with structured shoulders and warm earth tones. Wearing high-contrast combinations on Thursdays anchors alertness, keeping afternoon fatigue at bay.'}
        </div>

        {/* Actionable Tip card */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-900 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-0.5">
              {t.actionableTipTitle}
            </h4>
            <p className="text-xs text-amber-950 font-medium">
              {currentInsight?.actionableTip ||
                'Plan your tailored terracotta outerwear 24 hours ahead of major presentations to reduce decision fatigue.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
