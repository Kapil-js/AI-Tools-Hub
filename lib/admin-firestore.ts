import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  startAfter,
  DocumentSnapshot,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { FirestoreService } from './firestore';

// Admin-specific interfaces
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Timestamp;
  createdBy: string;
  isActive: boolean;
  lastActive: Timestamp;
}

export interface WebsiteContent {
  id?: string;
  type: 'hero' | 'about' | 'features' | 'testimonials' | 'footer';
  title: string;
  content: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    uid: string;
    name: string;
    email: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  views: number;
  likes: number;
}

export interface AITool {
  id?: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  isActive: boolean;
  isPremium: boolean;
  features: string[];
  usageCount: number;
  rating: number;
  reviews: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
  contactEmail: string;
  supportEmail: string;
  analytics: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  maintenance: {
    isEnabled: boolean;
    message: string;
  };
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  premiumUsers: number;
}

export interface ContentStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
}

export interface ToolStats {
  totalTools: number;
  activeTools: number;
  totalUsage: number;
  popularTools: { name: string; usage: number }[];
}

export class AdminFirestoreService extends FirestoreService {
  // Admin Management
  static async createAdmin(adminData: Omit<AdminUser, 'createdAt' | 'lastActive'>): Promise<string> {
    const data = {
      ...adminData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };
    return this.create<AdminUser>('admins', data);
  }

  static async getAllAdmins(): Promise<AdminUser[]> {
    return this.getMany<AdminUser>('admins', [orderBy('createdAt', 'desc')]);
  }

  static async updateAdminRole(adminId: string, role: AdminUser['role'], permissions: string[]): Promise<void> {
    return this.update('admins', adminId, { role, permissions });
  }

  static async toggleAdminStatus(adminId: string, isActive: boolean): Promise<void> {
    return this.update('admins', adminId, { isActive });
  }

