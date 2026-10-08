import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Sparkles,
  Award,
  Globe,
  Edit3,
  Heart,
  RotateCcw,
  LogOut,
  Check,
  AlertTriangle,
  Cloud,
  Loader2,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { User } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { storage } from '../../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
  onSwitchUser: (uid: string) => void;
  allUsers: User[];
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onResetAccountData?: () => void;
  onSyncCloud?: () => void;
  isSyncing?: boolean;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSwitchUser,
  allUsers,
  lang,
  onLanguageChange,
  onOpenAuth,
  onLogout,
  onResetAccountData,
  onSyncCloud,
  isSyncing = false,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const t = translations[lang] || translations.en;
  const isDemoUser = user.isDemo || user.uid === 'user_camille';

  if (!isOpen) return null;

  const handleResetData = () => {
    storage.resetUserAccountData(user.uid);
    setResetMessage('Account closet, outfits, entries, and posts reset successfully!');
    setShowResetConfirm(false);
    if (onResetAccountData) {
      onResetAccountData();
    }
    setTimeout(() => {
      setResetMessage(null);
    }, 4000);
  };

  const handleSave = () => {
    const updated: User = {
      ...user,
      displayName,
      bio,
      updatedAt: new Date().toISOString(),
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleManualSync = async () => {
    if (onSyncCloud) {
      onSyncCloud();
    } else {
      const res = await storage.syncToCloud(user.uid);
      setSyncStatusMsg(res.message);
      setTimeout(() => setSyncStatusMsg(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white text-[#2D2424] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE2DA]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif font-bold text-lg text-[#3C2F2F]">
              Profile & Settings
            </h2>
            {isDemoUser && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900">
                Demo Profile
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F7F3EE] text-[#8C7C7C] hover:text-[#3C2F2F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* User Hero Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E2725B]"
              />
              {user.role === 'admin' && (
                <div
                  className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-white shadow-xs"
                  title="Administrator Privileges"
                >
                  <Shield className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#3C2F2F] leading-tight">
                  {user.displayName}
                </h3>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 border border-amber-500/40">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8C7C7C]">{user.email}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#5C4D4D]">
                <span className="capitalize">{user.status.reason}</span>
                <span>•</span>
                <span>Role: <strong className="capitalize">{user.role}</strong></span>
              </div>
            </div>
          </div>

          {/* Followers / Following Stats */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white border border-[#EAE2DA] text-center">
            <div>
              <p className="font-bold text-base text-[#3C2F2F]">{user.followersCount}</p>
              <p className="text-[10px] text-[#8C7C7C] uppercase font-bold">Followers</p>
            </div>
            <div>
              <p className="font-bold text-base text-[#3C2F2F]">{user.followingCount}</p>
              <p className="text-[10px] text-[#8C7C7C] uppercase font-bold">Following</p>
            </div>
          </div>

          {/* Cloud Database Sync & Multi-Device Card */}
          <div className="p-4 rounded-2xl bg-[#F7F3EE] border border-[#EAE2DA] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3C2F2F]">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>Multi-Device Cloud Database Sync</span>
              </div>
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9CFC4] hover:border-[#E2725B] text-xs font-bold text-[#3C2F2F] transition cursor-pointer shadow-2xs"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#E2725B] animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5 text-[#E2725B]" />
                )}
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#7A6A6A] leading-relaxed">
              Your garments, outfits, and mood journal entries are synchronized across your devices. Sign into this account on your phone, tablet, or laptop to access your synced wardrobe.
            </p>
            {syncStatusMsg && (
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {syncStatusMsg}
              </p>
            )}
          </div>

          {/* Bio section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D]">
                Bio / Style Philosophy
              </label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-[#E2725B] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  className="w-full p-2 text-xs rounded-xl border border-[#D9CFC4] bg-white text-[#3C2F2F]"
                />
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#D9CFC4] bg-white text-[#3C2F2F]"
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-[#3C2F2F] text-white text-xs font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#4A3E3E] italic p-3 rounded-2xl bg-[#F7F3EE] border border-[#EAE2DA]">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Account Authentication & Google Sign-In */}
          <div className="pt-3 border-t border-[#EAE2DA] space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block">
              Authentication & Session Management
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#D9CFC4] bg-white hover:bg-[#F7F3EE] text-xs font-bold text-[#3C2F2F] transition cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>{isDemoUser ? 'Sign In / Register' : 'Switch Account'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLogout) {
                    onLogout();
                  } else if (onOpenAuth) {
                    onOpenAuth();
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition cursor-pointer"
                title="Log out and return to Demo Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Reset Account Data Section */}
          <div className="pt-3 border-t border-[#EAE2DA]">
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Reset Account Data
                </span>
                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition cursor-pointer"
                  >
                    Reset Data
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-600 border border-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-700 text-white shadow-xs"
                    >
                      Confirm Reset
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-rose-700 leading-tight">
                Clear all custom closet items, saved outfits, mood journal entries, and personal looks. Keeps your account login active.
              </p>
              {resetMessage && (
                <p className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {resetMessage}
                </p>
              )}
            </div>
          </div>

          {/* Switch Active Account (Demo Profiles) */}
          <div className="pt-2 border-t border-[#EAE2DA]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-2">
              Available Profiles on Device:
            </label>
            <div className="space-y-2">
              {allUsers.map((u) => (
                <button
                  key={u.uid}
                  onClick={() => onSwitchUser(u.uid)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                    u.uid === user.uid
                      ? 'border-[#E2725B] bg-[#E2725B]/10 font-bold'
                      : 'border-[#EAE2DA] bg-white hover:border-[#8C7C7C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs text-[#3C2F2F] font-bold">{u.displayName}</p>
                      <p className="text-[10px] text-[#8C7C7C]">
                        {u.uid === 'user_camille' ? 'Demo Profile (Sample Wardrobe)' : u.role === 'admin' ? 'Platform Admin' : 'Member Account'}
                      </p>
                    </div>
                  </div>
                  {u.uid === user.uid && <UserCheck className="w-4 h-4 text-[#E2725B]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto px-6 py-3 border-t border-[#EAE2DA] flex justify-end bg-[#FDFBF7]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3C2F2F] text-white text-xs font-bold cursor-pointer hover:bg-[#261E1D] transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
