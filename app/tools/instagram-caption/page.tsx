'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Instagram, Sparkles, Copy, RefreshCw, Hash } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function InstagramCaption() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);

  const generateCaptions = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const captions = [
        `✨ ${topic || 'Living my best life'} and loving every moment! Who else is feeling grateful today? Drop a 💙 if you're with me! #grateful #lifestyle #vibes #motivation #positivity #blessed #goodvibes #instadaily`,
        
        `${topic || 'Amazing moments'} captured! 📸 Sometimes you just have to stop and appreciate the beauty around you. What's making you smile today? 😊 #photography #moments #happiness #life #beauty #inspiration #smile #weekend`,
        
        `Can we talk about how incredible this ${topic || 'experience'} is?! 🤩 I'm absolutely obsessed and had to share with you all. Swipe to see more! ➡️ #obsessed #sharing #community #love #amazing #incredible #mustshare #swiperight`
      ];
      
      setGeneratedCaptions(captions);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getToneDescription = (selectedTone: string) => {
    switch (selectedTone) {
      case 'casual': return 'Friendly and relaxed';
      case 'professional': return 'Business-focused and polished';
      case 'funny': return 'Humorous and entertaining';
      case 'inspirational': return 'Motivational and uplifting';
      default: return '';
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
              AI-Powered Instagram Captions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Generate engaging captions with relevant hashtags to boost your Instagram engagement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Caption Settings
                </CardTitle>
                <CardDescription>
                  Customize your caption preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="topic">Topic or Theme</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="coffee, workout, travel, fashion..."
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    What's your post about? Be specific for better results.
                  </p>
                </div>

                <div>
                  <Label htmlFor="tone">Tone & Style</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual & Fun</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="funny">Funny & Witty</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-500 mt-1">
                    {getToneDescription(tone)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="length">Caption Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger id="length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (3-4 sentences)</SelectItem>
                      <SelectItem value="long">Long (5+ sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Additional Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="hashtags" defaultChecked className="rounded" />
                      <Label htmlFor="hashtags" className="text-sm">Include relevant hashtags</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="emojis" defaultChecked className="rounded" />
                      <Label htmlFor="emojis" className="text-sm">Add emojis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="cta" className="rounded" />
                      <Label htmlFor="cta" className="text-sm">Include call-to-action</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateCaptions}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Captions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Instagram className="w-5 h-5 mr-2" />
                  Generated Captions
                </CardTitle>
                <CardDescription>
                  Choose from AI-generated caption options
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedCaptions.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Instagram className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">
                      Generated captions will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedCaptions.map((caption, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm text-slate-700">Option {index + 1}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(caption)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={caption}
                          readOnly
                          className="min-h-[120px] text-sm resize-none"
                        />
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {(caption.match(/#\w+/g) || []).length} hashtags
                            </span>
                            <span>{caption.length} characters</span>
                          </div>
                          <Button size="sm" onClick={() => copyToClipboard(caption)}>
                            Copy Caption
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={generateCaptions}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate New Options
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Instagram Caption Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="font-semibold mb-2">Engage Your Audience</h4>
                <p className="text-sm text-slate-600">Ask questions and encourage comments to boost engagement</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Use Relevant Hashtags</h4>
                <p className="text-sm text-slate-600">Mix popular and niche hashtags for better discoverability</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Be Authentic</h4>
                <p className="text-sm text-slate-600">Let your personality shine through your captions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}