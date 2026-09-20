import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, brand } = body

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    // Generate SKU based on category and brand
    const categoryPrefix = category ? category.substring(0, 3).toUpperCase() : 'PRD'
    const brandPrefix = brand ? brand.substring(0, 3).toUpperCase() : 'GEN'

    // Get existing SKUs to find the next number
    const existingSKUs = storageData.products
      .filter((p: any) => p.sku && p.sku.startsWith(`${categoryPrefix}-${brandPrefix}`))
      .map((p: any) => {
        const match = p.sku.match(/-(\d+)$/)
        return match ? parseInt(match[1]) : 0
      })

    const nextNumber = existingSKUs.length > 0 ? Math.max(...existingSKUs) + 1 : 1

    const generatedSKU = `${categoryPrefix}-${brandPrefix}-${String(nextNumber).padStart(4, '0')}`

    return NextResponse.json({ sku: generatedSKU })
  } catch (error) {
    console.error('Error generating SKU:', error)
    return NextResponse.json({ error: 'Failed to generate SKU' }, { status: 500 })
  }
}
