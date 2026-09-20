'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function StoreTestPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?storage=true')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
        setError(null)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError('Error loading products: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">INFOGRA Store Test</h1>
          <p className="text-gray-400">Verify imported Kimo products appear correctly</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button onClick={loadProducts} variant="default">
            Reload Products
          </Button>
          <Button 
            onClick={() => window.open('/store', '_blank')}
            variant="outline"
          >
            Open Store Page
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Imported Products Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background-secondary p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-white">{products.length}</p>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">From Kimo</p>
                    <p className="text-2xl font-bold text-white">
                      {products.filter(p => p.sourceMetadata?.source === 'Kimo Store').length}
                    </p>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Sync Price Enabled</p>
                    <p className="text-2xl font-bold text-white">
                      {products.filter(p => p.syncPrice === true).length}
                    </p>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">With Images</p>
                    <p className="text-2xl font-bold text-white">
                      {products.filter(p => p.images && p.images.length > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="bg-background-secondary p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{product.name}</h3>
                          <p className="text-gray-400 text-sm">ID: {product.id}</p>
                          <p className="text-gray-400 text-sm">SKU: {product.sku || 'N/A'}</p>
                          <p className="text-gray-400 text-sm">Category: {product.category}</p>
                          <p className="text-gray-400 text-sm">Brand: {product.brand}</p>
                          <div className="mt-2 flex gap-4">
                            <span className="text-green-400 font-bold">EGP {product.price}</span>
                            {product.originalPrice && (
                              <span className="text-gray-500 line-through">EGP {product.originalPrice}</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Images: {product.images?.length || 0}
                          </p>
                          {product.sourceMetadata && (
                            <p className="text-blue-400 text-xs mt-1">
                              Source: {product.sourceMetadata.source}
                            </p>
                          )}
                        </div>
                        {product.images && product.images.length > 0 && (
                          <div className="ml-4 w-20 h-20 relative">
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}