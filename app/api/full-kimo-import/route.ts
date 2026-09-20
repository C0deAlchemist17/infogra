// Full Kimo catalog import - all categories
import { NextRequest, NextResponse } from 'next/server'
import { KimoScraper } from '@/lib/importers/kimo-scraper'
import { KimoProductMapper } from '@/lib/importers/kimo-mapper'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== FULL KIMO CATALOG IMPORT STARTED ===')
    console.log('This will scan ALL pages from ALL categories with complete product details')
    
    // Step 1: Use the new full catalog scan method
    console.log('Step 1: Starting complete catalog scan...')
    const scraper = new KimoScraper(2000) // 2 second delay for rate limiting
    const scrapeResult = await scraper.scanFullCatalog(1) // 1 page per category - AVOID TIMEOUT
    
    console.log(`Scanning complete: ${scrapeResult.products.length} products found`)
    console.log(`Pages scanned: ${scrapeResult.pagesScanned}`)
    console.log(`Errors: ${scrapeResult.errors.length}`)
    
    if (scrapeResult.errors.length > 0) {
      console.log('Errors encountered:', scrapeResult.errors.slice(0, 5))
    }
    
    // Step 2: Map to INFOGRA format
    console.log('Step 2: Mapping products to INFOGRA format...')
    const mapper = new KimoProductMapper({
      pricing: {
        mode: 'percentage', // Add 9% markup
        value: 9
      },
      stockSync: false,
      fieldOverrides: {
        name: true,
        description: true,
        images: true,
        specifications: true,
        price: true,
        stock: false,
        category: true,
        brand: true
      }
    })
    
    const mappedProducts = scrapeResult.products.map(kimoProduct => {
      const mappingResult = mapper.mapKimoProduct(kimoProduct)
      return mappingResult.product
    })
    
    console.log(`Mapped ${mappedProducts.length} products`)
    
    // Step 3: Import to JSON storage
    console.log('Step 3: Importing to JSON storage...')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    console.log('=== FULL IMPORT COMPLETE ===')
    console.log(`Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`)
    console.log(`Categories scanned: ${scrapeResult.categories.length}`)
    console.log(`Pages scanned: ${scrapeResult.pagesScanned}`)
    console.log(`Products discovered: ${scrapeResult.products.length}`)
    console.log(`Products imported: ${importResult.productsImported}`)
    console.log(`Products skipped: ${importResult.productsSkipped}`)
    console.log(`Products failed: ${importResult.productsFailed}`)
    
    return NextResponse.json({
      success: true,
      duration,
      scrapeResults: {
        categoriesFound: scrapeResult.categories.length,
        pagesScanned: scrapeResult.pagesScanned,
        productsDiscovered: scrapeResult.products.length,
        errors: scrapeResult.errors.length
      },
      mappingResults: {
        productsMapped: mappedProducts.length
      },
      importResults: {
        productsImported: importResult.productsImported,
        productsUpdated: importResult.productsUpdated,
        productsSkipped: importResult.productsSkipped,
        productsFailed: importResult.productsFailed,
        categoriesAdded: importResult.categoriesAdded,
        brandsAdded: importResult.brandsAdded
      },
      categoryBreakdown: mappedProducts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      brandBreakdown: mappedProducts.reduce((acc, p) => {
        acc[p.brand] = (acc[p.brand] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      errors: importResult.errors,
      warnings: importResult.warnings
    })

  } catch (error) {
    console.error('Full import failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}