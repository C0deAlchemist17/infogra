'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Upload, X, Plus, Trash2, AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [duplicates, setDuplicates] = useState<any[]>([])
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
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

  const checkForDuplicates = async () => {
    setCheckingDuplicates(true)
    try {
      const response = await fetch('/api/admin/products/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: formData.sku,
          barcode: formData.barcode,
          name: formData.name,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDuplicates(data.duplicates || [])
      }
    } catch (error) {
      console.error('Failed to check duplicates:', error)
    } finally {
      setCheckingDuplicates(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check for duplicates first
    await checkForDuplicates()
    if (duplicates.length > 0) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
          price: parseFloat(formData.price) || 0,
          purchasePrice: parseFloat(formData.purchasePrice) || 0,
          wholesalePrice: parseFloat(formData.wholesalePrice) || 0,
          discountPrice: parseFloat(formData.discountPrice) || 0,
          stock: parseInt(formData.stock) || 0,
          minStock: parseInt(formData.minStock) || 0,
          maxStock: parseInt(formData.maxStock) || 0,
        }),
      })

      if (response.ok) {
        router.push('/admin/products/all')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Add New Product</h1>
              <p className="text-white/60">Create a new product in your catalog</p>
            </div>
          </div>
        </div>

        {/* Duplicate Warning */}
        {duplicates.length > 0 && (
          <Card className="glass border border-red-500/50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold mb-2">Potential Duplicates Found</h3>
                  <div className="space-y-2">
                    {duplicates.map((dup, index) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-white/80 text-sm">
                          <span className="font-medium text-white">{dup.field}:</span> {dup.value}
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                          Already used by: {dup.existingProduct.name} (ID: {dup.existingProduct.id})
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm mt-4">
                    Please use a different SKU, barcode, or product name, or confirm if this is intentional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">SKU *</Label>
                  <div className="flex gap-2">
                    <Input
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      onBlur={checkForDuplicates}
                      className="flex-1 bg-white/10 border-white/20 text-white"
                      placeholder="Enter SKU"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/products/generate-sku', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ category: formData.category, brand: formData.brand }),
                          })
                          if (response.ok) {
                            const data = await response.json()
                            setFormData({ ...formData, sku: data.sku })
                          }
                        } catch (error) {
                          console.error('Failed to generate SKU:', error)
                        }
                      }}
                      title="Auto-generate SKU"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Barcode</Label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    onBlur={checkForDuplicates}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter barcode"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Category *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-white/80 mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  placeholder="Enter product description"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Unit</Label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                    placeholder="Alert threshold"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">Maximum Stock</Label>
                  <Input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Maximum capacity"
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
                    if (input && input.value) {
                      addImage(input.value)
                      input.value = ''
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
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
            <Link href="/admin/products">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
