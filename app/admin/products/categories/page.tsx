'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        // Extract unique categories from products
        const uniqueCategories = new Map()
        ;(data.products || []).forEach((p: any) => {
          if (p.category && !uniqueCategories.has(p.category)) {
            uniqueCategories.set(p.category, {
              id: p.category,
              name: p.category,
              slug: p.category,
              icon: '📦',
              productCount: 0,
            })
          }
        })
        // Count products per category
        ;(data.products || []).forEach((p: any) => {
          if (p.category && uniqueCategories.has(p.category)) {
            uniqueCategories.get(p.category).productCount++
          }
        })
        setCategories(Array.from(uniqueCategories.values()))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to database
    setShowAddForm(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', icon: '', description: '' })
    fetchCategories()
  }

  const handleEdit = (category: any) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description || '',
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? Products in this category will need to be reassigned.')) {
      // In a real app, this would delete from database
      setCategories(categories.filter(c => c.id !== id))
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
              <h1 className="text-4xl font-bold text-white mb-2">Categories</h1>
              <p className="text-white/60">Manage product categories</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({ name: '', slug: '', icon: '', description: '' })
            }}
            className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {showAddForm && (
          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{editingId ? 'Edit Category' : 'Add Category'}</CardTitle>
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
                  <div>
                    <Label className="text-white/80 mb-2 block">Icon</Label>
                    <Input
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="📦"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
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
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-white/40">No categories found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass border border-white/10 rounded-lg p-4 hover:border-accent-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{category.name}</h3>
                          <p className="text-white/60 text-sm">{category.productCount} products</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/60 hover:text-white"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-white/40 text-sm">{category.slug}</p>
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
