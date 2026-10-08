import React, { useState, useRef } from 'react';
import { X, Sparkles, Image, Check, Camera, Upload } from 'lucide-react';
import { ClothingCategory, ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { CameraCaptureModal } from '../camera/CameraCaptureModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
  userId: string;
  lang: Language;
}

const PRESET_PHOTOS: { name: string; category: ClothingCategory; url: string; colors: string[]; tags: string[]; useCases: string[] }[] = [
  {
    name: 'Cognac Leather Biker Jacket',
    category: 'outerwear',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    colors: ['cognac', 'brown'],
    tags: ['rebellious', 'bold', 'confident'],
    useCases: ['nightout', 'weekend'],
  },
  {
    name: 'Sage Silk Midi Dress',
    category: 'dresses',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    colors: ['sage', 'green', 'olive'],
    tags: ['serene', 'radiant', 'harmonious'],
    useCases: ['dinner', 'event', 'brunch'],
  },
  {
    name: 'Crisp Cotton Poplin Shirt',
    category: 'tops',
    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    colors: ['white', 'ivory'],
    tags: ['crisp', 'focused', 'sharp'],
    useCases: ['work', 'interview'],
  },
  {
    name: 'Structured Charcoal High-Waist Shorts',
    category: 'bottoms',
    url: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80',
    colors: ['charcoal', 'black'],
    tags: ['modern', 'dynamic'],
    useCases: ['summer', 'city'],
  },
  {
    name: 'Burgundy Suede Pointed Loafers',
    category: 'shoes',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    colors: ['burgundy', 'wine'],
    tags: ['poised', 'grounded'],
    useCases: ['office', 'commute'],
  },
  {
    name: 'Amber Tortoise Sunglasses',
    category: 'accessories',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    colors: ['amber', 'brown'],
    tags: ['mysterious', 'chic'],
    useCases: ['sunny', 'travel'],
  },
];

export const AddItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  userId,
  lang,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [imageUrl, setImageUrl] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [useCasesInput, setUseCasesInput] = useState('');
  const [emotionalTagsInput, setEmotionalTagsInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) setImageUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (p: typeof PRESET_PHOTOS[0]) => {
    setName(p.name);
    setCategory(p.category);
    setImageUrl(p.url);
    setColorsInput(p.colors.join(', '));
    setEmotionalTagsInput(p.tags.join(', '));
    setUseCasesInput(p.useCases.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = colorsInput
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    const useCases = useCasesInput
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);
    const emotionalTags = emotionalTagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newItem: ClosetItem = {
      itemId: `item_${Date.now()}`,
      userId,
      name: name.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      category,
      colors: colors.length > 0 ? colors : ['terracotta'],
      useCases: useCases.length > 0 ? useCases : ['casual', 'work'],
      emotionalTags: emotionalTags.length > 0 ? emotionalTags : ['confident'],
      wearCount: 0,
      lastWornAt: null,
      searchKeywords: [name.toLowerCase(), category, ...colors, ...emotionalTags],
      createdAt: new Date().toISOString(),
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E2725B]/20 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#3C2F2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E2725B] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-serif font-bold text-lg">{t.addNewItem}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick presets picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-2">
              Select Curated Fashion Preset (or type custom below)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => selectPreset(p)}
                  className={`group relative rounded-xl overflow-hidden aspect-video border transition text-left ${
                    imageUrl === p.url ? 'border-[#E2725B] ring-2 ring-[#E2725B]' : 'border-[#EAE2DA] hover:border-[#8C7C7C]'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <span className="absolute inset-0 bg-black/40 flex items-end p-1 text-[10px] text-white font-medium truncate">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Terracotta Linen Double-Breasted Blazer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-sm text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-sm text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
              >
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                Item Photo (Camera, Upload, or URL)
              </label>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E2725B] text-white hover:bg-[#D46049] text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take with Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D9CFC4] hover:bg-[#F7F3EE] text-[#3C2F2F] text-xs font-semibold transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#5C4D4D]" />
                  <span>Upload from Device</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDeviceFileUpload}
                />
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
              />

              {imageUrl && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-[#F7F3EE] rounded-xl border border-[#EAE2DA]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-[#E2725B]/30"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#3C2F2F] block">Photo Ready</span>
                    <span className="text-[10px] text-[#8C7C7C] truncate block">{imageUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1 rounded-lg hover:bg-white text-xs text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
              Colors (comma separated)
            </label>
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              placeholder="terracotta, rust, cocoa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-sm text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                Use Cases (comma separated)
              </label>
              <input
                type="text"
                value={useCasesInput}
                onChange={(e) => setUseCasesInput(e.target.value)}
                placeholder="work, keynote, dinner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-sm text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                Emotional Vibe / Tags
              </label>
              <input
                type="text"
                value={emotionalTagsInput}
                onChange={(e) => setEmotionalTagsInput(e.target.value)}
                placeholder="confident, grounded, poise"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-sm text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE2DA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#5C4D4D] hover:bg-[#EAE2DA] transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3C2F2F] text-white text-sm font-bold hover:bg-[#261E1D] transition shadow-md"
            >
              Save to My Closet
            </button>
          </div>
        </form>
      </div>

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(imgData) => setImageUrl(imgData)}
        title="Snap Closet Piece"
      />
    </div>
  );
};
