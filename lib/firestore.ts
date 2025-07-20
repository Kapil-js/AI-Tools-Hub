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
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// User data types
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due';
    currentPeriodEnd: Timestamp;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

// Tool usage data
export interface ToolUsage {
  id?: string;
  userId: string;
  toolName: string;
  usageCount: number;
  lastUsed: Timestamp;
  createdAt: Timestamp;
}

// Generic CRUD operations
export class FirestoreService {
  // Create a document
  static async create<T extends DocumentData>(
    collectionName: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Read a single document
  static async getById<T extends DocumentData>(
    collectionName: string, 
    id: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Read multiple documents with optional query constraints
  static async getMany<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  static async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserData | null> {
    return this.getById<UserData>('users', uid);
  }

  // Update user profile
  static async updateUserProfile(uid: string, data: Partial<UserData>): Promise<void> {
    return this.update('users', uid, data);
  }

  // Get user's tool usage
  static async getUserToolUsage(uid: string): Promise<ToolUsage[]> {
    return this.getMany<ToolUsage>('toolUsage', [
      where('userId', '==', uid),
      orderBy('lastUsed', 'desc')
    ]);
  }

  // Track tool usage
  static async trackToolUsage(
    userId: string, 
    toolName: string
  ): Promise<void> {
    try {
      // Check if usage record exists for this tool and user
      const existingUsage = await this.getMany<ToolUsage>('toolUsage', [
        where('userId', '==', userId),
        where('toolName', '==', toolName),
        limit(1)
      ]);

      if (existingUsage.length > 0) {
        // Update existing record
        const usage = existingUsage[0];
        await this.update('toolUsage', usage.id!, {
          usageCount: usage.usageCount + 1,
          lastUsed: serverTimestamp(),
        });
      } else {
        // Create new record
        await this.create<ToolUsage>('toolUsage', {
          userId,
          toolName,
          usageCount: 1,
          lastUsed: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error tracking tool usage:', error);
      throw error;
    }
  }

  // Get popular tools (most used across all users)
  static async getPopularTools(limitCount: number = 10): Promise<{ toolName: string; totalUsage: number }[]> {
    try {
      const usageData = await this.getMany<ToolUsage>('toolUsage', [
        orderBy('usageCount', 'desc'),
        limit(limitCount * 5) // Get more to aggregate
      ]);

      // Aggregate usage by tool name
      const toolStats = usageData.reduce((acc, usage) => {
        acc[usage.toolName] = (acc[usage.toolName] || 0) + usage.usageCount;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array and sort
      return Object.entries(toolStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limitCount)
        .map(([toolName, totalUsage]) => ({ toolName, totalUsage }));
    } catch (error) {
      console.error('Error getting popular tools:', error);
      throw error;
    }
  }
}

// Export commonly used Firestore functions
export {
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
  Timestamp
};
