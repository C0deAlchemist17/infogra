'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, CheckSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function BulkEditPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState('')
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    status: '',
    minStock: '',
    maxStock: '',
    priceMultiplier: '1',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          action,
          ...formData,
        }),
      })

      if (response.ok) {
        alert(`Successfully updated ${selectedProducts.length} products`)
        setSelectedProducts([])
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to bulk update:', error)
      alert('Failed to update products')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products/all">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Bulk Edit Products</h1>
              <p className="text-white/60">Selected: {selectedProducts.length} products</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Select Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded"
                />
                <span className="text-white/60 text-sm">Select All ({products.length})</span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {products.slice(0, 50).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{product.name}</p>
                      <p className="text-white/40 text-xs">{product.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Bulk Action</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/80 mb-2 block">Action</Label>
                  <Select 
                    value={action} 
                    onChange={(e) => setAction(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <SelectContent className="bg-[#1a1a2e] border-white/20">
                      <SelectItem value="activate">Activate Products</SelectItem>
                      <SelectItem value="deactivate">Deactivate Products</SelectItem>
                      <SelectItem value="delete">Delete Products</SelectItem>
                      <SelectItem value="change_category">Change Category</SelectItem>
                      <SelectItem value="change_brand">Change Brand</SelectItem>
                      <SelectItem value="change_status">Change Status</SelectItem>
                      <SelectItem value="change_price">Change Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {action === 'change_category' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">New Category</Label>
                    <Select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectContent className="bg-[#1a1a2e] border-white/20">
                        <SelectItem value="laptops">Laptops</SelectItem>
                        <SelectItem value="monitors">Monitors</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {action === 'change_brand' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">New Brand</Label>
                    <Select 
                      value={formData.brand} 
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectContent className="bg-[#1a1a2e] border-white/20">
                        <SelectItem value="lenovo">Lenovo</SelectItem>
                        <SelectItem value="hp">HP</SelectItem>
                        <SelectItem value="asus">ASUS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {action === 'change_status' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">New Status</Label>
                    <Select 
                      value={formData.status} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectContent className="bg-[#1a1a2e] border-white/20">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {action === 'change_price' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">Price Multiplier</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.priceMultiplier}
                      onChange={(e) => setFormData({ ...formData, priceMultiplier: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="1.0 = no change, 1.1 = +10%"
                    />
                  </div>
                )}

                {action === 'delete' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium">Warning</p>
                        <p className="text-white/60 text-sm">This will permanently delete {selectedProducts.length} products. This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={selectedProducts.length === 0 || !action}
                  className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply to {selectedProducts.length} Products
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
