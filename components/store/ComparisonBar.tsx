'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '@/providers/ComparisonProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, ArrowRight, BarChart3 } from 'lucide-react'
import Image from 'next/image'

export default function ComparisonBar() {
  const { items, removeItem, clearComparison, itemCount, maxItems } = useComparison()
  const [showModal, setShowModal] = useState(false)

  // Get union of all specification keys across all items
  const allSpecKeys = useMemo(() => {
    const keySet = new Set<string>()
    items.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => keySet.add(key))
      }
    })
    return Array.from(keySet)
  }, [items])

  if (itemCount === 0) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="comparison-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background-secondary/95 backdrop-blur-xl border-t border-border-subtle shadow-2xl"
        >
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent-primary" />
                  <span className="text-body font-semibold text-text-primary">
                    Compare ({itemCount}/{maxItems})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {items.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="relative group"
                    >
                      <div className="w-16 h-16 bg-background-tertiary rounded-xl border border-border-subtle overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-text-tertiary">No img</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      <div className="mt-1 text-caption text-text-tertiary text-center truncate max-w-16">
                        {product.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </motion.div>
                  ))}
                  {Array.from({ length: maxItems - itemCount }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-16 h-16 bg-background-tertiary/50 rounded-xl border border-dashed border-border-subtle flex items-center justify-center"
                    >
                      <span className="text-caption text-text-tertiary">+</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={clearComparison}>
                  Clear All
                </Button>
                <Button
                  variant="premium"
                  size="sm"
                  className="group"
                  onClick={() => setShowModal(true)}
                >
                  Compare Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="comparison-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background-primary/95 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass-strong border-border-subtle">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-h2 font-bold text-text-primary">Product Comparison</h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-xl hover:bg-background-tertiary transition-colors"
                    >
                      <X className="w-6 h-6 text-text-primary" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left p-4 text-small text-text-tertiary font-medium">Feature</th>
                          {items.map((product) => (
                            <th key={product.id} className="p-4 text-center min-w-[200px]">
                              <div className="relative inline-block">
                                <div className="w-24 h-24 bg-background-tertiary rounded-xl border border-border-subtle overflow-hidden mx-auto mb-4 relative">
                                  {product.images && product.images.length > 0 ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-xs text-text-tertiary">No img</span>
                                    </div>
                                  )}
                                </div>
                                <h3 className="text-body font-semibold text-text-primary">{product.name}</h3>
                                <p className="text-small text-accent-primary font-bold mt-1">EGP {product.price.toLocaleString()}</p>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Brand</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center text-body text-text-primary">{product.brand}</td>
                          ))}
                        </tr>
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Category</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center text-body text-text-primary capitalize">{product.category.replace(/-/g, ' ')}</td>
                          ))}
                        </tr>
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Rating</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center text-body text-text-primary">{product.rating} / 5</td>
                          ))}
                        </tr>
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Warranty</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center text-body text-text-primary">{product.warranty}</td>
                          ))}
                        </tr>
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Availability</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center">
                              <span className={`text-body ${product.stock > 0 ? 'text-accent-success' : 'text-accent-error'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                              </span>
                            </td>
                          ))}
                        </tr>
                        {/* Specifications - uses union of all keys */}
                        {allSpecKeys.map((key) => (
                          <tr key={key} className="border-t border-border-subtle">
                            <td className="p-4 text-small text-text-tertiary">{key}</td>
                            {items.map((product) => (
                              <td key={product.id} className="p-4 text-center text-body text-text-primary">
                                {product.specifications[key] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="border-t border-border-subtle">
                          <td className="p-4 text-small text-text-tertiary">Features</td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {product.features.slice(0, 3).map((feature) => (
                                  <span key={feature} className="text-caption px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
