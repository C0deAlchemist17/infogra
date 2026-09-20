'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Edit, Trash2, DollarSign, Package, User, Filter } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProductHistoryPage() {
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchHistory()
  }, [productId])

  const fetchHistory = async () => {
    try {
      // In a real app, this would fetch from a dedicated audit log endpoint
      // For now, simulate history data
      const mockHistory = [
        {
          id: '1',
          action: 'price_changed',
          user: 'Admin',
          date: new Date().toISOString(),
          oldValue: '2000 EGP',
          newValue: '2200 EGP',
          reason: 'Price adjustment',
        },
        {
          id: '2',
          action: 'stock_added',
          user: 'Admin',
          date: new Date(Date.now() - 86400000).toISOString(),
          oldValue: '10',
          newValue: '20',
          reason: 'Restock',
        },
        {
          id: '3',
          action: 'edited',
          user: 'Admin',
          date: new Date(Date.now() - 172800000).toISOString(),
          oldValue: 'Old description',
          newValue: 'Updated description',
          reason: 'Product update',
        },
        {
          id: '4',
          action: 'created',
          user: 'Admin',
          date: new Date(Date.now() - 259200000).toISOString(),
          oldValue: null,
          newValue: 'Product created',
          reason: 'Initial creation',
        },
      ]
      setHistory(mockHistory)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = filter === 'all' ? history : history.filter(h => h.action === filter)

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'price_changed':
        return <DollarSign className="w-5 h-5 text-blue-400" />
      case 'stock_added':
      case 'stock_removed':
        return <Package className="w-5 h-5 text-green-400" />
      case 'edited':
        return <Edit className="w-5 h-5 text-yellow-400" />
      case 'deleted':
        return <Trash2 className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-white/60" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'price_changed':
        return 'Price Changed'
      case 'stock_added':
        return 'Stock Added'
      case 'stock_removed':
        return 'Stock Removed'
      case 'edited':
        return 'Product Edited'
      case 'deleted':
        return 'Product Deleted'
      case 'created':
        return 'Product Created'
      default:
        return action
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/admin/products/${productId}`}>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Product History</h1>
              <p className="text-white/60">Audit log for product {productId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded px-3 py-2"
            >
              <option value="all">All Actions</option>
              <option value="price_changed">Price Changes</option>
              <option value="stock_added">Stock Changes</option>
              <option value="edited">Edits</option>
            </select>
          </div>
        </div>

        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">Loading...</div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-white/40">No history found</div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      {getActionIcon(item.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{getActionLabel(item.action)}</h3>
                        <span className="text-white/40 text-sm">
                          {new Date(item.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <User className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">{item.user}</span>
                      </div>
                      {item.oldValue && item.newValue && (
                        <div className="p-3 bg-white/5 rounded-lg space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">Before:</span>
                            <span className="text-white/60">{item.oldValue}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">After:</span>
                            <span className="text-white">{item.newValue}</span>
                          </div>
                        </div>
                      )}
                      {item.reason && (
                        <p className="text-white/40 text-sm mt-2">Reason: {item.reason}</p>
                      )}
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
