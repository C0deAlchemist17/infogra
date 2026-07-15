'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Filter, X, ChevronDown, ChevronUp, Search, Check } from 'lucide-react'
import { categories, brands } from '@/data/products'
import { Filter as FilterType } from '@/types/store'
import Image from 'next/image'

interface ProductFiltersProps {
  onFilterChange: (filters: FilterType) => void
}

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'brand', 'price'])
  const [searchQuery, setSearchQuery] = useState('')
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const [filters, setFilters] = useState<FilterType>({
    brand: [],
    category: [],
    subcategory: [],
    priceRange: [0, 5000],
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
    const currentFilters = filters[type]
    const isArray = Array.isArray(currentFilters)
    
    if (isArray) {
      const newFilters = (currentFilters as any[]).includes(value)
        ? (currentFilters as any[]).filter((v: any) => v !== value)
        : [...(currentFilters as any[]), value]
      
      setFilters(prev => ({ ...prev, [type]: newFilters }))
      onFilterChange({ ...filters, [type]: newFilters })
    } else {
      setFilters(prev => ({ ...prev, [type]: value }))
      onFilterChange({ ...filters, [type]: value })
    }
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
  }

  const activeFilterCount = 
    filters.brand.length +
    filters.category.length +
    filters.condition.length +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full glass border-border-subtle"
          onClick={() => setIsOpen(true)}
          onMouseEnter={addHoverEffect}
          onMouseLeave={removeHoverEffect}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-accent-primary text-white">{activeFilterCount}</Badge>
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
              className="absolute right-0 top-0 h-full w-full max-w-md glass-strong shadow-2xl p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-h3 font-bold text-text-primary">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-background-tertiary transition-colors"
                >
                  <X className="w-6 h-6 text-text-primary" />
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
                categories={categories}
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
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="glass border-border-subtle sticky top-24 shadow-glow">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-h4 font-semibold text-text-primary">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-small text-accent-primary hover:text-accent-secondary transition-colors"
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
              categories={categories}
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
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-5"
        >
          <span className="text-small font-semibold text-text-primary">Category</span>
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
              {categories.slice(0, 8).map((category: any) => (
                <motion.button
                  key={category.id}
                  onClick={() => toggleFilter('category', category.id)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-5 py-4 rounded-xl text-small transition-all duration-300 flex items-center justify-between group ${
                    filters.category.includes(category.id)
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-text-secondary hover:bg-background-tertiary/50 border border-transparent'
                  }`}
                >
                  <span>{category.name}</span>
                  {filters.category.includes(category.id) && (
                    <Check className="w-4 h-4" />
                  )}
                  <span className="text-caption text-text-tertiary bg-background-tertiary/50 px-2 py-1 rounded-full">{category.productCount}</span>
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
          className="flex items-center justify-between w-full mb-5"
        >
          <span className="text-small font-semibold text-text-primary">Brand</span>
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
              className="space-y-3"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background-tertiary/50 border border-border-subtle rounded-xl text-small text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/50 transition-colors"
                />
              </div>
              
              {brands.slice(0, 8).map((brand: any) => (
                <motion.button
                  key={brand.id}
                  onClick={() => toggleFilter('brand', brand.id)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-5 py-4 rounded-xl text-small transition-all duration-300 flex items-center gap-3 group ${
                    filters.brand.includes(brand.id)
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-text-secondary hover:bg-background-tertiary/50 border border-transparent'
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
                  <span className="flex-1">{brand.name}</span>
                  {filters.brand.includes(brand.id) && (
                    <Check className="w-4 h-4" />
                  )}
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
          className="flex items-center justify-between w-full mb-5"
        >
          <span className="text-small font-semibold text-text-primary">Price Range</span>
          {expandedSections.includes('price') ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes('price') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {priceRanges.map((range) => (
                <motion.button
                  key={range.label}
                  onClick={() => toggleFilter('priceRange', range.range)}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-5 py-4 rounded-xl text-small transition-all duration-300 flex items-center justify-between group ${
                    filters.priceRange[0] === range.range[0] && filters.priceRange[1] === range.range[1]
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-text-secondary hover:bg-background-tertiary/50 border border-transparent'
                  }`}
                >
                  <span>{range.label}</span>
                  {filters.priceRange[0] === range.range[0] && filters.priceRange[1] === range.range[1] && (
                    <Check className="w-4 h-4" />
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
          className="flex items-center justify-between w-full mb-5"
        >
          <span className="text-small font-semibold text-text-primary">Condition</span>
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
                  className={`w-full text-left px-5 py-4 rounded-xl text-small transition-all duration-300 flex items-center justify-between group capitalize ${
                    filters.condition.includes(condition)
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-text-secondary hover:bg-background-tertiary/50 border border-transparent'
                  }`}
                >
                  <span>{condition}</span>
                  {filters.condition.includes(condition) && (
                    <Check className="w-4 h-4" />
                  )}
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
          className="flex items-center justify-between w-full mb-5"
        >
          <span className="text-small font-semibold text-text-primary">Availability</span>
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
                  className={`w-full text-left px-5 py-4 rounded-xl text-small transition-all duration-300 flex items-center justify-between group capitalize ${
                    filters.availability === availability
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-text-secondary hover:bg-background-tertiary/50 border border-transparent'
                  }`}
                >
                  <span>{availability.replace('-', ' ')}</span>
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
