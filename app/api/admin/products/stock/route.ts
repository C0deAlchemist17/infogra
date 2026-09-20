import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, action, quantity, reason } = body

    const storage = new JSONStorageManager()
    const product = await storage.getProductById(productId)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let newStock = product.stock || 0

    switch (action) {
      case 'add':
        newStock += quantity
        break
      case 'remove':
        newStock = Math.max(0, newStock - quantity)
        break
      case 'adjust':
        newStock = quantity
        break
    }

    await storage.updateProduct(productId, {
      stock: newStock,
    } as any)

    return NextResponse.json({ success: true, newStock })
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}
