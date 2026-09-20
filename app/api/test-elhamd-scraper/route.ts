// Test API for Elhamd scraper
import { NextRequest, NextResponse } from 'next/server'
import { ElhamdScraper } from '@/lib/importers/elhamd-scraper'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== ELHAMD SCRAPER TEST STARTED ===')
    
    const scraper = new ElhamdScraper(5000)
    const result = await scraper.quickTestScan()
    
    const duration = Date.now() - startTime
    
    console.log('=== ELHAMD SCRAPER TEST COMPLETE ===')
    console.log(`Duration: ${duration}ms`)
    console.log(`Categories found: ${result.categories.length}`)
    console.log(`Products discovered: ${result.products.length}`)
    console.log(`Errors: ${result.errors}`)
    
    return NextResponse.json({
      success: true,
      duration,
      categoriesFound: result.categories.length,
      productsDiscovered: result.products.length,
      errors: result.errors,
      categories: result.categories.slice(0, 10),
      sampleProducts: result.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        images: p.images.length,
        url: p.url
      }))
    })
    
  } catch (error) {
    console.error('Elhamd scraper test failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}