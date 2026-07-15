'use client'

import { motion } from 'framer-motion'
import { useRecentlyViewed } from '@/providers/RecentlyViewedProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'

export default function RecentlyViewed() {
  const { items, clearHistory } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section className="py-20 bg-background-secondary/50">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex justify-between items-center mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary mb-2">Recently Viewed</h2>
              <p className="text-body text-text-secondary">Continue where you left off</p>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="text-small text-accent-primary hover:text-accent-secondary transition-colors"
          >
            Clear History
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
