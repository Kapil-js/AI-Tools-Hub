'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Palette,
  Bell,
  Key,
  Users,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
  };
  security: {
    passwordMinLength: number;
    requireStrongPassword: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  analytics: {
    googleAnalyticsId: string;
    trackingEnabled: boolean;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'AI Tools Hub',
    siteDescription: 'Your All-in-One AI Toolkit',
    siteUrl: 'https://scalestack.in',
    contactEmail: 'contact@aitoolshub.com',
    supportEmail: 'support@aitoolshub.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#3B82F6',
      darkMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false
    },
    security: {
      passwordMinLength: 8,
      requireStrongPassword: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5
    },
    analytics: {
      googleAnalyticsId: '',
      trackingEnabled: false
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load settings from Firebase
  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, 'site_settings', 'main'));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setSettings(prevSettings => ({
          ...prevSettings,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      await setDoc(doc(db, 'site_settings', 'main'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure your platform settings</p>
          </div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-10 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your platform settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Site Information
                </CardTitle>
                <CardDescription>
                  Basic information about your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => updateSettings('siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => updateSettings('siteUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSettings('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSettings('supportEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Registration
                </CardTitle>
                <CardDescription>
                  Control user registration and access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable site access for maintenance
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationEnabled">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register accounts
                    </p>
                  </div>
                  <Switch
                    id="registrationEnabled"
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => updateSettings('registrationEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailVerificationRequired">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    id="emailVerificationRequired"
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => updateSettings('emailVerificationRequired', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings('security.passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings('security.maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security.sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireStrongPassword">Require Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce uppercase, lowercase, numbers, and special characters
                  </p>
                </div>
                <Switch
                  id="requireStrongPassword"
                  checked={settings.security.requireStrongPassword}
                  onCheckedChange={(checked) => updateSettings('security.requireStrongPassword', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send system notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications.emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send browser push notifications
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications.pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send promotional and marketing emails
                  </p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(checked) => updateSettings('notifications.marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance of your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateSettings('theme.primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateSettings('theme.primaryColor', e.target.value)}
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateSettings('theme.secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateSettings('theme.secondaryColor', e.target.value)}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark Mode Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Set dark mode as the default theme
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.theme.darkMode}
                  onCheckedChange={(checked) => updateSettings('theme.darkMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Settings */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                File Upload Settings
              </CardTitle>
              <CardDescription>
                Configure file upload limits and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSettings('maxFileSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes.join(', ')}
                  onChange={(e) => updateSettings('allowedFileTypes', e.target.value.split(',').map(type => type.trim()))}
                  placeholder="jpg, png, pdf, docx"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Comma-separated list of allowed file extensions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Analytics Settings
              </CardTitle>
              <CardDescription>
                Configure analytics and tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.analytics.googleAnalyticsId}
                  onChange={(e) => updateSettings('analytics.googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trackingEnabled">Enable Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable analytics and user tracking
                  </p>
                </div>
                <Switch
                  id="trackingEnabled"
                  checked={settings.analytics.trackingEnabled}
                  onCheckedChange={(checked) => updateSettings('analytics.trackingEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}