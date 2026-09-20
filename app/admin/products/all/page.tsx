'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Filter, Download, Upload, RefreshCw, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  images: string[]
  status: string
  createdAt: string
  updatedAt: string
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    status: '',
    priceMin: '',
    priceMax: '',
    stockMin: '',
    stockMax: '',
  })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        storage: 'true',
        search: searchQuery,
        category: filters.category,
        brand: filters.brand,
        status: filters.status,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        stockMin: filters.stockMin,
        stockMax: filters.stockMax,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalProducts(data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, filters, itemsPerPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Remove client-side filtering - now done server-side
  const totalPages = useMemo(() => {
    // Will be updated from API response
    return Math.ceil(totalProducts / itemsPerPage)
  }, [totalProducts, itemsPerPage])
  
  // Current products are now already paginated from server
  const currentProducts = products
  
  // Calculate startIndex for display
  const startIndex = (currentPage - 1) * itemsPerPage

  const toggleSelectAll = useCallback(() => {
    if (selectedProducts.size === currentProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(currentProducts.map(p => p.id)))
    }
  }, [selectedProducts, currentProducts])

  const toggleSelect = useCallback((id: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">All Products</h1>
            <p className="text-white/60">Manage your complete product catalog</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Link href="/admin/products/import">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => window.open('/api/admin/products/export?format=csv', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/products/bulk-edit">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Bulk Edit
              </Button>
            </Link>
            <Link href="/admin/products/add">
              <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90">
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Actions */}
        <Card className="glass border border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search by name, SKU, category, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 glass border border-white/10 rounded-lg">
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Category</Label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="laptops">Laptops</option>
                    <option value="monitors">Monitors</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Brand</Label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="lenovo">Lenovo</option>
                    <option value="hp">HP</option>
                    <option value="asus">ASUS</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Status</Label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Price Min</Label>
                  <Input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    className="bg-white/10 border-white/20 text-white text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Price Max</Label>
                  <Input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    className="bg-white/10 border-white/20 text-white text-sm"
                    placeholder="∞"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Stock Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={filters.stockMin}
                      onChange={(e) => setFilters({ ...filters, stockMin: e.target.value })}
                      className="bg-white/10 border-white/20 text-white text-sm w-1/2"
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      value={filters.stockMax}
                      onChange={(e) => setFilters({ ...filters, stockMax: e.target.value })}
                      className="bg-white/10 border-white/20 text-white text-sm w-1/2"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <span className="text-white/60 text-sm">{selectedProducts.size} selected</span>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Link href="/admin/products/bulk-edit">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Edit className="w-4 h-4 mr-2" />
                    Bulk Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading products...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <p>No products found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.size === currentProducts.length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded"
                          />
                        </th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Product</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">SKU</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Category</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Brand</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Price</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Stock</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Status</th>
                        <th className="text-left p-4 text-white/60 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product.id)}
                              onChange={() => toggleSelect(product.id)}
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden relative">
                                {product.images[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <div className="w-6 h-6 border-2 border-current rounded" />
                                  </div>
                                )}
                              </div>
                              <div className="max-w-xs">
                                <p className="text-white font-medium truncate">{product.name}</p>
                                <p className="text-white/40 text-sm truncate">{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-white/80">{product.sku}</td>
                          <td className="p-4 text-white/80">{product.category}</td>
                          <td className="p-4 text-white/80">{product.brand}</td>
                          <td className="p-4 text-white font-medium">EGP {product.price.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {product.status || 'active'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/admin/products/${product.id}`}>
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalProducts)} of {totalProducts} products
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage + i - 2
                      if (page > totalPages) return null
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'bg-accent-primary text-white' : 'border-white/20 text-white hover:bg-white/10'}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
