'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  Users,
  Save,
  X,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  isPremium: boolean;
  usageCount: number;
  route: string;
  features: string[];
  createdAt: any;
  updatedAt: any;
}

export default function ToolsManagement() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'content',
    icon: 'Zap',
    route: '',
    features: '',
    isActive: true,
    isPremium: false
  });

  const categories = [
    'content',
    'image',
    'document',
    'social',
    'productivity',
    'design',
    'analysis'
  ];

  const iconOptions = [
    'Zap', 'Settings', 'Edit', 'Image', 'FileText', 'Users', 'Camera',
    'Video', 'Music', 'Code', 'Database', 'Cloud', 'Shield', 'Star'
  ];

  // Fetch tools from Firebase
  const fetchTools = async () => {
    try {
      setLoading(true);
      
      // First, try to get from Firebase
      const toolsRef = collection(db, 'ai_tools');
      const q = query(toolsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const toolsData: AITool[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        toolsData.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          category: data.category || 'content',
          icon: data.icon || 'Zap',
          isActive: data.isActive !== false,
          isPremium: data.isPremium || false,
          usageCount: data.usageCount || 0,
          route: data.route || '',
          features: data.features || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      // If no tools in Firebase, create default tools
      if (toolsData.length === 0) {
        await createDefaultTools();
        return;
      }
      
      setTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
      // Fallback to default tools if Firebase fails
      await createDefaultTools();
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTools = async () => {
    const defaultTools = [
      {
        name: 'Image Enhancer',
        description: 'Enhance image quality with AI-powered upscaling and noise reduction',
        category: 'image',
        icon: 'Image',
        route: '/tools/image-enhancer',
        features: ['AI Upscaling', 'Noise Reduction', 'Color Enhancement', 'Batch Processing'],
        isActive: true,
        isPremium: false,
        usageCount: 1250,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'AI Face Swapper',
        description: 'Swap faces in photos using advanced AI face detection technology',
        category: 'image',
        icon: 'Users',
        route: '/tools/face-swapper',
        features: ['Face Detection', 'Realistic Swapping', 'Batch Processing', 'High Quality Output'],
        isActive: true,
        isPremium: true,
        usageCount: 890,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'PDF Compressor',
        description: 'Compress PDF files while maintaining quality and readability',
        category: 'document',
        icon: 'FileText',
        route: '/tools/pdf-compressor',
        features: ['Lossless Compression', 'Batch Processing', 'Size Optimization', 'Quality Control'],
        isActive: true,
        isPremium: false,
        usageCount: 2100,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'Resume Builder',
        description: 'Create professional resumes with AI-powered content suggestions',
        category: 'productivity',
        icon: 'User',
        route: '/tools/resume-builder',
        features: ['AI Content Suggestions', 'Multiple Templates', 'PDF Export', 'ATS Optimization'],
        isActive: true,
        isPremium: false,
        usageCount: 1560,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'Instagram Caption Generator',
        description: 'Generate engaging captions for your Instagram posts with hashtags',
        category: 'social',
        icon: 'Camera',
        route: '/tools/instagram-caption',
        features: ['Hashtag Suggestions', 'Engagement Optimization', 'Multiple Styles', 'Emoji Integration'],
        isActive: true,
        isPremium: false,
        usageCount: 3200,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'YouTube Thumbnail Generator',
        description: 'Create eye-catching thumbnails for your YouTube videos',
        category: 'design',
        icon: 'Video',
        route: '/tools/youtube-thumbnail',
        features: ['Custom Templates', 'Text Overlay', 'Image Effects', 'Batch Creation'],
        isActive: true,
        isPremium: true,
        usageCount: 980,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name: 'AI Article Writer',
        description: 'Generate high-quality articles with AI-powered content creation',
        category: 'content',
        icon: 'Edit',
        route: '/tools/article-writer',
        features: ['SEO Optimization', 'Multiple Tones', 'Research Integration', 'Plagiarism Check'],
        isActive: true,
        isPremium: true,
        usageCount: 1780,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    try {
      const toolsRef = collection(db, 'ai_tools');
      const createdTools: AITool[] = [];
      
      for (const tool of defaultTools) {
        const docRef = await addDoc(toolsRef, tool);
        createdTools.push({
          id: docRef.id,
          ...tool
        } as AITool);
      }
      
      setTools(createdTools);
      toast({
        title: "Success",
        description: "Default tools created successfully",
      });
    } catch (error) {
      console.error('Error creating default tools:', error);
      toast({
        title: "Error",
        description: "Failed to create default tools",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateTool = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Name and description are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const toolData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        route: formData.route || `/tools/${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        isActive: formData.isActive,
        isPremium: formData.isPremium,
        usageCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'ai_tools'), toolData);
      
      toast({
        title: "Success",
        description: "AI tool created successfully",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchTools();
    } catch (error) {
      console.error('Error creating tool:', error);
      toast({
        title: "Error",
        description: "Failed to create AI tool",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTool = async () => {
    if (!editingTool || !formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Name and description are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const toolRef = doc(db, 'ai_tools', editingTool.id);
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        route: formData.route,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        isActive: formData.isActive,
        isPremium: formData.isPremium,
        updatedAt: serverTimestamp()
      };

      await updateDoc(toolRef, updateData);
      
      toast({
        title: "Success",
        description: "AI tool updated successfully",
      });
      
      setEditingTool(null);
      resetForm();
      fetchTools();
    } catch (error) {
      console.error('Error updating tool:', error);
      toast({
        title: "Error",
        description: "Failed to update AI tool",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this AI tool? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'ai_tools', toolId));
      toast({
        title: "Success",
        description: "AI tool deleted successfully",
      });
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Error",
        description: "Failed to delete AI tool",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (toolId: string, currentStatus: boolean) => {
    try {
      const toolRef = doc(db, 'ai_tools', toolId);
      await updateDoc(toolRef, {
        isActive: !currentStatus,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: `Tool ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchTools();
    } catch (error) {
      console.error('Error updating tool status:', error);
      toast({
        title: "Error",
        description: "Failed to update tool status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'content',
      icon: 'Zap',
      route: '',
      features: '',
      isActive: true,
      isPremium: false
    });
  };

  const openEditDialog = (tool: AITool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      route: tool.route,
      features: tool.features.join(', '),
      isActive: tool.isActive,
      isPremium: tool.isPremium
    });
  };

  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: string } = {
      content: 'bg-blue-500',
      image: 'bg-purple-500',
      document: 'bg-green-500',
      social: 'bg-pink-500',
      productivity: 'bg-orange-500',
      design: 'bg-indigo-500',
      analysis: 'bg-red-500'
    };
    
    return (
      <Badge className={colors[category] || 'bg-gray-500'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tools Management</h1>
          <p className="text-muted-foreground">
            Manage AI tools, features, and availability
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tools.filter(t => t.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Tools</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tools.filter(t => t.isPremium).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tools.reduce((sum, tool) => sum + tool.usageCount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>AI Tools ({filteredTools.length})</CardTitle>
          <CardDescription>
            Manage your AI tools and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tools by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Category: {filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tools Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
                        </div>
                      </TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                      <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || filterCategory !== 'all' ? 'No tools found matching your criteria' : 'No AI tools found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {tool.name}
                              {tool.isPremium && <Badge className="ml-2 bg-yellow-500">Premium</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tool.description.substring(0, 60)}...
                            </div>
                            {tool.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tool.features.slice(0, 2).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {tool.features.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{tool.features.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(tool.category)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={tool.isActive ? 'bg-green-500' : 'bg-red-500'}>
                            {tool.isActive ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{tool.usageCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tool.route}
                        </code>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(tool)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(tool.id, tool.isActive)}>
                              {tool.isActive ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTool(tool.id)}
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

      {/* Create/Edit Tool Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingTool} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setEditingTool(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTool ? 'Edit AI Tool' : 'Create New AI Tool'}
            </DialogTitle>
            <DialogDescription>
              {editingTool ? 'Update the AI tool settings and configuration' : 'Add a new AI tool to your platform'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tool Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter tool name..."
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this tool does..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  placeholder="/tools/tool-name"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1, Feature 2, Feature 3"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
                <Label htmlFor="isPremium">Premium Tool</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingTool(null);
                resetForm();
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={editingTool ? handleUpdateTool : handleCreateTool}>
                <Save className="w-4 h-4 mr-2" />
                {editingTool ? 'Update Tool' : 'Create Tool'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}