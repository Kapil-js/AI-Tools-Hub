'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ImageIcon, 
  Users, 
  FileText, 
  User, 
  Instagram, 
  Youtube, 
  PenTool,
  ArrowRight,
  Sparkles,
  Wrench,
  Zap,
  Lock,
  Repeat
} from 'lucide-react';

const tools = [
  {
    id: 'image-enhancer',
    title: 'Image Enhancer',
    description: 'Enhance image quality with AI-powered upscaling and noise reduction',
    icon: ImageIcon,
    href: '/tools/image-enhancer',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'face-swapper',
    title: 'AI Face Swapper',
    description: 'Swap faces in photos using advanced AI face detection technology',
    icon: Users,
    href: '/tools/face-swapper',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor',
    description: 'Compress PDF files while maintaining quality and readability',
    icon: FileText,
    href: '/tools/pdf-compressor',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Create professional resumes with AI-powered content suggestions',
    icon: User,
    href: '/tools/resume-builder',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'instagram-caption',
    title: 'Instagram Caption Generator',
    description: 'Generate engaging captions for your Instagram posts with hashtags',
    icon: Instagram,
    href: '/tools/instagram-caption',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'youtube-thumbnail',
    title: 'YouTube Thumbnail Generator',
    description: 'Create eye-catching thumbnails for your YouTube videos',
    icon: Youtube,
    href: '/tools/youtube-thumbnail',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'article-writer',
    title: 'AI Article Writer',
    description: 'Generate high-quality articles with AI-powered content creation',
    icon: PenTool,
    href: '/tools/article-writer',
    color: 'from-indigo-500 to-purple-500'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            AI Tools Collection
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to enhance your productivity and creativity.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <Card className="group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} dark:shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {tool.description}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-auto group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                    >
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl mb-16 max-w-7xl">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Our AI Tools?
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our tools are designed with cutting-edge AI technology to deliver exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Advanced AI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Powered by state-of-the-art machine learning models</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Fast Processing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Get results in seconds, not minutes</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Privacy Focused</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Your data is processed securely and never shared</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Unlimited Usage</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Use our tools as much as you need with your subscription</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to transform your workflow?
          </h3>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of professionals using our AI tools to save time and boost productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}