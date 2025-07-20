'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Download, Users, Zap, AlertCircle } from 'lucide-react';

export default function FaceSwapper() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'source' | 'target') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'source') {
          setSourceImage(e.target?.result as string);
        } else {
          setTargetImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwap = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Face Swapper</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Warning Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-1">Ethical Use Notice</p>
                <p>This tool should only be used with consent from all individuals in the photos. Misuse for deceptive purposes is prohibited.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Source Image */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Source Face
                </CardTitle>
                <CardDescription>
                  The face to be transferred
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  {sourceImage ? (
                    <div className="space-y-4">
                      <img 
                        src={sourceImage} 
                        alt="Source" 
                        className="max-w-full h-48 object-cover mx-auto rounded"
                      />
                      <Button variant="outline" size="sm" onClick={() => setSourceImage(null)}>
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
                      <div>
                        <Label htmlFor="source-upload" className="cursor-pointer">
                          <Button size="sm" asChild>
                            <span>Upload Source</span>
                          </Button>
                        </Label>
                        <Input
                          id="source-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'source')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Image */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Target Photo
                </CardTitle>
                <CardDescription>
                  The photo to receive the face
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  {targetImage ? (
                    <div className="space-y-4">
                      <img 
                        src={targetImage} 
                        alt="Target" 
                        className="max-w-full h-48 object-cover mx-auto rounded"
                      />
                      <Button variant="outline" size="sm" onClick={() => setTargetImage(null)}>
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
                      <div>
                        <Label htmlFor="target-upload" className="cursor-pointer">
                          <Button size="sm" asChild>
                            <span>Upload Target</span>
                          </Button>
                        </Label>
                        <Input
                          id="target-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'target')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Result
                </CardTitle>
                <CardDescription>
                  Face swapped image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center min-h-[240px] flex items-center justify-center">
                  {progress === 100 && targetImage ? (
                    <div className="space-y-4 w-full">
                      <img 
                        src={targetImage} 
                        alt="Result" 
                        className="max-w-full h-48 object-cover mx-auto rounded shadow-lg"
                      />
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Result
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Result will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="mt-8 text-center space-y-4">
            <Button 
              onClick={handleSwap}
              disabled={!sourceImage || !targetImage || isProcessing}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Zap className="w-5 h-5 mr-2" />
              {isProcessing ? 'Swapping Faces...' : 'Swap Faces'}
            </Button>

            {isProcessing && (
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing face swap...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Natural Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Seamless face swapping with realistic lighting and angles</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Fast Processing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Advanced algorithms for quick and accurate results</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">High Quality</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Maintain image quality and facial expressions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}