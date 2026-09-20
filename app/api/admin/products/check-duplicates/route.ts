import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sku, barcode, name, excludeId } = body

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    const duplicates: any[] = []

    for (const product of storageData.products) {
      const p = product as any
      // Skip if checking the same product (for edit)
      if (excludeId && p.id === excludeId) continue

      // Check SKU
      if (sku && p.sku === sku) {
        duplicates.push({
          field: 'sku',
          value: sku,
          existingProduct: {
            id: p.id,
            name: p.name,
            sku: p.sku,
          },
        })
      }

      // Check barcode
      if (barcode && p.barcode === barcode) {
        duplicates.push({
          field: 'barcode',
          value: barcode,
          existingProduct: {
            id: p.id,
            name: p.name,
            barcode: p.barcode,
          },
        })
      }

      // Check name similarity
      if (name && p.name.toLowerCase() === name.toLowerCase()) {
        duplicates.push({
          field: 'name',
          value: name,
          existingProduct: {
            id: p.id,
            name: p.name,
          },
        })
      }
    }

    return NextResponse.json({ duplicates })
  } catch (error) {
    console.error('Error checking duplicates:', error)
    return NextResponse.json({ error: 'Failed to check duplicates' }, { status: 500 })
  }
}
