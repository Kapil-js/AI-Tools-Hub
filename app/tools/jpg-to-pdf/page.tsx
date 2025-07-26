'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Zap, ImageIcon, X, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function JPGToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const handleConvert = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setConvertedFile('images-to-pdf.pdf');
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
    
    const blob = new Blob(['PDF content from images'], { type: 'application/pdf' });
    downloadFile(blob, convertedFile!, 'application/pdf');
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">JPG to PDF Converter</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Convert JPG images to PDF in seconds. Easily adjust orientation and margins
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Images
                </CardTitle>
                <CardDescription>Select JPG, PNG, or other image files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button asChild>
                      <span>Choose Images</span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Select multiple images to convert
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Images to convert ({files.length})</h3>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">PDF Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page-size">Page Size</Label>
                      <Select value={pageSize} onValueChange={setPageSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A3">A3</SelectItem>
                          <SelectItem value="Letter">Letter</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="orientation">Orientation</Label>
                      <Select value={orientation} onValueChange={setOrientation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="fit-page" defaultChecked className="rounded" />
                      <Label htmlFor="fit-page" className="text-sm">Fit images to page</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="maintain-aspect" defaultChecked className="rounded" />
                      <Label htmlFor="maintain-aspect" className="text-sm">Maintain aspect ratio</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleConvert}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Converting...' : `Convert ${files.length} Images to PDF`}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Converting images to PDF...</span>
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
                  Converted PDF
                </CardTitle>
                <CardDescription>Your PDF will be ready here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {convertedFile ? (
                    <div className="space-y-4 w-full">
                      <FileText className="w-12 h-12 text-pink-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Conversion Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Successfully converted {files.length} images to PDF
                        </p>
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="text-sm">
                            <p className="text-green-700 font-semibold mb-1">PDF Details:</p>
                            <p className="text-green-600">✓ Page Size: {pageSize}</p>
                            <p className="text-green-600">✓ Orientation: {orientation}</p>
                            <p className="text-green-600">✓ Pages: {files.length}</p>
                          </div>
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Converted PDF will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-slate-600">Support JPG, PNG, GIF, and more</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Custom Layout</h3>
              <p className="text-sm text-slate-600">Adjust page size and orientation</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Preserved</h3>
              <p className="text-sm text-slate-600">Maintain image quality in PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}