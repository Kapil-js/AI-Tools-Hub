'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollText, AlertTriangle, Scale, Ban, FileCheck, HelpCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Last updated: June 15, 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Welcome to AI Tools Hub. These Terms of Service ("Terms") govern your access to and use of our website, 
                services, and AI-powered tools (collectively, the "Services"). By accessing or using our Services, 
                you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p>
                Please read these Terms carefully before using our Services. If you do not agree to these Terms, 
                you may not access or use the Services.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileCheck className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                Account Registration and Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Account Creation</h3>
              <p>
                To access certain features of our Services, you may be required to register for an account. 
                When you register, you agree to provide accurate, current, and complete information about yourself.
              </p>

              <h3>Account Security</h3>
              <p>
                You are responsible for safeguarding your account credentials and for any activities or actions under your account. 
                You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h3>Age Requirements</h3>
              <p>
                You must be at least 16 years old to use our Services. If you are under 18, you represent that you have your 
                parent or guardian's permission to use the Services and they have read and agree to these Terms on your behalf.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Scale className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                User Rights and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>License to Use Services</h3>
              <p>
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to 
                access and use our Services for your personal or internal business purposes.
              </p>

              <h3>User Content</h3>
              <p>
                You retain ownership of any content you upload, submit, or create through our Services ("User Content"). 
                By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, 
                modify, and display your User Content for the purpose of operating and improving our Services.
              </p>

              <h3>Feedback</h3>
              <p>
                If you provide us with feedback or suggestions regarding our Services, you grant us the right to use such 
                feedback without restriction and without compensation to you.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Ban className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                You agree not to use our Services to:
              </p>
              
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Create, upload, or share content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
                <li>Attempt to gain unauthorized access to any part of the Services</li>
                <li>Use our AI tools to generate deepfakes without proper consent or for deceptive purposes</li>
                <li>Use our Services for any fraudulent or illegal purpose</li>
              </ul>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300">Important Notice</p>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Violation of these prohibited uses may result in immediate termination of your account and 
                      potential legal action.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                Subscription and Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Subscription Plans</h3>
              <p>
                We offer various subscription plans for our Services. By subscribing to a paid plan, you agree to pay 
                the applicable fees as described on our website.
              </p>

              <h3>Billing</h3>
              <p>
                For subscription plans, we will bill you in advance on a recurring basis according to your chosen billing cycle. 
                All payments are non-refundable except as expressly provided in these Terms.
              </p>

              <h3>Free Trial</h3>
              <p>
                We may offer free trials of our subscription plans. At the end of the free trial period, you will be 
                automatically charged the applicable subscription fee unless you cancel before the trial ends.
              </p>

              <h3>Changes to Pricing</h3>
              <p>
                We reserve the right to change our prices at any time. If we change the pricing for your subscription, 
                we will provide notice of the change on our website or by email at least 30 days before the change takes effect.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Our Intellectual Property</h3>
              <p>
                The Services and all content, features, and functionality (including but not limited to all information, 
                software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) 
                are owned by us, our licensors, or other providers and are protected by copyright, trademark, patent, 
                and other intellectual property laws.
              </p>

              <h3>AI-Generated Content</h3>
              <p>
                For content generated by our AI tools based on your inputs:
              </p>
              <ul>
                <li>You own the rights to the output generated specifically for you</li>
                <li>We retain rights to the underlying AI models and technology</li>
                <li>You are responsible for ensuring your use of the generated content complies with applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                To the maximum extent permitted by law, in no event shall we be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses, resulting from:
              </p>
              
              <ul>
                <li>Your access to or use of or inability to access or use the Services</li>
                <li>Any conduct or content of any third party on the Services</li>
                <li>Any content obtained from the Services</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>

              <p>
                Our total liability for any claims arising from or relating to these Terms or the Services is limited to 
                the amount you paid us to use the Services in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                <p className="font-semibold">AI Tools Hub</p>
                <p>Email: legal@aitoolshub.com</p>
                <p>Address: 123 Innovation Street, San Francisco, CA 94105</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>© 2024 AI Tools Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}