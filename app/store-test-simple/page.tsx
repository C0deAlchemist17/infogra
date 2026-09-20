'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/store'
import Image from 'next/image'

export default function SimpleStoreTest() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?storage=true')
        const data = await response.json()
        
        if (data.success && data.products) {
          setProducts(data.products)
          setError(null)
        } else {
          setError('Failed to load products')
        }
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-3xl text-white mb-4">INFOGRA Store - Simple Test</h1>
      <p className="text-gray-400 mb-4">Products loaded: {products.length}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 p-4 rounded-lg text-white">
            <h3 className="font-bold mb-2">{product.name}</h3>
            <p className="text-xl text-green-400">{product.price} EGP</p>
            <p className="text-sm text-gray-400">{product.brand}</p>
            <p className="text-sm text-gray-400">{product.category}</p>
            {product.images && product.images.length > 0 && (
              <div className="relative w-full h-48 mt-2 rounded overflow-hidden">
                <Image 
                  src={product.images[0]} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}