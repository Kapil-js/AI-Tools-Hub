'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Eye,
  Heart,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalLikes: number;
  toolUsage: { [key: string]: number };
  userGrowth: { date: string; users: number }[];
  topPosts: { title: string; views: number; likes: number }[];
  recentActivity: { type: string; description: string; timestamp: any }[];
}

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

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    toolUsage: {},
    userGrowth: [],
    topPosts: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch users data
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch blog posts data
      const postsSnapshot = await getDocs(collection(db, 'blog_posts'));
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Calculate analytics
      const totalUsers = users.length;
      const activeUsers = users.filter((user: any) => user.isActive !== false).length;
      
      // Calculate new users today (mock data for now)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = users.filter((user: any) => {
        if (!user.createdAt) return false;
        const userDate = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        return userDate >= today;
      }).length;
      
      const totalPosts = posts.length;
      const publishedPosts = posts.filter((post: any) => post.status === 'published').length;
      const totalViews = posts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);
      const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.likes || 0), 0);
      
      // Mock tool usage data
      const toolUsage = {
        'Image Enhancer': Math.floor(Math.random() * 500) + 200,
        'Face Swapper': Math.floor(Math.random() * 300) + 150,
        'Article Writer': Math.floor(Math.random() * 400) + 180,
        'PDF Compressor': Math.floor(Math.random() * 250) + 100,
        'Resume Builder': Math.floor(Math.random() * 200) + 80,
        'Instagram Caption': Math.floor(Math.random() * 350) + 120,
        'YouTube Thumbnail': Math.floor(Math.random() * 180) + 90
      };
      
      // Mock user growth data (last 7 days)
      const userGrowth = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString(),
          users: Math.floor(Math.random() * 50) + 10
        };
      });
      
      // Top posts
      const topPosts = posts
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map((post: any) => ({
          title: post.title,
          views: post.views || 0,
          likes: post.likes || 0
        }));
      
      // Recent activity (mock data)
      const recentActivity = [
        {
          type: 'user_signup',
          description: 'New user registered',
          timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        },
        {
          type: 'post_published',
          description: 'Blog post "AI Tools Guide" published',
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          type: 'tool_usage',
          description: 'Image Enhancer used 25 times',
          timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        },
        {
          type: 'user_premium',
          description: 'User upgraded to premium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        }
      ];
      
      setAnalytics({
        totalUsers,
        activeUsers,
        newUsersToday,
        totalPosts,
        publishedPosts,
        totalViews,
        totalLikes,
        toolUsage,
        userGrowth,
        topPosts,
        recentActivity
      });
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportAnalytics = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalUsers: analytics.totalUsers,
        activeUsers: analytics.activeUsers,
        totalPosts: analytics.totalPosts,
        publishedPosts: analytics.publishedPosts,
        totalViews: analytics.totalViews,
        totalLikes: analytics.totalLikes
      },
      toolUsage: analytics.toolUsage,
      topPosts: analytics.topPosts
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'post_published':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'tool_usage':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'user_premium':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your platform's performance and user engagement
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          change={12.5}
          changeLabel="from last month"
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={analytics.activeUsers}
          change={8.2}
          changeLabel="from last week"
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title="Published Posts"
          value={analytics.publishedPosts}
          change={15.3}
          changeLabel="from last month"
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Total Views"
          value={analytics.totalViews}
          change={23.1}
          changeLabel="from last week"
          icon={BarChart3}
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Users Today"
          value={analytics.newUsersToday}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard
          title="Total Posts"
          value={analytics.totalPosts}
          icon={Calendar}
          loading={loading}
        />
        <StatCard
          title="Total Likes"
          value={analytics.totalLikes}
          icon={Heart}
          loading={loading}
        />
        <StatCard
          title="Engagement Rate"
          value="68.4%"
          change={5.2}
          icon={Activity}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tool Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Statistics</CardTitle>
            <CardDescription>
              Most popular AI tools on your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.toolUsage)
                .sort(([,a], [,b]) => b - a)
                .map(([tool, usage]) => (
                  <div key={tool} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-medium">{tool}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(usage / Math.max(...Object.values(analytics.toolUsage))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{usage}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>
              Most viewed blog posts this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPosts.length > 0 ? (
                analytics.topPosts.map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{post.title}</div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views} views
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.likes} likes
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No published posts found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth (Last 7 Days)</CardTitle>
          <CardDescription>
            Daily new user registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.userGrowth.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 rounded-t w-full min-h-[20px] flex items-end justify-center text-white text-xs font-medium"
                  style={{ height: `${(day.users / Math.max(...analytics.userGrowth.map(d => d.users))) * 200 + 20}px` }}
                >
                  {day.users}
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  {day.date.split('/').slice(0, 2).join('/')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}