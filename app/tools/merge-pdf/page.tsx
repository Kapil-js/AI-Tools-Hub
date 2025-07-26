'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, FileText, Zap, X, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles]);
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

  const handleMerge = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setMergedFile('merged-document.pdf');
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
    
    // Create a dummy blob for demo
    const blob = new Blob(['Merged PDF content'], { type: 'application/pdf' });
    downloadFile(blob, 'merged-document.pdf', 'application/pdf');
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Merge PDF Files</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Combine multiple PDF files into one document in the order you want
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload PDF Files
                </CardTitle>
                <CardDescription>Select multiple PDF files to merge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <Label htmlFor="pdf-upload" className="cursor-pointer">
                    <Button asChild>
                      <span>Choose PDF Files</span>
                    </Button>
                  </Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Select multiple PDF files to merge
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Files to merge ({files.length})</h3>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <FileText className="w-4 h-4 text-red-600" />
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

                <Button 
                  onClick={handleMerge}
                  disabled={files.length < 2 || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Merging...' : `Merge ${files.length} PDFs`}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Merging PDFs...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Merged PDF
                </CardTitle>
                <CardDescription>Your merged PDF will be ready here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {mergedFile ? (
                    <div className="space-y-4 w-full">
                      <FileText className="w-12 h-12 text-green-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Merge Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Successfully merged {files.length} PDF files
                        </p>
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Merged PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Merged PDF will appear here after processing
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Merging</h3>
              <p className="text-sm text-slate-600">Combine multiple PDFs in seconds</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GripVertical className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Custom Order</h3>
              <p className="text-sm text-slate-600">Arrange files in any order you want</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Preserved</h3>
              <p className="text-sm text-slate-600">Maintain original PDF quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}