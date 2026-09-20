// Kimo Discovery Only - Fast discovery without extraction
import { NextRequest, NextResponse } from 'next/server'
import { KimoDiscovery } from '@/lib/importers/discovery/kimo-discovery'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }

  try {
    console.log('=== KIMO DISCOVERY ONLY STARTED ===')
    const discovery = new KimoDiscovery(500) // 500ms delay
    const result = await discovery.discoverAll()

    console.log('\n=== DISCOVERY COMPLETE ===')
    console.log(`Unique products discovered: ${result.products.length}`)

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
      productCount: result.products.length,
      sampleProducts: result.products.slice(0, 20) // First 20 as sample
    })
  } catch (error) {
    console.error('Discovery failed:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
