'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Zap, Camera, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function PDFToJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('high');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleConvert = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Mock converted images
          setConvertedImages(['page-1.jpg', 'page-2.jpg', 'page-3.jpg']);
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  const handleDownload = (fileName: string) => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    const blob = new Blob(['JPG image content'], { type: 'image/jpeg' });
    downloadFile(blob, fileName, 'image/jpeg');
  };

  const handleDownloadAll = () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    const blob = new Blob(['All images'], { type: 'application/zip' });
    downloadFile(blob, 'pdf-images.zip', 'application/zip');
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">PDF to JPG Converter</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Convert PDF pages to high-quality JPG images
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload PDF File
                </CardTitle>
                <CardDescription>Select a PDF file to convert to JPG images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  {file ? (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-red-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-600">Size: {formatFileSize(file.size)}</p>
                      </div>
                      <Button variant="outline" onClick={() => setFile(null)}>
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto" />
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
                      <p className="text-sm text-slate-500">
                        Select a PDF file to convert
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Conversion Options</h3>
                  
                  <div>
                    <Label htmlFor="quality">Image Quality</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Smaller file size)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Best quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="all-pages" defaultChecked className="rounded" />
                      <Label htmlFor="all-pages" className="text-sm">Convert all pages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="maintain-aspect" defaultChecked className="rounded" />
                      <Label htmlFor="maintain-aspect" className="text-sm">Maintain aspect ratio</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Converting...' : 'Convert to JPG'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Converting PDF to JPG...</span>
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
                  Converted Images
                </CardTitle>
                <CardDescription>Your JPG images will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {convertedImages.length > 0 ? (
                    <div className="space-y-4 w-full">
                      <Camera className="w-12 h-12 text-cyan-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Conversion Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Created {convertedImages.length} JPG images
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {convertedImages.map((fileName, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{fileName}</span>
                              <Button size="sm" onClick={() => handleDownload(fileName)}>
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button onClick={handleDownloadAll} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download All as ZIP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Converted JPG images will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold mb-2">High Quality</h3>
              <p className="text-sm text-slate-600">Convert to high-resolution JPG images</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-slate-600">Convert all pages in seconds</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Batch Download</h3>
              <p className="text-sm text-slate-600">Download all images at once</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}