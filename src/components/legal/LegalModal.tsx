import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Cookie, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { Language, translations } from '../../i18n/translations';

export type LegalTab = 'privacy' | 'terms' | 'security' | 'cookies';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  lang: Language;
}

export const LegalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white text-[#2D2424] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE2DA]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2725B]/15 text-[#E2725B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#E2725B]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3C2F2F]">
                Legal, Privacy & Compliance
              </h2>
              <p className="text-[11px] text-[#8C7C7C]">
                MEFE Platform Policies • Version 2.4 (Updated 2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F3EE] text-[#8C7C7C] hover:text-[#3C2F2F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#EAE2DA] bg-[#F7F3EE] px-4 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition shrink-0 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-[#E2725B] border-t-2 border-[#E2725B] shadow-2xs'
                : 'text-[#6C5D5D] hover:text-[#3C2F2F]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition shrink-0 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-[#E2725B] border-t-2 border-[#E2725B] shadow-2xs'
                : 'text-[#6C5D5D] hover:text-[#3C2F2F]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-[#E2725B] border-t-2 border-[#E2725B] shadow-2xs'
                : 'text-[#6C5D5D] hover:text-[#3C2F2F]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Data & Cloud Security</span>
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition shrink-0 cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-white text-[#E2725B] border-t-2 border-[#E2725B] shadow-2xs'
                : 'text-[#6C5D5D] hover:text-[#3C2F2F]'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Storage & Cookies</span>
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-[#4A3E3E] space-y-6 leading-relaxed">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-[#E2725B]/10 border border-[#E2725B]/20 text-[#3C2F2F]">
                <h3 className="font-bold text-sm text-[#E2725B] mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E2725B]" />
                  Our Privacy-First Commitment
                </h3>
                <p className="text-xs text-[#5C4D4D]">
                  MEFE is built on the philosophy that your wardrobe, personal style, and daily emotional reflections belong solely to you. We do not sell your personal data, wardrobe photographs, or private journal entries to advertisers or data brokers.
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">1. Information We Collect</h4>
                <p className="text-xs text-[#5C4D4D]">
                  When you use MEFE, we collect information you directly provide to manage your wardrobe and personal journal:
                </p>
                <ul className="text-xs list-disc pl-5 space-y-1 text-[#5C4D4D]">
                  <li><strong>Wardrobe Items & Imagery:</strong> Garment titles, category classifications, palette colors, wear frequency counts, and uploaded photos.</li>
                  <li><strong>Daily Style Journal:</strong> Daily emotional ratings (1–10), worn outfits, reflective personal notes, and mood tags.</li>
                  <li><strong>Account Credentials:</strong> Name, email address, profile photo URL, and language preference provided through registration or Google Sign-In.</li>
                  <li><strong>Cross-Device Telemetry:</strong> Device timestamps and sync tokens necessary to ensure your closet is updated simultaneously across your phone, tablet, and desktop.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">2. How Your Data Is Stored & Synchronized</h4>
                <p className="text-xs text-[#5C4D4D]">
                  MEFE operates on an offline-first architecture coupled with encrypted cloud synchronization. Data saved while offline is stored locally in your browser storage and queued to sync with our secure cloud database as soon as connectivity is restored.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">3. User Rights: Erasure, Export & Reset</h4>
                <p className="text-xs text-[#5C4D4D]">
                  In accordance with global privacy regulations (including GDPR and CCPA):
                </p>
                <ul className="text-xs list-disc pl-5 space-y-1 text-[#5C4D4D]">
                  <li><strong>Self-Service Reset:</strong> You can reset all wardrobe items and journal entries anytime through your Account Profile settings.</li>
                  <li><strong>Right to Erasure:</strong> Contacting our privacy desk or deleting your account immediately purges your records from active sync nodes.</li>
                  <li><strong>Data Portability:</strong> You may request or export your wardrobe records in open structured JSON format at any time.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">4. Contact Our Privacy Office</h4>
                <p className="text-xs text-[#5C4D4D]">
                  If you have questions regarding our data practices, contact us at <span className="font-semibold text-[#E2725B]">privacy@mefe.app</span>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">1. Agreement to Terms</h4>
                <p className="text-xs text-[#5C4D4D]">
                  By accessing or registering an account on MEFE ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may explore the platform using the sample Demo Profile without creating an account.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">2. User Content & Intellectual Property</h4>
                <p className="text-xs text-[#5C4D4D]">
                  You retain complete intellectual property ownership over photographs of garments, styling descriptions, and personal journal thoughts uploaded to the platform. By posting to the public Community Feed, you grant MEFE a non-exclusive license to display your look to fellow members within the application.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">3. Multi-Device Accounts & Security</h4>
                <p className="text-xs text-[#5C4D4D]">
                  You are responsible for safeguarding your credentials when signing in via email or Google Authentication. MEFE allows simultaneous sign-in across mobile, tablet, and desktop environments. Notify support immediately if you suspect unauthorized access.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">4. Acceptable Conduct</h4>
                <p className="text-xs text-[#5C4D4D]">
                  Members agree not to post abusive, unlawful, or infringing imagery on the social feed. The platform administration maintains automated filtering and moderator tools to protect community members.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">5. Service Availability & Modifications</h4>
                <p className="text-xs text-[#5C4D4D]">
                  We reserve the right to enhance or refine features to improve styling intelligence and system stability. Core personal archives remain backed up across our database clusters.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: DATA & CLOUD SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <h3 className="font-bold text-sm text-emerald-800 mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Enterprise-Grade Encryption & Isolation
                </h3>
                <p className="text-xs text-emerald-800">
                  Every wardrobe entry, capsule item, and mood score is isolated to your authenticated account ID with strict access-control layers.
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">1. Transport & Rest Encryption</h4>
                <p className="text-xs text-[#5C4D4D]">
                  All communications between client devices (phones, tablets, laptops) and cloud database endpoints occur exclusively over TLS 1.3 encrypted HTTPS. Data stored in the persistent database is encrypted at rest using industry-standard AES-256 protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">2. Role-Based Access Control (RBAC)</h4>
                <p className="text-xs text-[#5C4D4D]">
                  Database rules enforce strict user-scoped boundaries: standard members can only read and write their own wardrobe and journal documents. Administrative features are restricted strictly to verified platform administrators with immutable audit logging.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">3. Real-Time Multi-Device Sync Architecture</h4>
                <p className="text-xs text-[#5C4D4D]">
                  When you add a jacket on your phone while shopping, our cloud sync service commits the delta with timestamped version tags. Opening your laptop seamlessly pulls the latest revisions, preventing duplicate entries or data conflicts.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: COOKIE & STORAGE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">1. Essential Storage Only</h4>
                <p className="text-xs text-[#5C4D4D]">
                  MEFE relies primarily on modern browser <strong>LocalStorage</strong> and <strong>SessionStorage</strong> to enable offline access, instant rendering, and remember your session. We do not use third-party advertising cookies or cross-site tracking beacons.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">2. What Is Stored on Your Device?</h4>
                <ul className="text-xs list-disc pl-5 space-y-1.5 text-[#5C4D4D]">
                  <li><strong>Active Session Token:</strong> Remembers your authenticated user ID so you stay logged in between browser refreshes.</li>
                  <li><strong>Local Wardrobe Cache:</strong> Keeps a copy of your clothing items and outfits so the app loads instantly even with spotty cellular connection.</li>
                  <li><strong>Language Preference:</strong> Preserves your selected interface language (English, French, or Spanish).</li>
                  <li><strong>Offline Queue:</strong> Holds new entries created without an internet connection until cloud synchronization re-establishes.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-[#3C2F2F]">3. Clearing Your Local Data</h4>
                <p className="text-xs text-[#5C4D4D]">
                  You can clear your local storage at any time via your browser settings or by utilizing the self-service "Reset Account Data" button in your MEFE profile.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#EAE2DA] bg-[#FDFBF7] flex items-center justify-between">
          <div className="text-[11px] text-[#8C7C7C]">
            Questions? Contact <span className="text-[#3C2F2F] font-semibold">legal@mefe.app</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3C2F2F] hover:bg-[#261E1D] text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