  // User Management
  static async getAllUsers(lastDoc?: DocumentSnapshot, pageSize = 20) {
    const constraints = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (lastDoc) {
      constraints.push(startAfter(lastDoc) as any);
    }
    
    const querySnapshot = await getDocs(query(collection(db, 'users'), ...constraints));
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      _doc: doc // Store document reference for pagination
    }));
    
    return {
      users,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === pageSize
    };
  }

  static async searchUsers(searchTerm: string): Promise<any[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia or similar for production
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((user: any) => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }

  static async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    return this.update('users', userId, { isActive });
  }

  static async deleteUser(userId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Delete user document
    batch.delete(doc(db, 'users', userId));
    
    // Delete user's tool usage
    const usageQuery = query(collection(db, 'toolUsage'), where('userId', '==', userId));
    const usageSnapshot = await getDocs(usageQuery);
    usageSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    await batch.commit();
  }

  // Website Content Management
  static async getWebsiteContent(type?: string): Promise<WebsiteContent[]> {
    const constraints = [orderBy('updatedAt', 'desc')];
    if (type) {
      constraints.unshift(where('type', '==', type));
    }
    return this.getMany<WebsiteContent>('websiteContent', constraints);
  }

  static async createContent(content: Omit<WebsiteContent, 'createdAt' | 'updatedAt'>): Promise<string> {
    const data = {
      ...content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return this.create<WebsiteContent>('websiteContent', data);
  }

  static async updateContent(contentId: string, updates: Partial<WebsiteContent>): Promise<void> {
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    return this.update('websiteContent', contentId, data);
  }

  // Blog Management
  static async getAllPosts(status?: BlogPost['status']): Promise<BlogPost[]> {
    const constraints = [orderBy('createdAt', 'desc')];
    if (status) {
      constraints.unshift(where('status', '==', status));
    }
    return this.getMany<BlogPost>('blogPosts', constraints);
  }

  static async createPost(post: Omit<BlogPost, 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
    const data = {
      ...post,
      views: 0,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return this.create<BlogPost>('blogPosts', data);
  }

  static async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    return this.update('blogPosts', postId, data);
  }

  static async deletePost(postId: string): Promise<void> {
    return this.delete('blogPosts', postId);
  }

  static async incrementPostViews(postId: string): Promise<void> {
    const postRef = doc(db, 'blogPosts', postId);
    return updateDoc(postRef, {
      views: increment(1)
    });
  }

  // AI Tools Management
  static async getAllTools(): Promise<AITool[]> {
    return this.getMany<AITool>('aiTools', [orderBy('createdAt', 'desc')]);
  }

  static async createTool(tool: Omit<AITool, 'createdAt' | 'updatedAt' | 'usageCount' | 'rating' | 'reviews'>): Promise<string> {
    const data = {
      ...tool,
      usageCount: 0,
      rating: 0,
      reviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return this.create<AITool>('aiTools', data);
  }

  static async updateTool(toolId: string, updates: Partial<AITool>): Promise<void> {
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    return this.update('aiTools', toolId, data);
  }

  static async deleteTool(toolId: string): Promise<void> {
    return this.delete('aiTools', toolId);
  }

  // Site Settings
  static async getSiteSettings(): Promise<SiteSettings | null> {
    const settings = await this.getMany<SiteSettings>('siteSettings', [limit(1)]);
    return settings.length > 0 ? settings[0] : null;
  }

  static async updateSiteSettings(settings: Partial<SiteSettings>, updatedBy: string): Promise<void> {
    const currentSettings = await this.getSiteSettings();
    const data = {
      ...settings,
      updatedAt: serverTimestamp(),
      updatedBy,
    };

    if (currentSettings && currentSettings.id) {
      return this.update('siteSettings', currentSettings.id, data);
    } else {
      return this.create<SiteSettings>('siteSettings', data);
    }
  }

  // Analytics and Stats
  static async getUserStats(): Promise<UserStats> {
    const users = await this.getMany<any>('users');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive !== false).length;
    const newUsersToday = users.filter(user => {
      const createdAt = user.createdAt?.toDate();
      return createdAt && createdAt >= today;
    }).length;
    const newUsersThisWeek = users.filter(user => {
      const createdAt = user.createdAt?.toDate();
      return createdAt && createdAt >= thisWeek;
    }).length;
    const newUsersThisMonth = users.filter(user => {
      const createdAt = user.createdAt?.toDate();
      return createdAt && createdAt >= thisMonth;
    }).length;
    const premiumUsers = users.filter(user => user.subscription?.plan !== 'free').length;

    return {
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      premiumUsers,
    };
  }

  static async getContentStats(): Promise<ContentStats> {
    const posts = await this.getMany<BlogPost>('blogPosts');
    
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.status === 'published').length;
    const draftPosts = posts.filter(post => post.status === 'draft').length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
    };
  }

  static async getToolStats(): Promise<ToolStats> {
    const tools = await this.getMany<AITool>('aiTools');
    const usage = await this.getMany<any>('toolUsage');
    
    const totalTools = tools.length;
    const activeTools = tools.filter(tool => tool.isActive).length;
    const totalUsage = usage.reduce((sum, u) => sum + (u.usageCount || 0), 0);
    
    // Get popular tools
    const toolUsageMap = usage.reduce((map, u) => {
      map[u.toolName] = (map[u.toolName] || 0) + u.usageCount;
      return map;
    }, {} as Record<string, number>);

    const popularTools = Object.entries(toolUsageMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, usage]) => ({ name, usage }));

    return {
      totalTools,
      activeTools,
      totalUsage,
      popularTools,
    };
  }

  // Bulk Operations
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    
    userIds.forEach(userId => {
      batch.delete(doc(db, 'users', userId));
    });
    
    await batch.commit();
  }

  static async bulkUpdateToolStatus(toolIds: string[], isActive: boolean): Promise<void> {
    const batch = writeBatch(db);
    
    toolIds.forEach(toolId => {
      batch.update(doc(db, 'aiTools', toolId), { isActive, updatedAt: serverTimestamp() });
    });
    
    await batch.commit();
  }
}
