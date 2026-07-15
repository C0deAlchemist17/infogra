import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/navigation'
import { products } from '@/data/products'

const staticRoutes = [
  '',
  '/about',
  '/services',
  '/projects',
  '/case-studies',
  '/portfolio',
  '/industries',
  '/team',
  '/blog',
  '/faq',
  '/contact',
  '/search',
  '/privacy-policy',
  '/terms',
  '/store',
  '/store/categories',
  '/store/pc-builder',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const productPages = products.map((product) => ({
    url: `${baseUrl}/store/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages]
}
