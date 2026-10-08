import React from 'react';
import {
  BarChart3,
  Shield,
  Sparkles,
  ShoppingBag,
  UserCheck,
  Globe,
  Download,
  ExternalLink,
  ChevronRight,
  Heart,
  Palette,
  Award,
  Users,
  LogOut,
  RotateCcw,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { User, Insight } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { PWAInstallButton } from '../PWAInstallButton';
import { storage } from '../../services/storageService';

interface Props {
  user: User;
  insights: Insight[];
  onNavigateToInsights: () => void;
  onOpenShopSimilar: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onSwitchUserRole: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenFriends?: () => void;
  onOpenAuth?: () => void;
  onResetAccountData?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'security' | 'cookies') => void;
}

export const MenuScreen: React.FC<Props> = ({
  user,
  insights,
  onNavigateToInsights,
  onOpenShopSimilar,
  onOpenAdmin,
  onOpenProfile,
  onSwitchUserRole,
  language,
  onLanguageChange,
  onOpenFriends,
  onOpenAuth,
  onResetAccountData,
  onOpenLegal,
}) => {
  const currentInsight = insights[0];
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [resetMessage, setResetMessage] = React.useState<string | null>(null);

  const handleResetData = () => {
    storage.resetUserAccountData(user.uid);
    setShowResetConfirm(false);
    setResetMessage('Account data reset! Closet, outfits, and journals cleared.');
    if (onResetAccountData) onResetAccountData();
    setTimeout(() => setResetMessage(null), 3500);
  };
  const t = translations[language] || translations.en;

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div>
        <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
          {t.navMenu}
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6A6A]">
          Access empirical wardrobe telemetry, profile settings, and system tools.
        </p>
      </div>

      {/* User Card */}
      <div
        onClick={onOpenProfile}
        className="p-4 rounded-3xl bg-white border border-[#EAE2DA] hover:border-[#E2725B] shadow-sm flex items-center justify-between cursor-pointer group transition"
      >
        <div className="flex items-center gap-3.5">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E2725B]/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#3C2F2F] group-hover:text-[#E2725B] transition">
                {user.displayName}
              </h3>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3C2F2F] text-amber-300">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#8C7C7C]">{user.email}</p>
            <p className="text-[11px] font-bold text-[#E2725B] mt-0.5">
              {user.isPremium ? '★ Premium Entitlement Active' : 'Standard Member'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#8C7C7C] group-hover:translate-x-1 transition" />
      </div>

      {/* Primary Feature 1: Data & Insights Tab - Prominent Access */}
      <div
        onClick={onNavigateToInsights}
        className="p-5 rounded-3xl bg-gradient-to-br from-[#E2725B] to-[#C9533B] text-white shadow-xl hover:shadow-2xl cursor-pointer group transition transform hover:-translate-y-0.5"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">
                Empirical Telemetry
              </span>
              <h3 className="font-serif font-extrabold text-lg sm:text-xl text-white">
                {t.navInsights}
              </h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition" />
        </div>

        <p className="text-xs text-white/90 mt-2.5 leading-relaxed">
          Wardrobe telemetry, wear frequency tracking, mood correlations, and mindful style pattern synthesis.
        </p>

        {/* Telemetry teaser */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-200" />
            <span>Power Color: <strong>{currentInsight?.powerColor || 'Terracotta'}</strong></span>
          </div>
          <span className="font-bold underline text-amber-200">Open Analytics &rarr;</span>
        </div>
      </div>

      {/* Feature 2: Cloud Sync & Multi-Device Access */}
      <div
        onClick={onOpenProfile}
        className="p-4 sm:p-5 rounded-3xl bg-[#3C2F2F] text-white shadow-lg hover:shadow-xl cursor-pointer group transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E2725B] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-white">
              Multi-Device Cloud Sync
            </h3>
            <p className="text-xs text-amber-200/90">
              Access your digital closet and mood journal across phones, tablets & desktop.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition" />
      </div>

      {/* Feature 3: Shop Similar / Retailer Drawer */}
      <div
        onClick={onOpenShopSimilar}
        className="p-4 rounded-3xl bg-white border border-[#EAE2DA] hover:border-[#E2725B] shadow-sm cursor-pointer group transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F7F3EE] flex items-center justify-center text-[#E2725B]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#3C2F2F] group-hover:text-[#E2725B] transition">
              Shop The Look Retailer Drawer
            </h3>
            <p className="text-xs text-[#7A6A6A]">
              Search active partner stores (Nordstrom, ASOS, Revolve, Farfetch).
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#8C7C7C] group-hover:translate-x-1 transition" />
      </div>

      {/* Feature: Friends & Community Management */}
      <div
        onClick={onOpenFriends}
        className="p-4 rounded-3xl bg-white border border-[#EAE2DA] hover:border-[#E2725B] shadow-sm cursor-pointer group transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F7F3EE] flex items-center justify-center text-[#E2725B]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#3C2F2F] group-hover:text-[#E2725B] transition">
              Friends & Style Circle
            </h3>
            <p className="text-xs text-[#7A6A6A]">
              Friend, unfriend, or block community members. Filter feeds by friends & admin.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#8C7C7C] group-hover:translate-x-1 transition" />
      </div>

      {/* Google Authentication & Sign-In */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2DA] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h4 className="text-xs font-bold text-[#3C2F2F]">Google & Cloud Login</h4>
              <p className="text-[11px] text-[#7A6A6A]">Signed in as {user.email}</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-xl bg-[#3C2F2F] text-white hover:bg-[#251D1D] text-xs font-bold transition cursor-pointer"
          >
            Manage / Sign In
          </button>
        </div>
      </div>

      {/* Reset Account Data Feature */}
      <div className="p-4 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold text-rose-900">Reset Account Data</h4>
          </div>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Reset Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
        <p className="text-[11px] text-rose-700 leading-normal">
          Wipes closet items, saved outfits, and mood journal entries for this user. Your login remains active.
        </p>
        {resetMessage && (
          <p className="text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-xl border border-emerald-300">
            {resetMessage}
          </p>
        )}
      </div>

      {/* Hidden Feature 4: Admin Dashboard (Only visible if Firebase recognizes user as Admin) */}
      {user.role === 'admin' ? (
        <div
          onClick={onOpenAdmin}
          className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border-2 border-amber-500/40 shadow-sm cursor-pointer group transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3C2F2F] flex items-center justify-center text-amber-300 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
                  Admin Authority
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#3C2F2F]">
                {t.adminTitle}
              </h3>
              <p className="text-xs text-[#5C4D4D]">
                Manage users, grant VIP, moderate accounts & generate 1-line popups.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#3C2F2F] group-hover:translate-x-1 transition" />
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#F7F3EE] border border-dashed border-[#D9CFC4] text-center">
          <p className="text-xs text-[#7A6A6A]">
            Current account is standard user mode. (Switch to Admin mode below to inspect the Admin Dashboard).
          </p>
        </div>
      )}

      {/* Quick Demo Switcher */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2DA] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D]">
            Switch Account Role (Demo Mode)
          </span>
          <button
            onClick={onSwitchUserRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#3C2F2F] text-white hover:bg-[#251D1D] transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Switch to {user.role === 'admin' ? 'Camille (User)' : 'Joshua (Admin)'}</span>
          </button>
        </div>

        {/* Language selector in menu */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F5EFEB]">
          <span className="text-xs text-[#5C4D4D] flex items-center gap-1.5 font-medium">
            <Globe className="w-4 h-4 text-[#8C7C7C]" />
            App Language (i18n):
          </span>
          <div className="flex items-center gap-1 bg-[#F7F3EE] p-1 rounded-xl border border-[#D9CFC4]">
            {(['en', 'fr', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                  language === l ? 'bg-[#E2725B] text-white shadow-2xs' : 'text-[#5C4D4D] hover:bg-[#EAE2DA]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
