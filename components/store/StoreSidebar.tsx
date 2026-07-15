'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, X, Menu } from 'lucide-react'
import { storeNavigation, StoreCategory } from '@/data/store-navigation'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StoreSidebar() {
  const pathname = usePathname()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href
  const isCategoryActive = (cat: StoreCategory) => 
    pathname.includes(`/store/category/${cat.slug}`)

  const SidebarContent = () => (
    <nav className="space-y-1">
      {/* All Products */}
      <Link
        href="/store"
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
          pathname === '/store' 
            ? 'bg-accent-primary text-white' 
            : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
        )}
      >
        <span className="text-lg">🛍️</span>
        <span className="text-body font-medium">All Products</span>
      </Link>

      {/* Categories */}
      {storeNavigation.map((category) => (
        <div key={category.id}>
          <div className="flex items-center">
            <Link
              href={`/store/category/${category.slug}`}
              className={cn(
                'flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isCategoryActive(category)
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-body font-medium flex-1">{category.name}</span>
            </Link>
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
            >
              <ChevronDown 
                className={cn(
                  'w-4 h-4 text-text-tertiary transition-transform',
                  expandedCategory === category.id && 'rotate-180'
                )} 
              />
            </button>
          </div>
          
          {/* Subcategories */}
          <AnimatePresence>
            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-6 pl-4 border-l border-border-subtle space-y-1 py-2">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/store/category/${category.slug}?sub=${sub.slug}`}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-small transition-all',
                        pathname.includes(sub.slug)
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'text-text-tertiary hover:bg-background-tertiary hover:text-text-secondary'
                      )}
                    >
                      <span>{sub.name}</span>
                      {sub.productCount && (
                        <span className="text-caption text-text-tertiary bg-background-tertiary/50 px-2 py-0.5 rounded-full">
                          {sub.productCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Special Links */}
      <div className="pt-4 mt-4 border-t border-border-subtle space-y-1">
        <Link
          href="/store/pc-builder"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            pathname === '/store/pc-builder'
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
          )}
        >
          <span className="text-lg">💻</span>
          <span className="text-body font-medium">PC Builder</span>
        </Link>
        <Link
          href="/store/categories"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            pathname === '/store/categories'
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
          )}
        >
          <span className="text-lg">📂</span>
          <span className="text-body font-medium">All Categories</span>
        </Link>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-40 p-4 rounded-full bg-accent-primary text-white shadow-glow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background-primary/95 backdrop-blur-xl z-50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] glass-strong shadow-2xl p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-h4 font-bold text-text-primary">Categories</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-background-tertiary"
                >
                  <X className="w-6 h-6 text-text-primary" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <Card className="glass border-border-subtle">
            <CardContent className="p-4">
              <h3 className="text-h4 font-bold text-text-primary mb-4 px-4">Shop by Category</h3>
              <SidebarContent />
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  )
}


