/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { User, ClosetItem, Outfit, JournalEntry, Insight, Post } from './types';
import { Language, translations } from './i18n/translations';
import { changeLanguage } from './i18n/index';
import { Navbar } from './components/Navbar';
import { Navigation, NavTab } from './components/Navigation';
import { Footer } from './components/Footer';
import { ClosetScreen } from './components/closet/ClosetScreen';
import { OutfitsScreen } from './components/outfits/OutfitsScreen';
import { MoodJournalScreen } from './components/journal/MoodJournalScreen';
import { InsightsScreen } from './components/insights/InsightsScreen';
import { SocialFeedScreen } from './components/social/SocialFeedScreen';
import { MenuScreen } from './components/menu/MenuScreen';
import { ShopSimilarDrawer } from './components/ShopSimilarDrawer';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { FriendsModal } from './components/friends/FriendsModal';
import { LegalModal, LegalTab } from './components/legal/LegalModal';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => storage.getCurrentUser());
  const [language, setLanguage] = useState<Language>(currentUser.preferredLanguage || 'en');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isShopSimilarOpen, setIsShopSimilarOpen] = useState(false);
  const [shopSimilarQuery, setShopSimilarQuery] = useState('');
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  // Cloud Sync & Toast Notifications
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Storage collections
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(() =>
    storage.getClosetItems(storage.getCurrentUser().uid)
  );
  const [outfits, setOutfits] = useState<Outfit[]>(() =>
    storage.getOutfits(storage.getCurrentUser().uid)
  );
  const [journals, setJournals] = useState<JournalEntry[]>(() =>
    storage.getJournals(storage.getCurrentUser().uid)
  );
  const [insights, setInsights] = useState<Insight[]>(() =>
    storage.getInsights(storage.getCurrentUser().uid)
  );
  const [posts, setPosts] = useState<Post[]>(() =>
    storage.getPostsForUser(storage.getCurrentUser().uid)
  );

  // Offline detection
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync state if user switches
  const handleSwitchUser = (uid: string) => {
    const nextUser = storage.switchUser(uid);
    setCurrentUser(nextUser);
    const userLang = nextUser.preferredLanguage || 'en';
    setLanguage(userLang);
    changeLanguage(userLang);
    setClosetItems(storage.getClosetItems(nextUser.uid));
    setOutfits(storage.getOutfits(nextUser.uid));
    setJournals(storage.getJournals(nextUser.uid));
    setInsights(storage.getInsights(nextUser.uid));
    setPosts(storage.getPostsForUser(nextUser.uid));
  };

  const handleUpdateUser = (updated: User) => {
    storage.updateUser(updated);
    setCurrentUser(updated);
    storage.syncToCloud(updated.uid);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    changeLanguage(lang);
    const updated = { ...currentUser, preferredLanguage: lang };
    storage.updateUser(updated);
    setCurrentUser(updated);
  };

  // Explicit Log Out: Returns to Demo Profile (Camille Laurent)
  const handleLogout = () => {
    const demoUser = storage.logout();
    setCurrentUser(demoUser);
    const userLang = demoUser.preferredLanguage || 'en';
    setLanguage(userLang);
    changeLanguage(userLang);
    setClosetItems(storage.getClosetItems(demoUser.uid));
    setOutfits(storage.getOutfits(demoUser.uid));
    setJournals(storage.getJournals(demoUser.uid));
    setInsights(storage.getInsights(demoUser.uid));
    setPosts(storage.getPostsForUser(demoUser.uid));
    setIsAuthOpen(false);
    setIsProfileOpen(false);
    setSyncToast('Logged out. You are now exploring with the Demo Profile.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Cloud Database Sync
  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      const res = await storage.syncToCloud(currentUser.uid);
      setSyncToast(res.message);
      setTimeout(() => setSyncToast(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  // Actions with automatic background cloud sync
  const handleAddItem = (item: ClosetItem) => {
    storage.addClosetItem(item);
    setClosetItems(storage.getClosetItems(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleDeleteItem = (itemId: string) => {
    storage.deleteClosetItem(itemId);
    setClosetItems(storage.getClosetItems(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    storage.addOutfit(outfit);
    setOutfits(storage.getOutfits(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleScheduleOutfit = (outfitId: string, dateStr: string) => {
    const target = outfits.find((o) => o.outfitId === outfitId);
    if (!target) return;
    const existingDates = target.scheduledDates || [];
    const updatedDates = existingDates.includes(dateStr)
      ? existingDates.filter((d) => d !== dateStr)
      : [...existingDates, dateStr];

    const updated = { ...target, scheduledDates: updatedDates, updatedAt: new Date().toISOString() };
    storage.updateOutfit(updated);
    setOutfits(storage.getOutfits(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    storage.saveJournalEntry(entry);
    setJournals(storage.getJournals(currentUser.uid));
    setClosetItems(storage.getClosetItems(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleNewInsight = (insight: Insight) => {
    storage.saveInsight(insight);
    setInsights(storage.getInsights(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleToggleLike = (postId: string) => {
    storage.toggleLike(postId, currentUser.uid);
    setPosts(storage.getPostsForUser(currentUser.uid));
  };

  const handleAddComment = (postId: string, text: string) => {
    const comment = {
      commentId: `c_${Date.now()}`,
      authorId: currentUser.uid,
      authorDisplayName: currentUser.displayName,
      authorPhotoURL: currentUser.photoURL,
      text,
      createdAt: new Date().toISOString(),
    };
    storage.addComment(postId, comment);
    setPosts(storage.getPostsForUser(currentUser.uid));
  };

  const handleAddPost = (post: Post) => {
    storage.addPost(post);
    setPosts(storage.getPostsForUser(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleOpenShopSimilar = (query: string) => {
    setShopSimilarQuery(query);
    setIsShopSimilarOpen(true);
  };

  const handleResetAccountData = () => {
    storage.resetUserAccountData(currentUser.uid);
    setClosetItems(storage.getClosetItems(currentUser.uid));
    setOutfits(storage.getOutfits(currentUser.uid));
    setJournals(storage.getJournals(currentUser.uid));
    setInsights(storage.getInsights(currentUser.uid));
    setPosts(storage.getPostsForUser(currentUser.uid));
    storage.syncToCloud(currentUser.uid);
  };

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D2424] antialiased">
      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t.offlineBadge}</span>
        </div>
      )}

      {/* Cloud Sync Floating Banner / Toast */}
      {syncToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#3C2F2F] text-white text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Global Shell Header */}
      <Navbar
        user={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSyncCloud={handleCloudSync}
        isSyncing={isSyncing}
        onSwitchUserRole={() => {
          const all = storage.getAllUsers();
          const target = all.find((u) => u.uid !== currentUser.uid) || all[0];
          handleSwitchUser(target.uid);
        }}
      />

      {/* Main Layout Container: Desktop Sidebar + Central Single-Column Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Left Sidebar (>=768px) & Mobile Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          language={language}
          userRole={currentUser.role}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Central Content Area (Mobile: Single column ~564px; Desktop: Structured layout) */}
        <main className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
          {activeTab === 'home' && (
            <SocialFeedScreen
              posts={posts}
              currentUser={currentUser}
              outfits={outfits}
              closetItems={closetItems}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onAddPost={handleAddPost}
              onShopSimilar={handleOpenShopSimilar}
              lang={language}
            />
          )}

          {activeTab === 'closet' && (
            <ClosetScreen
              items={closetItems}
              searchQuery={searchQuery}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onShopSimilar={handleOpenShopSimilar}
              userId={currentUser.uid}
              lang={language}
            />
          )}

          {activeTab === 'outfits' && (
            <OutfitsScreen
              outfits={outfits}
              closetItems={closetItems}
              onSaveOutfit={handleSaveOutfit}
              onScheduleOutfit={handleScheduleOutfit}
              userName={currentUser.displayName}
              userId={currentUser.uid}
              lang={language}
            />
          )}

          {activeTab === 'journal' && (
            <MoodJournalScreen
              entries={journals}
              outfits={outfits}
              closetItems={closetItems}
              onSaveEntry={handleSaveJournalEntry}
              userId={currentUser.uid}
              lang={language}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsScreen
              insights={insights}
              journals={journals}
              closetItems={closetItems}
              outfits={outfits}
              onNewInsight={handleNewInsight}
              lang={language}
            />
          )}

          {activeTab === 'menu' && (
            <MenuScreen
              user={currentUser}
              insights={insights}
              onNavigateToInsights={() => setActiveTab('insights')}
              onOpenShopSimilar={() => handleOpenShopSimilar('terracotta blazer')}
              onOpenAdmin={() => setIsAdminOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onSwitchUserRole={() => {
                const all = storage.getAllUsers();
                const target = all.find((u) => u.uid !== currentUser.uid) || all[0];
                handleSwitchUser(target.uid);
              }}
              language={language}
              onLanguageChange={handleLanguageChange}
              onOpenFriends={() => setIsFriendsOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onResetAccountData={handleResetAccountData}
              onOpenLegal={handleOpenLegal}
            />
          )}
        </main>
      </div>

      {/* Dynamic "Shop the Look" Search Drawer */}
      <ShopSimilarDrawer
        isOpen={isShopSimilarOpen}
        onClose={() => setIsShopSimilarOpen(false)}
        initialQuery={shopSimilarQuery}
        lang={language}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        lang={language}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onSwitchUser={handleSwitchUser}
        allUsers={storage.getAllUsers()}
        lang={language}
        onLanguageChange={handleLanguageChange}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onResetAccountData={handleResetAccountData}
        onSyncCloud={handleCloudSync}
        isSyncing={isSyncing}
      />

      {/* Google & Cloud Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(authedUser: User) => {
          setCurrentUser(authedUser);
          const userLang = authedUser.preferredLanguage || 'en';
          setLanguage(userLang);
          changeLanguage(userLang);

          // Try pulling any existing cloud sync data for this user
          storage.syncFromCloud(authedUser.uid).then(() => {
            setClosetItems(storage.getClosetItems(authedUser.uid));
            setOutfits(storage.getOutfits(authedUser.uid));
            setJournals(storage.getJournals(authedUser.uid));
            setInsights(storage.getInsights(authedUser.uid));
            setPosts(storage.getPostsForUser(authedUser.uid));
          });

          setClosetItems(storage.getClosetItems(authedUser.uid));
          setOutfits(storage.getOutfits(authedUser.uid));
          setJournals(storage.getJournals(authedUser.uid));
          setInsights(storage.getInsights(authedUser.uid));
          setPosts(storage.getPostsForUser(authedUser.uid));
          setIsAuthOpen(false);
          setSyncToast(`Signed in as ${authedUser.displayName}`);
          setTimeout(() => setSyncToast(null), 3500);
        }}
        onLogout={handleLogout}
        lang={language}
        onOpenLegal={handleOpenLegal}
      />

      {/* Friends & Connections Modal */}
      <FriendsModal
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
        currentUser={currentUser}
        onFriendshipUpdated={() => {
          setPosts(storage.getPosts());
        }}
        lang={language}
      />

      {/* Legal & Privacy Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
        lang={language}
      />

      {/* Pinned Responsive Footer */}
      <Footer lang={language} onOpenLegal={handleOpenLegal} />
    </div>
  );
}
