import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const filter = searchParams.get('filter')

    const storage = new JSONStorageManager()
    const storageData = await storage.loadStorage()

    let products = storageData.products

    // Apply filters if provided
    if (filter === 'active') {
      products = products.filter((p: any) => p.status === 'active')
    } else if (filter === 'inactive') {
      products = products.filter((p: any) => p.status === 'inactive')
    } else if (filter === 'out-of-stock') {
      products = products.filter((p: any) => !p.stock || p.stock <= 0)
    } else if (filter === 'low-stock') {
      products = products.filter((p: any) => p.stock > 0 && p.stock <= 5)
    }

    if (format === 'csv') {
      const headers = ['ID', 'SKU', 'Name', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Created', 'Updated']
      const rows = products.map((product: any) => [
        product.id,
        product.sku || '',
        product.name,
        product.category,
        product.brand,
        product.price || 0,
        product.stock || 0,
        product.status || 'active',
        product.createdAt || '',
        product.updatedAt || '',
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else if (format === 'json') {
      return NextResponse.json(products, {
        headers: {
          'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting products:', error)
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 })
  }
}
