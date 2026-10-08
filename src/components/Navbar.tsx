import React, { useState } from 'react';
import { Search, Globe, Shield, Cloud, CloudCheck, Loader2, LogOut, Sparkles } from 'lucide-react';
import { User } from '../types';
import { translations, Language } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { MefeSymbol } from './MefeSymbol';

interface Props {
  user: User;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onSwitchUserRole: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onSyncCloud?: () => void;
  isSyncing?: boolean;
}

export const Navbar: React.FC<Props> = ({
  user,
  searchQuery,
  onSearchChange,
  language,
  onLanguageChange,
  onOpenProfile,
  onOpenAdmin,
  onSwitchUserRole,
  onOpenAuth,
  onLogout,
  onSyncCloud,
  isSyncing = false,
}) => {
  const t = translations[language] || translations.en;
  const isDemoUser = user.isDemo || user.uid === 'user_camille';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE2DA] bg-[#FDFBF7]/90 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2725B] to-[#3C2F2F] flex items-center justify-center text-white shadow-md shadow-[#E2725B]/25">
            <MefeSymbol className="w-5 h-5 text-amber-200" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif font-extrabold text-base tracking-tight text-[#3C2F2F] leading-none">
              MEFE
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E2725B]">
              Mindful Wardrobe
            </span>
          </div>

          {/* Demo Profile Badge */}
          {isDemoUser && (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[10px] font-bold"
              title="You are currently exploring with sample demo wardrobe data. Create an account to start your clean personal collection."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Demo Mode</span>
            </div>
          )}
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search garments, moods, colors..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white border border-[#D9CFC4] text-xs text-[#2D2424] placeholder-[#8C7C7C] focus:outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] transition shadow-2xs"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Cloud Database Sync Button */}
          {onSyncCloud && (
            <button
              onClick={onSyncCloud}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-[#D9CFC4] hover:bg-[#FAF8F5] text-xs text-[#5C4D4D] transition cursor-pointer shadow-2xs group"
              title="Sync with cloud database across multiple devices"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 text-[#E2725B] animate-spin" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition" />
              )}
              <span className="hidden xl:inline text-[11px] font-medium">
                {isSyncing ? 'Syncing...' : 'Cloud Synced'}
              </span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-[#8C7C7C] absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              aria-label="Language"
              className="pl-6 pr-2 py-1 rounded-full bg-white border border-[#D9CFC4] text-[11px] font-semibold text-[#5C4D4D] focus:outline-none focus:border-[#E2725B] cursor-pointer shadow-2xs appearance-none"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
          </div>

          {/* Admin Console Button (if admin role) */}
          {user.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              title={t.navAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#3C2F2F] text-amber-300 hover:bg-[#261E1D] transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">{t.navAdmin}</span>
            </button>
          )}

          {/* PWA Install */}
          <PWAInstallButton lang={language} />

          {/* Sign In / Switch Account Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs ${
                isDemoUser
                  ? 'bg-[#E2725B] text-white hover:bg-[#D46049] shadow-sm shadow-[#E2725B]/20'
                  : 'bg-white border border-[#D9CFC4] hover:bg-[#FAF8F5] text-[#3C2F2F]'
              }`}
              title={isDemoUser ? 'Create account or Sign In' : 'Account Management'}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>
                {isDemoUser ? 'Sign In / Register' : 'Account'}
              </span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#E2725B]/40 transition relative group"
            title={`${user.displayName} • Profile & Settings`}
          >
            <div className="relative">
              <img
                src={user.photoURL}
                alt={`${user.displayName} profile picture`}
                className="w-8 h-8 rounded-full object-cover border border-[#E2725B]/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
