import {
  User,
  ClosetItem,
  Outfit,
  JournalEntry,
  Insight,
  Post,
  Retailer,
  AdminAuditLog,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'mefe_users_v1',
  CURRENT_USER_ID: 'mefe_current_user_id_v1',
  CLOSET: 'mefe_closet_v1',
  OUTFITS: 'mefe_outfits_v1',
  JOURNALS: 'mefe_journals_v1',
  INSIGHTS: 'mefe_insights_v1',
  POSTS: 'mefe_posts_v1',
  RETAILERS: 'mefe_retailers_v1',
  LOGS: 'mefe_audit_logs_v1',
  FRIENDS: 'mefe_friends_v1',
  RESET_USERS: 'mefe_reset_users_v1',
};

export const DEFAULT_USER_PERMISSIONS = [
  'wardrobe:read',
  'wardrobe:write',
  'outfits:read',
  'outfits:write',
  'journal:read',
  'journal:write',
  'insights:read',
  'social:read',
  'social:post',
];

export const ADMIN_PERMISSIONS = [
  ...DEFAULT_USER_PERMISSIONS,
  'admin:manage_users',
  'admin:manage_roles',
  'admin:audit_logs',
];

// Initial Seed Data matching users Collection schema
const DEFAULT_USERS: User[] = [
  {
    uid: 'user_camille',
    email: 'camille@cosmostyle.com',
    displayName: 'Camille Laurent',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Architectural stylist & minimalist curator. Seeking daily alignment through silhouettes.',
    role: 'user',
    permissions: DEFAULT_USER_PERMISSIONS,
    isDemo: true,
    isPremium: true,
    preferredLanguage: 'en',
    status: { state: 'active', until: null, reason: 'Demo account with sample collection' },
    avatarConfig: {
      baseModelId: 'cher_classic',
      skinTone: '#F5D0C5',
      hairStyle: 'long_wavy',
      hairColor: '#4A2E18',
      canvasScale: 1.0,
    },
    followersCount: 1420,
    followingCount: 388,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    uid: 'admin_joshua',
    email: 'oharajoshua333@gmail.com',
    displayName: 'Joshua O\'Hara (Admin)',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform Lead & Systems Architect.',
    role: 'admin',
    permissions: ADMIN_PERMISSIONS,
    isDemo: false,
    isPremium: true,
    preferredLanguage: 'en',
    status: { state: 'active', until: null, reason: 'Super administrator privilege' },
    avatarConfig: {
      baseModelId: 'cher_classic',
      skinTone: '#E0AC69',
      hairStyle: 'sleek_bob',
      hairColor: '#1A1110',
      canvasScale: 1.0,
    },
    followersCount: 3450,
    followingCount: 180,
    createdAt: '2026-07-15T08:00:00Z',
    updatedAt: '2026-10-02T15:30:00Z',
  },
  {
    uid: 'user_maya',
    email: 'maya.lin@mefe.app',
    displayName: 'Maya Lin',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Eco-conscious textile designer & vintage hunter based in Paris.',
    role: 'user',
    permissions: DEFAULT_USER_PERMISSIONS,
    isDemo: false,
    isPremium: true,
    preferredLanguage: 'en',
    status: { state: 'active', until: null, reason: 'Active creator' },
    avatarConfig: {
      baseModelId: 'cher_classic',
      skinTone: '#EAC0A2',
      hairStyle: 'curly_high',
      hairColor: '#2B1B17',
      canvasScale: 1.0,
    },
    followersCount: 890,
    followingCount: 215,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-10-02T11:00:00Z',
  },
];

const DEFAULT_FRIENDS = [
  {
    relationshipId: 'rel_1',
    userId: 'user_camille',
    targetUserId: 'admin_joshua',
    status: 'friend' as const,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    relationshipId: 'rel_2',
    userId: 'user_camille',
    targetUserId: 'user_maya',
    status: 'friend' as const,
    createdAt: '2026-08-02T10:00:00Z',
  },
];

