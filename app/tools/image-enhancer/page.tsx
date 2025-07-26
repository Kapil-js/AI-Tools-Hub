'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, ImageIcon, Zap, Settings, Copy } from 'lucide-react';
import { downloadFile, copyToClipboard } from '@/lib/utils-client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ImageEnhancer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // In a real app, this would be the enhanced image from an API
          // For demo, we'll just use the original image
          setEnhancedImage(uploadedImage);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Function to download the enhanced image
  const downloadEnhancedImage = () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    if (!enhancedImage) return;
    
    // For demo purposes, we'll use the original file type if available
    const fileName = originalFile ? `enhanced-${originalFile.name}` : 'enhanced-image.jpg';
    const fileType = originalFile?.type || 'image/jpeg';
    
    // Convert data URL to blob and download
    fetch(enhancedImage)
      .then(res => res.blob())
      .then(blob => {
        downloadFile(blob, fileName, fileType);
      })
      .catch(err => {
        console.error('Error downloading image:', err);
      });
  };
  
  // Function to copy the enhanced image link
  const copyImageLink = () => {
    if (enhancedImage) {
      copyToClipboard(enhancedImage, 'Image link copied to clipboard');
    } else {
      copyToClipboard('https://example.com/your-enhanced-image.jpg', 'Image link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image Enhancer</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Supported formats: JPG, PNG, WebP (Max 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-w-full h-48 object-contain mx-auto rounded"
                      />
                      <Button variant="outline" onClick={() => setUploadedImage(null)}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
                      <div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <Button asChild>
                            <span>Choose Image</span>
                          </Button>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        or drag and drop your image here
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhancement Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Enhancement Options
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="upscale" defaultChecked className="rounded" />
                      <Label htmlFor="upscale" className="text-sm">2x Upscale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="denoise" defaultChecked className="rounded" />
                      <Label htmlFor="denoise" className="text-sm">Noise Reduction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sharpen" className="rounded" />
                      <Label htmlFor="sharpen" className="text-sm">Sharpen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="color" className="rounded" />
                      <Label htmlFor="color" className="text-sm">Color Enhance</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleEnhance}
                  disabled={!uploadedImage || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Enhancing...' : 'Enhance Image'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Enhanced Result
                </CardTitle>
                <CardDescription>
                  Your enhanced image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {progress === 100 && uploadedImage ? (
                    <div className="space-y-4 w-full">
                      <img 
                        src={enhancedImage || uploadedImage} 
                        alt="Enhanced" 
                        className="max-w-full h-48 object-contain mx-auto rounded shadow-lg"
                      />
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Enhancement completed!</p>
                        <div className="grid grid-cols-1 gap-2">
                          <Button 
                            className="w-full" 
                            onClick={downloadEnhancedImage}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Enhanced Image
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={copyImageLink}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Image Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Enhanced image will appear here after processing
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">AI-Powered</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Advanced neural networks for superior enhancement</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">High Quality</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Preserve details while improving resolution</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Fast Processing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Get results in seconds, not minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}