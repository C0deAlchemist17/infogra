// Verification API to check if products appear in Store UI
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if products load from API
    const productsResponse = await fetch('http://localhost:3001/api/products?storage=true')
    const productsData = await productsResponse.json()
    
    // Check if store page is accessible
    const storeResponse = await fetch('http://localhost:3001/store')
    const storeAccessible = storeResponse.ok
    
    return NextResponse.json({
      success: true,
      apiWorking: productsData.success,
      productsInStorage: productsData.products?.length || 0,
      allFromKimo: productsData.products?.filter((p: any) => p.sourceMetadata?.source === 'Kimo Store').length || 0,
      hasSourceMetadata: productsData.products?.filter((p: any) => p.sourceMetadata).length || 0,
      hasSyncPrice: productsData.products?.filter((p: any) => p.syncPrice === true).length || 0,
      hasImages: productsData.products?.filter((p: any) => p.images && p.images.length > 0).length || 0,
      sampleProduct: productsData.products?.[0] || null,
      storeAccessible
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}