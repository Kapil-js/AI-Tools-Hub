'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Zap, Scissors } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState('pages');
  const [pageRanges, setPageRanges] = useState('1-5, 6-10');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleSplit = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Mock split results
          setSplitFiles(['document-part-1.pdf', 'document-part-2.pdf', 'document-part-3.pdf']);
          return 100;
        }
        return prev + 12;
      });
    }, 250);
  };

  const handleDownload = (fileName: string) => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    const blob = new Blob(['Split PDF content'], { type: 'application/pdf' });
    downloadFile(blob, fileName, 'application/pdf');
  };

  const handleDownloadAll = () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // Mock download all as ZIP
    const blob = new Blob(['All split PDFs'], { type: 'application/zip' });
    downloadFile(blob, 'split-pdfs.zip', 'application/zip');
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Split PDF Files</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Separate one page or a whole set for easy conversion into independent PDF files
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload PDF File
                </CardTitle>
                <CardDescription>Select a PDF file to split</CardDescription>
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
                        Select a PDF file to split
                      </p>
                    </div>
                  )}
                </div>

                {/* Split Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Split Options</h3>
                  
                  <div>
                    <Label htmlFor="split-mode">Split Mode</Label>
                    <Select value={splitMode} onValueChange={setSplitMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pages">Split by Page Ranges</SelectItem>
                        <SelectItem value="every">Split Every N Pages</SelectItem>
                        <SelectItem value="size">Split by File Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {splitMode === 'pages' && (
                    <div>
                      <Label htmlFor="page-ranges">Page Ranges</Label>
                      <Input
                        id="page-ranges"
                        value={pageRanges}
                        onChange={(e) => setPageRanges(e.target.value)}
                        placeholder="e.g., 1-5, 6-10, 11-15"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Specify page ranges separated by commas
                      </p>
                    </div>
                  )}

                  {splitMode === 'every' && (
                    <div>
                      <Label htmlFor="pages-per-file">Pages per File</Label>
                      <Input
                        id="pages-per-file"
                        type="number"
                        defaultValue="5"
                        min="1"
                      />
                    </div>
                  )}

                  {splitMode === 'size' && (
                    <div>
                      <Label htmlFor="max-size">Maximum Size (MB)</Label>
                      <Input
                        id="max-size"
                        type="number"
                        defaultValue="10"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleSplit}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Splitting...' : 'Split PDF'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Splitting PDF...</span>
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
                  Split Results
                </CardTitle>
                <CardDescription>Your split PDF files will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {splitFiles.length > 0 ? (
                    <div className="space-y-4 w-full">
                      <Scissors className="w-12 h-12 text-orange-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Split Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Created {splitFiles.length} PDF files
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {splitFiles.map((fileName, index) => (
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
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Split PDF files will appear here after processing
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
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Splitting</h3>
              <p className="text-sm text-slate-600">Split by pages, size, or custom ranges</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-slate-600">Split large PDFs in seconds</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Batch Download</h3>
              <p className="text-sm text-slate-600">Download all files at once</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}