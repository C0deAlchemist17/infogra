'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, History, Package, DollarSign, AlertTriangle, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?storage=true`)
      if (response.ok) {
        const data = await response.json()
        const foundProduct = (data.products || []).find((p: any) => p.id === productId)
        if (foundProduct) {
          setProduct(foundProduct)
          // In a real app, fetch activity log from separate endpoint
          setActivity([
            { type: 'stock_added', date: new Date().toISOString(), user: 'Admin', details: 'Stock added: +10' },
            { type: 'price_changed', date: new Date().toISOString(), user: 'Admin', details: 'Price changed: 2000 → 2200 EGP' },
          ])
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] p-8 flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] p-8 flex items-center justify-center">
        <div className="text-white/40">Product not found</div>
      </div>
    )
  }

  const profit = (product.price || 0) - (product.originalPrice || product.price || 0)
  const margin = product.price > 0 ? ((profit / product.price) * 100).toFixed(1) : 0

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
              <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-white/60">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/products/${productId}/edit`}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/admin/products/${productId}/history`}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Product Image */}
          <Card className="glass border border-white/10">
            <CardContent className="p-6">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-white/20" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card className="glass border border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">SKU</p>
                  <p className="text-white font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Barcode</p>
                  <p className="text-white font-medium">{product.barcode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Category</p>
                  <p className="text-white font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Brand</p>
                  <p className="text-white font-medium">{product.brand}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.status || 'active'}
                  </span>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Created</p>
                  <p className="text-white font-medium">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Description</p>
                <p className="text-white">{product.description || 'No description'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pricing */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Selling Price</span>
                <span className="text-white font-bold text-xl">EGP {product.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Purchase Price</span>
                <span className="text-white">EGP {(product.originalPrice || product.price)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Wholesale Price</span>
                <span className="text-white">EGP {product.wholesalePrice?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Discount Price</span>
                <span className="text-white">EGP {product.discountPrice?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Profit</span>
                  <span className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    EGP {profit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/60">Margin</span>
                  <span className="text-white">{margin}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Current Stock</span>
                <span className={`font-bold text-xl ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Minimum Stock</span>
                <span className="text-white">{product.minStock || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Maximum Stock</span>
                <span className="text-white">{product.maxStock || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Unit</span>
                <span className="text-white">{product.unit || 'piece'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Warranty</span>
                <span className="text-white">{product.warranty || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="glass border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Product Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 glass border border-white/10 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'stock_added' ? 'bg-green-500/20' :
                      item.type === 'price_changed' ? 'bg-blue-500/20' :
                      'bg-white/10'
                    }`}>
                      {item.type === 'stock_added' ? <Package className="w-5 h-5 text-green-400" /> :
                       item.type === 'price_changed' ? <DollarSign className="w-5 h-5 text-blue-400" /> :
                       <Clock className="w-5 h-5 text-white/60" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.details}</p>
                      <p className="text-white/60 text-sm mt-1">
                        {item.user} • {new Date(item.date).toLocaleString()}
                      </p>
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
