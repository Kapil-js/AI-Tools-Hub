'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LifeBuoy, 
  MessageSquare, 
  FileQuestion, 
  BookOpen, 
  Video, 
  Lightbulb, 
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Search
} from 'lucide-react';

const supportCategories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'account', label: 'Account Issues' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical Problems' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' }
];

const popularArticles = [
  {
    title: 'Getting Started with AI Tools Hub',
    description: 'A complete guide to setting up your account and using our tools',
    icon: Lightbulb,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Subscription Plans Explained',
    description: 'Understand the differences between Free, Pro, and Business plans',
    icon: FileQuestion,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  },
  {
    title: 'Troubleshooting Upload Issues',
    description: 'Common solutions for file upload problems',
    icon: HelpCircle,
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  },
  {
    title: 'AI Image Enhancement Tips',
    description: 'Get the best results from our image enhancement tool',
    icon: Lightbulb,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }
];

const videoTutorials = [
  {
    title: 'Introduction to AI Tools Hub',
    duration: '3:45',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'Advanced PDF Compression',
    duration: '5:12',
    thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'Creating Perfect YouTube Thumbnails',
    duration: '7:30',
    thumbnail: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function Support() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Center</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get help with our AI tools, account management, and technical issues
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full shadow-lg"
              placeholder="Search for help articles, tutorials, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full">
              Search
            </Button>
          </div>
        </div>

        {/* Support Options */}
        <Tabs defaultValue="help-center" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="help-center" className="flex flex-col items-center py-3 gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Help Center</span>
            </TabsTrigger>
            <TabsTrigger value="video-tutorials" className="flex flex-col items-center py-3 gap-2">
              <Video className="w-5 h-5" />
              <span>Video Tutorials</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col items-center py-3 gap-2">
              <FileQuestion className="w-5 h-5" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col items-center py-3 gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>Contact Us</span>
            </TabsTrigger>
          </TabsList>

          {/* Help Center Content */}
          <TabsContent value="help-center">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                Popular Help Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${article.color} flex items-center justify-center flex-shrink-0`}>
                          <article.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                            {article.description}
                          </p>
                          <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                            Read article
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/faq">
                  <Button variant="outline" size="lg">
                    Browse All Help Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Video Tutorials Content */}
          <TabsContent value="video-tutorials">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                Video Tutorials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videoTutorials.map((video, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-purple-600 border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {video.title}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg">
                  View All Tutorials
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* FAQ Content */}
          <TabsContent value="faq">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                Frequently Asked Questions
              </h2>
              
              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        How do I reset my password?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Click on the "Forgot Password" link on the login page. Enter your email address, and we'll send you a link to reset your password. The link is valid for 24 hours.
                      </p>
                    </div>
                    
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Can I cancel my subscription?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.
                      </p>
                    </div>
                    
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        What file formats are supported?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Our image tools support JPG, PNG, WebP, and TIFF formats. The PDF compressor works with standard PDF files. Specific format support is indicated on each tool's page.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                        Is there a file size limit?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Free users can upload files up to 10MB. Pro users can upload files up to 50MB, and Business users up to 100MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link href="/faq">
                  <Button variant="outline" size="lg">
                    View All FAQs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Contact Us Content */}
          <TabsContent value="contact">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                Contact Our Support Team
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      Chat with our support team in real-time
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available now</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      Get a response within 24 hours
                    </p>
                    <p className="text-sm font-medium">
                      support@aitoolshub.com
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileQuestion className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Help Center</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      Browse our knowledge base
                    </p>
                    <Link href="/faq">
                      <Button variant="outline" size="sm">
                        Visit Help Center
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {submitted ? (
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                      Thank you for contacting us. Our support team will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                          Category
                        </label>
                        <Select value={contactForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          value={contactForm.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Please provide details about your issue or question..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isSubmitting ? (
                          'Sending Message...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}