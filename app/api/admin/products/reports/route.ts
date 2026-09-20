import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

export async function GET() {
  try {
    const storage = new JSONStorageManager()
    const products = await storage.getAllProducts()

    const totalProducts = products.length
    const activeProducts = products.filter((p: any) => p.status === 'active').length
    const inactiveProducts = products.filter((p: any) => p.status === 'inactive').length
    const totalInventory = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0)
    const totalCostValue = products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.originalPrice || p.price || 0)), 0)
    const totalSellingValue = products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.price || 0)), 0)
    const potentialProfit = totalSellingValue - totalCostValue
    const averageProfitMargin = totalSellingValue > 0 ? (potentialProfit / totalSellingValue) * 100 : 0

    const lowStockProducts = products
      .filter((p: any) => p.stock > 0 && p.stock <= 5)
      .sort((a: any, b: any) => a.stock - b.stock)
      .slice(0, 10)

    const outOfStockProducts = products.filter((p: any) => !p.stock || p.stock <= 0)

    const recentlyAdded = products
      .filter((p: any) => p.createdAt)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const recentlyUpdated = products
      .filter((p: any) => p.updatedAt)
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)

    const topSellingProducts = products
      .filter((p: any) => p.isBestSeller)
      .slice(0, 10)

    const reportData = {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalInventory,
      totalCostValue,
      totalSellingValue,
      potentialProfit,
      averageProfitMargin,
      lowStockProducts,
      outOfStockProducts,
      recentlyAdded,
      recentlyUpdated,
      topSellingProducts,
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
