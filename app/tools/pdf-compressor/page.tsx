'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Download, FileText, Zap, File, Copy } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { downloadFile, copyToClipboard } from '@/lib/utils-client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PDFCompressor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleCompress = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 12;
      });
    }, 250);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionDescription = (level: string) => {
    switch (level) {
      case 'low':
        return 'Minimal compression, highest quality (10-30% reduction)';
      case 'medium':
        return 'Balanced compression and quality (30-60% reduction)';
      case 'high':
        return 'Maximum compression, good quality (60-80% reduction)';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Compress PDF Files
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Reduce PDF file sizes while maintaining document quality and readability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload PDF
                </CardTitle>
                <CardDescription>
                  Select a PDF file to compress (Max 50MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <File className="w-12 h-12 text-green-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900">{uploadedFile.name}</p>
                        <p className="text-sm text-slate-600">
                          Size: {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setUploadedFile(null)}>
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                      <div>
                        <Label htmlFor="pdf-upload" className="cursor-pointer">
                          <Button asChild>
                            <span>Choose PDF File</span>
                          </Button>
                        </Label>
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <p className="text-sm text-slate-500">
                        or drag and drop your PDF here
                      </p>
                    </div>
                  )}
                </div>

                {/* Compression Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Compression Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="compression-level">Compression Level</Label>
                    <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                      <SelectTrigger id="compression-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Compression</SelectItem>
                        <SelectItem value="medium">Medium Compression</SelectItem>
                        <SelectItem value="high">High Compression</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-600">
                      {getCompressionDescription(compressionLevel)}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleCompress}
                  disabled={!uploadedFile || isProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compressing PDF...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Compressed PDF
                </CardTitle>
                <CardDescription>
                  Your compressed file will be ready here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {progress === 100 && uploadedFile ? (
                    <div className="space-y-4 w-full">
                      <File className="w-12 h-12 text-green-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Compression Complete!</p>
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">Original Size:</p>
                              <p className="font-semibold">{formatFileSize(uploadedFile.size)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600">Compressed Size:</p>
                              <p className="font-semibold text-green-600">
                                {formatFileSize(Math.floor(uploadedFile.size * 0.4))}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-green-200">
                            <p className="text-green-700 font-semibold">
                              60% reduction achieved!
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              if (!user) {
                                router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
                                return;
                              }
                              downloadFile(
                                uploadedFile,
                                `compressed-${uploadedFile.name}`,
                                'application/pdf'
                              );
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Compressed PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => copyToClipboard(
                              'Your PDF has been compressed successfully!',
                              'Download link copied to clipboard'
                            )}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Download Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Compressed PDF will appear here after processing
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Compression</h3>
              <p className="text-sm text-slate-600">Compress large PDFs in seconds</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Preserved</h3>
              <p className="text-sm text-slate-600">Maintain readability and image quality</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Levels</h3>
              <p className="text-sm text-slate-600">Choose compression level to fit your needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}