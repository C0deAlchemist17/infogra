import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { products } = body

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    let imported = 0
    let updated = 0
    let skipped = 0
    let failed = 0

    for (const product of products) {
      // Check for duplicates by SKU
      const existingIndex = storageData.products.findIndex(p => p.sku === product.sku)

      if (existingIndex >= 0) {
        // Update existing
        storageData.products[existingIndex] = {
          ...storageData.products[existingIndex],
          ...product,
          updatedAt: new Date().toISOString(),
        }
        updated++
      } else {
        // Add new
        storageData.products.push({
          id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        })
        imported++
      }
    }

    await storage.saveStorage(storageData)

    return NextResponse.json({
      success: true,
      imported,
      updated,
      skipped,
      failed,
    })
  } catch (error) {
    console.error('Error importing products:', error)
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 })
  }
}
