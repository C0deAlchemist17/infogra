'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Tag, RefreshCw, Plus, Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'

interface Tag {
  id: string
  name: string
  color: string
  productCount: number
  createdAt: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
  })

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ]

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/products/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTag ? '/api/admin/products/tags' : '/api/admin/products/tags'
      const method = editingTag ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTag ? { ...formData, id: editingTag.id } : formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingTag(null)
        setFormData({ name: '', color: '#3b82f6' })
        fetchTags()
      }
    } catch (error) {
      console.error('Failed to save tag:', error)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({ name: tag.name, color: tag.color })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      const response = await fetch(`/api/admin/products/tags?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTags()
      }
    } catch (error) {
      console.error('Failed to delete tag:', error)
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
              <h1 className="text-4xl font-bold text-white mb-2">Tag Management</h1>
              <p className="text-white/60">Manage product tags for categorization and filtering</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchTags}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
        </div>

        {/* Tag Form */}
        {showForm && (
          <Card className="glass border border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">{editingTag ? 'Edit Tag' : 'Add New Tag'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 mb-2 block">Tag Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90">
                    {editingTag ? 'Update Tag' : 'Add Tag'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white-10"
                    onClick={() => {
                      setShowForm(false)
                      setEditingTag(null)
                      setFormData({ name: '', color: '#3b82f6' })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tags List */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading tags...</p>
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Tag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tags found</p>
                <p className="text-white/30 text-sm mt-2">Add tags to organize and filter your products</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tag.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white/40 text-xs">Color: {tag.color}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-white/40" />
                          <span className="text-white font-medium">{tag.productCount}</span>
                        </div>
                        <p className="text-white/40 text-xs">Products</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/20 text-white hover:bg-white-10"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDelete(tag.id)}
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
