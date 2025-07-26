'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
  views: number;
  likes: number;
  featured: boolean;
}

export default function ContentManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false
  });

  // Fetch blog posts from Firebase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const postsData: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          author: data.author || 'Unknown',
          authorId: data.authorId || '',
          status: data.status || 'draft',
          tags: data.tags || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          publishedAt: data.publishedAt,
          views: data.views || 0,
          likes: data.likes || 0,
          featured: data.featured || false
        });
      });
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
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
    
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreatePost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
        author: user?.displayName || user?.email || 'Admin',
        authorId: user?.uid || '',
        status: formData.status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: formData.featured,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(formData.status === 'published' && { publishedAt: serverTimestamp() })
      };

      await addDoc(collection(db, 'blog_posts'), postData);
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const postRef = doc(db, 'blog_posts', editingPost.id);
      const updateData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
        status: formData.status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: formData.featured,
        updatedAt: serverTimestamp(),
        ...(formData.status === 'published' && !editingPost.publishedAt && { publishedAt: serverTimestamp() })
      };

      await updateDoc(postRef, updateData);
      
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const postRef = doc(db, 'blog_posts', postId);
      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };

      if (newStatus === 'published') {
        const post = posts.find(p => p.id === postId);
        if (!post?.publishedAt) {
          updateData.publishedAt = serverTimestamp();
        }
      }

      await updateDoc(postRef, updateData);
      
      toast({
        title: "Success",
        description: `Post ${newStatus} successfully`,
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      status: 'draft',
      featured: false
    });
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
      status: post.status,
      featured: post.featured
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Create and manage blog posts and articles
          </p>
        </div>
        <Button onClick={() => router.push('/admin/content/create')}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((sum, post) => sum + post.views, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>
            Manage your blog posts and articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('published')}>
                  Published Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                  Drafts Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                  Archived Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                        </div>
                      </TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || filterStatus !== 'all' ? 'No posts found matching your criteria' : 'No blog posts found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            {post.title}
                            {post.featured && <Badge className="ml-2 bg-yellow-500">Featured</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.excerpt.substring(0, 100)}...
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          {post.author}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>{post.views}</TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/content/edit/${post.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            {post.status !== 'published' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'published')}>
                                Publish
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'draft' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'draft')}>
                                Move to Draft
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'archived' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'archived')}>
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Post Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingPost} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setEditingPost(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update your blog post content and settings' : 'Create a new blog post for your platform'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the post..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={12}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ai, technology, tutorial"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingPost(null);
                resetForm();
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
                <Save className="w-4 h-4 mr-2" />
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}