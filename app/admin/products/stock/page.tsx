'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Minus, Save, Search } from 'lucide-react'
import Link from 'next/link'

export default function StockControlPage() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [action, setAction] = useState<'add' | 'remove' | 'adjust'>('add')
  const [reason, setReason] = useState('')

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/products/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          action,
          quantity: parseInt(quantity) || 0,
          reason,
        }),
      })

      if (response.ok) {
        setSelectedProduct('')
        setQuantity('')
        setReason('')
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to update stock:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                ←
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Stock Control</h1>
              <p className="text-white/60">Manage product inventory</p>
            </div>
          </div>
        </div>

        <Card className="glass border border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Stock Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-white/80 mb-2 block">Product</Label>
                <Select 
                  value={selectedProduct} 
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <SelectContent className="bg-[#1a1a2e] border-white/20 max-h-80">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80 mb-2 block">Action</Label>
                <Select 
                  value={action} 
                  onChange={(e) => setAction(e.target.value as 'add' | 'remove' | 'adjust')}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <SelectContent className="bg-[#1a1a2e] border-white/20">
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                    <SelectItem value="adjust">Adjust Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80 mb-2 block">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2 block">Reason</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Reason for adjustment"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !selectedProduct || !quantity}
                className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Update Stock'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/products/low-stock">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  View Low Stock
                </Button>
              </Link>
              <Link href="/admin/products/out-of-stock">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  View Out of Stock
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
