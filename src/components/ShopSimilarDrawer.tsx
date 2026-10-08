import React, { useState } from 'react';
import { X, Search, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import { Retailer } from '../types';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  lang: Language;
}

export const ShopSimilarDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  initialQuery = '',
  lang,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const retailers = storage.getRetailers().filter((r) => r.isActive);
  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  const buildSearchUrl = (retailer: Retailer) => {
    const encoded = encodeURIComponent(query.trim() || 'terracotta blazer');
    return retailer.searchUrlTemplate
      .replace('{query}', encoded)
      .replace('{affiliateId}', encodeURIComponent(retailer.affiliateId));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#E2725B]/20 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE2DA] bg-[#F7F3EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2725B] text-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3C2F2F]">Shop The Look</h2>
              <p className="text-xs text-[#7A6A6A]">Affiliate search across curated partners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A6A6A] hover:bg-[#EAE2DA] hover:text-[#3C2F2F] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input for drawer */}
        <div className="p-4 border-b border-[#EAE2DA] bg-white">
          <label className="text-xs font-semibold text-[#5C4D4D] uppercase tracking-wider block mb-1.5">
            Keywords to Match
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Terracotta tailored blazer, silk cowl top..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D9CFC4] bg-[#FDFBF7] text-sm text-[#3C2F2F] focus:outline-none focus:border-[#E2725B] focus:ring-2 focus:ring-[#E2725B]/20"
            />
          </div>
        </div>

        {/* Retailers list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-[#7A6A6A] px-1">
            <span>Available Verified Retailers ({retailers.length})</span>
            <span className="flex items-center gap-1 text-[#E2725B]">
              <Sparkles className="w-3 h-3" /> Live affiliate outlinks
            </span>
          </div>

          {retailers.map((ret) => {
            const url = buildSearchUrl(ret);
            return (
              <a
                key={ret.retailerId}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EAE2DA] hover:border-[#E2725B] hover:shadow-md transition"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={ret.logoUrl}
                    alt={`${ret.name} store logo`}
                    className="w-11 h-11 rounded-xl object-cover border border-[#EAE2DA]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#3C2F2F] group-hover:text-[#E2725B] transition">
                      {ret.name}
                    </h3>
                    <p className="text-xs text-[#7A6A6A] truncate max-w-[200px]">
                      Search for "{query || 'curated items'}"
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#5C4D4D] group-hover:bg-[#E2725B] group-hover:text-white transition">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-4 border-t border-[#EAE2DA] bg-[#F7F3EE] text-center text-xs text-[#8C7C7C]">
          Outlinks open in a new window with partner token tags. No personal closet metadata is shared with retailers.
        </div>
      </div>
    </div>
  );
};
