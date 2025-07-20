'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Activity,
  TrendingUp,
  Tool,
  Calendar,
  Eye,
  Heart,
  Globe,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AdminFirestoreService } from '@/lib/admin-firestore';
import type { UserStats, ContentStats, ToolStats } from '@/lib/admin-firestore';
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
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            {change !== undefined && (
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
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
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [toolStats, setToolStats] = useState<ToolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, content, tools] = await Promise.all([
          AdminFirestoreService.getUserStats(),
          AdminFirestoreService.getContentStats(),
          AdminFirestoreService.getToolStats()
        ]);
        
        setUserStats(users);
        setContentStats(content);
        setToolStats(tools);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add AI Tool',
      description: 'Add a new AI tool to the platform',
      icon: Tool,
      href: '/admin/tools/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Post',
      description: 'Write a new blog post',
      icon: FileText,
      href: '/admin/blog/new',
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
      title: 'Site Settings',
      description: 'Configure website settings',
      icon: Globe,
      href: '/admin/website-settings',
      color: 'bg-orange-500'
    }
  ];

  return (
    <AdminLayout>
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
            value={userStats?.totalUsers || 0}
            change={12.5}
            changeLabel="from last month"
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Active Users"
            value={userStats?.activeUsers || 0}
            change={8.2}
            changeLabel="from last week"
            icon={Activity}
            loading={loading}
          />
          <StatCard
            title="Blog Posts"
            value={contentStats?.totalPosts || 0}
            change={5.4}
            changeLabel="from last month"
            icon={FileText}
            loading={loading}
          />
          <StatCard
            title="AI Tools"
            value={toolStats?.totalTools || 0}
            change={15.3}
            changeLabel="from last month"
            icon={Tool}
            loading={loading}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="New Users Today"
            value={userStats?.newUsersToday || 0}
            icon={TrendingUp}
            loading={loading}
          />
          <StatCard
            title="Premium Users"
            value={userStats?.premiumUsers || 0}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Total Views"
            value={contentStats?.totalViews || 0}
            icon={Eye}
            loading={loading}
          />
          <StatCard
            title="Total Likes"
            value={contentStats?.totalLikes || 0}
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

          {/* Popular Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Popular AI Tools</CardTitle>
              <CardDescription>
                Most used tools this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : toolStats?.popularTools && toolStats.popularTools.length > 0 ? (
                <div className="space-y-3">
                  {toolStats.popularTools.slice(0, 5).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tool.usage} uses
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{tool.usage}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Tool className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tool usage data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Blog Performance
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Published Posts</span>
                    <span className="font-semibold">{contentStats?.publishedPosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Draft Posts</span>
                    <span className="font-semibold">{contentStats?.draftPosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Views</span>
                    <span className="font-semibold">{contentStats?.totalViews || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Likes</span>
                    <span className="font-semibold">{contentStats?.totalLikes || 0}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                User Growth
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">New Today</span>
                    <span className="font-semibold">{userStats?.newUsersToday || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New This Week</span>
                    <span className="font-semibold">{userStats?.newUsersThisWeek || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New This Month</span>
                    <span className="font-semibold">{userStats?.newUsersThisMonth || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Users</span>
                    <span className="font-semibold">{userStats?.premiumUsers || 0}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tools Usage
                <Tool className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Tools</span>
                    <span className="font-semibold">{toolStats?.activeTools || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Usage</span>
                    <span className="font-semibold">{toolStats?.totalUsage || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. per Tool</span>
                    <span className="font-semibold">
                      {toolStats?.totalTools ? Math.round((toolStats?.totalUsage || 0) / toolStats.totalTools) : 0}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
