// Test API endpoint for Kimo scraper
// Run with: GET /api/test-kimo-scraper

import { NextRequest, NextResponse } from 'next/server'
import { KimoScraper } from '@/lib/importers/kimo-scraper'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== KIMO SCRAPER TEST STARTED ===')
    
    const scraper = new KimoScraper(2000)
    
    console.log('Starting quick test scan...')
    const result = await scraper.quickTestScan()
    
    const duration = Date.now() - startTime
    
    console.log('=== TEST RESULTS ===')
    console.log(`Duration: ${duration}ms`)
    console.log(`Categories found: ${result.categories.length}`)
    console.log(`Pages scanned: ${result.pagesScanned}`)
    console.log(`Products discovered: ${result.products.length}`)
    console.log(`Errors: ${result.errors.length}`)
    
    if (result.products.length > 0) {
      console.log('\n=== SAMPLE PRODUCTS ===')
      result.products.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`)
        console.log(`   Price: ${product.price} EGP`)
        console.log(`   Category: ${product.category}`)
        console.log(`   Brand: ${product.brand || 'N/A'}`)
        console.log(`   Images: ${product.images.length}`)
      })
    }
    
    return NextResponse.json({
      success: true,
      duration,
      results: {
        categoriesFound: result.categories.length,
        pagesScanned: result.pagesScanned,
        productsDiscovered: result.products.length,
        errors: result.errors.length
      },
      sampleCategories: result.categories.slice(0, 5),
      sampleProducts: result.products.slice(0, 5).map(p => ({
        name: p.name,
        url: p.url,
        price: p.price,
        category: p.category,
        brand: p.brand,
        images: p.images.length,
        hasDescription: !!p.description,
        hasSpecifications: !!p.specifications && Object.keys(p.specifications).length > 0,
        hasVariants: !!p.variants && p.variants.length > 0
      })),
      errors: result.errors
    })

  } catch (error) {
    console.error('Test failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}