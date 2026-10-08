import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Sparkles,
  LogOut,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { User } from '../../types';
import { storage } from '../../services/storageService';
import { Language, translations } from '../../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAuthSuccess: (user: User) => void;
  onLogout: () => void;
  lang: Language;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'security' | 'cookies') => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  lang,
  onOpenLegal,
}) => {
  // Tabs: 'google' (Google Sign In Screen), 'email' (Email / Password), 'signup' (Create account)
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'signup'>('google');

  // Custom Google account input
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Known Google Accounts to pick from
  const GOOGLE_ACCOUNTS = [
    {
      email: 'oharajoshua333@gmail.com',
      displayName: "Joshua O'Hara (Admin)",
      photoURL:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badge: 'Super Admin',
      role: 'admin' as const,
      isRootAdmin: true,
    },
    {
      email: 'camille@cosmostyle.com',
      displayName: 'Camille Laurent',
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badge: 'Curator',
      role: 'user' as const,
      isRootAdmin: false,
    },
    {
      email: 'maya.lin@mefe.app',
      displayName: 'Maya Lin',
      photoURL:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      badge: 'Creator',
      role: 'user' as const,
      isRootAdmin: false,
    },
  ];

  const handleSelectGoogleAccount = (acc: typeof GOOGLE_ACCOUNTS[0]) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const googleUser = storage.signInWithGoogle({
        email: acc.email,
        displayName: acc.displayName,
        photoURL: acc.photoURL,
      });
      setSuccessMsg(`Signed in with Google as ${acc.displayName}!`);
      setTimeout(() => {
        onAuthSuccess(googleUser);
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      setError('Please provide your Google email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const emailLower = customGoogleEmail.trim().toLowerCase();
      const isAdmin = emailLower === 'oharajoshua333@gmail.com';
      const name =
        customGoogleName.trim() ||
        (isAdmin ? "Joshua O'Hara (Admin)" : emailLower.split('@')[0]);

      const photoURL = isAdmin
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

      const googleUser = storage.signInWithGoogle({
        email: emailLower,
        displayName: name,
        photoURL,
      });

      setSuccessMsg(`Signed in with Google as ${googleUser.displayName}!`);
      setTimeout(() => {
        onAuthSuccess(googleUser);
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const user = storage.signInUserByEmail(
        email,
        displayName || undefined,
        undefined
      );
      setSuccessMsg(
        activeTab === 'signup'
          ? 'Account created and signed in!'
          : 'Signed in successfully!'
      );
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white text-[#2D2424] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE2DA]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E2725B] to-[#3C2F2F] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3C2F2F] leading-tight">
                MEFE Authentication
              </h3>
              <p className="text-[11px] text-[#8C7C7C]">Secure Sign In & Account Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F3EE] text-[#8C7C7C] hover:text-[#3C2F2F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Status Bar */}
        <div className="p-3.5 mx-6 mt-4 rounded-2xl bg-[#F7F3EE] border border-[#EAE2DA] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#E2725B]/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#3C2F2F] truncate">
                  {currentUser.displayName}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 border border-amber-500/40">
                    <Shield className="w-2.5 h-2.5" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#8C7C7C] truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              setSuccessMsg('Signed out of active session.');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-medium transition cursor-pointer shrink-0"
            title="Log Out of this account"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4">
          <div className="flex bg-[#F7F3EE] p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('google');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'google'
                  ? 'bg-white text-[#3C2F2F] shadow-xs'
                  : 'text-[#8C7C7C] hover:text-[#3C2F2F]'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Google Sign In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('email');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-white text-[#3C2F2F] shadow-xs'
                  : 'text-[#8C7C7C] hover:text-[#3C2F2F]'
              }`}
            >
              Email Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-[#3C2F2F] shadow-xs'
                  : 'text-[#8C7C7C] hover:text-[#3C2F2F]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        <div className="px-6 pt-3">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Authentic Google Login Screen & Account Chooser */}
        {activeTab === 'google' && (
          <div className="p-6 pt-3 space-y-4">
            <div className="text-center pb-2">
              <h4 className="text-sm font-bold text-[#3C2F2F]">Choose an account</h4>
              <p className="text-xs text-[#8C7C7C]">to continue to MEFE (mefe.app)</p>
            </div>

            {/* List of Google Accounts */}
            <div className="space-y-2">
              {GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-2xl border border-[#D9CFC4] hover:border-[#4285F4] hover:bg-[#F8FAFC] transition text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={acc.photoURL}
                      alt={acc.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#D9CFC4] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#3C2F2F] group-hover:text-[#1E40AF]">
                          {acc.displayName}
                        </span>
                        {acc.isRootAdmin && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Super Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C7C7C] truncate">{acc.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C7C7C] group-hover:text-[#4285F4] transition shrink-0" />
                </button>
              ))}

              {/* Use Another Google Account option */}
              {!showCustomGoogleInput ? (
                <button
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-[#D9CFC4] hover:border-[#4285F4] hover:bg-[#F8FAFC] text-left flex items-center gap-3 text-xs font-semibold text-[#5C4D4D] hover:text-[#1E40AF] transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F7F3EE] border border-[#D9CFC4] flex items-center justify-center text-[#8C7C7C]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold">Use another Google account</span>
                    <span className="text-[10px] text-[#8C7C7C]">Sign in with your personal Google email</span>
                  </div>
                </button>
              ) : (
                <form
                  onSubmit={handleCustomGoogleSignIn}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#4285F4]/40 space-y-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1E40AF]">
                      Enter Google Account Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="text-[10px] text-[#8C7C7C] hover:text-[#3C2F2F]"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C4D4D] uppercase mb-1">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="e.g., yourname@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C4D4D] uppercase mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="e.g., Alex Johnson"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#4285F4] text-white text-xs font-bold hover:bg-[#3367D6] transition shadow-sm cursor-pointer"
                  >
                    Continue with Google
                  </button>
                </form>
              )}
            </div>

            {/* Google OAuth Disclosure */}
            <div className="pt-2 text-center text-[10px] text-[#8C7C7C] leading-relaxed">
              <p>
                To continue, Google will share your name, email address, language preference, and profile picture with MEFE.
              </p>
              <div className="mt-1 flex items-center justify-center gap-3 text-[#5C4D4D] font-medium">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLegal) onOpenLegal('privacy');
                  }}
                  className="hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLegal) onOpenLegal('terms');
                  }}
                  className="hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 & 3: Email Sign In or Sign Up Form */}
        {(activeTab === 'email' || activeTab === 'signup') && (
          <div className="p-6 pt-3">
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#5C4D4D] uppercase tracking-wider mb-1">
                    Full Name / Handle
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g., Joshua O'Hara"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#5C4D4D] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5C4D4D] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] transition shadow-md shadow-[#E2725B]/20 cursor-pointer disabled:opacity-50"
              >
                {activeTab === 'signup' ? 'Create Account & Enter' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-[#EAE2DA] text-center">
              <button
                type="button"
                onClick={() => setActiveTab('google')}
                className="text-xs font-bold text-[#4285F4] hover:underline"
              >
                Prefer 1-Click Google Sign In? Click here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
