export type UserRole = 'user' | 'admin';

export type UserStatus = {
  state: 'active' | 'muted' | 'banned';
  until?: string | null;
  reason: string;
};

export type AvatarConfig = {
  baseModelId: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  canvasScale: number;
};

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  role: UserRole;
  permissions?: string[];
  isDemo?: boolean;
  isPremium: boolean;
  preferredLanguage: 'en' | 'fr' | 'es';
  status: UserStatus;
  avatarConfig: AvatarConfig;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories';

export interface ClosetItem {
  itemId: string;
  userId: string;
  name: string;
  imageUrl: string;
  transparentPngUrl?: string | null;
  category: ClothingCategory;
  colors: string[];
  useCases: string[];
  emotionalTags: string[];
  wearCount: number;
  lastWornAt: string | null;
  searchKeywords: string[];
  createdAt: string;
}

export interface OutfitItemPlacement {
  x: number;
  y: number;
  zIndex: number;
  scale: number;
}

export interface Outfit {
  outfitId: string;
  userId: string;
  name: string;
  itemIds: string[];
  moodTarget: string;
  scheduledDates: string[]; // YYYY-MM-DD
  avatarCanvasState?: Record<string, OutfitItemPlacement>;
  previewImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  journalId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  moodScore: number; // 1-10
  emotionsLogged: string[];
  outfitId: string | null;
  wornItemIds: string[];
  entryText: string;
  sentimentScore: number | null; // -1.0 to 1.0
  aiProcessed: boolean;
  createdAt: string;
}

export interface Insight {
  insightId: string;
  userId: string;
  period: 'weekly' | 'monthly' | 'all_time';
  startDate: string;
  endDate: string;
  powerColor: string;
  topOutfitId: string | null;
  categoryCorrelations: Record<string, Record<string, number>>;
  aiNarrativeSummary: string;
  actionableTip: string;
  generatedAt: string;
}

export interface PostLike {
  userId: string;
  createdAt: string;
}

export interface PostComment {
  commentId: string;
  authorId: string;
  authorDisplayName: string;
  authorPhotoURL: string;
  text: string;
  createdAt: string;
}

export interface Post {
  postId: string;
  authorId: string;
  authorDisplayName: string;
  authorPhotoURL: string;
  mediaUrl?: string | null;
  caption: string;
  outfitId: string | null;
  taggedItemCount: number;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  comments?: PostComment[];
  likes?: PostLike[];
  createdAt: string;
}

export interface FriendRelationship {
  relationshipId: string;
  userId: string;
  targetUserId: string;
  status: 'friend' | 'blocked';
  createdAt: string;
}

export interface Retailer {
  retailerId: string;
  name: string;
  logoUrl: string;
  searchUrlTemplate: string;
  affiliateId: string;
  isActive: boolean;
  priorityOrder: number;
  updatedAt: string;
}

export interface AdminAuditLog {
  logId: string;
  adminId: string;
  targetUserId: string;
  actionType:
    | 'SET_PREMIUM'
    | 'MUTE_USER'
    | 'BAN_USER'
    | 'UNBAN_USER'
    | 'RETAILER_UPDATE'
    | 'SET_ADMIN'
    | 'REMOVE_ADMIN'
    | 'RESET_DATA';
  details: {
    durationDays?: number;
    reason: string;
    priorStatus?: string;
  };
  timestamp: string;
}
