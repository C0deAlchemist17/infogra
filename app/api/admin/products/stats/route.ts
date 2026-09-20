import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function GET() {
  try {
    const storage = new JSONStorageManager()
    const products = await storage.getAllProducts()

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter((p: any) => p.status === 'active').length,
      inactiveProducts: products.filter((p: any) => p.status === 'inactive').length,
      outOfStock: products.filter((p: any) => !p.stock || p.stock <= 0).length,
      lowStock: products.filter((p: any) => p.stock && p.stock > 0 && p.stock <= 5).length,
      noPrice: products.filter((p: any) => !p.price || p.price <= 0).length,
      noSku: products.filter((p: any) => !p.sku || p.sku.trim() === '').length,
      noCategory: products.filter((p: any) => !p.category || p.category.trim() === '').length,
      totalInventory: products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0),
      totalCostValue: products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.originalPrice || p.price || 0)), 0),
      totalSellingValue: products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.price || 0)), 0),
      potentialProfit: products.reduce((sum: number, p: any) => {
        const cost = p.originalPrice || p.price || 0
        const selling = p.price || 0
        return sum + ((p.stock || 0) * (selling - cost))
      }, 0),
      addedToday: products.filter((p: any) => {
        if (!p.createdAt) return false
        const createdDate = new Date(p.createdAt)
        const today = new Date()
        return createdDate.toDateString() === today.toDateString()
      }).length,
      updatedToday: products.filter((p: any) => {
        if (!p.updatedAt) return false
        const updatedDate = new Date(p.updatedAt)
        const today = new Date()
        return updatedDate.toDateString() === today.toDateString()
      }).length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
