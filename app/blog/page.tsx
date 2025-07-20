'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight, TrendingUp } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI-Powered Content Creation',
    excerpt: 'Explore how artificial intelligence is revolutionizing the way we create, edit, and optimize content across various industries.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'AI Technology',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: 2,
    title: 'Best Practices for YouTube Thumbnail Design',
    excerpt: 'Learn the essential design principles and psychological triggers that make thumbnails irresistible to viewers.',
    author: 'Mike Chen',
    date: '2024-01-12',
    readTime: '6 min read',
    category: 'Design',
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: 3,
    title: 'Instagram Marketing: Caption Strategies That Convert',
    excerpt: 'Discover proven caption formulas and hashtag strategies that boost engagement and drive conversions on Instagram.',
    author: 'Emma Rodriguez',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: 4,
    title: 'Resume Writing in the AI Era: What Recruiters Want',
    excerpt: 'Understand how AI is changing recruitment and what modern resumes need to stand out in applicant tracking systems.',
    author: 'David Park',
    date: '2024-01-08',
    readTime: '9 min read',
    category: 'Career',
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: 5,
    title: 'Image Enhancement Techniques: From Basic to AI',
    excerpt: 'A comprehensive guide to image enhancement methods, from traditional editing to cutting-edge AI algorithms.',
    author: 'Lisa Wang',
    date: '2024-01-05',
    readTime: '10 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: 6,
    title: 'PDF Optimization: Speed vs Quality Trade-offs',
    excerpt: 'Learn how to balance file size reduction with document quality for optimal user experience and loading times.',
    author: 'Alex Thompson',
    date: '2024-01-03',
    readTime: '5 min read',
    category: 'Productivity',
    image: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  }
];

const categories = ['All', 'AI Technology', 'Design', 'Marketing', 'Career', 'Technology', 'Productivity'];

export default function Blog() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Tools Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Insights, tutorials, and industry trends in AI-powered tools and creative technology
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Article</h2>
            </div>
            
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600 hover:bg-purple-700">
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Link href={`/blog/${featuredPost.id}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
              className={category === 'All' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}