const DEFAULT_CLOSET: ClosetItem[] = [
  {
    itemId: 'item_1',
    userId: 'user_camille',
    name: 'Vintage Terracotta Tailored Blazer',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'outerwear',
    colors: ['terracotta', 'rust', 'cocoa'],
    useCases: ['work', 'keynote', 'evening'],
    emotionalTags: ['confident', 'powerful', 'grounded'],
    wearCount: 14,
    lastWornAt: '2026-10-02T09:00:00Z',
    searchKeywords: ['blazer', 'terracotta', 'jacket', 'tailored', 'work'],
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    itemId: 'item_2',
    userId: 'user_camille',
    name: 'Ivory Silk Cowl Blouse',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'tops',
    colors: ['ivory', 'cream', 'white'],
    useCases: ['work', 'dinner', 'casual'],
    emotionalTags: ['serene', 'poised', 'chic'],
    wearCount: 19,
    lastWornAt: '2026-10-03T11:00:00Z',
    searchKeywords: ['silk', 'blouse', 'ivory', 'tops', 'cowl'],
    createdAt: '2026-08-12T14:00:00Z',
  },
  {
    itemId: 'item_3',
    userId: 'user_camille',
    name: 'Pleated Cocoa Wide-Leg Trousers',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'bottoms',
    colors: ['cocoa', 'espresso', 'brown'],
    useCases: ['work', 'gallery', 'everyday'],
    emotionalTags: ['empowered', 'comfortable', 'focused'],
    wearCount: 22,
    lastWornAt: '2026-10-03T11:00:00Z',
    searchKeywords: ['trousers', 'pants', 'brown', 'pleated', 'tailored'],
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    itemId: 'item_4',
    userId: 'user_camille',
    name: 'Saffron Cable Cashmere Sweater',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'tops',
    colors: ['yellow', 'saffron', 'gold'],
    useCases: ['weekend', 'creative', 'casual'],
    emotionalTags: ['energized', 'joyful', 'vibrant'],
    wearCount: 11,
    lastWornAt: '2026-09-28T14:00:00Z',
    searchKeywords: ['sweater', 'cashmere', 'knit', 'yellow', 'saffron'],
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    itemId: 'item_5',
    userId: 'user_camille',
    name: 'Italian Leather Almond Toe Boots',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'shoes',
    colors: ['black', 'espresso'],
    useCases: ['daily', 'commute', 'dinner'],
    emotionalTags: ['unstoppable', 'grounded'],
    wearCount: 27,
    lastWornAt: '2026-10-02T09:00:00Z',
    searchKeywords: ['boots', 'shoes', 'leather', 'black', 'ankle'],
    createdAt: '2026-08-05T08:00:00Z',
  },
  {
    itemId: 'item_6',
    userId: 'user_camille',
    name: 'Sculptural Minimalist Leather Tote',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'accessories',
    colors: ['caramel', 'terracotta'],
    useCases: ['work', 'travel', 'meetings'],
    emotionalTags: ['organized', 'composed'],
    wearCount: 30,
    lastWornAt: '2026-10-03T09:00:00Z',
    searchKeywords: ['bag', 'tote', 'leather', 'handbag', 'accessories'],
    createdAt: '2026-08-02T10:00:00Z',
  },
  {
    itemId: 'item_7',
    userId: 'user_camille',
    name: 'Pleated Camel Wool Trench',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'outerwear',
    colors: ['camel', 'beige', 'sand'],
    useCases: ['travel', 'rainy', 'city'],
    emotionalTags: ['sophisticated', 'protected'],
    wearCount: 8,
    lastWornAt: '2026-09-25T08:00:00Z',
    searchKeywords: ['trench', 'coat', 'outerwear', 'camel', 'wool'],
    createdAt: '2026-09-01T11:00:00Z',
  },
  {
    itemId: 'item_8',
    userId: 'user_camille',
    name: 'Burgundy Asymmetric Slip Dress',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    transparentPngUrl: null,
    category: 'dresses',
    colors: ['burgundy', 'wine', 'red'],
    useCases: ['dinner', 'cocktail', 'date'],
    emotionalTags: ['radiant', 'alluring', 'confident'],
    wearCount: 6,
    lastWornAt: '2026-09-22T20:00:00Z',
    searchKeywords: ['dress', 'slip', 'silk', 'burgundy', 'evening'],
    createdAt: '2026-09-10T16:00:00Z',
  },
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

const DEFAULT_OUTFITS: Outfit[] = [
  {
    outfitId: 'outfit_power_thu',
    userId: 'user_camille',
    name: 'Executive Power Thursday',
    itemIds: ['item_1', 'item_2', 'item_3', 'item_5', 'item_6'],
    moodTarget: 'High Confidence & Executive Presence',
    scheduledDates: [todayStr, '2026-10-08'],
    previewImageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-10-01T15:00:00Z',
  },
  {
    outfitId: 'outfit_creative_weekend',
    userId: 'user_camille',
    name: 'Warm Saffron Cafe & Studio',
    itemIds: ['item_4', 'item_3', 'item_6'],
    moodTarget: 'Creative, Open & Grounded',
    scheduledDates: ['2026-10-10'],
    previewImageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-25T11:30:00Z',
    updatedAt: '2026-10-02T09:00:00Z',
  },
  {
    outfitId: 'outfit_gallery_evening',
    userId: 'user_camille',
    name: 'Burgundy Silk & Trench Ensemble',
    itemIds: ['item_8', 'item_7', 'item_5'],
    moodTarget: 'Radiant Sophistication',
    scheduledDates: ['2026-10-12'],
    previewImageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-27T16:00:00Z',
    updatedAt: '2026-10-03T18:00:00Z',
  },
];

const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    journalId: `user_camille_${todayStr}`,
    userId: 'user_camille',
    date: todayStr,
    moodScore: 9,
    emotionsLogged: ['confident', 'powerful', 'grounded'],
    outfitId: 'outfit_power_thu',
    wornItemIds: ['item_1', 'item_2', 'item_3', 'item_5'],
    entryText: 'Wore the terracotta blazer for our design pitch. Felt completely in my element, authoritative yet warm. Got two spontaneous compliments.',
    sentimentScore: 0.92,
    aiProcessed: true,
    createdAt: new Date().toISOString(),
  },
  {
    journalId: `user_camille_${yesterday}`,
    userId: 'user_camille',
    date: yesterday,
    moodScore: 8,
    emotionsLogged: ['focused', 'serene'],
    outfitId: 'outfit_creative_weekend',
    wornItemIds: ['item_4', 'item_3', 'item_6'],
    entryText: 'Yellow knit day. The brightness kept my energy buoyant through a 4-hour drafting session.',
    sentimentScore: 0.81,
    aiProcessed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    journalId: `user_camille_${twoDaysAgo}`,
    userId: 'user_camille',
    date: twoDaysAgo,
    moodScore: 7,
    emotionsLogged: ['composed', 'grounded'],
    outfitId: null,
    wornItemIds: ['item_2', 'item_3'],
    entryText: 'Low-key studio day. Minimalist cream blouse and wide-leg trousers kept me relaxed.',
    sentimentScore: 0.65,
    aiProcessed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const DEFAULT_INSIGHT: Insight = {
  insightId: 'insight_weekly_1',
  userId: 'user_camille',
  period: 'weekly',
  startDate: twoDaysAgo,
  endDate: todayStr,
  powerColor: 'Terracotta',
  topOutfitId: 'outfit_power_thu',
  categoryCorrelations: {
    outerwear: { blazer: 9.1, trench: 7.8 },
    tops: { silk_blouse: 8.5, knit: 8.0 },
    bottoms: { trousers: 8.6 },
    dresses: { slip: 8.8 },
  },
  aiNarrativeSummary:
    'MEFE noticed your confidence statistically peaks (+28%) when wearing warm earth tones like Terracotta and Cocoa Brown. Structured outerwear acts as a psychological armor during high-stakes presentations, correlating with an average mood score of 9.1 out of 10.',
  actionableTip:
    'Schedule your Terracotta Blazer for upcoming Tuesday client reviews to reinforce executive composure.',
  generatedAt: new Date().toISOString(),
};

const DEFAULT_POSTS: Post[] = [
  {
    postId: 'post_101',
    authorId: 'user_camille',
    authorDisplayName: 'Camille Laurent',
    authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    caption: 'Executive Power Thursday. Terracotta + wide-leg trousers has been my anchor for high-clarity mornings. ✨ #MEFE #WardrobeIntelligence',
    outfitId: 'outfit_power_thu',
    taggedItemCount: 4,
    likeCount: 48,
    commentCount: 6,
    likedByMe: false,
    likes: [{ userId: 'admin_joshua', createdAt: '2026-10-04T07:35:00Z' }],
    comments: [
      {
        commentId: 'c1',
        authorId: 'admin_joshua',
        authorDisplayName: 'Joshua O\'Hara',
        authorPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'The color harmony on that blazer is impeccable!',
        createdAt: '2026-10-04T08:15:00Z',
      },
      {
        commentId: 'c2',
        authorId: 'user_elena',
        authorDisplayName: 'Elena Vance',
        authorPhotoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        text: 'Obsessed with this silhouette. Adding a similar piece to my wishlist right now.',
        createdAt: '2026-10-04T08:45:00Z',
      },
    ],
    createdAt: '2026-10-04T07:30:00Z',
  },
  {
    postId: 'post_102',
    authorId: 'user_maya',
    authorDisplayName: 'Maya Lin',
    authorPhotoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    caption: 'Autumn tones in Paris. Discovering that dressing in cocoa neutrals brings a calming mental cadence.',
    outfitId: null,
    taggedItemCount: 3,
    likeCount: 92,
    commentCount: 9,
    likedByMe: true,
    likes: [{ userId: 'user_camille', createdAt: '2026-10-03T18:05:00Z' }],
    comments: [
      {
        commentId: 'c3',
        authorId: 'user_camille',
        authorDisplayName: 'Camille Laurent',
        authorPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'Cocoa neutrals are supreme this season! Gorgeous vibe.',
        createdAt: '2026-10-03T19:20:00Z',
      },
    ],
    createdAt: '2026-10-03T18:00:00Z',
  },
];

const DEFAULT_RETAILERS: Retailer[] = [
  {
    retailerId: 'ret_nordstrom',
    name: 'Nordstrom',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=120&q=80',
    searchUrlTemplate: 'https://www.nordstrom.com/sr?origin=keywordsearch&keyword={query}&affid={affiliateId}',
    affiliateId: 'mefe_nord',
    isActive: true,
    priorityOrder: 1,
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    retailerId: 'ret_asos',
    name: 'ASOS Design',
    logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=120&q=80',
    searchUrlTemplate: 'https://www.asos.com/search/?q={query}&affid={affiliateId}',
    affiliateId: 'mefe_asos',
    isActive: true,
    priorityOrder: 2,
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    retailerId: 'ret_revolve',
    name: 'REVOLVE',
    logoUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&q=80',
    searchUrlTemplate: 'https://www.revolve.com/r/Search.jsp?search={query}&affid={affiliateId}',
    affiliateId: 'mefe_rvlv',
    isActive: true,
    priorityOrder: 3,
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    retailerId: 'ret_zara',
    name: 'ZARA',
    logoUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=120&q=80',
    searchUrlTemplate: 'https://www.zara.com/us/en/search?searchTerm={query}',
    affiliateId: 'mefe_zara',
    isActive: true,
    priorityOrder: 4,
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    retailerId: 'ret_farfetch',
    name: 'FARFETCH',
    logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80',
    searchUrlTemplate: 'https://www.farfetch.com/shopping/women/search/items.aspx?q={query}',
    affiliateId: 'mefe_farfetch',
    isActive: true,
    priorityOrder: 5,
    updatedAt: '2026-10-01T12:00:00Z',
  },
];

const DEFAULT_LOGS: AdminAuditLog[] = [
  {
    logId: 'log_01',
    adminId: 'admin_joshua',
    targetUserId: 'user_camille',
    actionType: 'SET_PREMIUM',
    details: { reason: 'Annual Cognitive VIP Entitlement', priorStatus: 'Free' },
    timestamp: '2026-10-01T10:00:00Z',
  },
  {
    logId: 'log_02',
    adminId: 'admin_joshua',
    targetUserId: 'retailers_global',
    actionType: 'RETAILER_UPDATE',
    details: { reason: 'Optimized search templates for Nordstrom & ASOS' },
    timestamp: '2026-10-02T14:20:00Z',
  },
];

class StorageEngine {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      this.set(STORAGE_KEYS.CURRENT_USER_ID, 'user_camille');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLOSET)) {
      this.set(STORAGE_KEYS.CLOSET, DEFAULT_CLOSET);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OUTFITS)) {
      this.set(STORAGE_KEYS.OUTFITS, DEFAULT_OUTFITS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOURNALS)) {
      this.set(STORAGE_KEYS.JOURNALS, DEFAULT_JOURNALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSIGHTS)) {
      this.set(STORAGE_KEYS.INSIGHTS, [DEFAULT_INSIGHT]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      this.set(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RETAILERS)) {
      this.set(STORAGE_KEYS.RETAILERS, DEFAULT_RETAILERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      this.set(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FRIENDS)) {
      this.set(STORAGE_KEYS.FRIENDS, DEFAULT_FRIENDS);
    }
  }

  // User management
  public getCurrentUser(): User {
    const users = this.get<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
    const currentId = this.get<string>(STORAGE_KEYS.CURRENT_USER_ID, 'user_camille');
    const user = users.find((u) => u.uid === currentId);
    return user || users[0] || DEFAULT_USERS[0];
  }

  public switchUser(uid: string): User {
    this.set(STORAGE_KEYS.CURRENT_USER_ID, uid);
    return this.getCurrentUser();
  }

  public getAllUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }

  public updateUser(user: User): void {
    const users = this.getAllUsers().map((u) => (u.uid === user.uid ? user : u));
    this.set(STORAGE_KEYS.USERS, users);
  }

  // Closet
  public getClosetItems(userId?: string): ClosetItem[] {
    const all = this.get<ClosetItem[]>(STORAGE_KEYS.CLOSET, DEFAULT_CLOSET);
    if (!userId) return all;
    // For demo profile, ensure sample wardrobe exists
    if (userId === 'user_camille') {
      const demoItems = all.filter((item) => item.userId === 'user_camille');
      if (demoItems.length > 0) return demoItems;
      return DEFAULT_CLOSET;
    }
    // For real user accounts: return strictly their own items (empty [] for newly created accounts)
    return all.filter((item) => item.userId === userId);
  }

  public addClosetItem(item: ClosetItem): void {
    const items = this.get<ClosetItem[]>(STORAGE_KEYS.CLOSET, DEFAULT_CLOSET);
    this.set(STORAGE_KEYS.CLOSET, [item, ...items]);
  }

  public updateClosetItem(item: ClosetItem): void {
    const items = this.getClosetItems().map((i) => (i.itemId === item.itemId ? item : i));
    this.set(STORAGE_KEYS.CLOSET, items);
  }

  public deleteClosetItem(itemId: string): void {
    const items = this.getClosetItems().filter((i) => i.itemId !== itemId);
    this.set(STORAGE_KEYS.CLOSET, items);
  }

  // Outfits
  public getOutfits(userId?: string): Outfit[] {
    const all = this.get<Outfit[]>(STORAGE_KEYS.OUTFITS, DEFAULT_OUTFITS);
    if (!userId) return all;
    // For demo profile, return demo outfits
    if (userId === 'user_camille') {
      const demoOutfits = all.filter((o) => o.userId === 'user_camille');
      if (demoOutfits.length > 0) return demoOutfits;
      return DEFAULT_OUTFITS;
    }
    // For real user accounts: return strictly their own outfits (empty [] for newly created accounts)
    return all.filter((o) => o.userId === userId);
  }

  public addOutfit(outfit: Outfit): void {
    const outfits = this.get<Outfit[]>(STORAGE_KEYS.OUTFITS, DEFAULT_OUTFITS);
    this.set(STORAGE_KEYS.OUTFITS, [outfit, ...outfits]);
  }

  public updateOutfit(outfit: Outfit): void {
    const outfits = this.getOutfits().map((o) => (o.outfitId === outfit.outfitId ? outfit : o));
    this.set(STORAGE_KEYS.OUTFITS, outfits);
  }

  public deleteOutfit(outfitId: string): void {
    const outfits = this.getOutfits().filter((o) => o.outfitId !== outfitId);
    this.set(STORAGE_KEYS.OUTFITS, outfits);
  }

  // Journals
  public getJournals(userId?: string): JournalEntry[] {
    const all = this.get<JournalEntry[]>(STORAGE_KEYS.JOURNALS, DEFAULT_JOURNALS);
    const sorted = [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!userId) return sorted;
    return sorted.filter((j) => j.userId === userId);
  }

  public saveJournalEntry(entry: JournalEntry): void {
    const journals = this.get<JournalEntry[]>(STORAGE_KEYS.JOURNALS, DEFAULT_JOURNALS);
    // Replace if same date exists for this user, or prepend
    const existingIndex = journals.findIndex((j) => j.userId === entry.userId && j.date === entry.date);
    if (existingIndex >= 0) {
      journals[existingIndex] = entry;
      this.set(STORAGE_KEYS.JOURNALS, journals);
    } else {
      this.set(STORAGE_KEYS.JOURNALS, [entry, ...journals]);
    }

    // Increment wear counts on worn items
    if (entry.wornItemIds && entry.wornItemIds.length > 0) {
      const closet = this.getClosetItems();
      const updatedCloset = closet.map((item) => {
        if (entry.wornItemIds.includes(item.itemId)) {
          return {
            ...item,
            wearCount: item.wearCount + 1,
            lastWornAt: new Date().toISOString(),
          };
        }
        return item;
      });
      this.set(STORAGE_KEYS.CLOSET, updatedCloset);
    }
  }

  // Insights
  public getInsights(userId?: string): Insight[] {
    const all = this.get<Insight[]>(STORAGE_KEYS.INSIGHTS, [DEFAULT_INSIGHT]);
    if (!userId) return all;
    if (userId === 'user_camille') {
      const demoInsights = all.filter((i) => i.userId === 'user_camille');
      return demoInsights.length > 0 ? demoInsights : [DEFAULT_INSIGHT];
    }
    return all.filter((i) => i.userId === userId);
  }

  public saveInsight(insight: Insight): void {
    const insights = this.get<Insight[]>(STORAGE_KEYS.INSIGHTS, [DEFAULT_INSIGHT]);
    this.set(STORAGE_KEYS.INSIGHTS, [insight, ...insights]);
  }

  // Social Posts
  public getPosts(): Post[] {
    return this.get<Post[]>(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
  }

  public addPost(post: Post): void {
    const posts = this.getPosts();
    this.set(STORAGE_KEYS.POSTS, [post, ...posts]);
  }

  public toggleLike(postId: string, userId: string): Post | null {
    const posts = this.getPosts();
    const post = posts.find((p) => p.postId === postId);
    if (!post) return null;

    if (!post.likes) post.likes = [];
    const existingIndex = post.likes.findIndex((l) => l.userId === userId);
    if (existingIndex >= 0) {
      post.likes.splice(existingIndex, 1);
      post.likedByMe = false;
    } else {
      post.likes.push({ userId, createdAt: new Date().toISOString() });
      post.likedByMe = true;
    }
    post.likeCount = post.likes.length;
    this.set(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  public addComment(postId: string, comment: any): Post | null {
    const posts = this.getPosts();
    const post = posts.find((p) => p.postId === postId);
    if (!post) return null;

    if (!post.comments) post.comments = [];
    // Enforce max 280 characters as specified
    const sanitizedText = String(comment.text || '').slice(0, 280);
    const fullComment = {
      commentId: comment.commentId || `c_${Date.now()}`,
      authorId: comment.authorId,
      authorDisplayName: comment.authorDisplayName,
      authorPhotoURL: comment.authorPhotoURL,
      text: sanitizedText,
      createdAt: comment.createdAt || new Date().toISOString(),
    };
    post.comments.push(fullComment);
    post.commentCount = post.comments.length;
    this.set(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  // Retailers
  public getRetailers(): Retailer[] {
    return this.get<Retailer[]>(STORAGE_KEYS.RETAILERS, DEFAULT_RETAILERS).sort(
      (a, b) => a.priorityOrder - b.priorityOrder
    );
  }

  public saveRetailer(retailer: Retailer): void {
    const retailers = this.getRetailers();
    const idx = retailers.findIndex((r) => r.retailerId === retailer.retailerId);
    if (idx >= 0) {
      retailers[idx] = retailer;
    } else {
      retailers.push(retailer);
    }
    this.set(STORAGE_KEYS.RETAILERS, retailers);
  }

  public deleteRetailer(retailerId: string): void {
    const retailers = this.getRetailers().filter((r) => r.retailerId !== retailerId);
    this.set(STORAGE_KEYS.RETAILERS, retailers);
  }

  // Audit Logs
  public getLogs(): AdminAuditLog[] {
    return this.get<AdminAuditLog[]>(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
  }

  public addLog(log: AdminAuditLog): void {
    const logs = this.getLogs();
    this.set(STORAGE_KEYS.LOGS, [log, ...logs]);
  }

  // Friends & Social Graph
  public getRelationships(): any[] {
    return this.get<any[]>(STORAGE_KEYS.FRIENDS, DEFAULT_FRIENDS);
  }

  public getFriends(userId: string): User[] {
    const rels = this.getRelationships();
    const users = this.getAllUsers();
    const friendIds = new Set<string>();
    rels.forEach((r) => {
      if (r.userId === userId && r.status === 'friend') {
        friendIds.add(r.targetUserId);
      } else if (r.targetUserId === userId && r.status === 'friend') {
        friendIds.add(r.userId);
      }
    });
    return users.filter((u) => friendIds.has(u.uid));
  }

  public getBlockedUserIds(userId: string): string[] {
    const rels = this.getRelationships();
    return rels
      .filter((r) => r.userId === userId && r.status === 'blocked')
      .map((r) => r.targetUserId);
  }

  public getRelationshipStatus(userId: string, targetUserId: string): 'friend' | 'blocked' | 'none' {
    if (userId === targetUserId) return 'none';
    const rels = this.getRelationships();
    const direct = rels.find((r) => r.userId === userId && r.targetUserId === targetUserId);
    if (direct) return direct.status;
    const reverse = rels.find((r) => r.userId === targetUserId && r.targetUserId === userId && r.status === 'friend');
    if (reverse) return 'friend';
    return 'none';
  }

  public addFriend(userId: string, targetUserId: string): void {
    if (userId === targetUserId) return;
    const rels = this.getRelationships();
    const filtered = rels.filter(
      (r) => !(r.userId === userId && r.targetUserId === targetUserId) &&
             !(r.userId === targetUserId && r.targetUserId === userId)
    );
    filtered.push({
      relationshipId: `rel_${Date.now()}`,
      userId,
      targetUserId,
      status: 'friend',
      createdAt: new Date().toISOString(),
    });
    this.set(STORAGE_KEYS.FRIENDS, filtered);
  }

  public removeFriend(userId: string, targetUserId: string): void {
    const rels = this.getRelationships();
    const filtered = rels.filter(
      (r) => !(r.userId === userId && r.targetUserId === targetUserId) &&
             !(r.userId === targetUserId && r.targetUserId === userId)
    );
    this.set(STORAGE_KEYS.FRIENDS, filtered);
  }

  public blockUser(userId: string, targetUserId: string): void {
    if (userId === targetUserId) return;
    const rels = this.getRelationships();
    const filtered = rels.filter(
      (r) => !(r.userId === userId && r.targetUserId === targetUserId) &&
             !(r.userId === targetUserId && r.targetUserId === userId)
    );
    filtered.push({
      relationshipId: `block_${Date.now()}`,
      userId,
      targetUserId,
      status: 'blocked',
      createdAt: new Date().toISOString(),
    });
    this.set(STORAGE_KEYS.FRIENDS, filtered);
  }

  public unblockUser(userId: string, targetUserId: string): void {
    const rels = this.getRelationships();
    const filtered = rels.filter(
      (r) => !(r.userId === userId && r.targetUserId === targetUserId && r.status === 'blocked')
    );
    this.set(STORAGE_KEYS.FRIENDS, filtered);
  }

  // Filtered feed:
  // "There should be a friends section with logic to friend, block, or remove, etc., and that is the feed you see. Everyone sees the admin."
  public getPostsForUser(currentUserId: string): Post[] {
    const allPosts = this.getPosts();
    const blockedIds = new Set(this.getBlockedUserIds(currentUserId));
    const allUsers = this.getAllUsers();
    const adminUids = new Set(allUsers.filter((u) => u.role === 'admin').map((u) => u.uid));
    const friendUsers = this.getFriends(currentUserId);
    const friendUids = new Set(friendUsers.map((u) => u.uid));

    return allPosts.filter((p) => {
      // Exclude blocked accounts
      if (blockedIds.has(p.authorId)) return false;
      // Current user's own posts
      if (p.authorId === currentUserId) return true;
      // Everyone sees admin posts
      if (adminUids.has(p.authorId)) return true;
      // Visible if friend
      if (friendUids.has(p.authorId)) return true;
      return false;
    });
  }

  // Admin Management:
  // "The admin console should only be visible to admins. With my account being the default admin (I should be able to add and remove admins from the console), oharajoshua333@gmail.com."
  public setAdminRole(targetUid: string, makeAdmin: boolean, performingAdminUid: string): boolean {
    const users = this.getAllUsers();
    const target = users.find((u) => u.uid === targetUid);
    if (!target) return false;

    // Protect default root admin
    if (target.email.toLowerCase() === 'oharajoshua333@gmail.com' && !makeAdmin) {
      return false;
    }

    target.role = makeAdmin ? 'admin' : 'user';
    target.updatedAt = new Date().toISOString();
    this.set(STORAGE_KEYS.USERS, users);

    this.addLog({
      logId: `log_${Date.now()}`,
      adminId: performingAdminUid,
      targetUserId: targetUid,
      actionType: makeAdmin ? 'SET_ADMIN' : 'REMOVE_ADMIN',
      details: {
        reason: makeAdmin ? 'Promoted to platform Administrator' : 'Revoked Administrator access',
        priorStatus: makeAdmin ? 'user' : 'admin',
      },
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // User Reset Data:
  // "A user should be able to reset their account data."
  public resetUserAccountData(userId: string): void {
    const closet = this.get<ClosetItem[]>(STORAGE_KEYS.CLOSET, DEFAULT_CLOSET);
    this.set(
      STORAGE_KEYS.CLOSET,
      closet.filter((i) => i.userId !== userId)
    );

    const outfits = this.get<Outfit[]>(STORAGE_KEYS.OUTFITS, DEFAULT_OUTFITS);
    this.set(
      STORAGE_KEYS.OUTFITS,
      outfits.filter((o) => o.userId !== userId)
    );

    const journals = this.get<JournalEntry[]>(STORAGE_KEYS.JOURNALS, DEFAULT_JOURNALS);
    this.set(
      STORAGE_KEYS.JOURNALS,
      journals.filter((j) => j.userId !== userId)
    );

    const insights = this.get<Insight[]>(STORAGE_KEYS.INSIGHTS, [DEFAULT_INSIGHT]);
    this.set(
      STORAGE_KEYS.INSIGHTS,
      insights.filter((ins) => ins.userId !== userId)
    );

    const posts = this.get<Post[]>(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    this.set(
      STORAGE_KEYS.POSTS,
      posts.filter((p) => p.authorId !== userId)
    );

    const resetUsers = this.get<string[]>(STORAGE_KEYS.RESET_USERS, []);
    if (!resetUsers.includes(userId)) {
      this.set(STORAGE_KEYS.RESET_USERS, [...resetUsers, userId]);
    }

    this.addLog({
      logId: `log_${Date.now()}`,
      adminId: userId,
      targetUserId: userId,
      actionType: 'RESET_DATA',
      details: {
        reason: 'User executed self-service reset of wardrobe data',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Authentication Flows
  public signInUserByEmail(email: string, displayName?: string, photoURL?: string): User {
    const users = this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    const isDefaultAdmin = cleanEmail === 'oharajoshua333@gmail.com';

    if (!user) {
      const name = displayName?.trim() || cleanEmail.split('@')[0];
      user = {
        uid: isDefaultAdmin ? 'admin_joshua' : `user_${Date.now()}`,
        email: cleanEmail,
        displayName: name,
        photoURL:
          photoURL ||
          (isDefaultAdmin
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
        bio: isDefaultAdmin ? 'Platform Lead & Systems Architect.' : 'Member of MEFE personal style community.',
        role: isDefaultAdmin ? 'admin' : 'user',
        permissions: isDefaultAdmin ? ADMIN_PERMISSIONS : DEFAULT_USER_PERMISSIONS,
        isDemo: false,
        isPremium: isDefaultAdmin,
        preferredLanguage: 'en',
        status: { state: 'active', until: null, reason: 'Active account' },
        avatarConfig: {
          baseModelId: 'cher_classic',
          skinTone: '#F5D0C5',
          hairStyle: 'long_wavy',
          hairColor: '#4A2E18',
          canvasScale: 1.0,
        },
        followersCount: isDefaultAdmin ? 3450 : 0,
        followingCount: isDefaultAdmin ? 180 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.set(STORAGE_KEYS.USERS, [...users, user]);
    } else if (isDefaultAdmin && user.role !== 'admin') {
      user.role = 'admin';
      user.permissions = ADMIN_PERMISSIONS;
      this.updateUser(user);
    }

    this.set(STORAGE_KEYS.CURRENT_USER_ID, user.uid);
    return user;
  }

  public signInWithGoogle(googleProfile?: { email: string; displayName: string; photoURL: string }): User {
    const email = googleProfile?.email || 'oharajoshua333@gmail.com';
    const name = googleProfile?.displayName || (email === 'oharajoshua333@gmail.com' ? "Joshua O'Hara (Admin)" : 'Google User');
    const photo = googleProfile?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
    return this.signInUserByEmail(email, name, photo);
  }

  public logout(): User {
    // Reverts to the Demo Profile (Camille Laurent)
    this.set(STORAGE_KEYS.CURRENT_USER_ID, 'user_camille');
    return this.getCurrentUser();
  }

  // Cloud Database Sync across devices
  public async syncToCloud(userId: string): Promise<{ success: boolean; lastSyncedAt: string; message: string }> {
    try {
      const user = this.getAllUsers().find((u) => u.uid === userId);
      const payload = {
        data: {
          closetItems: this.getClosetItems(userId),
          outfits: this.getOutfits(userId),
          journals: this.getJournals(userId),
          insights: this.getInsights(userId),
          posts: this.getPostsForUser(userId),
          userProfile: user,
        },
        deviceInfo: typeof navigator !== 'undefined' ? `${navigator.userAgent.slice(0, 40)}` : 'Web',
      };

      const res = await fetch(`/api/sync/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Cloud sync request returned error');
      const json = await res.json();
      const lastSyncedAt = json.lastSyncedAt || new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`mefe_last_sync_${userId}`, lastSyncedAt);
      }
      return {
        success: true,
        lastSyncedAt,
        message: 'Synchronized with cloud database across devices',
      };
    } catch (err: any) {
      const lastSyncedAt =
        (typeof localStorage !== 'undefined' && localStorage.getItem(`mefe_last_sync_${userId}`)) ||
        new Date().toISOString();
      return {
        success: false,
        lastSyncedAt,
        message: err.message || 'Saved locally on this device',
      };
    }
  }

  public async syncFromCloud(userId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/sync/${userId}`);
      if (!res.ok) return false;
      const json = await res.json();
      if (json.exists && json.data) {
        if (Array.isArray(json.data.closetItems)) {
          const localAll = this.get<ClosetItem[]>(STORAGE_KEYS.CLOSET, DEFAULT_CLOSET);
          const others = localAll.filter((i) => i.userId !== userId);
          this.set(STORAGE_KEYS.CLOSET, [...others, ...json.data.closetItems]);
        }
        if (Array.isArray(json.data.outfits)) {
          const localOutfits = this.get<Outfit[]>(STORAGE_KEYS.OUTFITS, DEFAULT_OUTFITS);
          const others = localOutfits.filter((o) => o.userId !== userId);
          this.set(STORAGE_KEYS.OUTFITS, [...others, ...json.data.outfits]);
        }
        if (Array.isArray(json.data.journals)) {
          const localJournals = this.get<JournalEntry[]>(STORAGE_KEYS.JOURNALS, DEFAULT_JOURNALS);
          const others = localJournals.filter((j) => j.userId !== userId);
          this.set(STORAGE_KEYS.JOURNALS, [...others, ...json.data.journals]);
        }
        if (json.data.userProfile) {
          this.updateUser(json.data.userProfile);
        }
        if (json.lastSyncedAt && typeof localStorage !== 'undefined') {
          localStorage.setItem(`mefe_last_sync_${userId}`, json.lastSyncedAt);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getLastSyncTime(userId: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(`mefe_last_sync_${userId}`);
  }
}

export const storage = new StorageEngine();
storage.init();
