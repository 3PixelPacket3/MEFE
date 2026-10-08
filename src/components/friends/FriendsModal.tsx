import React, { useState } from 'react';
import { X, UserPlus, UserMinus, ShieldAlert, Shield, Search, Check, Users } from 'lucide-react';
import { User } from '../../types';
import { storage } from '../../services/storageService';
import { Language, translations } from '../../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onFriendshipUpdated: () => void;
  lang: Language;
}

export const FriendsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onFriendshipUpdated,
  lang,
}) => {
  const [tab, setTab] = useState<'friends' | 'discover' | 'blocked'>('friends');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const allUsers = storage.getAllUsers().filter((u) => u.uid !== currentUser.uid);
  const friends = storage.getFriends(currentUser.uid);
  const blockedIds = new Set(storage.getBlockedUserIds(currentUser.uid));

  const handleAddFriend = (targetUid: string) => {
    storage.addFriend(currentUser.uid, targetUid);
    onFriendshipUpdated();
  };

  const handleRemoveFriend = (targetUid: string) => {
    storage.removeFriend(currentUser.uid, targetUid);
    onFriendshipUpdated();
  };

  const handleBlockUser = (targetUid: string) => {
    storage.blockUser(currentUser.uid, targetUid);
    onFriendshipUpdated();
  };

  const handleUnblockUser = (targetUid: string) => {
    storage.unblockUser(currentUser.uid, targetUid);
    onFriendshipUpdated();
  };

  // Filter based on search query
  const matchesSearch = (u: User) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    );
  };

  const filteredFriends = friends.filter(matchesSearch);
  const filteredDiscover = allUsers.filter(
    (u) => !friends.some((f) => f.uid === u.uid) && !blockedIds.has(u.uid) && matchesSearch(u)
  );
  const filteredBlocked = allUsers.filter((u) => blockedIds.has(u.uid) && matchesSearch(u));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] text-[#2D2424] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE2DA] max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2DA] bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E2725B] to-[#3C2F2F] flex items-center justify-center text-white shadow-xs">
              <Users className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3C2F2F] leading-tight">
                Friends & Community
              </h3>
              <p className="text-[11px] text-[#8C7C7C]">
                Feed displays posts from friends and admins
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

        {/* Global Policy Notice */}
        <div className="px-6 py-2.5 bg-amber-50/70 border-b border-amber-200/50 flex items-center gap-2 text-[11px] text-amber-900">
          <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Global Broadcast:</strong> All users see official Admin looks in their feed alongside confirmed friends.
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-4 px-6 border-b border-[#EAE2DA]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7C7C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or style vibe..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#F7F3EE] p-1 mx-6 my-3 rounded-xl shrink-0">
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'friends' ? 'bg-white text-[#3C2F2F] shadow-xs' : 'text-[#8C7C7C]'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setTab('discover')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'discover' ? 'bg-white text-[#3C2F2F] shadow-xs' : 'text-[#8C7C7C]'
            }`}
          >
            Discover ({allUsers.length - friends.length - blockedIds.size})
          </button>
          <button
            onClick={() => setTab('blocked')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === 'blocked' ? 'bg-white text-[#3C2F2F] shadow-xs' : 'text-[#8C7C7C]'
            }`}
          >
            Blocked ({blockedIds.size})
          </button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {tab === 'friends' && (
            <>
              {filteredFriends.length === 0 ? (
                <div className="text-center py-8 text-[#8C7C7C]">
                  <p className="text-xs">You haven't added any friends yet.</p>
                  <button
                    onClick={() => setTab('discover')}
                    className="mt-2 text-xs font-bold text-[#E2725B] hover:underline"
                  >
                    Browse Discover list to connect!
                  </button>
                </div>
              ) : (
                filteredFriends.map((user) => (
                  <div
                    key={user.uid}
                    className="p-3.5 rounded-2xl bg-white border border-[#EAE2DA] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2725B]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#3C2F2F] truncate">
                            {user.displayName}
                          </span>
                          {user.role === 'admin' && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8C7C7C] truncate">{user.bio || user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRemoveFriend(user.uid)}
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
                        title="Remove Friend"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.uid)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs transition cursor-pointer"
                        title="Block User"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === 'discover' && (
            <>
              {filteredDiscover.length === 0 ? (
                <div className="text-center py-8 text-[#8C7C7C]">
                  <p className="text-xs">No new users to discover right now.</p>
                </div>
              ) : (
                filteredDiscover.map((user) => (
                  <div
                    key={user.uid}
                    className="p-3.5 rounded-2xl bg-white border border-[#EAE2DA] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2725B]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#3C2F2F] truncate">
                            {user.displayName}
                          </span>
                          {user.role === 'admin' && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8C7C7C] truncate">{user.bio || user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAddFriend(user.uid)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E2725B] text-white hover:bg-[#D46049] text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => handleBlockUser(user.uid)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-100 text-xs transition cursor-pointer"
                        title="Block User"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === 'blocked' && (
            <>
              {filteredBlocked.length === 0 ? (
                <div className="text-center py-8 text-[#8C7C7C]">
                  <p className="text-xs">No users currently blocked.</p>
                </div>
              ) : (
                filteredBlocked.map((user) => (
                  <div
                    key={user.uid}
                    className="p-3.5 rounded-2xl bg-white border border-[#EAE2DA] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover opacity-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-500 line-through truncate">
                          {user.displayName}
                        </span>
                        <p className="text-[11px] text-gray-400 truncate">Blocked from your feed</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnblockUser(user.uid)}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium transition cursor-pointer shrink-0"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
