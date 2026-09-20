'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, Archive, RotateCcw, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function ArchivedProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchivedProducts()
  }, [])

  const fetchArchivedProducts = async () => {
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        const archived = (data.products || []).filter((p: any) => p.deletedAt || p.status === 'archived')
        setProducts(archived)
      }
    } catch (error) {
      console.error('Failed to fetch archived products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    if (!confirm('Are you sure you want to restore this product?')) return

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'restore' }),
      })

      if (response.ok) {
        fetchArchivedProducts()
      }
    } catch (error) {
      console.error('Failed to restore product:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchArchivedProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
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
              <h1 className="text-4xl font-bold text-white mb-2">Archived Products</h1>
              <p className="text-white/60">Manage deleted and archived products</p>
            </div>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchArchivedProducts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No archived products found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Archive className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-white/60 text-sm">SKU: {product.sku} • Archived: {product.deletedAt ? new Date(product.deletedAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => handleRestore(product.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
