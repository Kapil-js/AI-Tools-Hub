'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, FileText, Clock, User } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
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
                At AI Tools Hub, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you visit our website and use our AI-powered tools and services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
                please do not access the site or use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <User className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Personal Data</h3>
              <p>
                When you register for an account or use our services, we may collect personally identifiable information, such as:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Payment information</li>
                <li>Usage data and preferences</li>
              </ul>

              <h3>Content Data</h3>
              <p>
                When you use our AI tools, we process the content you upload or create, which may include:
              </p>
              <ul>
                <li>Images and photos</li>
                <li>Text content</li>
                <li>PDF documents</li>
                <li>Video content</li>
              </ul>

              <h3>Usage Information</h3>
              <p>
                We collect information about how you interact with our services, including:
              </p>
              <ul>
                <li>Access times and dates</li>
                <li>Pages viewed</li>
                <li>Tools used</li>
                <li>Device information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We use the information we collect for various purposes, including:</p>
              
              <h3>Providing and Improving Our Services</h3>
              <ul>
                <li>Processing and delivering the results of our AI tools</li>
                <li>Maintaining and improving our website and services</li>
                <li>Developing new features and tools</li>
              </ul>

              <h3>Communication</h3>
              <ul>
                <li>Responding to your inquiries and support requests</li>
                <li>Sending you updates about our services</li>
                <li>Providing information about new features or products</li>
              </ul>

              <h3>Analytics and Research</h3>
              <ul>
                <li>Understanding how users interact with our tools</li>
                <li>Improving the accuracy and effectiveness of our AI models</li>
                <li>Analyzing usage patterns to optimize performance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lock className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
              
              <h3>Security Measures</h3>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure data storage practices</li>
              </ul>

              <p>
                While we strive to use commercially acceptable means to protect your personal information, 
                no method of transmission over the Internet or electronic storage is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                Data Retention and Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes for 
                which we collected it, including for the purposes of satisfying any legal, regulatory, tax, 
                accounting, or reporting requirements.
              </p>
              
              <h3>Content Retention</h3>
              <ul>
                <li>User-uploaded content is typically stored for 30 days after processing</li>
                <li>Generated results are available for download for 7 days</li>
                <li>Account information is retained as long as your account is active</li>
              </ul>

              <h3>Account Deletion</h3>
              <p>
                You can request deletion of your account and associated data at any time through your account 
                settings or by contacting our support team. Upon deletion, we will remove your personal information 
                from our active databases, though some information may be retained in our backup systems for a limited period.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                Updates to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for 
                other operational, legal, or regulatory reasons. We will notify you of any material changes by:
              </p>
              
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice on our website</li>
              </ul>

              <p>
                Your continued use of our services after such modifications will constitute your acknowledgment 
                of the modified Privacy Policy and agreement to abide by its terms.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                <p className="font-semibold">AI Tools Hub</p>
                <p>Email: privacy@aitoolshub.com</p>
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