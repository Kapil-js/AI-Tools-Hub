'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Calendar, 
  User, 
  Eye,
  Heart,
  Share2,
  Clock,
  MessageCircle,
  Send,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  likedBy?: string[];
  bookmarkedBy?: string[];
  metaDescription?: string;
  createdAt: any;
  publishedAt: any;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: any;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const postId = params.id as string;

  const fetchPost = async () => {
    try {
      setLoading(true);
      // Convert slug back to search for title
      const titleFromSlug = postId.replace(/-/g, ' ');
      
      // Query posts by title
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, where('status', '==', 'published'));
      const querySnapshot = await getDocs(q);
      
      let postDoc = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const postSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (postSlug === postId) {
          postDoc = { id: doc.id, ...data };
        }
      });
      
      if (!postDoc) {
        setLoading(false);
        return;
      }
      
      const postData: BlogPost = {
        id: postDoc.id,
        title: postDoc.title || '',
        content: postDoc.content || '',
        excerpt: postDoc.excerpt || '',
        author: 'Admin',
        imageUrl: postDoc.imageUrl || '',
        tags: postDoc.tags || [],
        views: postDoc.views || 0,
        likes: postDoc.likes || 0,
        likedBy: postDoc.likedBy || [],
        bookmarkedBy: postDoc.bookmarkedBy || [],
        metaDescription: postDoc.metaDescription || '',
        createdAt: postDoc.createdAt,
        publishedAt: postDoc.publishedAt
      };
        
        setPost(postData);
        
        // Check if user has liked or bookmarked
        if (user) {
          setLiked(postData.likedBy?.includes(user.uid) || false);
          setBookmarked(postData.bookmarkedBy?.includes(user.uid) || false);
        }
        
        // Increment view count
        await updateDoc(doc(db, 'blog_posts', postDoc.id), {
          views: increment(1)
        });
        
        // Update local state
        setPost(prev => prev ? { ...prev, views: prev.views + 1 } : null);
        
        // Fetch comments
        const commentsRef = collection(db, 'blog_comments');
        const commentsQuery = query(commentsRef, where('postId', '==', postDoc.id));
        const commentsSnapshot = await getDocs(commentsQuery);
        
        const commentsData: Comment[] = [];
        commentsSnapshot.forEach((doc) => {
          const data = doc.data();
          commentsData.push({
            id: doc.id,
            postId: data.postId,
            userId: data.userId,
            userName: data.userName,
            userEmail: data.userEmail,
            content: data.content,
            createdAt: data.createdAt
          });
        });
        
        // Sort comments by creation date (newest first)
        commentsData.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return bTime.getTime() - aTime.getTime();
        });
        
        setComments(commentsData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = async () => {
    if (!post || !user) {
      toast({
        title: "Login Required",
        description: "Please login to like this post",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const postRef = doc(db, 'blog_posts', post.id);
      
      if (liked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
        setPost(prev => prev ? { ...prev, likes: prev.likes - 1, likedBy: prev.likedBy?.filter(id => id !== user.uid) } : null);
        setLiked(false);
        toast({
          title: "Unliked",
          description: "Post removed from your likes"
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
        setPost(prev => prev ? { ...prev, likes: prev.likes + 1, likedBy: [...(prev.likedBy || []), user.uid] } : null);
        setLiked(true);
        toast({
          title: "Liked!",
          description: "Thanks for liking this post"
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive"
      });
    }
  };

  const handleBookmark = async () => {
    if (!post || !user) {
      toast({
        title: "Login Required",
        description: "Please login to bookmark this post",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const postRef = doc(db, 'blog_posts', post.id);
      
      if (bookmarked) {
        // Remove bookmark
        await updateDoc(postRef, {
          bookmarkedBy: arrayRemove(user.uid)
        });
        setPost(prev => prev ? { ...prev, bookmarkedBy: prev.bookmarkedBy?.filter(id => id !== user.uid) } : null);
        setBookmarked(false);
        toast({
          title: "Bookmark Removed",
          description: "Post removed from your bookmarks"
        });
      } else {
        // Add bookmark
        await updateDoc(postRef, {
          bookmarkedBy: arrayUnion(user.uid)
        });
        setPost(prev => prev ? { ...prev, bookmarkedBy: [...(prev.bookmarkedBy || []), user.uid] } : null);
        setBookmarked(true);
        toast({
          title: "Bookmarked!",
          description: "Post saved to your bookmarks"
        });
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmittingComment(true);
      
      const commentData = {
        postId: post.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userEmail: user.email || '',
        content: newComment,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'blog_comments'), commentData);
      
      setNewComment('');
      toast({
        title: "Comment Added",
        description: "Your comment has been posted"
      });
      
      // Refresh comments
      fetchPost();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
              <div className="aspect-video bg-gray-200 rounded-lg mb-6" />
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.push('/blog')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8 shadow-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{post.views} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-light">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              className="text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: `<p class="mb-4">${formatContent(post.content)}</p>` 
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  onClick={handleLike}
                  className={liked ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                </Button>
                <Button
                  variant={bookmarked ? "default" : "outline"}
                  onClick={handleBookmark}
                  className={bookmarked ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Published on {formatDate(post.publishedAt)}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder={user ? "Write your comment..." : "Please login to comment"}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      disabled={!user}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddComment}
                        disabled={!user || !newComment.trim() || submittingComment}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {comment.userName}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}