'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Zap,
  Heart,
  Shield,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Former AI researcher at Google with 10+ years in machine learning and product development.'
  },
  {
    name: 'Mike Chen',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Full-stack engineer and AI specialist, previously at OpenAI and Microsoft.'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of Design',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Award-winning UX designer with expertise in AI-human interaction design.'
  },
  {
    name: 'David Park',
    role: 'Head of Marketing',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Growth marketing expert who has scaled multiple tech startups from zero to millions of users.'
  }
];

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We push the boundaries of what\'s possible with AI technology to create tools that truly make a difference.'
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Every feature we build is designed with our users\' needs and workflows in mind.'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'We prioritize data protection and ensure your content remains secure and private.'
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'We believe powerful AI tools should be accessible to everyone, regardless of technical expertise.'
  }
];

const stats = [
  { label: 'Active Users', value: '500K+' },
  { label: 'Tools Created', value: '50+' },
  { label: 'Countries Served', value: '120+' },
  { label: 'Customer Satisfaction', value: '98%' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            About AI Tools Hub
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize AI-powered creativity, making advanced tools accessible 
            to creators, professionals, and businesses worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="w-6 h-6 mr-3 text-purple-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To empower creators and professionals with cutting-edge AI tools that enhance productivity, 
                creativity, and innovation. We believe that advanced AI capabilities should be intuitive, 
                accessible, and seamlessly integrated into everyday workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="w-6 h-6 mr-3 text-blue-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                A world where AI amplifies human creativity rather than replacing it. We envision a future 
                where powerful AI tools enable everyone to bring their ideas to life, regardless of their 
                technical background or resources.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story */}
        <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                AI Tools Hub was born from a simple observation: while AI technology was advancing rapidly, 
                the tools available to everyday creators and professionals were either too complex, too expensive, 
                or simply didn't exist.
              </p>
              <p>
                In 2023, our founders—a team of AI researchers, designers, and entrepreneurs—came together 
                with a shared vision: to bridge the gap between cutting-edge AI research and practical, 
                user-friendly applications that anyone could use.
              </p>
              <p>
                Starting with just three tools, we've grown to serve over 500,000 users across 120 countries. 
                Our platform now offers a comprehensive suite of AI-powered tools for content creation, 
                image enhancement, document processing, and much more.
              </p>
              <p>
                But we're just getting started. As AI technology continues to evolve, so do we. Our commitment 
                remains the same: to make powerful AI tools accessible, intuitive, and genuinely useful for 
                real-world applications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of creators and professionals who are already using our AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Try Our Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}