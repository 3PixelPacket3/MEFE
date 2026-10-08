import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Tag,
  Plus,
  X,
  Send,
  Sparkles,
  UserPlus,
  UserCheck,
  UserMinus,
  Shield,
  ShieldAlert,
  Users,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Filter,
} from 'lucide-react';
import { Post, User, Outfit, ClosetItem } from '../../types';
import { translations, Language } from '../../i18n/translations';
import { storage } from '../../services/storageService';
import { CameraCaptureModal } from '../camera/CameraCaptureModal';
import { FriendsModal } from '../friends/FriendsModal';

interface Props {
  posts: Post[];
  currentUser: User;
  outfits: Outfit[];
  closetItems: ClosetItem[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddPost: (post: Post) => void;
  onShopSimilar: (query: string) => void;
  lang: Language;
}

export const SocialFeedScreen: React.FC<Props> = ({
  posts,
  currentUser,
  outfits,
  closetItems,
  onToggleLike,
  onAddComment,
  onAddPost,
  onShopSimilar,
  lang,
}) => {
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [feedMode, setFeedMode] = useState<'friends_and_admin' | 'all'>('friends_and_admin');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New post modal state
  const [postTab, setPostTab] = useState<'camera' | 'upload' | 'url' | 'text'>('camera');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(
    outfits[0]?.outfitId || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang] || translations.en;

  // Retrieve social graph
  const allUsers = storage.getAllUsers();
  const friends = storage.getFriends(currentUser.uid);
  const friendIds = new Set(friends.map((f) => f.uid));
  const blockedIds = new Set(storage.getBlockedUserIds(currentUser.uid));

  // Determine which posts are visible
  const filteredPosts = posts.filter((post) => {
    // Blocked users are never shown
    if (blockedIds.has(post.authorId)) return false;

    // In "All Community" mode, show everyone non-blocked
    if (feedMode === 'all') return true;

    // In "Friends & Admin" mode (Default):
    // 1. Current user's own posts
    if (post.authorId === currentUser.uid) return true;
    // 2. Confirmed friends' posts
    if (friendIds.has(post.authorId)) return true;
    // 3. Admin posts (Everyone sees the admin!)
    const author = allUsers.find((u) => u.uid === post.authorId);
    if (
      author?.role === 'admin' ||
      author?.email.toLowerCase() === 'oharajoshua333@gmail.com' ||
      post.authorId === 'admin_joshua'
    ) {
      return true;
    }

    return false;
  });

  const handleToggleFriend = (targetUid: string) => {
    if (friendIds.has(targetUid)) {
      storage.removeFriend(currentUser.uid, targetUid);
    } else {
      storage.addFriend(currentUser.uid, targetUid);
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBlockUser = (targetUid: string) => {
    if (confirm('Block this user? You will no longer see their posts in your feed.')) {
      storage.blockUser(currentUser.uid, targetUid);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && !mediaUrl) return;

    const linkedOutfit = outfits.find((o) => o.outfitId === selectedOutfitId);

    const newPost: Post = {
      postId: `post_${Date.now()}`,
      authorId: currentUser.uid,
      authorDisplayName: currentUser.displayName,
      authorPhotoURL: currentUser.photoURL,
      mediaUrl: mediaUrl.trim() ? mediaUrl : null,
      caption: caption.trim(),
      outfitId: selectedOutfitId,
      taggedItemCount: linkedOutfit ? linkedOutfit.itemIds.length : (mediaUrl ? 1 : 0),
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onAddPost(newPost);
    setIsNewPostModalOpen(false);
    setCaption('');
    setMediaUrl('');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      {/* Top Header with Social Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] tracking-tight">
            {t.socialTitle}
          </h2>
          <p className="text-xs text-[#7A6A6A]">
            Discover real styling ensembles, friend feeds, and verified admin announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Friends Management CTA */}
          <button
            onClick={() => setIsFriendsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white border border-[#D9CFC4] hover:bg-[#F7F3EE] text-[#3C2F2F] text-xs font-bold transition shadow-2xs cursor-pointer"
            title="Manage Friends and Blocked Users"
          >
            <Users className="w-4 h-4 text-[#E2725B]" />
            <span>Friends ({friends.length})</span>
          </button>

          {/* Share Look CTA */}
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E2725B] hover:bg-[#D46049] text-white text-xs font-bold shadow-md shadow-[#E2725B]/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.shareLook}</span>
          </button>
        </div>
      </div>

      {/* Feed Visibility Ribbon */}
      <div className="flex items-center justify-between p-1.5 bg-[#F7F3EE] border border-[#EAE2DA] rounded-2xl">
        <div className="flex items-center gap-1 flex-1">
          <button
            onClick={() => setFeedMode('friends_and_admin')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              feedMode === 'friends_and_admin'
                ? 'bg-[#3C2F2F] text-white shadow-xs'
                : 'text-[#5C4D4D] hover:bg-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Friends & Admin Feed</span>
          </button>
          <button
            onClick={() => setFeedMode('all')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              feedMode === 'all'
                ? 'bg-[#3C2F2F] text-white shadow-xs'
                : 'text-[#5C4D4D] hover:bg-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#E2725B]" />
            <span>All Community</span>
          </button>
        </div>
      </div>

      {/* The Feed: Single-column vertical scroll */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2DA] shadow-xs space-y-3">
            <Users className="w-10 h-10 text-[#8C7C7C] mx-auto opacity-50" />
            <h4 className="font-serif font-bold text-base text-[#3C2F2F]">No Posts in this Feed</h4>
            <p className="text-xs text-[#7A6A6A] max-w-sm mx-auto">
              {feedMode === 'friends_and_admin'
                ? 'You are viewing the Friends & Admin feed. Add friends in the community or switch to All Community feed to view everyone!'
                : 'No posts available yet. Be the first to share your fashion look or thoughts!'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsFriendsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] transition cursor-pointer"
              >
                Find & Add Friends
              </button>
              <button
                onClick={() => setFeedMode('all')}
                className="px-4 py-2 rounded-xl bg-[#F7F3EE] text-[#3C2F2F] text-xs font-bold hover:bg-[#EAE2DA] transition cursor-pointer"
              >
                View All Community
              </button>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = activeCommentsPostId === post.postId;
            const linkedOutfit = outfits.find((o) => o.outfitId === post.outfitId);
            const isMe = post.authorId === currentUser.uid;
            const isFriend = friendIds.has(post.authorId);
            const author = allUsers.find((u) => u.uid === post.authorId);
            const isAdmin =
              author?.role === 'admin' ||
              author?.email.toLowerCase() === 'oharajoshua333@gmail.com' ||
              post.authorId === 'admin_joshua';

            return (
              <article
                key={post.postId}
                className="rounded-3xl bg-white border border-[#EAE2DA] shadow-md overflow-hidden transition"
              >
                {/* Post Header: User Avatar, Name, Friend Action & Admin Badge */}
                <div className="p-4 flex items-center justify-between border-b border-[#F5EFEB]">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorPhotoURL}
                      alt={post.authorDisplayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E2725B]/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-[#3C2F2F] leading-tight">
                          {post.authorDisplayName}
                        </h3>

                        {/* Admin Badge */}
                        {isAdmin && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3C2F2F] text-amber-300">
                            <Shield className="w-2.5 h-2.5 text-amber-300" />
                            <span>Admin</span>
                          </span>
                        )}

                        {/* Friend / Unfriend / Block Controls */}
                        {!isMe && (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => handleToggleFriend(post.authorId)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                isFriend
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                  : 'bg-[#E2725B]/15 text-[#E2725B] hover:bg-[#E2725B] hover:text-white'
                              }`}
                              title={isFriend ? 'Click to remove friend' : 'Click to add friend'}
                            >
                              {isFriend ? (
                                <>
                                  <UserCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Friends ✓</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3 h-3" />
                                  <span>Add Friend</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleBlockUser(post.authorId)}
                              className="p-1 rounded-full text-[#8C7C7C] hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Block User from feed"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8C7C7C]">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {post.taggedItemCount > 0 && (
                    <button
                      onClick={() => {
                        if (linkedOutfit) {
                          onShopSimilar(linkedOutfit.name);
                        } else {
                          onShopSimilar('terracotta chic outfit');
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F3EE] hover:bg-[#EAE2DA] text-[11px] font-semibold text-[#5C4D4D] transition cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-[#E2725B]" />
                      <span>{post.taggedItemCount} {t.taggedItems}</span>
                    </button>
                  )}
                </div>

                {/* Post Body: Image OR Chic Text Story (Instagram-style notes/text) */}
                {post.mediaUrl ? (
                  <div className="relative aspect-[4/5] bg-black/5 overflow-hidden">
                    <img
                      src={post.mediaUrl}
                      alt="Outfit Post"
                      className="w-full h-full object-cover"
                    />
                    {linkedOutfit && (
                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-amber-200">{linkedOutfit.name}</p>
                          <p className="text-[11px] opacity-80">{linkedOutfit.moodTarget}</p>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white/20 uppercase tracking-wider font-bold">
                          Ensemble
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Instagram / Editorial Text Card */
                  <div className="p-8 bg-gradient-to-br from-[#3C2F2F] via-[#2D2323] to-[#1E1717] text-white flex flex-col justify-center min-h-[260px] relative overflow-hidden">
                    <div className="text-amber-300/30 font-serif text-7xl absolute top-2 left-4 select-none pointer-events-none">
                      “
                    </div>
                    <div className="relative z-10 space-y-3">
                      <p className="font-serif italic text-base sm:text-lg text-white leading-relaxed text-center px-4">
                        {post.caption}
                      </p>
                      {linkedOutfit && (
                        <div className="pt-3 border-t border-white/20 text-center">
                          <span className="text-xs text-amber-300 font-semibold">
                            Style Look: {linkedOutfit.name} ({linkedOutfit.moodTarget})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Actions: Like, Comment, Share */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onToggleLike(post.postId)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                          post.likedByMe ? 'text-[#E2725B]' : 'text-[#5C4D4D] hover:text-[#E2725B]'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${post.likedByMe ? 'fill-current text-[#E2725B]' : ''}`}
                        />
                        <span>{post.likeCount}</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveCommentsPostId(isCommentsOpen ? null : post.postId)
                        }
                        className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D4D] hover:text-[#3C2F2F] transition cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5 text-[#8C7C7C]" />
                        <span>{post.comments ? post.comments.length : post.commentCount}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `Look by ${post.authorDisplayName}`,
                            text: post.caption,
                            url: window.location.href,
                          });
                        }
                      }}
                      className="p-1.5 rounded-full hover:bg-[#F7F3EE] text-[#8C7C7C] hover:text-[#3C2F2F] transition cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Caption if media was displayed */}
                  {post.mediaUrl && (
                    <div className="text-xs text-[#3C2F2F]">
                      <span className="font-bold mr-1.5">{post.authorDisplayName}</span>
                      <span className="text-[#5C4D4D] leading-relaxed">{post.caption}</span>
                    </div>
                  )}

                  {/* Comment Drawer / Section */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-[#F5EFEB] space-y-3 animate-in fade-in-50">
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <div key={comment.commentId} className="flex items-start gap-2 text-xs">
                              <img
                                src={comment.authorPhotoURL}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                              />
                              <div className="p-2 rounded-2xl bg-[#F7F3EE] flex-1">
                                <span className="font-bold text-[#3C2F2F] block">
                                  {comment.authorDisplayName}
                                </span>
                                <span className="text-[#5C4D4D]">{comment.text}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-[#8C7C7C] italic text-center py-1">
                            No comments yet. Start the style conversation!
                          </p>
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.postId)}
                          placeholder={t.writeComment}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#D9CFC4] text-xs text-[#3C2F2F] focus:outline-none focus:border-[#E2725B]"
                        />
                        <button
                          onClick={() => handleSendComment(post.postId)}
                          className="p-2 rounded-xl bg-[#3C2F2F] text-white hover:bg-[#251D1D] transition cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Share Look / New Post Modal with Device Camera, File Upload, Text options */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl border border-[#E2725B]/20 animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2DA] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E2725B] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#3C2F2F]">Share Style Look</h3>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8C7C7C] hover:bg-[#EAE2DA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Image Source Selection Tabs (Camera, Upload, URL, Text-Only) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1.5">
                  Media Source
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#F7F3EE] rounded-xl border border-[#D9CFC4] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setPostTab('camera');
                      setIsCameraModalOpen(true);
                    }}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg transition cursor-pointer ${
                      postTab === 'camera' ? 'bg-white text-[#E2725B] shadow-2xs font-bold' : 'text-[#7A6A6A]'
                    }`}
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPostTab('upload');
                      fileInputRef.current?.click();
                    }}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg transition cursor-pointer ${
                      postTab === 'upload' ? 'bg-white text-[#E2725B] shadow-2xs font-bold' : 'text-[#7A6A6A]'
                    }`}
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostTab('url')}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg transition cursor-pointer ${
                      postTab === 'url' ? 'bg-white text-[#E2725B] shadow-2xs font-bold' : 'text-[#7A6A6A]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">Photo URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPostTab('text');
                      setMediaUrl('');
                    }}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg transition cursor-pointer ${
                      postTab === 'text' ? 'bg-white text-[#E2725B] shadow-2xs font-bold' : 'text-[#7A6A6A]'
                    }`}
                  >
                    <FileText className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">Text Only</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDeviceFileUpload}
                />
              </div>

              {/* URL Input (if URL tab selected) */}
              {postTab === 'url' && (
                <div>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                  />
                </div>
              )}

              {/* Image Preview if image loaded */}
              {mediaUrl && postTab !== 'text' && (
                <div className="relative rounded-2xl overflow-hidden border border-[#E2725B]/30 aspect-[16/9] bg-black/5">
                  <img
                    src={mediaUrl}
                    alt="Look Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tag Outfit Ensemble */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                  Tag an Outfit Ensemble (Optional)
                </label>
                <select
                  value={selectedOutfitId || ''}
                  onChange={(e) => setSelectedOutfitId(e.target.value || null)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                >
                  <option value="">None / Freeform Post</option>
                  {outfits.map((o) => (
                    <option key={o.outfitId} value={o.outfitId}>
                      {o.name} ({o.moodTarget})
                    </option>
                  ))}
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D4D] block mb-1">
                  Caption & Style Story *
                </label>
                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share normal text, styling inspiration, or how this look made you feel today..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] bg-white text-xs text-[#3C2F2F] focus:border-[#E2725B] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE2DA]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C4D4D] hover:bg-[#EAE2DA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E2725B] hover:bg-[#D46049] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Publish to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Camera Modal for Posting */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(imgData) => {
          setMediaUrl(imgData);
          setPostTab('camera');
        }}
        title="Snap Photo for Feed"
      />

      {/* Friends & Connections Modal */}
      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        currentUser={currentUser}
        onFriendshipUpdated={() => setRefreshTrigger((prev) => prev + 1)}
        lang={lang}
      />
    </div>
  );
};
