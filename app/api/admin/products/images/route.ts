import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    // Parse imageId to get productId and index
    const [productId, imageIndex] = imageId.split('-')
    const index = parseInt(imageIndex)

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    const productIndex = storageData.products.findIndex((p: any) => p.id === productId)
    if (productIndex >= 0 && storageData.products[productIndex].images) {
      storageData.products[productIndex].images.splice(index, 1)
      await storage.saveStorage(storageData)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageId } = body

    // Parse imageId to get productId and index
    const [productId, imageIndex] = imageId.split('-')
    const index = parseInt(imageIndex)

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    const productIndex = storageData.products.findIndex((p: any) => p.id === productId)
    if (productIndex >= 0 && storageData.products[productIndex].images) {
      // Set this image as primary by moving it to index 0
      const images = storageData.products[productIndex].images
      const [primaryImage] = images.splice(index, 1)
      storageData.products[productIndex].images = [primaryImage, ...images]
      await storage.saveStorage(storageData)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  } catch (error) {
    console.error('Error setting primary image:', error)
    return NextResponse.json({ error: 'Failed to set primary image' }, { status: 500 })
  }
}
