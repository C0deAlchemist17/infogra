'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Image as ImageIcon, RefreshCw, Upload, X, ChevronLeft, ChevronRight, ZoomIn, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductImage {
  id: string
  productId: string
  productName: string
  url: string
  isPrimary: boolean
  order: number
}

export default function ProductImagesPage() {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [selectedProduct])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        const allImages: ProductImage[] = []

        data.products.forEach((product: any) => {
          if (product.images && Array.isArray(product.images)) {
            product.images.forEach((url: string, index: number) => {
              allImages.push({
                id: `${product.id}-${index}`,
                productId: product.id,
                productName: product.name,
                url,
                isPrimary: index === 0,
                order: index,
              })
            })
          }
        })

        if (selectedProduct) {
          setImages(allImages.filter((img) => img.productId === selectedProduct))
        } else {
          setImages(allImages)
        }
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', selectedProduct)

      const response = await fetch('/api/admin/products/images/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        // Add the new image to the list
        const newImage: ProductImage = {
          id: `new-${Date.now()}`,
          productId: selectedProduct,
          productName: 'Unknown Product',
          url: data.url,
          isPrimary: false,
          order: images.length,
        }
        setImages([...images, newImage])
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/admin/products/images?id=${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages(images.filter((img) => img.id !== imageId))
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch('/api/admin/products/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      })

      if (response.ok) {
        setImages(
          images.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        )
      }
    } catch (error) {
      console.error('Failed to set primary image:', error)
    }
  }

  const handleReorder = async (imageId: string, direction: 'left' | 'right') => {
    const currentIndex = images.findIndex((img) => img.id === imageId)
    if (currentIndex < 0) return

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const reorderedImages = [...images]
    const [movedImage] = reorderedImages.splice(currentIndex, 1)
    reorderedImages.splice(newIndex, 0, movedImage)

    // Update order numbers
    reorderedImages.forEach((img, index) => {
      img.order = index
    })

    setImages(reorderedImages)

    try {
      const response = await fetch('/api/admin/products/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: reorderedImages }),
      })

      if (!response.ok) {
        // Revert on failure
        setImages(images)
      }
    } catch (error) {
      console.error('Failed to reorder images:', error)
      setImages(images)
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
              <h1 className="text-4xl font-bold text-white mb-2">Product Images</h1>
              <p className="text-white/60">Manage product images, upload, delete, and reorder</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchImages}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Product Filter */}
        <Card className="glass border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Label className="text-white/80 mb-2 block">Filter by Product</Label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full max-w-md h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">All Products</option>
                {/* Product options would be populated from actual products */}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        {selectedProduct && (
          <Card className="glass border border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-white/80 mb-2 block">Upload New Image</Label>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-accent-primary/50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-white/40" />
                      <span className="text-white/60">
                        {uploading ? 'Uploading...' : 'Click to upload image'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images Grid */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No images found</p>
                <p className="text-white/30 text-sm mt-2">Select a product to view and manage its images</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="aspect-square bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.productName}
                        fill
                        className="object-cover"
                        onClick={() => setPreviewImage(image.url)}
                      />
                    </div>
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-accent-primary text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 bg-black/50 text-white hover:bg-white/10"
                        onClick={() => setPreviewImage(image.url)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 bg-black/50 text-white hover:bg-white-10"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 bg-black/50 text-white hover:bg-white/10"
                        onClick={() => handleReorder(image.id, 'left')}
                        disabled={index === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 bg-black/50 text-white hover:bg-white/10"
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={image.isPrimary}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 bg-black/50 text-white hover:bg-white-10"
                        onClick={() => handleReorder(image.id, 'right')}
                        disabled={index === images.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <p className="text-white text-sm truncate">{image.productName}</p>
                      <p className="text-white/40 text-xs">Order: {image.order + 1}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={previewImage}
                alt="Preview"
                width={800}
                height={600}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 border-white/20 bg-black/50 text-white hover:bg-white-10"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
