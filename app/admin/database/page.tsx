'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  HardDrive,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DatabaseStats {
  collections: {
    name: string;
    documentCount: number;
    size: string;
    lastUpdated: string;
  }[];
  totalSize: string;
  totalDocuments: number;
  storageUsed: number;
  storageLimit: number;
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats>({
    collections: [],
    totalSize: '0 MB',
    totalDocuments: 0,
    storageUsed: 0,
    storageLimit: 100
  });
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const { toast } = useToast();

  // Mock database stats - in real app, fetch from Firebase
  const mockStats: DatabaseStats = {
    collections: [
      {
        name: 'users',
        documentCount: 1247,
        size: '2.3 MB',
        lastUpdated: '2024-01-21 10:30:00'
      },
      {
        name: 'blog_posts',
        documentCount: 45,
        size: '890 KB',
        lastUpdated: '2024-01-21 09:15:00'
      },
      {
        name: 'ai_tools',
        documentCount: 12,
        size: '156 KB',
        lastUpdated: '2024-01-20 16:45:00'
      },
      {
        name: 'contact_messages',
        documentCount: 89,
        size: '445 KB',
        lastUpdated: '2024-01-21 08:20:00'
      },
      {
        name: 'site_settings',
        documentCount: 1,
        size: '12 KB',
        lastUpdated: '2024-01-19 14:30:00'
      },
      {
        name: 'admins',
        documentCount: 3,
        size: '8 KB',
        lastUpdated: '2024-01-18 11:00:00'
      }
    ],
    totalSize: '3.8 MB',
    totalDocuments: 1397,
    storageUsed: 3.8,
    storageLimit: 100
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBackup = async () => {
    setBackupLoading(true);
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup Completed",
        description: "Database backup has been created successfully",
      });
      setBackupLoading(false);
    }, 3000);
  };

  const handleExportCollection = (collectionName: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${collectionName} collection...`,
    });
    
    // In a real app, this would trigger the export process
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: `${collectionName} collection exported successfully`,
      });
    }, 2000);
  };

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
      toast({
        title: "Stats Refreshed",
        description: "Database statistics have been updated",
      });
    }, 1000);
  };

  const getCollectionIcon = (name: string) => {
    switch (name) {
      case 'users':
        return <Users className="w-4 h-4" />;
      case 'blog_posts':
        return <FileText className="w-4 h-4" />;
      case 'ai_tools':
        return <Settings className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your Firebase database
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleBackup} disabled={backupLoading}>
            <Download className="w-4 h-4 mr-2" />
            {backupLoading ? 'Creating Backup...' : 'Backup Database'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storagePercentage.toFixed(1)}%</div>
            <Progress value={storagePercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Storage Overview
          </CardTitle>
          <CardDescription>
            Current storage usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Usage</span>
              <span className="text-sm text-muted-foreground">
                {stats.storageUsed} MB / {stats.storageLimit} MB
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <div className="flex items-center space-x-2">
              {storagePercentage < 80 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {storagePercentage < 80 
                  ? 'Storage usage is within normal limits'
                  : 'Storage usage is approaching the limit'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections */}
      <Card>
        <CardHeader>
          <CardTitle>Database Collections</CardTitle>
          <CardDescription>
            Overview of all collections in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats.collections.map((collection) => (
                <div key={collection.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center text-white">
                      {getCollectionIcon(collection.name)}
                    </div>
                    <div>
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {collection.lastUpdated}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{collection.documentCount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">documents</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{collection.size}</div>
                      <div className="text-sm text-muted-foreground">size</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportCollection(collection.name)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Operations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Backup & Export
            </CardTitle>
            <CardDescription>
              Create backups and export your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={handleBackup}
                disabled={backupLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                {backupLoading ? 'Creating Full Backup...' : 'Create Full Backup'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Create a complete backup of your database
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Schedule Automatic Backups
              </Button>
              <p className="text-sm text-muted-foreground">
                Set up automated daily backups
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Database Health
            </CardTitle>
            <CardDescription>
              Monitor database performance and health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Status</span>
              <Badge className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Read Operations</span>
              <span className="text-sm font-medium">Normal</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Write Operations</span>
              <span className="text-sm font-medium">Normal</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Index Performance</span>
              <Badge className="bg-green-500">Optimal</Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Health Check
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Database Activity</CardTitle>
          <CardDescription>
            Latest database operations and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">Added to users collection</p>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Blog post published</p>
                <p className="text-xs text-muted-foreground">Updated blog_posts collection</p>
              </div>
              <span className="text-xs text-muted-foreground">15m ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI tool configuration updated</p>
                <p className="text-xs text-muted-foreground">Modified ai_tools collection</p>
              </div>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}