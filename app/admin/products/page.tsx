'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Download, Upload, RefreshCw, Package, AlertTriangle, TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3, Users, Clock, Zap, Edit, Archive, Truck, Barcode, FileText, Building2, Tag, Image as ImageIcon, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  outOfStock: number
  lowStock: number
  noPrice: number
  noSku: number
  noCategory: number
  totalInventory: number
  totalCostValue: number
  totalSellingValue: number
  potentialProfit: number
  addedToday: number
  updatedToday: number
}

export default function ProductsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    noPrice: 0,
    noSku: 0,
    noCategory: 0,
    totalInventory: 0,
    totalCostValue: 0,
    totalSellingValue: 0,
    potentialProfit: 0,
    addedToday: 0,
    updatedToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [statsResponse, productsResponse] = await Promise.all([
        fetch('/api/admin/products/stats'),
        fetch('/api/products?storage=true&limit=10')
      ])

      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data)
      }

      if (productsResponse.ok) {
        const data = await productsResponse.json()
        const uniqueCategories = Array.from(new Set((data.products || []).map((p: any) => p.category).filter(Boolean))) as string[]
        setCategories(uniqueCategories)
        setRecentProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'from-blue-500 to-cyan-500', href: '/admin/products/all' },
    { title: 'Active Products', value: stats.activeProducts, icon: TrendingUp, color: 'from-green-500 to-emerald-500', href: '/admin/products?status=active' },
    { title: 'Inactive Products', value: stats.inactiveProducts, icon: TrendingDown, color: 'from-red-500 to-orange-500', href: '/admin/products?status=inactive' },
    { title: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'from-red-600 to-pink-600', href: '/admin/products?stock=out-of-stock' },
    { title: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'from-yellow-500 to-orange-500', href: '/admin/products?stock=low' },
    { title: 'No Price', value: stats.noPrice, icon: DollarSign, color: 'from-purple-500 to-pink-500', href: '/admin/products?issues=no-price' },
    { title: 'No SKU', value: stats.noSku, icon: ShoppingCart, color: 'from-indigo-500 to-purple-500', href: '/admin/products?issues=no-sku' },
    { title: 'No Category', value: stats.noCategory, icon: BarChart3, color: 'from-teal-500 to-cyan-500', href: '/admin/products?issues=no-category' },
    { title: 'Total Inventory', value: stats.totalInventory, icon: Package, color: 'from-blue-600 to-indigo-600', href: '/admin/products?view=inventory' },
    { title: 'Cost Value', value: `EGP ${stats.totalCostValue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', href: '/admin/products?view=cost' },
    { title: 'Selling Value', value: `EGP ${stats.totalSellingValue.toLocaleString()}`, icon: TrendingUp, color: 'from-cyan-500 to-blue-600', href: '/admin/products?view=selling' },
    { title: 'Potential Profit', value: `EGP ${stats.potentialProfit.toLocaleString()}`, icon: Zap, color: 'from-yellow-500 to-amber-500', href: '/admin/products?view=profit' },
    { title: 'Added Today', value: stats.addedToday, icon: Clock, color: 'from-green-500 to-teal-500', href: '/admin/products?date=today' },
    { title: 'Updated Today', value: stats.updatedToday, icon: RefreshCw, color: 'from-blue-500 to-indigo-500', href: '/admin/products?date=updated-today' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Products Management</h1>
            <p className="text-white/60">Complete dashboard for managing your product catalog</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white-10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/products/add">
              <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link key={card.title} href={card.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card className="glass border border-white/10 hover:border-accent-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{loading ? '...' : card.value}</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm">{card.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="glass border border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              <Link href="/admin/products/add">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/products/all">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Package className="w-4 h-4 mr-2" />
                  All Products
                </Button>
              </Link>
              <Link href="/admin/products/categories">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </Link>
              <Link href="/admin/products/brands">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Users className="w-4 h-4 mr-2" />
                  Brands
                </Button>
              </Link>
              <Link href="/admin/products/stock">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Package className="w-4 h-4 mr-2" />
                  Stock Control
                </Button>
              </Link>
              <Link href="/admin/products/bulk-edit">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Edit className="w-4 h-4 mr-2" />
                  Bulk Edit
                </Button>
              </Link>
              <Link href="/admin/products/import">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </Link>
              <Link href="/admin/products/export">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </Link>
              <Link href="/admin/products/price-management">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price Mgmt
                </Button>
              </Link>
              <Link href="/admin/products/low-stock">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Low Stock
                </Button>
              </Link>
              <Link href="/admin/products/out-of-stock">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Out of Stock
                </Button>
              </Link>
              <Link href="/admin/products/archived">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Archive className="w-4 h-4 mr-2" />
                  Archived
                </Button>
              </Link>
              <Link href="/admin/products/stock-transfers">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Truck className="w-4 h-4 mr-2" />
                  Stock Transfers
                </Button>
              </Link>
              <Link href="/admin/products/barcodes">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Barcode className="w-4 h-4 mr-2" />
                  Barcodes
                </Button>
              </Link>
              <Link href="/admin/products/reports">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
              <Link href="/admin/products/suppliers">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Building2 className="w-4 h-4 mr-2" />
                  Suppliers
                </Button>
              </Link>
              <Link href="/admin/products/tags">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </Button>
              </Link>
              <Link href="/admin/products/images">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white-10">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Images
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Category Visualization - Temporarily disabled for build */}
        <Card className="glass border border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Category Visualization</CardTitle>
            <p className="text-white/60 text-sm">Click on a shape to filter by category</p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] flex items-center justify-center text-white/40">
              Interactive visualization loading...
            </div>
          </CardContent>
        </Card>

        {/* Recent Products Preview */}
        <Card className="glass border border-white/10">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Products</CardTitle>
            <Link href="/admin/products/all">
              <Button variant="ghost" className="text-white/60 hover:text-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading products...</p>
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No products found</p>
                <Link href="/admin/products/add">
                  <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white-10">
                    Add Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border border-white/10 hover:border-accent-primary/50 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden relative flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 ml-3">
                            <p className="text-white font-medium text-sm truncate">{product.name}</p>
                            <p className="text-white/40 text-xs truncate">{product.sku || product.id}</p>
                            <p className="text-accent-primary font-semibold text-sm mt-1">EGP {product.price?.toLocaleString() || '0'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-1">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-1">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
