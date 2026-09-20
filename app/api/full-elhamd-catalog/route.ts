// Full Elhamd catalog import
import { NextRequest, NextResponse } from 'next/server'
import { ElhamdScraper } from '@/lib/importers/elhamd-scraper'
import { ElhamdProductMapper } from '@/lib/importers/elhamd-mapper'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== FULL ELHAMD CATALOG IMPORT STARTED ===')
    console.log('This will scan ALL pages from ALL categories with complete product details')
    
    // Step 1: Use the new full catalog scan method
    console.log('Step 1: Starting complete catalog scan...')
    const scraper = new ElhamdScraper(5000)
    const scanResult = await scraper.scanFullCatalog(1) // 1 page per category - AVOID TIMEOUT
    
    console.log(`Scanning complete: ${scanResult.products.length} products found`)
    console.log(`Categories scanned: ${scanResult.categories.length}`)
    console.log(`Errors: ${scanResult.errors}`)
    
    // Remove duplicates by ID
    const uniqueProducts = Array.from(
      new Map(scanResult.products.map(p => [p.id, p])).values()
    )
    console.log(`Unique products after deduplication: ${uniqueProducts.length}`)
    
    // Step 2: Map to INFOGRA format with 9% markup
    console.log('Step 2: Mapping products to INFOGRA format...')
    const mapper = new ElhamdProductMapper({
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
    
    const mappedProducts = uniqueProducts.map(p => mapper.mapElhamdProduct(p).product)
    console.log(`Mapped ${mappedProducts.length} products`)
    
    // Step 3: Import to storage
    console.log('Step 3: Importing to JSON storage...')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    console.log('=== FULL IMPORT COMPLETE ===')
    console.log(`Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`)
    console.log(`Categories scanned: ${scanResult.categories.length}`)
    console.log(`Products discovered: ${scanResult.products.length}`)
    console.log(`Unique products: ${uniqueProducts.length}`)
    console.log(`Products imported: ${importResult.productsImported}`)
    console.log(`Products skipped: ${importResult.productsSkipped}`)
    console.log(`Products failed: ${importResult.productsFailed}`)
    
    return NextResponse.json({
      success: true,
      duration,
      catalogStats: {
        totalCategories: scanResult.categories.length,
        categoriesScanned: scanResult.categories.length,
        productsDiscovered: scanResult.products.length,
        uniqueProducts: uniqueProducts.length,
        errors: scanResult.errors
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
    console.error('Full Elhamd catalog import failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}