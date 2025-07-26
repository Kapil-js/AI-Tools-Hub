import { MetadataRoute } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://scalestack.in'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Tool pages
  const toolPages = [
    'image-enhancer',
    'face-swapper', 
    'pdf-compressor',
    'resume-builder',
    'instagram-caption',
    'youtube-thumbnail',
    'article-writer',
    'merge-pdf',
    'split-pdf',
    'pdf-to-word',
    'word-to-pdf',
    'pdf-to-jpg',
    'jpg-to-pdf',
    'unlock-pdf'
  ].map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Blog posts
  let blogPages: any[] = []
  try {
    const blogQuery = query(collection(db, 'blog_posts'), where('status', '==', 'published'))
    const blogSnapshot = await getDocs(blogQuery)
    
    blogPages = blogSnapshot.docs.map(doc => {
      const data = doc.data()
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [...staticPages, ...toolPages, ...blogPages]
}