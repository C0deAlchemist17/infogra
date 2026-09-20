'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types/store'

interface RecentlyViewedContextType {
  items: Product[]
  addItem: (product: Product) => void
  clearHistory: () => void
  maxItems: number
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const MAX_RECENT = 10

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('infogra-recently-viewed')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (error) {
      // Silently fail - localStorage might be disabled or full
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('infogra-recently-viewed', JSON.stringify(items))
    } catch (error) {
      // Silently fail - localStorage might be disabled or full
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems(prev => {
      // Remove if already exists to move to front
      const filtered = prev.filter(item => item.id !== product.id)
      // Add to front and limit to MAX_RECENT
      return [product, ...filtered].slice(0, MAX_RECENT)
    })
  }

  const clearHistory = () => {
    setItems([])
  }

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        addItem,
        clearHistory,
        maxItems: MAX_RECENT,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}
