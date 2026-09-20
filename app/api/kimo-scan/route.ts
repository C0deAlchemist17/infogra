// API Route for Kimo Catalog Scanning
// Test endpoint for scanning Kimo catalog

import { NextRequest, NextResponse } from 'next/server'
import { KimoScraper } from '@/lib/importers/kimo-scraper'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const searchParams = request.nextUrl.searchParams
    const maxPages = parseInt(searchParams.get('maxPages') || '1')
    const category = searchParams.get('category')

    const scraper = new KimoScraper(1000)

    if (category) {
      // Scan specific category
      const categoryUrl = `https://kimostore.net/${category}`
      const products = await scraper.scrapeCategoryProducts(categoryUrl, maxPages)
      
      return NextResponse.json({
        success: true,
        category,
        productsScanned: products.length,
        products: products.slice(0, 10) // Return first 10 for preview
      })
    } else {
      // Scan all categories (limited)
      const result = await scraper.scanFullCatalog(maxPages)
      
      return NextResponse.json({
        success: true,
        productsDiscovered: result.products.length,
        pagesScanned: result.pagesScanned,
        categoriesFound: result.categories.length,
        errors: result.errors.length,
        sampleProducts: result.products.slice(0, 5)
      })
    }

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
