'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { FirestoreService } from '@/lib/firestore';

interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  isActive: boolean;
}

interface AdminContextType {
  isAdmin: boolean;
  adminData: AdminUser | null;
  loading: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const adminUser = await FirestoreService.getById<AdminUser>('admins', user.uid);
      
      if (adminUser && adminUser.isActive) {
        setIsAdmin(true);
        setAdminData(adminUser);
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    if (!adminData) return false;
    if (adminData.role === 'super_admin') return true;
    return adminData.permissions.includes(permission);
  };

  const refreshAdminStatus = async () => {
    await checkAdminStatus();
  };

  const permissions = adminData?.permissions || [];

  const value: AdminContextType = {
    isAdmin,
    adminData,
    loading,
    permissions,
    hasPermission,
    refreshAdminStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
