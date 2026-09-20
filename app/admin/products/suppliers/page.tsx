'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Building2, RefreshCw, Plus, Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  productCount: number
  notes: string
  createdAt: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/admin/products/suppliers')
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.suppliers || [])
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingSupplier
        ? '/api/admin/products/suppliers'
        : '/api/admin/products/suppliers'
      const method = editingSupplier ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSupplier ? { ...formData, id: editingSupplier.id } : formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingSupplier(null)
        setFormData({ name: '', contact: '', email: '', phone: '', address: '', notes: '' })
        fetchSuppliers()
      }
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      notes: supplier.notes,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return

    try {
      const response = await fetch(`/api/admin/products/suppliers?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSuppliers()
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error)
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
              <h1 className="text-4xl font-bold text-white mb-2">Supplier Management</h1>
              <p className="text-white/60">Manage product suppliers and vendor information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchSuppliers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Supplier Form */}
        {showForm && (
          <Card className="glass border border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 mb-2 block">Supplier Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter supplier name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Contact Person</Label>
                    <Input
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="supplier@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="+20 xxx xxx xxxx"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/80 mb-2 block">Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Full address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/80 mb-2 block">Notes</Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Additional notes"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90">
                    {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white-10"
                    onClick={() => {
                      setShowForm(false)
                      setEditingSupplier(null)
                      setFormData({ name: '', contact: '', email: '', phone: '', address: '', notes: '' })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Suppliers List */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading suppliers...</p>
              </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No suppliers found</p>
                <p className="text-white/30 text-sm mt-2">Add suppliers to track vendor information</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suppliers.map((supplier, index) => (
                  <motion.div
                    key={supplier.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{supplier.name}</p>
                        <p className="text-white/60 text-sm">{supplier.contact}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-white/40 text-xs">{supplier.email}</span>
                          <span className="text-white/40 text-xs">{supplier.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-white/40" />
                          <span className="text-white font-medium">{supplier.productCount}</span>
                        </div>
                        <p className="text-white/40 text-xs">Products</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
