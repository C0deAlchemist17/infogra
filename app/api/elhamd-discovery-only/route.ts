// Elhamd Discovery Only - Fast discovery without extraction
import { NextRequest, NextResponse } from 'next/server'
import { ElhamdDiscovery } from '@/lib/importers/discovery/elhamd-discovery'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }

  try {
    console.log('=== ELHAMD DISCOVERY ONLY STARTED ===')
    const discovery = new ElhamdDiscovery(300) // 300ms delay for faster discovery
    const result = await discovery.discoverAll()

    console.log('\n=== DISCOVERY COMPLETE ===')
    console.log(`Unique products discovered: ${result.products.length}`)

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
      productCount: result.products.length,
      sampleProducts: result.products.slice(0, 10) // First 10 as sample
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
