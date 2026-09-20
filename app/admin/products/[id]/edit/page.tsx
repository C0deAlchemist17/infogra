'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Upload, X, Plus, Trash2, History } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [changes, setChanges] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    purchasePrice: '',
    wholesalePrice: '',
    discountPrice: '',
    stock: '',
    minStock: '',
    maxStock: '',
    unit: 'piece',
    warranty: '',
    warrantyType: 'none',
    status: 'active',
  })

  const fetchProduct = useCallback(async () => {
    try {
      // Use the new single-product endpoint - much faster
      const response = await fetch(`/api/products?storage=true&id=${productId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.product) {
          const product = data.product
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            barcode: product.barcode || '',
            category: product.category || '',
            brand: product.brand || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            purchasePrice: product.originalPrice?.toString() || '',
            wholesalePrice: product.wholesalePrice?.toString() || '',
            discountPrice: product.discountPrice?.toString() || '',
            stock: product.stock?.toString() || '',
            minStock: product.minStock?.toString() || '',
            maxStock: product.maxStock?.toString() || '',
            unit: product.unit || 'piece',
            warranty: product.warranty || '',
            warrantyType: product.warrantyType || 'none',
            status: product.status || 'active',
          })
          setImages(product.images || [])
        } else {
          // Fallback to old method if single-product endpoint fails
          const fallbackResponse = await fetch(`/api/products?storage=true`)
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            const product = (fallbackData.products || []).find((p: any) => p.id === productId)
            if (product) {
              setFormData({
                name: product.name || '',
                sku: product.sku || '',
                barcode: product.barcode || '',
                category: product.category || '',
                brand: product.brand || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                purchasePrice: product.originalPrice?.toString() || '',
                wholesalePrice: product.wholesalePrice?.toString() || '',
                discountPrice: product.discountPrice?.toString() || '',
                stock: product.stock?.toString() || '',
                minStock: product.minStock?.toString() || '',
                maxStock: product.maxStock?.toString() || '',
                unit: product.unit || 'piece',
                warranty: product.warranty || '',
                warrantyType: product.warrantyType || 'none',
                status: product.status || 'active',
              })
              setImages(product.images || [])
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Track changes
    const trackedChanges = []
    if (formData.price !== (await getCurrentPrice())) {
      trackedChanges.push({ field: 'price', old: await getCurrentPrice(), new: formData.price })
    }
    if (formData.stock !== (await getCurrentStock())) {
      trackedChanges.push({ field: 'stock', old: await getCurrentStock(), new: formData.stock })
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          ...formData,
          images,
          price: parseFloat(formData.price) || 0,
          purchasePrice: parseFloat(formData.purchasePrice) || 0,
          wholesalePrice: parseFloat(formData.wholesalePrice) || 0,
          discountPrice: parseFloat(formData.discountPrice) || 0,
          stock: parseInt(formData.stock) || 0,
          minStock: parseInt(formData.minStock) || 0,
          maxStock: parseInt(formData.maxStock) || 0,
          changes: trackedChanges,
        }),
      })

      if (response.ok) {
        router.push('/admin/products/all')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setSaving(false)
    }
  }

  const getCurrentPrice = async () => {
    // In a real app, this would fetch from API
    return formData.price
  }

  const getCurrentStock = async () => {
    // In a real app, this would fetch from API
    return formData.stock
  }

  const addImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8 flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products/all">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 font-bold text-white mb-1">Edit Product</h1>
              <p className="text-text-secondary text-sm md:text-body">Update product information</p>
            </div>
          </div>
          <Link href={`/admin/products/${productId}/history`}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/80 mb-2 block">Product Name *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">SKU *</Label>
                  <Input
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Barcode</Label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Category *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Select category</option>
                    <option value="laptops">Laptops</option>
                    <option value="monitors">Monitors</option>
                    <option value="graphics-cards">Graphics Cards</option>
                    <option value="ram">RAM</option>
                    <option value="storage">Storage</option>
                    <option value="processors">Processors</option>
                    <option value="motherboards">Motherboards</option>
                    <option value="keyboards">Keyboards</option>
                    <option value="mice">Mice</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Brand *</Label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Select brand</option>
                    <option value="lenovo">Lenovo</option>
                    <option value="hp">HP</option>
                    <option value="asus">ASUS</option>
                    <option value="dell">Dell</option>
                    <option value="msi">MSI</option>
                    <option value="samsung">Samsung</option>
                    <option value="logitech">Logitech</option>
                    <option value="corsair">Corsair</option>
                    <option value="razer">Razer</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-white/80 mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/80 mb-2 block">Selling Price (EGP) *</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Purchase Price (EGP)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Wholesale Price (EGP)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Discount Price (EGP)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/80 mb-2 block">Current Stock *</Label>
                  <Input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Unit</Label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="piece">Piece</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                    <option value="meter">Meter</option>
                    <option value="kilogram">Kilogram</option>
                    <option value="gram">Gram</option>
                    <option value="liter">Liter</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Minimum Stock</Label>
                  <Input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Maximum Stock</Label>
                  <Input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  className="flex-1 bg-white/10 border-white/20 text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addImage((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter image URL"]') as HTMLInputElement
                    addImage(input.value)
                    input.value = ''
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/products/all">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
