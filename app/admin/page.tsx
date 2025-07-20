'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Activity,
  TrendingUp,
  Settings,
  Eye,
  Heart,
  Plus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  loading?: boolean;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            {change !== undefined && (
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change)}%
                </span>
                {changeLabel && ` ${changeLabel}`}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalPosts: 45,
    totalTools: 12,
    newUsersToday: 23,
    premiumUsers: 156,
    totalViews: 15420,
    totalLikes: 2341
  });

  const quickActions = [
    {
      title: 'Add AI Tool',
      description: 'Add a new AI tool to the platform',
      icon: Settings,
      href: '/admin/tools',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Post',
      description: 'Write a new blog post',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-green-500'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500'
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-3 h-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={12.5}
          changeLabel="from last month"
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change={8.2}
          changeLabel="from last week"
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title="Blog Posts"
          value={stats.totalPosts}
          change={5.4}
          changeLabel="from last month"
          icon={FileText}
          loading={loading}
        />
        <StatCard
          title="AI Tools"
          value={stats.totalTools}
          change={15.3}
          changeLabel="from last month"
          icon={Settings}
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Users Today"
          value={stats.newUsersToday}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          icon={Heart}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className={`p-2 rounded-md ${action.color} text-white mr-3`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current platform health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Status</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Services</span>
                <Badge className="bg-green-500">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cache</span>
                <Badge className="bg-yellow-500">Warming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest events and system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration</p>
                <p className="text-xs text-muted-foreground">user@example.com joined the platform</p>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI Tool used</p>
                <p className="text-xs text-muted-foreground">Image enhancer processed 15 images</p>
              </div>
              <span className="text-xs text-muted-foreground">5m ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New blog post published</p>
                <p className="text-xs text-muted-foreground">"Getting Started with AI Tools"</p>
              </div>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
