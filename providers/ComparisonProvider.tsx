'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types/store'

interface ComparisonContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInComparison: (productId: string) => boolean
  clearComparison: () => void
  itemCount: number
  maxItems: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const MAX_COMPARE = 4

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('infogra-comparison')
      if (stored) setItems(JSON.parse(stored))
    } catch (error) {
      console.error('Failed to load comparison:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('infogra-comparison', JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save comparison:', error)
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems(prev => {
      if (prev.some(item => item.id === product.id)) return prev
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, product]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const isInComparison = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  const clearComparison = () => setItems([])

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInComparison,
        clearComparison,
        itemCount: items.length,
        maxItems: MAX_COMPARE,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
