'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Grid3x3, Filter, Sparkles, TrendingUp, Zap, Award, Shield } from 'lucide-react'
import { categories } from '@/data/products'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const Categories = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/store?category=${categoryId}`)
  }

  const featuredCategories = categories.slice(0, 12)
  const allCategories = categories

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section with Three.js */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ThreeScene />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/70 via-background-primary/90 to-background-primary" />

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
              <span className="text-small text-text-secondary">Browse by Category</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12"
            >
              <span className="gradient-text">Product Categories</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed"
            >
              Explore our wide range of premium technology products across various categories
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Grid3x3, label: 'Categories', value: '30+' },
              { icon: Award, label: 'Brands', value: '50+' },
              { icon: TrendingUp, label: 'Products', value: '500+' },
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

      {/* Featured Categories */}
      <section className="py-20 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-6">Featured Categories</h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
              Most popular categories chosen by our customers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
                className="cursor-pointer"
              >
                <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-xl bg-accent-primary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <Badge variant="outline" className="text-small glass border-border-subtle">
                        {category.productCount} products
                      </Badge>
                    </div>
                    <h3 className="text-h4 font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-body text-text-tertiary mb-6 leading-relaxed line-clamp-2">
                      {category.subcategories.slice(0, 3).join(', ')}
                    </p>
                    <div className="flex items-center text-small text-accent-primary group-hover:translate-x-2 transition-transform">
                      <span>Browse Products</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories Grid */}
      <section className="py-40">
        <div className="container mx-auto px-8">
          <motion.div
            ref={elementRef}
            initial={{ opacity: 0 }}
            animate={hasBeenVisible ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-h2 font-bold text-text-primary mb-12 text-center">All Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {allCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.05, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  className="cursor-pointer"
                >
                  <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-xl bg-accent-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <Badge variant="outline" className="text-small glass border-border-subtle">
                          {category.productCount}
                        </Badge>
                      </div>
                      <h3 className="text-h4 font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-small text-text-tertiary mb-4 leading-relaxed line-clamp-2">
                        {category.subcategories.slice(0, 2).join(', ')}
                      </p>
                      <div className="flex items-center text-caption text-accent-primary group-hover:translate-x-2 transition-transform">
                        <span>View Products</span>
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          >
            <Card className="bg-gradient-primary border-none text-white overflow-hidden shadow-glow">
              <CardContent className="p-16 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold mb-8">Can&apos;t Find What You&apos;re Looking For?</h2>
                  <p className="text-body-lg md:text-h4 lg:text-h3 mb-12 opacity-90 leading-relaxed">
                    Contact our team and we&apos;ll help you find the perfect product for your needs
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      size="xl"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-accent-primary group"
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                      onClick={() => router.push('/#contact')}
                    >
                      Contact Us
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="xl"
                      className="bg-white text-accent-primary hover:bg-background-tertiary"
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                      onClick={() => router.push('/store')}
                    >
                      Browse All Products
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Categories
