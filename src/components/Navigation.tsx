import React from 'react';
import { Home, Shirt, Layers, BookOpen, Menu as MenuIcon, BarChart3, Shield, Sparkles } from 'lucide-react';
import { translations, Language } from '../i18n/translations';
import { UserRole } from '../types';

export type NavTab = 'home' | 'closet' | 'outfits' | 'journal' | 'insights' | 'menu';

interface Props {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  userRole: UserRole;
  onOpenAdmin: () => void;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onTabChange,
  language,
  userRole,
  onOpenAdmin,
}) => {
  const t = translations[language] || translations.en;

  // Desktop navigation items
  const desktopNavItems = [
    { id: 'home' as NavTab, label: t.navHome, icon: Home },
    { id: 'closet' as NavTab, label: t.navCloset, icon: Shirt },
    { id: 'outfits' as NavTab, label: t.navOutfits, icon: Layers },
    { id: 'journal' as NavTab, label: t.navJournal, icon: BookOpen },
    { id: 'insights' as NavTab, label: t.navInsights, icon: BarChart3 },
    { id: 'menu' as NavTab, label: t.navMenu, icon: MenuIcon },
  ];

  // Mobile navigation items strictly 5 sticky icons: Home, Closet, Outfits, Journal, Menu (Hamburger icon)
  const mobileNavItems = [
    { id: 'home' as NavTab, label: t.navHome, icon: Home },
    { id: 'closet' as NavTab, label: t.navCloset, icon: Shirt },
    { id: 'outfits' as NavTab, label: t.navOutfits, icon: Layers },
    { id: 'journal' as NavTab, label: t.navJournal, icon: BookOpen },
    { id: 'menu' as NavTab, label: t.navMenu, icon: MenuIcon },
  ];

  return (
    <>
      {/* Desktop Vertical Sidebar (>=768px) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#EAE2DA] bg-[#FDFBF7] p-5 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C7C] px-3 mb-2">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E2725B] text-white shadow-md shadow-[#E2725B]/25'
                      : 'text-[#5C4D4D] hover:bg-[#F7F3EE] hover:text-[#3C2F2F]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8C7C7C]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mindful Capsule Wardrobe Tip */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-[#3C2F2F] to-[#261E1D] text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1.5 text-[#E2725B]">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider">Mindful Style</span>
          </div>
          <p className="text-xs text-[#EAE2DA] mb-3 leading-relaxed">
            Record what you wear and track how silhouettes harmonize with daily emotional clarity.
          </p>
          <button
            onClick={() => onTabChange('journal')}
            className="w-full py-2 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] transition shadow-sm cursor-pointer"
          >
            Today's Log
          </button>
        </div>

        {/* Admin Shortcut if admin */}
        {userRole === 'admin' && (
          <div className="mt-4 pt-4 border-t border-[#EAE2DA]">
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 transition cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>{t.navAdmin}</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Sticky Bottom Navigation (<768px): 5 Facebook-style sticky icons */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-lg border-t border-[#EAE2DA] px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-lg">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition cursor-pointer ${
                  isActive ? 'text-[#E2725B]' : 'text-[#8C7C7C] hover:text-[#3C2F2F]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition ${
                    isActive ? 'bg-[#E2725B]/15 text-[#E2725B]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
