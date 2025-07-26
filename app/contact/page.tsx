'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Bug
} from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email and we\'ll respond within 24 hours',
    contact: 'hello@aitoolshub.com',
    action: 'mailto:hello@aitoolshub.com'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our support team during business hours',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come visit our headquarters in San Francisco',
    contact: '123 Innovation Street, San Francisco, CA 94105',
    action: '#'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: 'We\'re here to help during these hours',
    contact: 'Mon-Fri: 9AM-6PM PST',
    action: '#'
  }
];

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry', icon: MessageCircle },
  { value: 'support', label: 'Technical Support', icon: HelpCircle },
  { value: 'business', label: 'Business Partnership', icon: Briefcase },
  { value: 'bug', label: 'Bug Report', icon: Bug }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save contact form data to Firebase
      const contactDoc = await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp(),
        isRead: false
      });
      
      // Create admin notification
      const notificationDoc = await addDoc(collection(db, 'admin_notifications'), {
        type: 'contact_form',
        title: 'New Contact Form Submission',
        message: `New message from ${formData.name} (${formData.email})`,
        data: {
          contactId: formData.email,
          subject: formData.subject,
          inquiryType: formData.inquiryType
        },
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message! We'll get back to you soon."
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have questions about our AI tools? Need support? Want to partner with us? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Choose the best way to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {info.description}
                        </p>
                        {info.action.startsWith('#') ? (
                          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {info.contact}
                          </p>
                        ) : (
                          <a 
                            href={info.action}
                            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            {info.contact}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="font-semibold mb-2">Need Quick Answers?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Check out our FAQ section for instant answers to common questions.
                </p>
                <Button variant="secondary" size="sm">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquiry-type">Inquiry Type *</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                        <SelectTrigger id="inquiry-type">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  <Icon className="w-4 h-4 mr-2" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="privacy" required className="rounded" />
                    <Label htmlFor="privacy" className="text-sm">
                      I agree to the{' '}
                      <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Terms of Service
                      </a>
                    </Label>
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
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Other Ways to Get Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Live Chat
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Get instant help from our support team during business hours
                </p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Help Center
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Browse our comprehensive documentation and tutorials
                </p>
                <Button variant="outline" size="sm">
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Community Forum
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Connect with other users and share tips and tricks
                </p>
                <Button variant="outline" size="sm">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}