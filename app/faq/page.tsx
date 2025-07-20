'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Search, CreditCard, Lock, Zap, Image, FileText, Settings, Users } from 'lucide-react';

// FAQ categories and questions
const faqData = [
  {
    category: 'General',
    icon: HelpCircle,
    color: 'text-purple-600 dark:text-purple-400',
    questions: [
      {
        question: 'What is AI Tools Hub?',
        answer: 'AI Tools Hub is a comprehensive platform offering various AI-powered tools for creative professionals, including image enhancement, face swapping, PDF compression, resume building, Instagram caption generation, YouTube thumbnail creation, and article writing.'
      },
      {
        question: 'Do I need technical knowledge to use these tools?',
        answer: 'No, our tools are designed to be user-friendly and accessible to everyone, regardless of technical expertise. The intuitive interfaces guide you through each step of the process.'
      },
      {
        question: 'Can I use these tools on mobile devices?',
        answer: 'Yes, AI Tools Hub is fully responsive and works on desktop, tablet, and mobile devices. However, for the best experience with tools that involve detailed editing, we recommend using a desktop or laptop.'
      },
      {
        question: 'Are there any limitations on how many times I can use the tools?',
        answer: 'Free users have limited access to our tools. Premium subscribers enjoy unlimited access to all tools with higher processing priority and additional features.'
      }
    ]
  },
  {
    category: 'Account & Billing',
    icon: CreditCard,
    color: 'text-green-600 dark:text-green-400',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click on the "Sign In" button in the top right corner, then select "Create Account." Fill in your details, verify your email address, and you\'re ready to go.'
      },
      {
        question: 'What subscription plans do you offer?',
        answer: 'We offer a Free plan with basic access, a Pro plan ($9.99/month) for individuals with full access to all tools, and a Business plan ($29.99/month) for teams with additional collaboration features.'
      },
      {
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 7-day money-back guarantee for new subscribers. If you\'re not satisfied with our services, contact our support team within 7 days of your initial purchase for a full refund.'
      }
    ]
  },
  {
    category: 'Privacy & Security',
    icon: Lock,
    color: 'text-blue-600 dark:text-blue-400',
    questions: [
      {
        question: 'How do you handle my uploaded content?',
        answer: 'We temporarily store your uploaded content only for the purpose of processing and generating results. All uploaded content is automatically deleted after 30 days. We never share your content with third parties.'
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption to protect your data in transit and at rest. Our servers are hosted in secure facilities with strict access controls.'
      },
      {
        question: 'Do you use my content to train your AI models?',
        answer: 'No, we do not use your uploaded content to train our AI models unless you explicitly opt-in to our improvement program. Your privacy is our priority.'
      },
      {
        question: 'Can I delete my account and all associated data?',
        answer: 'Yes, you can request account deletion from your account settings. This will permanently remove all your personal information and uploaded content from our systems.'
      }
    ]
  },
  {
    category: 'Performance & Features',
    icon: Zap,
    color: 'text-orange-600 dark:text-orange-400',
    questions: [
      {
        question: 'How fast do the tools process my requests?',
        answer: 'Processing time depends on the complexity of the task and current server load. Most operations complete within seconds to minutes. Premium users receive priority processing.'
      },
      {
        question: 'What file formats are supported?',
        answer: 'Our image tools support JPG, PNG, WebP, and TIFF formats. The PDF compressor works with standard PDF files. Specific format support is indicated on each tool\'s page.'
      },
      {
        question: 'Is there a file size limit?',
        answer: 'Free users can upload files up to 10MB. Pro users can upload files up to 50MB, and Business users up to 100MB.'
      },
      {
        question: 'Can I batch process multiple files?',
        answer: 'Batch processing is available for Pro and Business subscribers. Free users can only process one file at a time.'
      }
    ]
  },
  {
    category: 'Image Tools',
    icon: Image,
    color: 'text-pink-600 dark:text-pink-400',
    questions: [
      {
        question: 'How does the Image Enhancer work?',
        answer: 'Our Image Enhancer uses advanced AI algorithms to improve image quality by reducing noise, increasing resolution, enhancing colors, and sharpening details while preserving the natural look of the image.'
      },
      {
        question: 'Is the Face Swapper ethical and legal?',
        answer: 'Our Face Swapper is designed for creative and entertainment purposes only. We require users to comply with our ethical guidelines, which prohibit creating misleading or harmful content. Always ensure you have proper consent from individuals in the photos.'
      },
      {
        question: 'How accurate is the YouTube Thumbnail Generator?',
        answer: 'The YouTube Thumbnail Generator creates professional-looking thumbnails based on your inputs. While the AI suggests optimal designs, you can customize every aspect to match your channel\'s style and content.'
      },
      {
        question: 'Can I edit the enhanced images after processing?',
        answer: 'Yes, all processed images can be downloaded and further edited in your preferred image editing software. We provide the results in high-quality formats that preserve all enhancements.'
      }
    ]
  },
  {
    category: 'Document Tools',
    icon: FileText,
    color: 'text-emerald-600 dark:text-emerald-400',
    questions: [
      {
        question: 'Does PDF compression affect document quality?',
        answer: 'Our PDF Compressor uses smart algorithms to reduce file size while maintaining readability. You can choose different compression levels based on your quality requirements. The "Low" compression setting preserves nearly all original quality.'
      },
      {
        question: 'How customizable is the Resume Builder?',
        answer: 'The Resume Builder offers multiple templates, formatting options, and content suggestions. You can customize every section, add or remove elements, and adjust styling to create a unique professional resume.'
      },
      {
        question: 'Can I export my resume in different formats?',
        answer: 'Yes, you can export your resume as PDF, DOCX, or plain text. Pro users can also access additional formats like HTML and JSON for integration with other systems.'
      },
      {
        question: 'How does the AI Article Writer generate content?',
        answer: 'The AI Article Writer uses advanced language models trained on diverse content to generate human-like text based on your topic, tone, and structure preferences. You can edit and refine the generated content to match your specific needs.'
      }
    ]
  },
  {
    category: 'Technical Support',
    icon: Settings,
    color: 'text-red-600 dark:text-red-400',
    questions: [
      {
        question: 'What should I do if a tool isn\'t working properly?',
        answer: 'First, try refreshing the page and clearing your browser cache. If the issue persists, check our status page for any ongoing service disruptions. You can also contact our support team with details about the problem.'
      },
      {
        question: 'How can I report a bug?',
        answer: 'You can report bugs through the "Help" section in your account dashboard or by emailing support@aitoolshub.com. Please include details about the issue, steps to reproduce it, and screenshots if possible.'
      },
      {
        question: 'Do you offer API access to your tools?',
        answer: 'Yes, API access is available for Business plan subscribers. This allows you to integrate our AI tools directly into your workflows and applications. Documentation is provided in the developer portal.'
      },
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version.'
      }
    ]
  },
  {
    category: 'Business & Teams',
    icon: Users,
    color: 'text-indigo-600 dark:text-indigo-400',
    questions: [
      {
        question: 'Do you offer team accounts for businesses?',
        answer: 'Yes, our Business plan includes team management features, allowing multiple users to access the platform under a single billing account with centralized administration.'
      },
      {
        question: 'Can we get custom branding on the outputs?',
        answer: 'Business plan subscribers can add their logo and custom branding to generated content, including watermarks on images and branded headers on documents.'
      },
      {
        question: 'Do you offer volume discounts?',
        answer: 'Yes, we offer volume discounts for businesses with more than 10 users. Contact our sales team at sales@aitoolshub.com for custom pricing.'
      },
      {
        question: 'Is there a service level agreement (SLA) for business customers?',
        answer: 'Yes, Business plan subscribers receive an SLA with guaranteed uptime and priority support response times. Enterprise customers can negotiate custom SLAs based on their specific needs.'
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter questions based on search query and active category
  const filteredFAQs = faqData.flatMap(category => {
    const categoryQuestions = category.questions.filter(q => 
      (searchQuery === '' || 
       q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
       q.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === 'all' || activeCategory === category.category)
    );
    
    if (categoryQuestions.length === 0) return [];
    
    return [{
      ...category,
      questions: categoryQuestions
    }];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about our AI tools and services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              placeholder="Search for questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
              className={activeCategory === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
            >
              All Categories
            </Button>
            {faqData.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.category}
                  variant={activeCategory === category.category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.category)}
                  className={activeCategory === category.category ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
                >
                  <Icon className={`w-4 h-4 mr-1 ${category.color}`} />
                  {category.category}
                </Button>
              );
            })}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category) => (
              <Card key={category.category} className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className={`w-5 h-5 mr-2 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-slate-900 dark:text-white">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We couldn't find any FAQs matching your search. Try different keywords or browse by category.
              </p>
            </div>
          )}

          {/* Still Need Help */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="mb-6 opacity-90 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}