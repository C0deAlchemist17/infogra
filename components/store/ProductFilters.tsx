'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Filter, X, ChevronDown, ChevronUp, Search, Check, ChevronRight } from 'lucide-react'
import { categories, brands } from '@/data/products'
import { Filter as FilterType } from '@/types/store'
import Image from 'next/image'

interface ProductFiltersProps {
  onFilterChange: (filters: FilterType) => void
  categories?: any[]
  brands?: any[]
}

interface Category {
  name: string
  slug: string
  subcategories: Category[]
}

const storeCategories: Category[] = [
  {
    name: 'ACCESSORIES (5,825)',
    slug: 'accessories',
    subcategories: []
  },
  {
    name: 'CASES (57)',
    slug: 'cases',
    subcategories: []
  },
  {
    name: 'DESKTOPS (20)',
    slug: 'desktops',
    subcategories: []
  },
  {
    name: 'GRAPHICS CARDS (9)',
    slug: 'graphics-cards',
    subcategories: []
  },
  {
    name: 'HEADSETS (95)',
    slug: 'headsets',
    subcategories: []
  },
  {
    name: 'EARBUDS',
    slug: 'earbuds',
    subcategories: []
  },
  {
    name: 'HEADPHONES',
    slug: 'headphones',
    subcategories: []
  },
  {
    name: 'KEYBOARDS (36)',
    slug: 'keyboards',
    subcategories: []
  },
  {
    name: 'LAPTOPS (25)',
    slug: 'laptops',
    subcategories: []
  },
  {
    name: 'MICE (58)',
    slug: 'mice',
    subcategories: []
  },
  {
    name: 'MONITORS (52)',
    slug: 'monitors',
    subcategories: []
  },
  {
    name: 'MOTHERBOARDS (16)',
    slug: 'motherboards',
    subcategories: []
  },
  {
    name: 'POWER SUPPLIES (46)',
    slug: 'power-supplies',
    subcategories: []
  },
  {
    name: 'PRINTERS (18)',
    slug: 'printers',
    subcategories: []
  },
  {
    name: 'PROCESSORS (32)',
    slug: 'processors',
    subcategories: []
  },
  {
    name: 'RAM (54)',
    slug: 'ram',
    subcategories: []
  },
  {
    name: 'ROUTERS & NETWORKING (81)',
    slug: 'routers-networking',
    subcategories: []
  },
  {
    name: 'STORAGE (17)',
    slug: 'storage',
    subcategories: []
  }
]

