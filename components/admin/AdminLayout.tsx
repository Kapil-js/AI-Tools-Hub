'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Wrench,
  BarChart3,
  Globe,
  Shield,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Mail,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'users.view',
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    permission: 'content.view',
  },
  {
    name: 'Blog Posts',
    href: '/admin/blog',
    icon: FileText,
    permission: 'blog.view',
  },
  {
    name: 'Contact Messages',
    href: '/admin/contact-messages',
    icon: Mail,
    permission: 'content.view',
  },
  {
    name: 'AI Tools',
    href: '/admin/tools',
    icon: Wrench,
    permission: 'tools.view',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'analytics.view',
  },
  {
    name: 'Website Settings',
    href: '/admin/website-settings',
    icon: Globe,
    permission: 'settings.view',
  },
  {
    name: 'Admin Management',
    href: '/admin/admins',
    icon: Shield,
    permission: 'admins.view',
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'system.view',
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { adminData, hasPermission, isAdmin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    console.log('AdminLayout useEffect - isAdmin:', isAdmin, 'adminData:', adminData);
    if (!isAdmin) {
      console.log('Not admin, skipping notification listener');
      return;
    }

    console.log('Setting up notification listener...');
    const notificationsRef = collection(db, 'admin_notifications');
    const q = query(notificationsRef, where('isRead', '==', false));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Notification snapshot received, size:', snapshot.size);
      const notificationData: any[] = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        console.log('Notification:', data);
        notificationData.push(data);
      });
      console.log('Setting notifications:', notificationData.length);
      setNotifications(notificationData);
    }, (error) => {
      console.error('Notification listener error:', error);
    });

    return () => {
      console.log('Cleaning up notification listener');
      unsubscribe();
    };
  }, [isAdmin, adminData]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'admin_notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatNotificationTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  if (!isAdmin || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin panel.
          </p>
          <Button onClick={() => router.push('/')}>
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permission) || adminData.role === 'super_admin'
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-6 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
            <AvatarFallback>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.displayName || 'Admin User'}
            </p>
            <Badge variant="outline" className="text-xs">
              {adminData.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-white dark:bg-gray-800">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1" />
            
            {/* Notifications */}
            <div className="relative mr-4">
              <DropdownMenu open={showNotifications} onOpenChange={(open) => {
                console.log('Notification dropdown toggled:', open, 'notifications count:', notifications.length);
                setShowNotifications(open);
              }}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative"
                    onClick={() => console.log('Bell clicked, notifications:', notifications)}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                    {/* Debug badge - always show count */}
                    <span className="absolute -bottom-2 -right-2 text-xs bg-blue-500 text-white px-1 rounded">
                      {notifications.length}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications ({notifications.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-4 cursor-pointer"
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                          if (notification.type === 'contact_form') {
                            router.push('/admin/contact-messages');
                          }
                          setShowNotifications(false);
                        }}
                      >
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.createdAt)}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length > 5 && (
                      <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                        +{notifications.length - 5} more notifications
                      </DropdownMenuItem>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.displayName || 'Admin'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.displayName || 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  User Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/')}>
                  <Globe className="mr-2 h-4 w-4" />
                  View Website
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
