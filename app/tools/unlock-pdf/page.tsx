'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileText, Zap, Unlock, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlockedFile, setUnlockedFile] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUnlock = () => {
    if (!password.trim()) {
      setError('Please enter the PDF password');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Simulate password validation
          if (password === 'wrongpassword') {
            setError('Incorrect password. Please try again.');
            return 0;
          }
          setUnlockedFile('unlocked-document.pdf');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    const blob = new Blob(['Unlocked PDF content'], { type: 'application/pdf' });
    downloadFile(blob, unlockedFile!, 'application/pdf');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Unlock PDF</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Remove password protection from PDF files to make them accessible
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Protected PDF
                </CardTitle>
                <CardDescription>Select a password-protected PDF file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  {file ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <FileText className="w-12 h-12 text-red-600 mx-auto" />
                        <Lock className="w-4 h-4 text-orange-500 absolute -top-1 -right-1" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-600">Size: {formatFileSize(file.size)}</p>
                        <p className="text-xs text-orange-600 mt-1">🔒 Password Protected</p>
                      </div>
                      <Button variant="outline" onClick={() => setFile(null)}>
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                        <Lock className="w-4 h-4 text-slate-400 absolute -top-1 -right-1" />
                      </div>
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <Button asChild>
                          <span>Choose Protected PDF</span>
                        </Button>
                      </Label>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <p className="text-sm text-slate-500">
                        Select a password-protected PDF file
                      </p>
                    </div>
                  )}
                </div>

                {file && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Enter PDF Password</h3>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter the PDF password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Alert>
                      <Shield className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Privacy Notice:</strong> Your password is processed securely and never stored on our servers.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <Button 
                  onClick={handleUnlock}
                  disabled={!file || !password.trim() || isProcessing}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Unlocking...' : 'Unlock PDF'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Removing password protection...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Unlocked PDF
                </CardTitle>
                <CardDescription>Your unlocked PDF will be ready here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {unlockedFile ? (
                    <div className="space-y-4 w-full">
                      <div className="relative">
                        <FileText className="w-12 h-12 text-green-600 mx-auto" />
                        <Unlock className="w-4 h-4 text-green-500 absolute -top-1 -right-1" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">PDF Unlocked Successfully!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Password protection has been removed
                        </p>
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="text-sm">
                            <p className="text-green-700 font-semibold mb-1">Unlock Summary:</p>
                            <p className="text-green-600">✓ Password protection removed</p>
                            <p className="text-green-600">✓ Full access restored</p>
                            <p className="text-green-600">✓ Ready for editing and printing</p>
                          </div>
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Unlocked PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="relative">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <Lock className="w-4 h-4 text-slate-400 absolute -top-1 -right-1" />
                      </div>
                      <p className="text-slate-500">
                        Unlocked PDF will appear here after processing
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Remove Protection</h3>
              <p className="text-sm text-slate-600">Unlock password-protected PDFs instantly</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Process</h3>
              <p className="text-sm text-slate-600">Passwords are never stored or shared</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Unlock</h3>
              <p className="text-sm text-slate-600">Remove restrictions in seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}