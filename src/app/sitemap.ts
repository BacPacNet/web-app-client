import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const lastModified = new Date()

  const routes = [
    { path: '/', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/discover', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/privacy-policy', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/terms-and-condition', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/user-guidelines', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/report-bug', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/login', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/register', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/forget-password', changeFrequency: 'monthly' as const, priority: 0.4 },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
