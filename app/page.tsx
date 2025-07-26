import type { Metadata } from 'next'
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: 'AI Tools Hub - Free AI-Powered Tools for Content Creation & Productivity',
  description: 'Discover 20+ free AI tools for image enhancement, PDF processing, content creation, and more. Boost your productivity with our powerful AI-powered platform.',
  keywords: 'AI tools, free AI tools, image enhancer, PDF tools, content creation, productivity tools, artificial intelligence, online tools',
  authors: [{ name: 'AI Tools Hub' }],
  creator: 'AI Tools Hub',
  publisher: 'AI Tools Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://scalestack.in'),
  alternates: {
    canonical: 'https://scalestack.in',
  },
  openGraph: {
    title: 'AI Tools Hub - Free AI-Powered Tools for Everyone',
    description: 'Transform your workflow with 20+ free AI tools. Enhance images, process PDFs, create content, and boost productivity.',
    url: 'https://scalestack.in',
    siteName: 'AI Tools Hub',
    images: [
      {
        url: 'https://scalestack.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Hub - Free AI-Powered Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Hub - Free AI-Powered Tools',
    description: 'Transform your workflow with 20+ free AI tools. Enhance images, process PDFs, create content.',
    images: ['https://scalestack.in/og-image.jpg'],
    creator: '@aitoolshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Merge,
  Scissors,
  File,
} from "lucide-react";

const tools = [
  {
    id: "image-enhancer",
    title: "Image Enhancer",
    description:
      "Enhance image quality with AI-powered upscaling and noise reduction",
    icon: ImageIcon,
    href: "/tools/image-enhancer",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "face-swapper",
    title: "AI Face Swapper",
    description:
      "Swap faces in photos using advanced AI face detection technology",
    icon: Users,
    href: "/tools/face-swapper",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "pdf-compressor",
    title: "PDF Compressor",
    description: "Compress PDF files while maintaining quality and readability",
    icon: FileText,
    href: "/tools/pdf-compressor",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    description:
      "Create professional resumes with AI-powered content suggestions",
    icon: User,
    href: "/tools/resume-builder",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "instagram-caption",
    title: "Instagram Caption Generator",
    description:
      "Generate engaging captions for your Instagram posts with hashtags",
    icon: Instagram,
    href: "/tools/instagram-caption",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "youtube-thumbnail",
    title: "YouTube Thumbnail Generator",
    description: "Create eye-catching thumbnails for your YouTube videos",
    icon: Youtube,
    href: "/tools/youtube-thumbnail",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "article-writer",
    title: "AI Article Writer",
    description:
      "Generate high-quality articles with AI-powered content creation",
    icon: PenTool,
    href: "/tools/article-writer",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger",
    icon: Merge,
    href: "/tools/merge-pdf",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Separate pages for easy conversion into independent PDF files",
    icon: Scissors,
    href: "/tools/split-pdf",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF files into editable DOC and DOCX documents",
    icon: File,
    href: "/tools/pdf-to-word",
    color: "from-blue-500 to-indigo-500",
  },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Tools Hub',
    description: 'Free AI-powered tools for content creation, image enhancement, PDF processing, and productivity.',
    url: 'https://scalestack.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://scalestack.in/tools?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Tools Hub',
      url: 'https://scalestack.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://scalestack.in/logo.png'
      }
    }
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Powerful AI Tools for
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent block">
              Creative Professionals
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Transform your workflow with our comprehensive suite of AI-powered
            tools. Enhance images, create content, and streamline your creative
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/auth"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Tool
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select from our powerful collection of AI tools designed to enhance
            your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <Card className="group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} dark:shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
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
        
        <div className="text-center mt-12">
          <Link href="/tools">
            <Button size="lg" variant="outline" className="group">
              View All Tools
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
      </main>
    </div>
    </>
  );
}
