'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
    autoSave: true,
    dataCollection: true
  });

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        settings: settings,
        updatedAt: new Date()
      });

      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeleteLoading(true);
      
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete user account from Firebase Auth
      await deleteUser(user);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted"
      });
      
      // Sign out will be handled automatically by auth state change
    } catch (error: any) {
      let errorMessage = 'Failed to delete account';
      
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in before deleting your account';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please login to access settings</h1>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates about your account via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified about important updates</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive news and promotional content</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-gray-500">Choose your preferred theme</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                  </div>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Auto-save Work</Label>
                    <p className="text-sm text-gray-500">Automatically save your work in tools</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-collection">Analytics & Improvement</Label>
                    <p className="text-sm text-gray-500">Help us improve by sharing usage data</p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => setSettings({...settings, dataCollection: checked})}
                  />
                </div>

                <div className="pt-4">
                  <Link href="/profile/password">
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleSaveSettings} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showDeleteConfirm ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDescription>
                    </Alert>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="flex-1"
                      >
                        {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}