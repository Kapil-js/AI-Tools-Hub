'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  CreditCard, 
  Zap, 
  Users, 
  Building2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const features = {
  free: [
    { name: 'Access to basic AI tools', included: true },
    { name: 'Limited processing (5 per day)', included: true },
    { name: 'Standard quality outputs', included: true },
    { name: 'Basic support', included: true },
    { name: 'File size limit: 10MB', included: true },
    { name: 'Priority processing', included: false },
    { name: 'Advanced AI features', included: false },
    { name: 'Batch processing', included: false },
    { name: 'API access', included: false },
    { name: 'Custom branding', included: false },
  ],
  pro: [
    { name: 'Access to all AI tools', included: true },
    { name: 'Unlimited processing', included: true },
    { name: 'High quality outputs', included: true },
    { name: 'Priority support', included: true },
    { name: 'File size limit: 50MB', included: true },
    { name: 'Priority processing', included: true },
    { name: 'Advanced AI features', included: true },
    { name: 'Batch processing', included: true },
    { name: 'API access', included: false },
    { name: 'Custom branding', included: false },
  ],
  business: [
    { name: 'Access to all AI tools', included: true },
    { name: 'Unlimited processing', included: true },
    { name: 'Maximum quality outputs', included: true },
    { name: 'Dedicated support', included: true },
    { name: 'File size limit: 100MB', included: true },
    { name: 'Priority processing', included: true },
    { name: 'Advanced AI features', included: true },
    { name: 'Batch processing', included: true },
    { name: 'API access', included: true },
    { name: 'Custom branding', included: true },
  ]
};

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee for new subscribers. If you\'re not satisfied with our services, contact our support team within 7 days of your initial purchase for a full refund.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. For Business plans, we also offer invoice payment options.'
  },
  {
    question: 'Are there any long-term contracts?',
    answer: 'No, all our plans are subscription-based with no long-term commitment. You can cancel at any time without penalty.'
  },
  {
    question: 'Do you offer discounts for non-profits or educational institutions?',
    answer: 'Yes, we offer special pricing for qualified non-profit organizations, educational institutions, and students. Please contact our sales team for more information.'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');

  const getPrice = (plan: string) => {
    if (plan === 'free') return 0;
    
    const prices = {
      pro: {
        monthly: 9.99,
        annual: 7.99
      },
      business: {
        monthly: 29.99,
        annual: 24.99
      },
      enterprise: {
        monthly: 'Custom',
        annual: 'Custom'
      }
    };
    
    return prices[plan as keyof typeof prices][billingCycle];
  };

  const getDiscount = () => {
    return billingCycle === 'annual' ? 20 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pricing Plans</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center justify-center mb-12">
          <Tabs 
            value={userType} 
            onValueChange={(value) => setUserType(value as 'individual' | 'business')}
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-3">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
              Monthly
            </span>
            <Switch 
              checked={billingCycle === 'annual'} 
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <div className="flex items-center">
              <span className={`text-sm ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <Badge className="ml-2 bg-green-500 hover:bg-green-600">Save {getDiscount()}%</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm relative">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Free
              </CardTitle>
              <CardDescription>
                Get started with basic features
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500 dark:text-slate-400 ml-2">forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>
              
              <div className="space-y-2">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 mr-2 text-slate-400" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm relative">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Pro
              </CardTitle>
              <CardDescription>
                Perfect for individual creators
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">${getPrice('pro')}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-2">
                  /{billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Started
              </Button>
              
              <div className="space-y-2">
                {features.pro.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 mr-2 text-slate-400" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm relative">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Business
              </CardTitle>
              <CardDescription>
                For teams and businesses
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">${getPrice('business')}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-2">
                  /{billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
              
              <div className="space-y-2">
                {features.business.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 mr-2 text-slate-400" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise */}
        <div className="mt-12 max-w-6xl mx-auto">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                  <Building2 className="w-6 h-6 mr-2" />
                  Enterprise
                </h3>
                <p className="text-slate-300 max-w-md">
                  Custom solutions for large organizations with advanced needs. Includes dedicated support, custom integrations, and SLA.
                </p>
              </div>
              <Button size="lg" variant="secondary">
                Contact Sales
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl mx-auto">
            Join thousands of creators and professionals who are already using our AI tools to enhance their workflow.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Sign Up Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}