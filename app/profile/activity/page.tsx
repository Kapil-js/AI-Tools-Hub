'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Download, 
  Heart, 
  MessageCircle, 
  Image as ImageIcon,
  FileText,
  User,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'download' | 'like' | 'comment' | 'tool_use';
  description: string;
  timestamp: any;
  metadata?: any;
}

export default function ActivityPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserActivity();
    }
  }, [user]);

  const fetchUserActivity = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user's blog interactions
      const blogCommentsQuery = query(
        collection(db, 'blog_comments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const commentsSnapshot = await getDocs(blogCommentsQuery);
      
      const activityItems: ActivityItem[] = [];
      
      // Add comments to activity
      commentsSnapshot.forEach(doc => {
        const data = doc.data();
        activityItems.push({
          id: doc.id,
          type: 'comment',
          description: `Commented on a blog post: "${data.content.substring(0, 50)}..."`,
          timestamp: data.createdAt,
          metadata: { postId: data.postId }
        });
      });

      // Add some mock tool usage activities
      const mockActivities = [
        {
          id: 'tool1',
          type: 'tool_use' as const,
          description: 'Used Image Enhancer tool',
          timestamp: { toDate: () => new Date(Date.now() - 86400000) }, // 1 day ago
          metadata: { tool: 'image-enhancer' }
        },
        {
          id: 'tool2',
          type: 'download' as const,
          description: 'Downloaded enhanced image',
          timestamp: { toDate: () => new Date(Date.now() - 172800000) }, // 2 days ago
          metadata: { tool: 'image-enhancer' }
        },
        {
          id: 'tool3',
          type: 'tool_use' as const,
          description: 'Generated Instagram captions',
          timestamp: { toDate: () => new Date(Date.now() - 259200000) }, // 3 days ago
          metadata: { tool: 'instagram-caption' }
        }
      ];

      activityItems.push(...mockActivities);
      
      // Sort by timestamp
      activityItems.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return bTime.getTime() - aTime.getTime();
      });

      setActivities(activityItems);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="w-4 h-4" />;
      case 'like': return <Heart className="w-4 h-4" />;
      case 'comment': return <MessageCircle className="w-4 h-4" />;
      case 'tool_use': return <ImageIcon className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'download': return 'bg-green-100 text-green-600';
      case 'like': return 'bg-red-100 text-red-600';
      case 'comment': return 'bg-blue-100 text-blue-600';
      case 'tool_use': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please login to view your activity</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/profile">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Activity History</h1>
            <p className="text-slate-600">Track your interactions and tool usage</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent actions and tool usage across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600 mb-4">Start using our AI tools to see your activity here</p>
                  <Link href="/tools">
                    <Button>Explore Tools</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                          {activity.type === 'tool_use' && activity.metadata?.tool && (
                            <Badge variant="outline" className="text-xs">
                              {activity.metadata.tool.replace('-', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {activities.filter(a => a.type === 'tool_use').length}
                </div>
                <div className="text-sm text-slate-600">Tools Used</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {activities.filter(a => a.type === 'download').length}
                </div>
                <div className="text-sm text-slate-600">Downloads</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {activities.filter(a => a.type === 'comment').length}
                </div>
                <div className="text-sm text-slate-600">Comments</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {activities.filter(a => a.type === 'like').length}
                </div>
                <div className="text-sm text-slate-600">Likes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}