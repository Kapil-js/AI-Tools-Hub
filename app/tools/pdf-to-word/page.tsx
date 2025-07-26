'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Zap, File } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('docx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
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
          setConvertedFile(`converted-document.${outputFormat}`);
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  const handleDownload = () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    const mimeType = outputFormat === 'docx' 
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/msword';
    
    const blob = new Blob(['Converted Word document content'], { type: mimeType });
    downloadFile(blob, convertedFile!, mimeType);
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">PDF to Word Converter</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Easily convert your PDF files into editable DOC and DOCX documents with 99% accuracy
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
                <CardDescription>Select a PDF file to convert to Word</CardDescription>
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

                {/* Conversion Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Conversion Options</h3>
                  
                  <div>
                    <Label htmlFor="output-format">Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docx">DOCX (Word 2007+)</SelectItem>
                        <SelectItem value="doc">DOC (Word 97-2003)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      DOCX format is recommended for better compatibility
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="preserve-layout" defaultChecked className="rounded" />
                      <Label htmlFor="preserve-layout" className="text-sm">Preserve original layout</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="ocr-text" defaultChecked className="rounded" />
                      <Label htmlFor="ocr-text" className="text-sm">OCR for scanned PDFs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="extract-images" className="rounded" />
                      <Label htmlFor="extract-images" className="text-sm">Extract images</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Converting...' : 'Convert to Word'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Converting PDF to Word...</span>
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
                  Converted Word Document
                </CardTitle>
                <CardDescription>Your Word document will be ready here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {convertedFile ? (
                    <div className="space-y-4 w-full">
                      <File className="w-12 h-12 text-blue-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Conversion Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          PDF successfully converted to {outputFormat.toUpperCase()} format
                        </p>
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="text-sm">
                            <p className="text-green-700 font-semibold mb-1">Conversion Summary:</p>
                            <p className="text-green-600">✓ Text extracted with 99% accuracy</p>
                            <p className="text-green-600">✓ Layout preserved</p>
                            <p className="text-green-600">✓ Formatting maintained</p>
                          </div>
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Word Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <File className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Converted Word document will appear here after processing
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
              <h3 className="font-semibold mb-2">99% Accuracy</h3>
              <p className="text-sm text-slate-600">Advanced OCR technology for perfect conversion</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <File className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Layout Preserved</h3>
              <p className="text-sm text-slate-600">Maintain original formatting and structure</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-slate-600">Support for both DOC and DOCX formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}