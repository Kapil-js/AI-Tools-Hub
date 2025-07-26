'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  User, 
  Eye,
  Heart,
  ArrowRight,
  Filter
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl?: string;
  tags: string[];
  views: number;
  likes: number;
  featured: boolean;
  createdAt: any;
  publishedAt: any;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'blog_posts');
      
      // First try to get all posts to debug
      let querySnapshot;
      try {
        const q = query(
          postsRef, 
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (error) {
        console.log('Ordered query failed, trying simple query:', error);
        // Fallback to simple query without ordering
        const q = query(postsRef, where('status', '==', 'published'));
        querySnapshot = await getDocs(q);
      }
      
      console.log('Found posts:', querySnapshot.size);
      
      const postsData: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Post data:', { id: doc.id, title: data.title, status: data.status });
        postsData.push({
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          author: 'Admin',
          imageUrl: data.imageUrl || '',
          tags: data.tags || [],
          views: data.views || 0,
          likes: data.likes || 0,
          featured: data.featured || false,
          createdAt: data.createdAt,
          publishedAt: data.publishedAt
        });
      });
      
      setPosts(postsData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const PostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${featured ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : ''}`}>
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
            <Calendar className="w-4 h-4 ml-2" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          {post.featured && (
            <Badge className="bg-yellow-500">Featured</Badge>
          )}
        </div>
        <CardTitle className={`group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {post.excerpt}
        </CardDescription>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </span>
          </div>
          <Link href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}>
            <Button variant="ghost" size="sm" className="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover insights, tutorials, and updates about AI tools and technology
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            >
              <option value="">All Topics</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filter criteria' 
                : 'Check back soon for new articles!'}
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <PostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}