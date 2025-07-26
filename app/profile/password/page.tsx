'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});

    } catch (error: any) {
      let errorMessage = 'Failed to update password';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak';
        setErrors({ newPassword: 'Password is too weak' });
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please login to change your password</h1>
          </div>
        </div>
      </div>
    );
  }

  // Check if user signed in with Google (no password to change)
  const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/profile">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Change Password</h1>
            <p className="text-slate-600">Update your account password for better security</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Password Security
              </CardTitle>
              <CardDescription>
                Choose a strong password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGoogleUser ? (
                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    You signed in with Google. Your password is managed by Google and cannot be changed here.
                    To change your Google account password, visit your Google Account settings.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        placeholder="Enter your current password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        placeholder="Enter your new password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="Confirm your new password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    disabled={loading}
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </Button>

                  <Alert>
                    <Shield className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Security Tips:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Use a combination of letters, numbers, and symbols</li>
                        <li>Make it at least 8 characters long</li>
                        <li>Don't use personal information or common words</li>
                        <li>Consider using a password manager</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}