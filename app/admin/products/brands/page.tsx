'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    featured: false,
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        // Extract unique brands from products
        const uniqueBrands = new Map()
        ;(data.products || []).forEach((p: any) => {
          if (p.brand && !uniqueBrands.has(p.brand)) {
            uniqueBrands.set(p.brand, {
              id: p.brand.toLowerCase().replace(/\s+/g, '-'),
              name: p.brand,
              slug: p.brand.toLowerCase().replace(/\s+/g, '-'),
              logo: '',
              description: '',
              featured: false,
              productCount: 0,
            })
          }
        })
        // Count products per brand
        ;(data.products || []).forEach((p: any) => {
          if (p.brand && uniqueBrands.has(p.brand)) {
            uniqueBrands.get(p.brand).productCount++
          }
        })
        setBrands(Array.from(uniqueBrands.values()))
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to database
    setShowAddForm(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', logo: '', description: '', featured: false })
    fetchBrands()
  }

  const handleEdit = (brand: any) => {
    setEditingId(brand.id)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      description: brand.description,
      featured: brand.featured,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this brand? Products with this brand will need to be reassigned.')) {
      // In a real app, this would delete from database
      setBrands(brands.filter(b => b.id !== id))
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
              <h1 className="text-4xl font-bold text-white mb-2">Brands</h1>
              <p className="text-white/60">Manage product brands</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({ name: '', slug: '', logo: '', description: '', featured: false })
            }}
            className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>

        {showAddForm && (
          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{editingId ? 'Edit Brand' : 'Add Brand'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80 mb-2 block">Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Slug *</Label>
                    <Input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Logo URL</Label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="featured" className="text-white/80">Featured Brand</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingId(null)
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">Loading...</div>
            ) : brands.length === 0 ? (
              <div className="text-center py-12 text-white/40">No brands found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass border border-white/10 rounded-lg p-4 hover:border-accent-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🏷️</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-white font-medium">{brand.name}</h3>
                          <p className="text-white/60 text-sm">{brand.productCount} products</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/60 hover:text-white"
                          onClick={() => handleEdit(brand)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(brand.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {brand.featured && (
                      <span className="inline-block px-2 py-1 bg-accent-primary/20 text-accent-primary text-xs rounded-full">
                        Featured
                      </span>
                    )}
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
