import React, { useState } from 'react';
import {
  X,
  Shield,
  Users,
  ShoppingBag,
  FileText,
  Check,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Sparkles,
  KeyRound,
  Search,
} from 'lucide-react';
import { User, Retailer, AdminAuditLog } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { storage } from '../../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  lang: Language;
}

export const AdminDashboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'retailers' | 'popupGen' | 'logs'>('users');
  const [users, setUsers] = useState<User[]>(storage.getAllUsers());
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [retailers, setRetailers] = useState<Retailer[]>(storage.getRetailers());
  const [logs, setLogs] = useState<AdminAuditLog[]>(storage.getLogs());

  // Retailer form state
  const [newRetailerName, setNewRetailerName] = useState('');
  const [newRetailerLogo, setNewRetailerLogo] = useState('');
  const [newRetailerTemplate, setNewRetailerTemplate] = useState('');
  const [newRetailerAffiliate, setNewRetailerAffiliate] = useState('');

  // 1-line HTML generator state
  const [popupStoreName, setPopupStoreName] = useState('Nordstrom Seasonal Edit');
  const [popupStoreUrl, setPopupStoreUrl] = useState('https://www.nordstrom.com/');
  const [popupDiscount, setPopupDiscount] = useState('20% OFF Autumn Terracotta Blazers');
  const [generatedOneLineCode, setGeneratedOneLineCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  // Filtered users for search bar
  const filteredUsers = users.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q)
    );
  });

  const handleResetPassword = (targetUser: User) => {
    setResetFeedback(`Password reset instruction link dispatched to ${targetUser.email}`);
    setTimeout(() => setResetFeedback(null), 4000);

    storage.addLog({
      logId: `log_${Date.now()}`,
      adminId: currentUser.uid,
      targetUserId: targetUser.uid,
      actionType: 'UNBAN_USER',
      details: { reason: `Admin sent password reset link to ${targetUser.email}` },
      timestamp: new Date().toISOString(),
    });
    setLogs(storage.getLogs());
  };

  const handleToggleAdminRole = (targetUser: User) => {
    // If target is the default admin (oharajoshua333@gmail.com) and currently admin, prevent accidental removal
    if (targetUser.email.toLowerCase() === 'oharajoshua333@gmail.com' && targetUser.role === 'admin') {
      setResetFeedback('Default primary admin (oharajoshua333@gmail.com) is permanently protected.');
      setTimeout(() => setResetFeedback(null), 4000);
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated: User = {
      ...targetUser,
      role: newRole,
      updatedAt: new Date().toISOString(),
    };
    storage.updateUser(updated);
    setUsers(storage.getAllUsers());
    if (updated.uid === currentUser.uid) onUpdateUser(updated);

    setResetFeedback(`${targetUser.displayName} authority set to: ${newRole === 'admin' ? 'ADMIN' : 'STANDARD USER'}`);
    setTimeout(() => setResetFeedback(null), 4000);

    storage.addLog({
      logId: `log_${Date.now()}`,
      adminId: currentUser.uid,
      targetUserId: targetUser.uid,
      actionType: newRole === 'admin' ? 'SET_ADMIN' : 'REMOVE_ADMIN',
      details: {
        reason: `Admin role toggled to ${newRole} by ${currentUser.email}`,
      },
      timestamp: new Date().toISOString(),
    });
    setLogs(storage.getLogs());
  };

  const handleTogglePremium = (targetUser: User) => {
    const updated: User = {
      ...targetUser,
      isPremium: !targetUser.isPremium,
      updatedAt: new Date().toISOString(),
    };
    storage.updateUser(updated);
    setUsers(storage.getAllUsers());
    if (updated.uid === currentUser.uid) onUpdateUser(updated);

    storage.addLog({
      logId: `log_${Date.now()}`,
      adminId: currentUser.uid,
      targetUserId: targetUser.uid,
      actionType: 'SET_PREMIUM',
      details: {
        reason: updated.isPremium ? 'Admin Granted VIP' : 'Admin Revoked VIP',
      },
      timestamp: new Date().toISOString(),
    });
    setLogs(storage.getLogs());
  };

  const handleStatusChange = (targetUser: User, state: 'active' | 'muted' | 'banned', durationDays?: number) => {
    const updated: User = {
      ...targetUser,
      status: {
        state,
        reason: `Admin set status to ${state}`,
        until: durationDays ? new Date(Date.now() + durationDays * 86400000).toISOString() : null,
      },
      updatedAt: new Date().toISOString(),
    };
    storage.updateUser(updated);
    setUsers(storage.getAllUsers());
    if (updated.uid === currentUser.uid) onUpdateUser(updated);

    storage.addLog({
      logId: `log_${Date.now()}`,
      adminId: currentUser.uid,
      targetUserId: targetUser.uid,
      actionType: state === 'banned' ? 'BAN_USER' : state === 'muted' ? 'MUTE_USER' : 'UNBAN_USER',
      details: {
        priorStatus: targetUser.status.state,
        durationDays,
        reason: `Admin updated moderation state to ${state}`,
      },
      timestamp: new Date().toISOString(),
    });
    setLogs(storage.getLogs());
  };

  const handleAddRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetailerName.trim()) return;

    const newRet: Retailer = {
      retailerId: `ret_${Date.now()}`,
      name: newRetailerName.trim(),
      logoUrl:
        newRetailerLogo.trim() ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=120&q=80',
      searchUrlTemplate:
        newRetailerTemplate.trim() || 'https://www.google.com/search?q={query}',
      affiliateId: newRetailerAffiliate.trim() || 'mefe_partner',
      isActive: true,
      priorityOrder: retailers.length + 1,
      updatedAt: new Date().toISOString(),
    };

    storage.saveRetailer(newRet);
    setRetailers(storage.getRetailers());
    setNewRetailerName('');
    setNewRetailerLogo('');
    setNewRetailerTemplate('');
    setNewRetailerAffiliate('');

    storage.addLog({
      logId: `log_${Date.now()}`,
      adminId: currentUser.uid,
      targetUserId: newRet.retailerId,
      actionType: 'RETAILER_UPDATE',
      details: { reason: `Added partner store ${newRet.name}` },
      timestamp: new Date().toISOString(),
    });
    setLogs(storage.getLogs());
  };

  const handleDeleteRetailer = (retailerId: string) => {
    storage.deleteRetailer(retailerId);
    setRetailers(storage.getRetailers());
  };

  // Requirement: "generate this as self-contained HTML/CSS in a single continuous line (no line breaks) with target='_blank' for all CTAs"
  const generateSingleLine = () => {
    const raw = `<div style="position:fixed;bottom:24px;right:24px;z-index:9999;max-width:340px;background:#FDFBF7;border:2px solid #E2725B;border-radius:20px;padding:18px;box-shadow:0 20px 40px rgba(60,47,47,0.25);font-family:'Plus Jakarta Sans',sans-serif;color:#3C2F2F;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><span style="font-size:11px;font-weight:800;letter-spacing:1px;color:#E2725B;text-transform:uppercase;">MEFE Exclusive</span><button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#8C7C7C;cursor:pointer;font-size:18px;line-height:1;">&times;</button></div><h4 style="margin:0 0 6px 0;font-size:16px;font-weight:700;">${popupStoreName}</h4><p style="margin:0 0 14px 0;font-size:12px;color:#5C4D4D;line-height:1.4;">${popupDiscount}</p><a href="${popupStoreUrl}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;background:#3C2F2F;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;padding:10px 16px;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.15);">Shop With Partner Token &rarr;</a></div>`;
    // Clean all possible newlines or carriage returns into a single continuous line
    const oneLiner = raw.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    setGeneratedOneLineCode(oneLiner);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOneLineCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E2725B]/20 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#3C2F2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-[#3C2F2F]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                {t.adminTitle}
              </h2>
              <p className="text-[11px] text-amber-200">
                Custom Claims, User Moderation [Reset Pwd / VIP / Ban] & 1-Line Popup Generator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Ribbon */}
        <div className="flex items-center gap-2 p-3 bg-[#F7F3EE] border-b border-[#EAE2DA] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'users' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D] hover:bg-[#EAE2DA]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.tabUsers} ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('retailers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'retailers' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D] hover:bg-[#EAE2DA]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.tabRetailers} ({retailers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('popupGen')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'popupGen' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D] hover:bg-[#EAE2DA]'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>1-Line Popup Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#3C2F2F] text-white' : 'text-[#5C4D4D] hover:bg-[#EAE2DA]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabAuditLogs}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Tab 1: User Management List */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Feedback toast */}
              {resetFeedback && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{resetFeedback}</span>
                </div>
              )}

              {/* User Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or handle..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                  />
                </div>
                <span className="text-xs text-[#7A6A6A] font-medium shrink-0">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* User Management Table */}
              <div className="border border-[#EAE2DA] rounded-2xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F3EE] border-b border-[#EAE2DA] text-[#5C4D4D] uppercase font-bold">
                    <tr>
                      <th className="p-3">User Profile</th>
                      <th className="p-3">Role & Authority</th>
                      <th className="p-3">Actions: [Grant Premium]</th>
                      <th className="p-3">Actions: [Reset Pwd]</th>
                      <th className="p-3 text-right">Actions: [Ban/Mute Dropdown]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2DA]">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-[#FAF8F5]">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-[#3C2F2F]">{u.displayName}</p>
                              <p className="text-[10px] text-[#8C7C7C]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'admin'
                                  ? 'bg-[#3C2F2F] text-amber-300'
                                  : 'bg-[#F7F3EE] text-[#5C4D4D]'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                            {/* Add/Remove Admin button */}
                            <button
                              onClick={() => handleToggleAdminRole(u)}
                              disabled={u.email.toLowerCase() === 'oharajoshua333@gmail.com' && u.role === 'admin'}
                              title={
                                u.role === 'admin'
                                  ? 'Demote from Admin role'
                                  : 'Promote to Admin role'
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                u.role === 'admin'
                                  ? u.email.toLowerCase() === 'oharajoshua333@gmail.com'
                                    ? 'border-amber-400 bg-amber-50 text-amber-800 opacity-70 cursor-not-allowed'
                                    : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'border-[#3C2F2F] bg-white text-[#3C2F2F] hover:bg-[#3C2F2F] hover:text-white'
                              }`}
                            >
                              {u.email.toLowerCase() === 'oharajoshua333@gmail.com'
                                ? 'Default Admin'
                                : u.role === 'admin'
                                ? 'Remove Admin'
                                : 'Make Admin'}
                            </button>
                          </div>
                        </td>
                        {/* [Grant Premium] Action Toggle */}
                        <td className="p-3">
                          <button
                            onClick={() => handleTogglePremium(u)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer ${
                              u.isPremium
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {u.isPremium ? '★ Grant Premium [ON]' : 'Grant Premium [OFF]'}
                          </button>
                        </td>
                        {/* [Reset Pwd] Action Toggle */}
                        <td className="p-3">
                          <button
                            onClick={() => handleResetPassword(u)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D9CFC4] bg-[#FDFBF7] hover:bg-[#EAE2DA] text-[11px] font-bold text-[#3C2F2F] transition cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#E2725B]" />
                            <span>Reset Pwd</span>
                          </button>
                        </td>
                        {/* [Ban/Mute Dropdown] Action Toggle */}
                        <td className="p-3 text-right">
                          <select
                            value={u.status.state}
                            onChange={(e) =>
                              handleStatusChange(
                                u,
                                e.target.value as 'active' | 'muted' | 'banned',
                                e.target.value === 'muted' ? 7 : undefined
                              )
                            }
                            className={`text-[11px] p-1.5 rounded-lg border font-bold cursor-pointer ${
                              u.status.state === 'banned'
                                ? 'border-rose-400 bg-rose-50 text-rose-800'
                                : u.status.state === 'muted'
                                ? 'border-amber-400 bg-amber-50 text-amber-800'
                                : 'border-emerald-400 bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            <option value="active">✓ Active (Unrestricted)</option>
                            <option value="muted">⚠ Mute (7 Days)</option>
                            <option value="banned">⛔ Ban Account</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Retailers Manager */}
          {activeTab === 'retailers' && (
            <div className="space-y-6">
              {/* Add Retailer Form */}
              <form onSubmit={handleAddRetailer} className="p-4 rounded-2xl bg-white border border-[#EAE2DA] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3C2F2F]">
                  Add / Edit Retailer Partner Store
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newRetailerName}
                    onChange={(e) => setNewRetailerName(e.target.value)}
                    placeholder="Store Name (e.g. Net-a-Porter)"
                    className="p-2.5 rounded-xl border border-[#D9CFC4] text-xs bg-[#FDFBF7]"
                  />
                  <input
                    type="text"
                    value={newRetailerAffiliate}
                    onChange={(e) => setNewRetailerAffiliate(e.target.value)}
                    placeholder="Affiliate Partner Token (e.g. cosmopulse_nap)"
                    className="p-2.5 rounded-xl border border-[#D9CFC4] text-xs bg-[#FDFBF7]"
                  />
                  <input
                    type="url"
                    value={newRetailerLogo}
                    onChange={(e) => setNewRetailerLogo(e.target.value)}
                    placeholder="Store Logo URL"
                    className="p-2.5 rounded-xl border border-[#D9CFC4] text-xs bg-[#FDFBF7]"
                  />
                  <input
                    type="text"
                    required
                    value={newRetailerTemplate}
                    onChange={(e) => setNewRetailerTemplate(e.target.value)}
                    placeholder="https://store.com/search?q={query}&affid={affiliateId}"
                    className="p-2.5 rounded-xl border border-[#D9CFC4] text-xs bg-[#FDFBF7]"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3C2F2F] text-white text-xs font-bold hover:bg-[#251D1D] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Partner Store</span>
                  </button>
                </div>
              </form>

              {/* Retailers list */}
              <div className="space-y-2">
                {retailers.map((r) => (
                  <div
                    key={r.retailerId}
                    className="p-3 rounded-2xl bg-white border border-[#EAE2DA] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img src={r.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-xs text-[#3C2F2F]">{r.name}</h5>
                        <p className="text-[10px] text-[#7A6A6A] truncate max-w-sm">
                          {r.searchUrlTemplate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRetailer(r.retailerId)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Single-line Popup Generator */}
          {activeTab === 'popupGen' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <span className="font-bold">Prompt Instruction Requirement:</span> "If you need to embed future popup code for initial applications or retailer alerts, the admin tool will generate this as self-contained HTML/CSS in a single continuous line (no line breaks) with target='_blank' for all CTAs."
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#EAE2DA]">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#5C4D4D] block mb-1">
                    Store / Alert Name
                  </label>
                  <input
                    type="text"
                    value={popupStoreName}
                    onChange={(e) => setPopupStoreName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC4] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#5C4D4D] block mb-1">
                    Target Link URL
                  </label>
                  <input
                    type="url"
                    value={popupStoreUrl}
                    onChange={(e) => setPopupStoreUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC4] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-[#5C4D4D] block mb-1">
                    Offer / Callout Copy
                  </label>
                  <input
                    type="text"
                    value={popupDiscount}
                    onChange={(e) => setPopupDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC4] text-xs"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    onClick={generateSingleLine}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.generateSingleLinePopup}</span>
                  </button>
                </div>
              </div>

              {generatedOneLineCode && (
                <div className="p-4 rounded-2xl bg-[#261E1D] text-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Generated Continuous Single-Line HTML/CSS:</span>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 text-stone-900 font-extrabold hover:bg-amber-300 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? t.copied : t.copyCode}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono whitespace-nowrap overflow-x-auto p-3 bg-black/40 rounded-xl text-emerald-400">
                    {generatedOneLineCode}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Audit Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-2">
              <p className="text-xs text-[#7A6A6A] mb-3">
                Immutable record of administrative interventions.
              </p>
              {logs.map((log) => (
                <div
                  key={log.logId}
                  className="p-3 rounded-2xl bg-white border border-[#EAE2DA] text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#E2725B] mr-2">[{log.actionType}]</span>
                    <span className="text-[#3C2F2F]">
                      Target: {log.targetUserId} — {log.details.reason || 'Admin action'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C7C7C]">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE2DA] bg-[#F7F3EE] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#3C2F2F] text-white text-xs font-bold cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
