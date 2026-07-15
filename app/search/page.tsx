'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { products } from '@/data/products'

const staticPages = [
  { title: 'About Us', href: '/about', description: 'Learn about INFOGRA and our mission' },
  { title: 'Services', href: '/services', description: 'Web development, design, AI, and more' },
  { title: 'Projects', href: '/projects', description: 'View our portfolio of work' },
  { title: 'Store', href: '/store', description: 'Premium technology products' },
  { title: 'Blog', href: '/blog', description: 'Latest insights and articles' },
  { title: 'Contact', href: '/contact', description: 'Get in touch with our team' },
  { title: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
  { title: 'PC Builder', href: '/store/pc-builder', description: 'Build your custom PC' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(() => {
    if (!query.trim()) return { pages: [], products: [] }
    const q = query.toLowerCase()

    const pages = staticPages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )

    const productResults = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )

    return { pages, products: productResults }
  }, [query])

  const hasResults = results.pages.length > 0 || results.products.length > 0

  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-8 px-6 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-8 text-center">Search</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, products, services..."
              className="pl-12 h-14 text-body"
              autoFocus
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-6 md:px-8">
        <div className="container mx-auto max-w-3xl">
          {query.trim() && !hasResults && (
            <p className="text-body text-text-secondary text-center py-12">
              No results found for &quot;{query}&quot;
            </p>
          )}

          {results.pages.length > 0 && (
            <div className="mb-12">
              <h2 className="text-h4 font-semibold text-text-primary mb-4">Pages</h2>
              <div className="space-y-3">
                {results.pages.map((page) => (
                  <Link key={page.href} href={page.href} className="block card-premium rounded-xl p-4 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-body font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{page.title}</h3>
                        <p className="text-small text-text-secondary">{page.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <h2 className="text-h4 font-semibold text-text-primary mb-4">Products</h2>
              <div className="space-y-3">
                {results.products.map((product) => (
                  <Link key={product.id} href={`/store/product/${product.slug}`} className="block card-premium rounded-xl p-4 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-body font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{product.name}</h3>
                        <p className="text-small text-text-secondary">{product.brand} · EGP {product.price.toLocaleString('en-EG')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-primary flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
