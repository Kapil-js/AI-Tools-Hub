import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://scalestack.in'),
  title: {
    default: 'AI Tools Hub - Free AI-Powered Tools for Everyone',
    template: '%s | AI Tools Hub'
  },
  description: 'Discover 20+ free AI tools for image enhancement, PDF processing, content creation, and productivity. Transform your workflow with powerful AI technology.',
  keywords: 'AI tools, free AI tools, image enhancer, PDF tools, content creation, productivity tools, artificial intelligence, online tools, AI platform',
  authors: [{ name: 'AI Tools Hub', url: 'https://scalestack.in' }],
  creator: 'AI Tools Hub',
  publisher: 'AI Tools Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scalestack.in',
    siteName: 'AI Tools Hub',
    title: 'AI Tools Hub - Free AI-Powered Tools for Everyone',
    description: 'Transform your workflow with 20+ free AI tools. Enhance images, process PDFs, create content, and boost productivity.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Hub - Free AI-Powered Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Hub - Free AI-Powered Tools',
    description: 'Transform your workflow with 20+ free AI tools. Enhance images, process PDFs, create content.',
    images: ['/og-image.jpg'],
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
  alternates: {
    canonical: 'https://scalestack.in',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}