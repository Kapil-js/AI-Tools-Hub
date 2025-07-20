'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, PenTool, Download, Copy, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function ArticleWriter() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedArticle, setGeneratedArticle] = useState('');

  const generateArticle = () => {
    setIsGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedArticle(sampleArticle);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArticle);
  };

  const wordCount = generatedArticle.split(' ').filter(word => word.length > 0).length;

  const sampleArticle = `# ${topic || 'The Future of Technology'}

## Introduction

In today's rapidly evolving digital landscape, understanding the latest technological trends has become more crucial than ever. This comprehensive guide explores the key developments shaping our future and their potential impact on various industries.

## Key Developments

### Artificial Intelligence and Machine Learning

The advancement of AI and machine learning technologies continues to revolutionize how we approach problem-solving across different sectors. From healthcare diagnostics to financial analysis, these technologies are enabling unprecedented levels of efficiency and accuracy.

### Internet of Things (IoT)

The interconnected world of IoT devices is creating new opportunities for data collection and analysis. Smart cities, autonomous vehicles, and connected homes are just the beginning of what's possible with this technology.

### Blockchain Technology

Beyond cryptocurrencies, blockchain technology is finding applications in supply chain management, digital identity verification, and decentralized finance systems.

## Industry Impact

### Healthcare

Technology is transforming healthcare delivery through telemedicine, AI-powered diagnostics, and personalized treatment plans based on genetic analysis.

### Education

Digital learning platforms, virtual reality experiences, and AI tutors are reshaping how we approach education and skill development.

### Business Operations

Automation, data analytics, and cloud computing are enabling businesses to operate more efficiently and make data-driven decisions.

## Future Outlook

As we look toward the future, the convergence of these technologies promises to create even more innovative solutions. The key to success will be staying informed about these developments and understanding how to leverage them effectively.

## Conclusion

The technological revolution is not just about adopting new tools; it's about transforming how we think, work, and interact with the world around us. By staying informed and adaptable, we can harness these innovations to create a better future for everyone.

*This article was generated using AI technology and provides insights based on current technological trends and industry analysis.*`;

  const getToneDescription = (selectedTone: string) => {
    switch (selectedTone) {
      case 'professional': return 'Formal, authoritative, business-focused';
      case 'casual': return 'Conversational, friendly, approachable';
      case 'academic': return 'Scholarly, research-oriented, detailed';
      case 'creative': return 'Engaging, storytelling, imaginative';
      default: return '';
    }
  };

  const getLengthDescription = (selectedLength: string) => {
    switch (selectedLength) {
      case 'short': return '300-500 words, quick read';
      case 'medium': return '800-1200 words, comprehensive';
      case 'long': return '1500+ words, in-depth analysis';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Tool Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              AI-Powered Content Creation
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Generate high-quality articles, blog posts, and content with advanced AI writing assistance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Article Settings
                  </CardTitle>
                  <CardDescription>Configure your article parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic / Title</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter your article topic..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tone">Writing Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 mt-1">
                      {getToneDescription(tone)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="length">Article Length</Label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger id="length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short Article</SelectItem>
                        <SelectItem value="medium">Medium Article</SelectItem>
                        <SelectItem value="long">Long Article</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 mt-1">
                      {getLengthDescription(length)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords (Optional)</Label>
                    <Input
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Comma-separated keywords for SEO optimization
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Content Options</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="intro" defaultChecked className="rounded" />
                        <Label htmlFor="intro" className="text-sm">Include introduction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="headings" defaultChecked className="rounded" />
                        <Label htmlFor="headings" className="text-sm">Use section headings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="conclusion" defaultChecked className="rounded" />
                        <Label htmlFor="conclusion" className="text-sm">Include conclusion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="citations" className="rounded" />
                        <Label htmlFor="citations" className="text-sm">Add citations</Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={generateArticle}
                    disabled={!topic || isGenerating}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Writing Article...
                      </>
                    ) : (
                      <>
                        <PenTool className="w-4 h-4 mr-2" />
                        Generate Article
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Generating content...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              {generatedArticle && (
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Article Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Word Count:</span>
                      <span className="font-semibold">{wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Character Count:</span>
                      <span className="font-semibold">{generatedArticle.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reading Time:</span>
                      <span className="font-semibold">{Math.ceil(wordCount / 200)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paragraphs:</span>
                      <span className="font-semibold">{generatedArticle.split('\n\n').length}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Article Editor */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Generated Article
                    </div>
                    {generatedArticle && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Your AI-generated article will appear here. You can edit and refine the content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  {generatedArticle ? (
                    <Textarea
                      value={generatedArticle}
                      onChange={(e) => setGeneratedArticle(e.target.value)}
                      className="min-h-[600px] font-mono text-sm resize-none"
                      placeholder="Your generated article will appear here..."
                    />
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center min-h-[600px] flex items-center justify-center">
                      <div className="text-center">
                        <PenTool className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-500 mb-2">Ready to create amazing content?</p>
                        <p className="text-sm text-slate-400">
                          Enter a topic and click "Generate Article" to get started
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-600">Advanced language models for high-quality content</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Tones</h3>
              <p className="text-sm text-slate-600">Adapt writing style to match your needs</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">SEO Optimized</h3>
              <p className="text-sm text-slate-600">Built-in keyword optimization for better rankings</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Export Ready</h3>
              <p className="text-sm text-slate-600">Download in multiple formats for any platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}