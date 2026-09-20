// Parallel Kimo import - Multiple entry points to avoid timeout
import { NextRequest, NextResponse } from 'next/server'
import { ParallelKimoScraper } from '@/lib/importers/parallel-kimo-scraper'
import { KimoProductMapper } from '@/lib/importers/kimo-mapper'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== PARALLEL KIMO IMPORT STARTED ===')
    console.log('Scraping from multiple entry points to avoid timeout...')
    
    const scraper = new ParallelKimoScraper()
    const result = await scraper.scrapeFromMultipleEntryPoints(20) // 20 pages per entry point for deeper scanning
    
    console.log(`Scraping complete: ${result.products.length} unique products`)
    console.log(`Entry points scanned: ${result.entryPointsScanned}`)
    console.log(`Errors: ${result.errors.length}`)
    
    // Map to INFOGRA format with 9% markup
    console.log('Mapping products to INFOGRA format...')
    const mapper = new KimoProductMapper({
      pricing: {
        mode: 'percentage',
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
    
    const mappedProducts = result.products.map(kimoProduct => {
      const mappingResult = mapper.mapKimoProduct(kimoProduct)
      return mappingResult.product
    })
    
    console.log(`Mapped ${mappedProducts.length} products`)
    
    // Import to storage (use 'update' mode to skip NO products - update all)
    console.log('Importing to JSON storage...')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'update')
    
    const duration = Date.now() - startTime
    
    console.log('=== PARALLEL IMPORT COMPLETE ===')
    console.log(`Duration: ${duration}ms`)
    console.log(`Entry points scanned: ${result.entryPointsScanned}`)
    console.log(`Products discovered: ${result.totalProducts}`)
    console.log(`Unique products: ${result.products.length}`)
    console.log(`Products imported: ${importResult.productsImported}`)
    console.log(`Products skipped: ${importResult.productsSkipped}`)
    
    return NextResponse.json({
      success: true,
      duration,
      scrapeResults: {
        entryPointsScanned: result.entryPointsScanned,
        productsDiscovered: result.totalProducts,
        uniqueProducts: result.products.length,
        errors: result.errors
      },
      importResults: {
        productsImported: importResult.productsImported,
        productsUpdated: importResult.productsUpdated,
        productsSkipped: importResult.productsSkipped,
        productsFailed: importResult.productsFailed
      },
      categoryBreakdown: mappedProducts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      errors: importResult.errors,
      warnings: importResult.warnings
    })
    
  } catch (error) {
    console.error('Parallel import failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
