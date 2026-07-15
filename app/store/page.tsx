'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, TrendingUp, Sparkles, Zap, Award, Shield, Truck, RefreshCw } from 'lucide-react'
import { products, categories, brands } from '@/data/products'
import ProductCard from '@/components/store/ProductCard'
import SearchBar from '@/components/store/SearchBar'
import ProductFilters from '@/components/store/ProductFilters'
import ComparisonBar from '@/components/store/ComparisonBar'
import RecentlyViewed from '@/components/store/RecentlyViewed'
import { Filter } from '@/types/store'
import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const Store = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const clearAllFilters = () => {
    setFilteredProducts(products)
  }

  const handleFilterChange = (filters: Filter) => {
    let filtered = [...products]

    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category))
    }

    if (filters.brand.length > 0) {
      filtered = filtered.filter(p => filters.brand.includes(p.brand.toLowerCase()))
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )
    }

    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 0)
    } else if (filters.availability === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0)
    }

    if (filters.condition.length > 0) {
      filtered = filtered.filter(p => filters.condition.includes(p.condition))
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating)
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section with Three.js */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          ref={containerRef}
          style={{ y: parallaxY, opacity: parallaxOpacity }}
          className="absolute inset-0"
        >
          <ThreeScene />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/50 via-background-primary/80 to-background-primary" />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-24"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12"
            >
              <Sparkles className="w-5 h-5 text-accent-highlight" />
              <span className="text-small text-text-secondary">Premium Technology Store</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12 leading-tight"
            >
              <span className="gradient-text">INFOGRA</span>
              <br />
              <span className="text-text-primary">Technology Store</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-16 max-w-4xl mx-auto leading-relaxed"
            >
              Discover premium gaming laptops, desktop PCs, components, and accessories. 
              Quality technology for professionals and enthusiasts.
            </motion.p>
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            >
              <Button size="xl" variant="premium" className="group">
                Browse Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="xl" variant="outline" className="group">
                <ShoppingBag className="w-5 h-5 mr-2" />
                View Categories
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: ShoppingBag, label: 'Products', value: '500+' },
              { icon: Award, label: 'Brands', value: '50+' },
              { icon: TrendingUp, label: 'Categories', value: '30+' },
              { icon: Zap, label: 'Deals', value: 'Daily' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="text-center p-6 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-400"
              >
                <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-accent-primary" />
                </div>
                <div className="text-h3 font-bold text-text-primary mb-2">{stat.value}</div>
                <div className="text-small text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Bar Full Width */}
      <section className="py-4 bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-8">
          <SearchBar />
        </div>
      </section>

      {/* Main Store Content with Sidebar */}
      <section className="py-4">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>
            {/* Mobile Filter Button */}
            <div className="lg:hidden w-full">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Featured Categories */}
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-center mb-12"
                >
                  <h2 className="text-h2 font-bold text-text-primary mb-4">Featured Categories</h2>
                  <p className="text-body text-text-secondary">
                    Browse our wide range of technology products
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.slice(0, 8).map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      <Link href={`/store/category/${category.slug}`}>
                        <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-400 hover:-translate-y-1 cursor-pointer h-full">
                          <CardContent className="p-5 text-center">
                            <div className="text-3xl mb-3">{category.icon}</div>
                            <h3 className="text-small font-semibold text-text-primary mb-1">{category.name}</h3>
                            <p className="text-caption text-text-tertiary">{category.productCount} Products</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* All Products Grid */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-h3 font-bold text-text-primary mb-2">All Products</h2>
                    <p className="text-small text-text-secondary">{filteredProducts.length} products found</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="px-4 py-2 rounded-xl glass border border-border-subtle text-small text-text-primary focus:outline-none focus:border-accent-primary">
                      <option>Sort by: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                      <option>Best Rated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-h4 text-text-secondary mb-4">No products found</p>
                    <p className="text-body text-text-tertiary">Try adjusting your filters or search terms</p>
                    <Button variant="outline" className="mt-6" onClick={clearAllFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-h2 font-bold text-text-primary mb-4">Best Sellers</h2>
              <p className="text-body text-text-secondary">Most popular products</p>
            </div>
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.isBestSeller).slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-h2 font-bold text-text-primary mb-4">New Arrivals</h2>
              <p className="text-body text-text-secondary">Latest additions to our store</p>
            </div>
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.isNew).slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-12 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-6">Featured Brands</h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
              Shop from the world&apos;s leading technology brands
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {brands.filter(b => b.featured).map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
                className="flex flex-col items-center justify-center p-8 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-400 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-400">
                  <span className="text-2xl font-bold gradient-text">{brand.name.charAt(0)}</span>
                </div>
                <div className="text-small font-semibold text-text-primary">{brand.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-b border-border-subtle bg-background-secondary/30">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Shield, title: 'Warranty', description: '1-3 Year Warranty on all products' },
              { icon: Truck, title: 'Fast Delivery', description: 'Free shipping on orders over EGP 5,000' },
              { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
              { icon: Award, title: 'Authentic', description: '100% genuine products' }
            ].map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <badge.icon className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-h4 font-semibold text-text-primary mb-2">{badge.title}</h3>
                <p className="text-small text-text-secondary">{badge.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Comparison Bar */}
      <ComparisonBar />

      {/* Build Your PC CTA */}
      <section className="py-32">
        <div className="container mx-auto px-8">
          <Card className="bg-gradient-primary border-none text-white overflow-hidden">
            <CardContent className="p-16 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-h2 font-bold mb-6">Build Your Dream PC</h2>
                <p className="text-body-lg mb-8 opacity-90">
                  Let our experts help you build the perfect custom PC for your needs. 
                  Gaming, content creation, or professional work - we&apos;ve got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-accent-primary" asChild>
                    <Link href="/store/pc-builder">
                      Start Building
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="xl" className="bg-white text-accent-primary hover:bg-background-tertiary" asChild>
                    <Link href="/contact">
                      Get Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Store
