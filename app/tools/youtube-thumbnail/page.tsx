'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Youtube, Upload, Download, Type, Palette, Image as ImageIcon, Copy } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { downloadFile, copyToClipboard } from '@/lib/utils-client';

export default function YouTubeThumbnail() {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('gaming');
  const [colorScheme, setColorScheme] = useState('red');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateThumbnail = () => {
    setIsGenerating(true);
    
    // In a real app, this would call an API to generate the thumbnail
    // For demo purposes, we'll simulate the generation by using the current state
    setTimeout(() => {
      // Create a mock generated thumbnail URL
      // In a real app, this would be the URL returned from the API
      if (uploadedImage) {
        setGeneratedThumbnail(uploadedImage);
      } else {
        // Create a placeholder image if no background was uploaded
        const placeholderUrl = `https://placehold.co/1280x720/333333/FFFFFF/png?text=${encodeURIComponent(title || 'YouTube Thumbnail')}`;  
        setGeneratedThumbnail(placeholderUrl);
      }
      
      setIsGenerating(false);
    }, 2000);
  };
  
  // Function to download the thumbnail
  const downloadThumbnail = () => {
    if (!generatedThumbnail && !uploadedImage) return;
    
    const imageUrl = generatedThumbnail || uploadedImage;
    if (imageUrl) {
      // For direct image URLs
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          downloadFile(blob, 'youtube-thumbnail.png', 'image/png');
        })
        .catch(error => {
          console.error('Error downloading image:', error);
        });
    } else if (thumbnailRef.current) {
      // Fallback: Try to capture the thumbnail div as an image
      // This is a simplified version - in a real app you'd use html2canvas or similar
      copyToClipboard('Thumbnail image', 'Thumbnail link copied to clipboard');
    }
  };
  
  // Function to copy thumbnail link
  const copyThumbnailLink = () => {
    if (generatedThumbnail) {
      copyToClipboard(generatedThumbnail, 'Thumbnail link copied to clipboard');
    } else {
      copyToClipboard('https://example.com/your-youtube-thumbnail.png', 'Thumbnail link copied to clipboard');
    }
  };

  const templates = {
    gaming: { name: 'Gaming', description: 'Bold text, vibrant colors, action-packed' },
    tutorial: { name: 'Tutorial', description: 'Clean design, step indicators, professional' },
    vlog: { name: 'Vlog', description: 'Personal style, lifestyle focused, casual' },
    tech: { name: 'Tech Review', description: 'Modern design, product focused, sleek' },
    cooking: { name: 'Cooking', description: 'Food photography, warm colors, appetizing' }
  };

  const colorSchemes = {
    red: { name: 'YouTube Red', colors: ['#FF0000', '#FF4444'] },
    blue: { name: 'Cool Blue', colors: ['#0066FF', '#4488FF'] },
    green: { name: 'Fresh Green', colors: ['#00CC66', '#44DD88'] },
    purple: { name: 'Royal Purple', colors: ['#6644FF', '#8866FF'] },
    orange: { name: 'Energy Orange', colors: ['#FF6600', '#FF8844'] }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tool Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Create Eye-Catching YouTube Thumbnails
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Design professional thumbnails that increase click-through rates and video views
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Design Panel */}
            <div className="space-y-6">
              {/* Text Settings */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="w-5 h-5 mr-2" />
                    Text & Title
                  </CardTitle>
                  <CardDescription>Add compelling text to your thumbnail</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Main Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your video title..."
                      maxLength={50}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      {title.length}/50 characters (shorter is better for thumbnails)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Font Style</Label>
                      <Select defaultValue="bold">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bold">Bold Impact</SelectItem>
                          <SelectItem value="modern">Modern Sans</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                          <SelectItem value="elegant">Elegant Serif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Text Size</Label>
                      <Select defaultValue="large">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xlarge">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Template Selection */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Template Style
                  </CardTitle>
                  <CardDescription>Choose a template that fits your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Template Category</Label>
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(templates).map(([key, tmpl]) => (
                          <SelectItem key={key} value={key}>
                            {tmpl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 mt-1">
                      {templates[template as keyof typeof templates]?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Color Scheme */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Scheme
                  </CardTitle>
                  <CardDescription>Select colors that grab attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Color Palette</Label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(colorSchemes).map(([key, scheme]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {scheme.colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <span>{scheme.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Background Image */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Background Image
                  </CardTitle>
                  <CardDescription>Upload your own image or use AI-generated backgrounds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={uploadedImage} 
                          alt="Background" 
                          className="max-w-full h-32 object-cover mx-auto rounded"
                        />
                        <Button variant="outline" onClick={() => setUploadedImage(null)}>
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                        <div>
                          <Label htmlFor="bg-upload" className="cursor-pointer">
                            <Button size="sm" asChild>
                              <span>Upload Image</span>
                            </Button>
                          </Label>
                          <Input
                            id="bg-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                        <p className="text-sm text-slate-500">
                          Or choose from AI-generated backgrounds
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-4">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Thumbnail Preview</span>
                    <div className="flex space-x-2">
                      <Button
                        onClick={generateThumbnail}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      >
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={downloadThumbnail}
                        disabled={!generatedThumbnail && !uploadedImage}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* YouTube Thumbnail Preview - 16:9 aspect ratio */}
                  <div ref={thumbnailRef} className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                    {uploadedImage && (
                      <img 
                        src={uploadedImage} 
                        alt="Background" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Title overlay */}
                    {title && (
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h2 
                          className="text-white font-bold text-center leading-tight shadow-lg"
                          style={{ 
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            background: `linear-gradient(45deg, ${colorSchemes[colorScheme as keyof typeof colorSchemes].colors.join(', ')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
                          }}
                        >
                          {title}
                        </h2>
                      </div>
                    )}

                    {/* YouTube branding overlay */}
                    <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                      16:30
                    </div>

                    {!title && !uploadedImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                          <Youtube className="w-12 h-12 mx-auto mb-2" />
                          <p>Your thumbnail preview will appear here</p>
                          <p className="text-sm">Add a title and background to get started</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview Info */}
                  <div className="mt-4 text-sm text-slate-600 space-y-1">
                    <p><strong>Dimensions:</strong> 1280 x 720 pixels (16:9)</p>
                    <p><strong>File size:</strong> Optimized for web</p>
                    <p><strong>Format:</strong> PNG/JPG</p>
                  </div>
                  
                  {/* Copy Link Button */}
                  {(generatedThumbnail || uploadedImage) && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={copyThumbnailLink}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Thumbnail Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="mt-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Thumbnail Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Use bright, contrasting colors</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Keep text large and readable</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Include faces when possible</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Create curiosity and urgency</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}