const ProductFilters = ({ onFilterChange, categories: dynamicCategories, brands: dynamicBrands }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'brand', 'price'])
  const [searchQuery, setSearchQuery] = useState('')
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  // Use dynamic categories/brands if provided, otherwise use static
  const categoriesList = dynamicCategories && dynamicCategories.length > 0 ? dynamicCategories : categories
  const brandsList = dynamicBrands && dynamicBrands.length > 0 ? dynamicBrands : brands

  const [filters, setFilters] = useState<FilterType>({
    brand: [],
    category: [],
    subcategory: [],
    priceRange: [0, 100000],
    availability: 'all',
    condition: [],
    rating: 0
  })

  const priceRanges = [
    { label: 'Under EGP 5,000', range: [0, 5000] },
    { label: 'EGP 5,000 - 15,000', range: [5000, 15000] },
    { label: 'EGP 15,000 - 30,000', range: [15000, 30000] },
    { label: 'EGP 30,000 - 60,000', range: [30000, 60000] },
    { label: 'EGP 60,000+', range: [60000, 200000] }
  ]

  const conditions = ['new', 'refurbished']

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const toggleFilter = (type: keyof FilterType, value: any) => {
    setFilters(prev => {
      const currentFilters = prev[type]
      const isArray = Array.isArray(currentFilters)
      
      let newFilters
      if (isArray) {
        // Single selection: replace with new value or clear if already selected
        // For condition, also use single selection
        newFilters = (currentFilters as any[]).includes(value)
          ? [] // Deselect if already selected
          : [value] // Select only this one (replace all)
      } else {
        newFilters = value
      }
      
      const updatedFilters = { ...prev, [type]: newFilters }
      onFilterChange(updatedFilters)
      return updatedFilters
    })
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterType = {
      brand: [],
      category: [],
      subcategory: [],
      priceRange: [0, 5000],
      availability: 'all',
      condition: [],
      rating: 0
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
    // Close mobile filter overlay if open
    if (isOpen) {
      setIsOpen(false)
    }
  }

  const activeFilterCount = 
    filters.brand.length +
    filters.category.length +
    filters.condition.length +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  const filteredBrands = brandsList.filter(brand =>
    brand.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.toLowerCase?.includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full glass border-border-subtle hover:border-accent-primary/50 transition-all duration-300 group"
          onClick={() => setIsOpen(true)}
          onMouseEnter={addHoverEffect}
          onMouseLeave={removeHoverEffect}
        >
          <Filter className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-accent-primary text-white shadow-lg">{activeFilterCount}</Badge>
          )}
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background-primary/95 backdrop-blur-xl z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md glass-strong shadow-2xl p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-h2 font-bold text-text-primary">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                >
                  <X className="w-4 h-4 text-text-primary" />
                </button>
              </div>

              <FilterContent
                filters={filters}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                toggleFilter={toggleFilter}
                clearAllFilters={clearAllFilters}
                activeFilterCount={activeFilterCount}
                addHoverEffect={addHoverEffect}
                removeHoverEffect={removeHoverEffect}
                categories={categoriesList}
                brands={filteredBrands}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  Close Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="glass border-border-subtle sticky top-4 shadow-glow bg-gradient-to-b from-background-primary to-background-secondary/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-h2 font-bold text-text-primary">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-body text-accent-primary hover:text-accent-secondary transition-colors font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            <FilterContent
              filters={filters}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              toggleFilter={toggleFilter}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
              addHoverEffect={addHoverEffect}
              removeHoverEffect={removeHoverEffect}
              categories={categoriesList}
              brands={filteredBrands}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const FilterContent = ({
  filters,
  expandedSections,
  toggleSection,
  toggleFilter,
  clearAllFilters,
  activeFilterCount,
  addHoverEffect,
  removeHoverEffect,
  categories,
  brands,
  searchQuery,
  setSearchQuery
}: any) => {
  const priceRanges = [
    { label: 'Under EGP 5,000', range: [0, 5000] },
    { label: 'EGP 5,000 - 15,000', range: [5000, 15000] },
    { label: 'EGP 15,000 - 30,000', range: [15000, 30000] },
    { label: 'EGP 30,000 - 60,000', range: [30000, 60000] },
    { label: 'EGP 60,000+', range: [60000, 200000] }
  ]

  return (
    <div className="space-y-4">
      {/* Categories - Hierarchical */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="text-body font-bold text-text-primary">Category</span>
          {expandedSections.includes('category') ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('category') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {storeCategories.map((category: Category) => (
                <motion.button
                  key={category.slug}
                  onClick={() => toggleFilter('category', category.slug)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-body transition-all duration-300 flex items-center gap-3 group ${
                    filters.category.some((c: string) =>
                      category.slug.toLowerCase() === c.toLowerCase()
                    )
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    filters.category.some((c: string) =>
                      category.slug.toLowerCase() === c.toLowerCase()
                    )
                      ? 'border-accent-primary bg-accent-primary'
                      : 'border-text-tertiary'
                  }`} />
                  <span className="whitespace-normal">{category.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brands */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="text-body font-bold text-text-primary">Brand</span>
          {expandedSections.includes('brand') ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('brand') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background-tertiary/50 border border-border-subtle rounded-lg text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/50 transition-colors"
                />
              </div>

              {(brands || []).slice(0, 12).map((brand: any) => (
                <motion.button
                  key={brand.id || brand.name || brand}
                  onClick={() => toggleFilter('brand', brand.id || brand.name || brand)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-body transition-all duration-300 flex items-center gap-3 group ${
                    filters.brand.some((b: string) =>
                      (brand.id || brand.name || brand).toLowerCase() === b.toLowerCase()
                    )
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 shadow-glow'
                      : 'text-text-secondary hover:bg-background-tertiary/50 hover:border-accent-primary/30 border border-transparent'
                  }`}
                >
                  {brand.logo && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="flex-1">{brand.name || brand}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    filters.brand.some((b: string) => 
                      (brand.id || brand.name || brand).toLowerCase() === b.toLowerCase()
                    )
                      ? 'border-accent-primary bg-accent-primary'
                      : 'border-text-tertiary'
                  }`} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-10"
        >
          <span className="text-h3 font-bold text-text-primary">Price Range</span>
          {expandedSections.includes('price') ? (
            <ChevronUp className="w-7 h-7 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-7 h-7 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('price') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {priceRanges.map((range) => (
                <motion.button
                  key={range.label}
                  onClick={() => toggleFilter('priceRange', range.range)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-8 py-6 rounded-xl text-h4 transition-all duration-300 flex items-center justify-between group ${
                    filters.priceRange[0] === range.range[0] && filters.priceRange[1] === range.range[1]
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 shadow-glow'
                      : 'text-text-secondary hover:bg-background-tertiary/50 hover:border-accent-primary/30 border border-transparent'
                  }`}
                >
                  <span>{range.label}</span>
                  {filters.priceRange[0] === range.range[0] && filters.priceRange[1] === range.range[1] && (
                    <Check className="w-7 h-7" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Condition */}
      <div>
        <button
          onClick={() => toggleSection('condition')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="text-body font-bold text-text-primary">Condition</span>
          {expandedSections.includes('condition') ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('condition') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {['new', 'refurbished'].map((condition) => (
                <motion.button
                  key={condition}
                  onClick={() => toggleFilter('condition', condition)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-body transition-all duration-300 flex items-center justify-between group capitalize ${
                    filters.condition.includes(condition)
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 shadow-glow'
                      : 'text-text-secondary hover:bg-background-tertiary/50 hover:border-accent-primary/30 border border-transparent'
                  }`}
                >
                  <span className="whitespace-normal">{condition}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    filters.condition.includes(condition)
                      ? 'border-accent-primary bg-accent-primary'
                      : 'border-text-tertiary'
                  }`} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability */}
      <div>
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="text-body font-bold text-text-primary">Availability</span>
          {expandedSections.includes('availability') ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('availability') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {['all', 'in-stock', 'out-of-stock'].map((availability) => (
                <motion.button
                  key={availability}
                  onClick={() => toggleFilter('availability', availability)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-body transition-all duration-300 flex items-center justify-between group capitalize ${
                    filters.availability === availability
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 shadow-glow'
                      : 'text-text-secondary hover:bg-background-tertiary/50 hover:border-accent-primary/30 border border-transparent'
                  }`}
                >
                  <span className="whitespace-normal">{availability.replace('-', ' ')}</span>
                  {filters.availability === availability && (
                    <Check className="w-4 h-4" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProductFilters
