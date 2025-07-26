'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export default function EditBlogPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    imageUrl: '',
    metaDescription: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);
    
    setFormData({ ...formData, content: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'blog_posts', postId));
        if (postDoc.exists()) {
          const data = postDoc.data();
          setFormData({
            title: data.title || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            tags: (data.tags || []).join(', '),
            status: data.status || 'draft',
            featured: data.featured || false,
            imageUrl: data.imageUrl || '',
            metaDescription: data.metaDescription || ''
          });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';

    try {
      const fileName = `blog-images/${Date.now()}-${imageFile.name}`;
      const imageRef = ref(storage, fileName);
      
      await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(imageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const updateData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
        status: status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: formData.featured,
        imageUrl: imageUrl,
        metaDescription: formData.metaDescription,
        updatedAt: serverTimestamp(),
        ...(status === 'published' && { publishedAt: serverTimestamp() })
      };

      await updateDoc(doc(db, 'blog_posts', postId), updateData);
      
      toast({
        title: "Success",
        description: `Blog post ${status === 'published' ? 'published' : 'updated'} successfully`,
      });
      
      router.push('/admin/content');
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
            <p className="text-muted-foreground">Update your blog post content</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            <Eye className="w-4 h-4 mr-2" />
            {saving ? 'Updating...' : 'Update & Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Post Content</span>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={showPreview ? "outline" : "default"}
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant={showPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Edit your blog post content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title..."
                  className="text-lg font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post (optional)..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                {!showPreview && (
                  <div className="border rounded-md">
                    <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('**', '**')}>
                        <strong>B</strong>
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('*', '*')}>
                        <em>I</em>
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('# ', '')}>
                        H1
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('## ', '')}>
                        H2
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('[Link Text](', ')')}>
                        Link
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertText('- ', '')}>
                        List
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      ref={textareaRef}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your blog post content here..."
                      rows={20}
                      className="border-0 resize-none focus:ring-0"
                    />
                  </div>
                )}

                {showPreview && (
                  <div className="mt-4">
                    <div className="border rounded-md p-4 min-h-[400px] bg-white prose prose-lg max-w-none">
                      {formData.content ? (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: formatContent(formData.content)
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">Start writing to see preview...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>Upload or provide URL for the post's featured image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Label>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {(imagePreview || formData.imageUrl) && (
                <div className="relative">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ai, technology, tutorial"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Post</Label>
                  <p className="text-xs text-muted-foreground">Show this post prominently</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description for search engines..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}