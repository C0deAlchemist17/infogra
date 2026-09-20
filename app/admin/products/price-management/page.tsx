'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function PriceManagementPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [priceAction, setPriceAction] = useState('')
  const [formData, setFormData] = useState({
    newPrice: '',
    increasePercentage: '',
    decreasePercentage: '',
    roundTo: '0',
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

  const calculatePreview = () => {
    if (selectedProducts.length === 0) return { before: 0, after: 0, change: 0 }

    const selectedProductData = products.filter(p => selectedProducts.includes(p.id))
    const totalBefore = selectedProductData.reduce((sum, p) => sum + (p.price || 0), 0)

    let totalAfter = totalBefore

    if (priceAction === 'set_price' && formData.newPrice) {
      totalAfter = selectedProductData.length * parseFloat(formData.newPrice)
    } else if (priceAction === 'increase' && formData.increasePercentage) {
      const multiplier = 1 + (parseFloat(formData.increasePercentage) / 100)
      totalAfter = totalBefore * multiplier
    } else if (priceAction === 'decrease' && formData.decreasePercentage) {
      const multiplier = 1 - (parseFloat(formData.decreasePercentage) / 100)
      totalAfter = totalBefore * multiplier
    }

    return {
      before: totalBefore,
      after: totalAfter,
      change: totalAfter - totalBefore,
    }
  }

  const preview = calculatePreview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    if (!confirm(`Are you sure you want to change prices for ${selectedProducts.length} products?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          action: 'change_price',
          priceAction,
          ...formData,
        }),
      })

      if (response.ok) {
        alert(`Successfully updated prices for ${selectedProducts.length} products`)
        setSelectedProducts([])
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to update prices:', error)
      alert('Failed to update prices')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Price Management</h1>
              <p className="text-white/60">Bulk edit product prices</p>
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
                      <p className="text-white/40 text-xs">{product.sku} • EGP {product.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Actions */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Price Change</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/80 mb-2 block">Action</Label>
                  <Select 
                    value={priceAction} 
                    onChange={(e) => setPriceAction(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <SelectContent className="bg-[#1a1a2e] border-white/20">
                      <SelectItem value="set_price">Set Fixed Price</SelectItem>
                      <SelectItem value="increase">Increase by Percentage</SelectItem>
                      <SelectItem value="decrease">Decrease by Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {priceAction === 'set_price' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">New Price (EGP)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.newPrice}
                      onChange={(e) => setFormData({ ...formData, newPrice: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}

                {priceAction === 'increase' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">Increase Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.increasePercentage}
                      onChange={(e) => setFormData({ ...formData, increasePercentage: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., 10 for 10%"
                    />
                  </div>
                )}

                {priceAction === 'decrease' && (
                  <div>
                    <Label className="text-white/80 mb-2 block">Decrease Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.decreasePercentage}
                      onChange={(e) => setFormData({ ...formData, decreasePercentage: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., 10 for 10%"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-white/80 mb-2 block">Round To</Label>
                  <Select 
                    value={formData.roundTo} 
                    onChange={(e) => setFormData({ ...formData, roundTo: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <SelectContent className="bg-[#1a1a2e] border-white/20">
                      <SelectItem value="0">No rounding</SelectItem>
                      <SelectItem value="1">Round to 1 decimal</SelectItem>
                      <SelectItem value="10">Round to 10</SelectItem>
                      <SelectItem value="100">Round to 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview */}
                {selectedProducts.length > 0 && (
                  <div className="p-4 glass border border-white/10 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Total Before</span>
                      <span className="text-white font-medium">EGP {preview.before.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Total After</span>
                      <span className="text-white font-medium">EGP {preview.after.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-white/60">Change</span>
                      <span className={`font-medium ${preview.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {preview.change >= 0 ? '+' : ''}EGP {preview.change.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {priceAction && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-medium">Warning</p>
                        <p className="text-white/60 text-sm">This will change prices for {selectedProducts.length} products. This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={selectedProducts.length === 0 || !priceAction}
                  className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply Price Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
