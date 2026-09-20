import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const storage = new JSONStorageManager()

    const newProduct = {
      id: `product-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await storage.addProduct(newProduct)

    return NextResponse.json({ success: true, product: newProduct })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const storage = new JSONStorageManager()

    const updatedProduct = {
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    await storage.updateProduct(id, updatedProduct)

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()
    const index = storageData.products.findIndex((p: any) => p.id === id)

    if (index >= 0) {
      // Soft delete - add deletedAt timestamp instead of removing
      const product = storageData.products[index] as any
      product.deletedAt = new Date().toISOString()
      product.status = 'archived'
      await storage.saveStorage(storageData)
      return NextResponse.json({ success: true, archived: true })
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    console.error('Error archiving product:', error)
    return NextResponse.json({ error: 'Failed to archive product' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    if (action === 'restore') {
      const index = storageData.products.findIndex((p: any) => p.id === id)
      if (index >= 0) {
        const product = storageData.products[index] as any
        product.deletedAt = null
        product.status = 'active'
        await storage.saveStorage(storageData)
        return NextResponse.json({ success: true, restored: true })
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error restoring product:', error)
    return NextResponse.json({ error: 'Failed to restore product' }, { status: 500 })
  }
}
