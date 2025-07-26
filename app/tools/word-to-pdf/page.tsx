'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, FileText, Zap, File } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/lib/utils-client';

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type.includes('word') || selectedFile.name.endsWith('.doc') || selectedFile.name.endsWith('.docx'))) {
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
          setConvertedFile('converted-document.pdf');
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
    
    const blob = new Blob(['Converted PDF content'], { type: 'application/pdf' });
    downloadFile(blob, convertedFile!, 'application/pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Word to PDF Converter</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Make DOC and DOCX files easy to read by converting them to PDF
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Word Document
                </CardTitle>
                <CardDescription>Select a DOC or DOCX file to convert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  {file ? (
                    <div className="space-y-4">
                      <File className="w-12 h-12 text-blue-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-600">Ready to convert</p>
                      </div>
                      <Button variant="outline" onClick={() => setFile(null)}>
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <File className="w-12 h-12 text-slate-400 mx-auto" />
                      <Label htmlFor="word-upload" className="cursor-pointer">
                        <Button asChild>
                          <span>Choose Word File</span>
                        </Button>
                      </Label>
                      <Input
                        id="word-upload"
                        type="file"
                        accept=".doc,.docx"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <p className="text-sm text-slate-500">
                        Supports DOC and DOCX formats
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Converting to PDF...</span>
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
                      <FileText className="w-12 h-12 text-red-600 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-2">Conversion Complete!</p>
                        <p className="text-sm text-slate-600 mb-4">
                          Word document successfully converted to PDF
                        </p>
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
        </div>
      </div>
    </div>
  );
}