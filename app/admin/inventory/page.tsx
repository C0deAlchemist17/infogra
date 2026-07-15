'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react'
import { products } from '@/data/products'

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'in-stock' && product.stock > 10) ||
                         (filterStatus === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
                         (filterStatus === 'out-of-stock' && product.stock === 0)
    
    return matchesSearch && matchesFilter
  })

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const toggleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedProducts(newSelected)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-accent-error text-white' }
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-accent-highlight text-white' }
    return { label: 'In Stock', color: 'bg-accent-success text-white' }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-display font-bold text-text-primary mb-4">Inventory Management</h1>
        <p className="text-body-lg text-text-secondary">
          Manage product stock, prices, and details
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Products', value: products.length, icon: Package },
          { label: 'In Stock', value: products.filter(p => p.stock > 0).length, icon: CheckCircle },
          { label: 'Low Stock', value: products.filter(p => p.stock > 0 && p.stock <= 10).length, icon: AlertTriangle },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: AlertTriangle },
        ].map((stat, index) => (
          <Card key={stat.label} className="glass border-border-subtle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-accent-primary" />
                <span className="text-h3 font-bold text-text-primary">{stat.value}</span>
              </div>
              <div className="text-small text-text-secondary">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 glass border-border-subtle"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {['all', 'in-stock', 'low-stock', 'out-of-stock'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'premium' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status as any)}
                  >
                    {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Button>
                ))}
              </div>

              {selectedProducts.size > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Selected ({selectedProducts.size})
                  </Button>
                  <Button variant="outline" size="sm" className="text-accent-error border-accent-error">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass border-border-subtle overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-tertiary/50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === filteredProducts.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-small font-semibold text-text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="border-t border-border-subtle hover:bg-background-tertiary/30 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-accent-primary" />
                          </div>
                          <div>
                            <div className="text-body font-medium text-text-primary">{product.name}</div>
                            <div className="text-small text-text-tertiary">{product.sku || product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body text-text-secondary">{product.brand}</td>
                      <td className="px-6 py-4 text-body font-medium text-text-primary">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-body text-text-secondary">{product.stock}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStockStatus(product.stock).color}>
                          {getStockStatus(product.stock).label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-accent-error border-accent-error">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
