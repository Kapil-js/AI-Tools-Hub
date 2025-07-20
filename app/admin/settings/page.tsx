'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Key
} from 'lucide-react';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'AI Tools Hub',
    siteDescription: 'Powerful AI tools for creative professionals',
    siteUrl: 'https://aitoolshub.com',
    adminEmail: 'admin@aitoolshub.com',
    timezone: 'America/New_York',
    language: 'en',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'TLS',
    fromEmail: 'noreply@aitoolshub.com',
    fromName: 'AI Tools Hub',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notifyNewUsers: true,
    notifySystemErrors: true,
    notifySecurityEvents: true,
    
    // Security Settings
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireSpecialChars: true,
    enableTwoFactor: true,
    enableCaptcha: false,
    
    // API Settings
    apiRateLimit: '1000',
    apiKeyExpiration: '365',
    enableApiLogs: true,
    allowCors: true,
    
    // Performance Settings
    cacheEnabled: true,
    cacheExpiration: '3600',
    compressionEnabled: true,
    minifyAssets: true,
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: '30',
    
    // Theme Settings
    primaryColor: '#7C3AED',
    secondaryColor: '#2563EB',
    darkMode: true,
    customLogo: '',
    customFavicon: ''
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 2000);
  };

  const handleReset = () => {
    // Reset to default values
    console.log('Resetting settings...');
  };

  const handleTestEmail = () => {
    console.log('Testing email configuration...');
  };

  const handleBackupNow = () => {
    console.log('Creating backup...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic configuration for your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for email delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Email settings are required for user notifications and system alerts.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Select value={settings.smtpEncryption} onValueChange={(value) => handleSettingChange('smtpEncryption', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TLS">TLS</SelectItem>
                      <SelectItem value="SSL">SSL</SelectItem>
                      <SelectItem value="NONE">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => handleSettingChange('fromName', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleTestEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Channels</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Text message notifications</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Event Notifications</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">New User Registrations</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">When new users sign up</p>
                  </div>
                  <Switch
                    checked={settings.notifyNewUsers}
                    onCheckedChange={(checked) => handleSettingChange('notifyNewUsers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">System Errors</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Critical system errors and failures</p>
                  </div>
                  <Switch
                    checked={settings.notifySystemErrors}
                    onCheckedChange={(checked) => handleSettingChange('notifySystemErrors', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Security Events</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Security alerts and suspicious activities</p>
                  </div>
                  <Switch
                    checked={settings.notifySecurityEvents}
                    onCheckedChange={(checked) => handleSettingChange('notifySecurityEvents', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Password Min Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security Features</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Require Special Characters</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Passwords must include special characters</p>
                  </div>
                  <Switch
                    checked={settings.requireSpecialChars}
                    onCheckedChange={(checked) => handleSettingChange('requireSpecialChars', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Enable CAPTCHA</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add CAPTCHA to login forms</p>
                  </div>
                  <Switch
                    checked={settings.enableCaptcha}
                    onCheckedChange={(checked) => handleSettingChange('enableCaptcha', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API access and rate limiting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleSettingChange('apiRateLimit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKeyExpiration">API Key Expiration (days)</Label>
                  <Input
                    id="apiKeyExpiration"
                    type="number"
                    value={settings.apiKeyExpiration}
                    onChange={(e) => handleSettingChange('apiKeyExpiration', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Enable API Logs</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Log all API requests and responses</p>
                  </div>
                  <Switch
                    checked={settings.enableApiLogs}
                    onCheckedChange={(checked) => handleSettingChange('enableApiLogs', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Allow CORS</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable Cross-Origin Resource Sharing</p>
                  </div>
                  <Switch
                    checked={settings.allowCors}
                    onCheckedChange={(checked) => handleSettingChange('allowCors', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Performance Optimization
              </CardTitle>
              <CardDescription>
                Configure caching and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cacheExpiration">Cache Expiration (seconds)</Label>
                  <Input
                    id="cacheExpiration"
                    type="number"
                    value={settings.cacheExpiration}
                    onChange={(e) => handleSettingChange('cacheExpiration', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Enable Caching</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Cache frequently accessed data</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Compression</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable gzip compression for responses</p>
                  </div>
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Minify Assets</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Minify CSS and JavaScript files</p>
                  </div>
                  <Switch
                    checked={settings.minifyAssets}
                    onCheckedChange={(checked) => handleSettingChange('minifyAssets', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Maintenance & Backup
              </CardTitle>
              <CardDescription>
                Configure maintenance mode and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className={settings.maintenanceMode ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30' : ''}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {settings.maintenanceMode 
                    ? 'Maintenance mode is currently ACTIVE. Your site is not accessible to users.'
                    : 'Maintenance mode is currently disabled.'
                  }
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Maintenance Mode</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Put the site in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Backup Settings</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Automatic Backup</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable scheduled backups</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Retention Period (days)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={settings.backupRetention}
                      onChange={(e) => handleSettingChange('backupRetention', e.target.value)}
                    />
                  </div>
                </div>

                <Button variant="outline" onClick={handleBackupNow}>
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance & Branding
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      placeholder="#7C3AED"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      placeholder="#2563EB"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Dark Mode Default</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Set dark mode as the default theme</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Logo & Branding</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="customLogo">Custom Logo</Label>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Recommended: 200x50px PNG or SVG
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customFavicon">Favicon</Label>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Recommended: 32x32px ICO or PNG
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Preview</h4>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    AI
                  </div>
                  <span className="font-bold text-lg" style={{ color: settings.primaryColor }}>
                    {settings.siteName}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
