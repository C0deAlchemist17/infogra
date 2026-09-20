import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function POST(request: Request) {
  try {
    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    // Generate a random 13-digit barcode (EAN-13 format)
    const barcode = Math.floor(Math.random() * 1000000000000).toString().padStart(13, '0')

    // Check if barcode already exists
    const existingProduct = storageData.products.find((p: any) => p.barcode === barcode)

    if (existingProduct) {
      // Try again if duplicate
      return POST(request)
    }

    return NextResponse.json({ barcode })
  } catch (error) {
    console.error('Error generating barcode:', error)
    return NextResponse.json({ error: 'Failed to generate barcode' }, { status: 500 })
  }
}
