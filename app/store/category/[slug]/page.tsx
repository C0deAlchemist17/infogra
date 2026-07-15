'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ChevronRight, Grid3x3, LayoutList } from 'lucide-react'
import { products, categories } from '@/data/products'
import { storeNavigation, getCategoryBySlug, StoreCategory, StoreSubcategory } from '@/data/store-navigation'
import ProductCard from '@/components/store/ProductCard'
import { useState } from 'react'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const category = getCategoryBySlug(slug)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter products by category
  const categoryProducts = products.filter(p => {
    const productCategory = p.category.toLowerCase()
    const productSlug = p.slug.toLowerCase()
    
    // Match by category slug or product category field
    if (productCategory === slug || productCategory.includes(slug.replace(/-/g, ''))) return true
    if (productSlug.includes(slug)) return true
    
    // Match by subcategory
    if (selectedSubcategory) {
      const sub = category?.subcategories.find(s => s.slug === selectedSubcategory)
      if (sub) {
        return p.subcategory?.toLowerCase().includes(sub.name.toLowerCase()) ||
               p.name.toLowerCase().includes(sub.name.toLowerCase())
      }
    }
    
    return false
  })

  // Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      default: return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
    }
  })

  if (!category) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-text-primary mb-4">Category Not Found</h1>
          <p className="text-body text-text-secondary mb-8">The category you are looking for does not exist.</p>
          <Button onClick={() => router.push('/store')}>Back to Store</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Breadcrumb */}
      <div className="bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-small text-text-tertiary">
            <Link href="/store" className="hover:text-accent-primary transition-colors">Store</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-primary">{category.name}</span>
            {selectedSubcategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-text-primary">
                  {category.subcategories.find(s => s.slug === selectedSubcategory)?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <Card className="glass border-border-subtle sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-h4 font-bold text-text-primary mb-6 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </h2>
                
                {/* All Products Button */}
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                    !selectedSubcategory
                      ? 'bg-accent-primary text-white'
                      : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                  }`}
                >
                  All {category.name}
                </button>

                {/* Subcategories */}
                <div className="space-y-1">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.slug)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${
                        selectedSubcategory === sub.slug
                          ? 'bg-accent-primary text-white'
                          : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {sub.productCount && (
                        <Badge variant="outline" className="text-xs">
                          {sub.productCount}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>

                {/* Other Categories */}
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <h3 className="text-small font-semibold text-text-primary mb-4">Other Categories</h3>
                  <div className="space-y-1">
                    {storeNavigation.filter(c => c.slug !== slug).slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/store/category/${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-small text-text-secondary hover:bg-background-tertiary hover:text-text-primary transition-all"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-h2 md:text-h1 font-bold text-text-primary mb-2">
                <span className="gradient-text">{category.name}</span>
              </h1>
              <p className="text-body text-text-secondary">
                {category.nameAr} - Browse our collection of {category.name.toLowerCase()}
              </p>
            </motion.div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-small text-text-tertiary">
                Showing {sortedProducts.length} products
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background-tertiary border border-border-subtle rounded-xl px-4 py-2 text-small text-text-primary focus:outline-none focus:border-accent-primary"
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-text-secondary'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-text-secondary'
                    }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-body text-text-secondary mb-4">No products found in this category</p>
                <Button onClick={() => router.push('/store')}>Browse All Products</Button>
              </div>
            )}

            {/* Subcategory Quick Links */}
            {!selectedSubcategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 pt-8 border-t border-border-subtle"
              >
                <h2 className="text-h3 font-bold text-text-primary mb-6">Browse Subcategories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.slug)}
                      className="p-4 rounded-xl border border-border-subtle hover:border-accent-primary/50 hover:bg-background-tertiary/50 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                          {sub.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      {sub.productCount && (
                        <span className="text-small text-text-tertiary">{sub.productCount} products</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
