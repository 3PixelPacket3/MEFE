import React, { useState } from 'react';
import { Plus, Sparkles, ShoppingBag, Trash2, X, Calendar, Tag, Heart } from 'lucide-react';
import { ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { AddItemModal } from './AddItemModal';

interface Props {
  items: ClosetItem[];
  searchQuery: string;
  onAddItem: (item: ClosetItem) => void;
  onDeleteItem: (itemId: string) => void;
  onShopSimilar: (query: string) => void;
  userId: string;
  lang: Language;
}

export const ClosetScreen: React.FC<Props> = ({
  items,
  searchQuery,
  onAddItem,
  onDeleteItem,
  onShopSimilar,
  userId,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<ClosetItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const t = translations[lang] || translations.en;

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'tops', label: t.categoryTops },
    { id: 'bottoms', label: t.categoryBottoms },
    { id: 'dresses', label: t.categoryDresses },
    { id: 'outerwear', label: t.categoryOuterwear },
    { id: 'shoes', label: t.categoryShoes },
    { id: 'accessories', label: t.categoryAccessories },
  ];

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(q);
    const matchesColors = item.colors.some((c) => c.toLowerCase().includes(q));
    const matchesVibes = item.emotionalTags.some((v) => v.toLowerCase().includes(q));
    const matchesUseCases = item.useCases.some((u) => u.toLowerCase().includes(q));
    return matchesName || matchesColors || matchesVibes || matchesUseCases;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
            {t.navCloset}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6A6A]">
            Curate, tag, and track your daily wardrobe repertoire.
          </p>
        </div>

        {/* Prominent Cocoa Brown "Add New Item" Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#3C2F2F] hover:bg-[#251D1D] text-white text-sm font-bold shadow-lg shadow-[#3C2F2F]/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{t.addNewItem}</span>
        </button>
      </div>

      {/* Filter / Sort Ribbon (Horizontally scrolling pills) */}
      <div className="overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition min-h-[40px] cursor-pointer ${
                  isActive
                    ? 'bg-[#E2725B] text-white shadow-md shadow-[#E2725B]/25'
                    : 'bg-[#F7F3EE] text-[#5C4D4D] hover:bg-[#EAE2DA] border border-[#D9CFC4]/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Mobile Image Grid (3-4 cols on desktop) */}
      {items.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EAE2DA] shadow-xs">
          <ShirtIcon className="w-12 h-12 mx-auto text-[#E2725B] mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#3C2F2F] mb-1">Your Wardrobe is Ready</h3>
          <p className="text-xs text-[#7A6A6A] max-w-sm mx-auto mb-4">
            Your personal account is set up with full styling permissions. Add your first garment or capsule piece to begin curating.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#E2725B] hover:bg-[#D46049] text-white text-xs font-bold shadow-md shadow-[#E2725B]/20 cursor-pointer"
          >
            + Add Your First Garment
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EAE2DA]">
          <ShirtIcon className="w-12 h-12 mx-auto text-[#C2B4A8] mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#3C2F2F] mb-1">{t.noItemsFound}</h3>
          <p className="text-xs text-[#7A6A6A] max-w-sm mx-auto mb-4">
            Try adjusting your search query or add a chic new piece to your archive.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#E2725B] text-white text-xs font-bold shadow-sm"
          >
            {t.addNewItem}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.itemId}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#EAE2DA] hover:border-[#E2725B] shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col"
            >
              {/* Image aspect ratio container */}
              <div className="aspect-[3/4] relative overflow-hidden bg-[#F7F3EE]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Category chip */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#3C2F2F]/80 backdrop-blur-xs text-[10px] uppercase font-bold tracking-wider text-white">
                  {item.category}
                </span>
                {/* Wear count pill */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#3C2F2F] shadow-xs">
                  {item.wearCount}×
                </span>
              </div>

              {/* Meta */}
              <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#3C2F2F] line-clamp-1 group-hover:text-[#E2725B] transition">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.emotionalTags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#E2725B]/10 text-[#E2725B]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#F2ECE4] flex items-center justify-between text-[10px] text-[#8C7C7C]">
                  <span>{item.colors[0]}</span>
                  <span className="text-[#E2725B] font-semibold hover:underline">Inspect →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Overlay / Popup */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E2725B]/20 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#3C2F2F] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E2725B] font-bold">
                  {activeItem.category}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  {activeItem.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 relative">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                  {t.wearCount.replace('{count}', String(activeItem.wearCount))}
                </div>
              </div>

              {/* Tags: Use For & Vibe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-4 rounded-2xl border border-[#EAE2DA]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C7C] flex items-center gap-1.5 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#E2725B]" />
                    {t.useFor}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.useCases.map((u, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F7F3EE] text-[#5C4D4D]"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C7C] flex items-center gap-1.5 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#E2725B]" />
                    {t.vibe}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.emotionalTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#E2725B]/15 text-[#E2725B]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors & Last Worn */}
              <div className="flex items-center justify-between text-xs text-[#7A6A6A] px-1">
                <div>
                  <span className="font-semibold text-[#3C2F2F]">Palette: </span>
                  {activeItem.colors.join(', ')}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7C7C]" />
                  <span>
                    {activeItem.lastWornAt
                      ? `${t.lastWorn} ${new Date(activeItem.lastWornAt).toLocaleDateString()}`
                      : t.neverWorn}
                  </span>
                </div>
              </div>

              {/* Action Buttons: "Shop Similar" and "Delete" */}
              <div className="pt-3 border-t border-[#EAE2DA] flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const idToDelete = activeItem.itemId;
                    setActiveItem(null);
                    onDeleteItem(idToDelete);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.delete}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5C4D4D] hover:bg-[#EAE2DA] transition"
                  >
                    {t.close}
                  </button>
                  {/* Action: "Shop Similar" button (triggers retailer search pop-out) */}
                  <button
                    onClick={() => {
                      const query = `${activeItem.colors[0] || ''} ${activeItem.name}`;
                      setActiveItem(null);
                      onShopSimilar(query);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E2725B] hover:bg-[#D46049] text-white text-xs font-bold shadow-md shadow-[#E2725B]/25 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.shopSimilar}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddItem}
        userId={userId}
        lang={lang}
      />
    </div>
  );
};

function ShirtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}
