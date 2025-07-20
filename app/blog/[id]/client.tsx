'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Copy,
  Download
} from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils-client';

// This would typically come from a CMS or API
const blogPost = {
  id: 1,
  title: 'The Future of AI-Powered Content Creation',
  excerpt: 'Explore how artificial intelligence is revolutionizing the way we create, edit, and optimize content across various industries.',
  author: 'Sarah Johnson',
  date: '2024-01-15',
  readTime: '8 min read',
  category: 'AI Technology',
  image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  content: `
# The Future of AI-Powered Content Creation

Artificial Intelligence has fundamentally transformed how we approach content creation, moving from simple automation to sophisticated creative assistance. As we stand at the threshold of 2024, the landscape of AI-powered content tools continues to evolve at an unprecedented pace.

## The Current State of AI Content Tools

Today's AI content creation tools have moved far beyond basic text generation. We're seeing sophisticated systems that can:

- **Generate high-quality written content** across multiple formats and styles
- **Create and enhance visual content** with remarkable precision
- **Optimize content for specific audiences** and platforms
- **Provide real-time editing suggestions** that improve clarity and engagement

### Key Technologies Driving Innovation

The advancement in AI content creation is powered by several breakthrough technologies:

**Large Language Models (LLMs)**: These models, like GPT-4 and Claude, have revolutionized text generation by understanding context, tone, and style with human-like proficiency.

**Computer Vision AI**: Advanced image processing algorithms can now enhance, modify, and generate visual content that rivals professional design work.

**Multimodal AI**: The integration of text, image, and audio processing in single systems is creating more versatile content creation platforms.

## Industry Applications

### Marketing and Advertising

AI tools are transforming marketing by enabling:
- Personalized content at scale
- A/B testing of multiple content variations
- Real-time optimization based on audience response
- Cross-platform content adaptation

### Education and Training

Educational content creation has been revolutionized through:
- Adaptive learning materials that adjust to student needs
- Automated quiz and assessment generation
- Interactive content that responds to learning patterns
- Multilingual content translation and localization

### Entertainment and Media

The entertainment industry leverages AI for:
- Script writing assistance and story development
- Video editing and post-production automation
- Music composition and sound design
- Character and world-building for games and films

## Challenges and Considerations

While AI-powered content creation offers tremendous opportunities, several challenges must be addressed:

### Quality and Authenticity

Maintaining human creativity and authentic voice while leveraging AI assistance requires careful balance. The best results come from human-AI collaboration rather than complete automation.

### Ethical Considerations

- **Attribution and originality**: Ensuring proper credit and avoiding plagiarism
- **Bias mitigation**: Addressing inherent biases in training data
- **Transparency**: Being clear about AI involvement in content creation

### Technical Limitations

Current AI systems still struggle with:
- Long-form narrative consistency
- Cultural nuance and context
- Real-time fact-checking and accuracy
- Creative breakthrough and innovation

## Best Practices for AI Content Creation

### 1. Define Clear Objectives

Before using AI tools, establish:
- Target audience and their preferences
- Content goals and success metrics
- Brand voice and style guidelines
- Quality standards and review processes

### 2. Choose the Right Tools

Select AI tools based on:
- Specific content type requirements
- Integration capabilities with existing workflows
- Customization and training options
- Cost-effectiveness and scalability

### 3. Maintain Human Oversight

Implement processes for:
- Content review and editing
- Fact-checking and accuracy verification
- Brand consistency maintenance
- Legal and compliance review

## The Road Ahead

The future of AI-powered content creation promises even more exciting developments:

### Emerging Trends

**Hyper-Personalization**: AI will enable content that adapts in real-time to individual user preferences and behaviors.

**Cross-Platform Optimization**: Single content pieces will automatically adapt for optimal performance across different platforms and formats.

**Collaborative AI**: Multiple AI systems will work together to create more sophisticated and nuanced content.

**Real-Time Content**: AI will generate and modify content in real-time based on current events, trends, and user interactions.

### Preparing for the Future

Organizations should:
- Invest in AI literacy and training for content teams
- Develop clear AI usage policies and guidelines
- Experiment with new tools and technologies
- Build flexible workflows that can adapt to new capabilities

## Conclusion

AI-powered content creation is not about replacing human creativity but amplifying it. The most successful content strategies will combine the efficiency and scale of AI with the insight, emotion, and strategic thinking that only humans can provide.

As these tools continue to evolve, the organizations that embrace AI while maintaining focus on quality, authenticity, and human connection will lead the next generation of content creation.

The future is not about choosing between human or AI content creation—it's about finding the perfect harmony between both to create content that truly resonates with audiences and drives meaningful engagement.

---

*What are your thoughts on AI-powered content creation? Share your experiences and insights in the comments below.*
  `,
  tags: ['AI', 'Content Creation', 'Technology', 'Future Trends', 'Digital Marketing'],
  likes: 127,
  comments: 23
};

const relatedPosts = [
  {
    id: 2,
    title: 'Best Practices for YouTube Thumbnail Design',
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400',
    readTime: '6 min read'
  },
  {
    id: 3,
    title: 'Instagram Marketing: Caption Strategies That Convert',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    readTime: '7 min read'
  },
  {
    id: 4,
    title: 'Resume Writing in the AI Era: What Recruiters Want',
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    readTime: '9 min read'
  }
];

export default function BlogPostClient({ id }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <img 
                  src={blogPost.image} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {blogPost.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8">
                {/* Article Header */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    {blogPost.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blogPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(blogPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blogPost.readTime}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {blogPost.likes}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {blogPost.comments}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => isMounted && copyToClipboard(window.location.href, "Link copied to clipboard!")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  <Separator />
                </div>

                {/* Article Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-0 right-0" 
                    onClick={() => isMounted && copyToClipboard(blogPost.content, "Article content copied to clipboard!")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </Button>
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                    {blogPost.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('# ')) {
                        return (
                          <h1 key={index} className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                            {paragraph.replace('# ', '')}
                          </h1>
                        );
                      }
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-xl font-semibold text-slate-900 dark:text-white mt-4 mb-2">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <p key={index} className="font-semibold text-slate-900 dark:text-white mb-2">
                            {paragraph.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <li key={index} className="ml-4 mb-1">
                            {paragraph.replace('- ', '')}
                          </li>
                        );
                      }
                      if (paragraph.trim() === '---') {
                        return <Separator key={index} className="my-6" />;
                      }
                      if (paragraph.trim() === '') {
                        return <br key={index} />;
                      }
                      return (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Download Options */}
                <div className="mt-8 pt-6 border-t dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Download Options</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => isMounted && downloadFile(blogPost.content, `${blogPost.title.replace(/\s+/g, '-').toLowerCase()}.txt`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download as TXT
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => isMounted && downloadFile(blogPost.content, `${blogPost.title.replace(/\s+/g, '-').toLowerCase()}.md`, 'text/markdown')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download as Markdown
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!isMounted) return;
                        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${blogPost.title}</title>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${blogPost.title}</h1>
  <div class="meta">
    <p>Author: ${blogPost.author} | Published: ${blogPost.date} | ${blogPost.readTime}</p>
  </div>
  <div class="content">
    ${blogPost.content.split('\n').map(p => `<p>${p}</p>`).join('')}
  </div>
</body>
</html>`;
                        downloadFile(htmlContent, `${blogPost.title.replace(/\s+/g, '-').toLowerCase()}.html`, 'text/html');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download as HTML
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {blogPost.author}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    AI Technology Writer & Content Strategist
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Follow
                  </Button>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <div className="flex space-x-3 group cursor-pointer">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {post.readTime}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/blog">
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      View All Articles
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}