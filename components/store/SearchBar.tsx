'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { products, categories, brands } from '@/data/products'
import { useRouter } from 'next/navigation'

// Simple fuzzy search implementation
const fuzzyMatch = (text: string, query: string): boolean => {
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Exact match
  if (textLower.includes(queryLower)) return true
  
  // Fuzzy match - check if all characters in query appear in order in text
  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }
  
  return queryIndex === queryLower.length
}

const calculateRelevance = (item: any, query: string): number => {
  let score = 0
  const queryLower = query.toLowerCase()
  
  // Exact match in name
  if (item.name?.toLowerCase() === queryLower) score += 100
  else if (item.name?.toLowerCase().startsWith(queryLower)) score += 50
  else if (fuzzyMatch(item.name || '', query)) score += 25
  
  // Match in brand
  if (item.brand?.toLowerCase().includes(queryLower)) score += 30
  
  // Match in category
  if (item.category?.toLowerCase().includes(queryLower)) score += 20
  
  return score
}

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const popularSearches = ['Gaming Laptop', 'RTX 4090', 'Mechanical Keyboard', '240Hz Monitor', 'Custom PC']
  
  const recentSearches = ['ASUS ROG', 'MSI Gaming', 'Razer Blade']

  const filteredProducts = useMemo(() => 
    query.length > 0 
      ? products
          .map(p => ({ ...p, relevance: calculateRelevance(p, query) }))
          .filter(p => p.relevance > 0)
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 5)
      : []
  , [query])

  const filteredCategories = useMemo(() => 
    query.length > 0
      ? categories
          .map(c => ({ ...c, relevance: calculateRelevance(c, query) }))
          .filter(c => c.relevance > 0)
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 3)
      : []
  , [query])

  const filteredBrands = useMemo(() => 
    query.length > 0
      ? brands
          .map(b => ({ ...b, relevance: calculateRelevance(b, query) }))
          .filter(b => b.relevance > 0)
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 3)
      : []
  , [query])

  const allResults = useMemo(() => [
    ...filteredProducts.map(p => ({ type: 'product', data: p })),
    ...filteredCategories.map(c => ({ type: 'category', data: c })),
    ...filteredBrands.map(b => ({ type: 'brand', data: b }))
  ], [filteredProducts, filteredCategories, filteredBrands])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        const result = allResults[selectedIndex]
        if (result.type === 'product') {
          router.push(`/store/product/${result.data.slug}`)
        } else if (result.type === 'category') {
          router.push(`/store?category=${result.data.slug}`)
        } else if (result.type === 'brand') {
          router.push(`/store?brand=${result.data.slug}`)
        }
        setIsOpen(false)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allResults, router])

  const handleSearch = (value: string) => {
    setQuery(value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleResultClick = (result: any) => {
    if (result.type === 'product') {
      router.push(`/store/product/${result.data.slug}`)
    } else if (result.type === 'category') {
      router.push(`/store?category=${result.data.slug}`)
    } else if (result.type === 'brand') {
      router.push(`/store?brand=${result.data.slug}`)
    }
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, categories, brands..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-12 h-14 text-body glass border-border-subtle focus:border-accent-primary"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-background-tertiary transition-colors"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="glass-strong border-border-subtle shadow-large overflow-hidden">
              <CardContent className="p-0">
                {query.length > 0 ? (
                  // Search Results
                  allResults.length > 0 ? (
                    <div className="py-2">
                      {allResults.map((result, index) => (
                        <button
                          key={`${result.type}-${result.data.id}`}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => {
                            setSelectedIndex(index)
                            addHoverEffect()
                          }}
                          onMouseLeave={() => removeHoverEffect()}
                          className={`w-full px-6 py-4 flex items-center gap-4 transition-colors ${
                            selectedIndex === index ? 'bg-accent-primary/20' : 'hover:bg-background-tertiary/50'
                          }`}
                        >
                          {result.type === 'product' && (
                            <>
                              <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                                <span className="text-xl">📦</span>
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-body font-medium text-text-primary">{result.data.name}</div>
                                <div className="text-small text-text-tertiary">{(result.data as any).brand || ''}</div>
                              </div>
                              <div className="text-body font-semibold gradient-text">EGP {(result.data as any).price?.toLocaleString() || '0'}</div>
                            </>
                          )}
                          {result.type === 'category' && (
                            <>
                              <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                                <span className="text-xl">{(result.data as any).icon}</span>
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-body font-medium text-text-primary">{result.data.name}</div>
                                <div className="text-small text-text-tertiary">{(result.data as any).productCount} products</div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-text-tertiary" />
                            </>
                          )}
                          {result.type === 'brand' && (
                            <>
                              <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-bold gradient-text">{result.data.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-body font-medium text-text-primary">{result.data.name}</div>
                                <div className="text-small text-text-tertiary">Brand</div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-text-tertiary" />
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-body text-text-secondary">No results found for &quot;{query}&quot;</p>
                      <p className="text-small text-text-tertiary mt-2">Try different keywords or browse categories</p>
                    </div>
                  )
                ) : (
                  // Default State
                  <div className="py-6">
                    {/* Popular Searches */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 px-6 mb-4">
                        <TrendingUp className="w-4 h-4 text-accent-primary" />
                        <span className="text-small font-semibold text-text-primary">Popular Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2 px-6">
                        {popularSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearch(search)}
                            onMouseEnter={addHoverEffect}
                            onMouseLeave={removeHoverEffect}
                            className="px-4 py-2 rounded-full glass border border-border-subtle text-small text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-all"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="border-t border-border-subtle pt-6">
                        <div className="flex items-center gap-2 px-6 mb-4">
                          <Clock className="w-4 h-4 text-accent-primary" />
                          <span className="text-small font-semibold text-text-primary">Recent Searches</span>
                        </div>
                        <div className="space-y-1 px-6">
                          {recentSearches.map((search) => (
                            <button
                              key={search}
                              onClick={() => handleSearch(search)}
                              onMouseEnter={addHoverEffect}
                              onMouseLeave={removeHoverEffect}
                              className="w-full text-left px-4 py-2 rounded-lg text-small text-text-secondary hover:bg-background-tertiary/50 hover:text-text-primary transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
