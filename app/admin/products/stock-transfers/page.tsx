'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface StockTransfer {
  id: string
  productId: string
  productName: string
  fromLocation: string
  toLocation: string
  quantity: number
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
  notes?: string
}

const locations = [
  { id: 'main-warehouse', name: 'Main Warehouse' },
  { id: 'store-front', name: 'Store Front' },
  { id: 'secondary-warehouse', name: 'Secondary Warehouse' },
  { id: 'alexandria-branch', name: 'Alexandria Branch' },
  { id: 'cairo-branch', name: 'Cairo Branch' },
]

export default function StockTransfersPage() {
  const [transfers, setTransfers] = useState<StockTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    fromLocation: '',
    toLocation: '',
    quantity: 0,
    notes: '',
  })

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/admin/products/stock-transfers')
      if (response.ok) {
        const data = await response.json()
        setTransfers(data.transfers || [])
      }
    } catch (error) {
      console.error('Failed to fetch transfers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/products/stock-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          productId: '',
          productName: '',
          fromLocation: '',
          toLocation: '',
          quantity: 0,
          notes: '',
        })
        fetchTransfers()
      }
    } catch (error) {
      console.error('Failed to create transfer:', error)
    }
  }

  const updateTransferStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/products/stock-transfers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        fetchTransfers()
      }
    } catch (error) {
      console.error('Failed to update transfer:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'in-transit':
        return <Truck className="w-4 h-4 text-blue-400" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Package className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50'
      case 'in-transit':
        return 'bg-blue-500/20 border-blue-500/50'
      case 'completed':
        return 'bg-green-500/20 border-green-500/50'
      case 'cancelled':
        return 'bg-red-500/20 border-red-500/50'
      default:
        return 'bg-gray-500/20 border-gray-500/50'
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
              <h1 className="text-4xl font-bold text-white mb-2">Stock Transfers</h1>
              <p className="text-white/60">Manage inventory transfers between locations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchTransfers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90" onClick={() => setShowForm(true)}>
              <Truck className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>

        {/* Transfer Form */}
        {showForm && (
          <Card className="glass border border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Create Stock Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 mb-2 block">Product ID</Label>
                    <Input
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter product ID"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Product Name</Label>
                    <Input
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">From Location</Label>
                    <select
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="">Select source location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">To Location</Label>
                    <select
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="">Select destination location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Quantity</Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter quantity"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Notes</Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90">
                    Create Transfer
                  </Button>
                  <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Transfers List */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading transfers...</p>
              </div>
            ) : transfers.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No stock transfers found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer, index) => (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border rounded-lg ${getStatusColor(transfer.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          {getStatusIcon(transfer.status)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transfer.productName}</p>
                          <p className="text-white/60 text-sm">
                            {locations.find((l) => l.id === transfer.fromLocation)?.name} →{' '}
                            {locations.find((l) => l.id === transfer.toLocation)?.name}
                          </p>
                          <p className="text-white/60 text-sm">Quantity: {transfer.quantity}</p>
                          {transfer.notes && (
                            <p className="text-white/40 text-xs mt-1">Notes: {transfer.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transfer.status)}`}>
                          {transfer.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-white/40 text-xs">
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </span>
                        {transfer.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                              onClick={() => updateTransferStatus(transfer.id, 'in-transit')}
                            >
                              Start Transfer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => updateTransferStatus(transfer.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        {transfer.status === 'in-transit' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                            onClick={() => updateTransferStatus(transfer.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
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
