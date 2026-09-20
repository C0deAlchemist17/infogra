// Full Kimo catalog import - all categories, all pages
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
  const maxPagesPerCategory = 3 // Scan up to 3 pages per category
  const delayBetweenRequests = 500 // 500ms delay to avoid rate limiting
  
  try {
    console.log('=== FULL KIMO CATALOG IMPORT STARTED ===')
    
    const scraper = new KimoScraper(300)
    const categories = await scraper.scrapeCategories()
    console.log(`Total categories discovered: ${categories.length}`)
    
    const allProducts: any[] = []
    const categoryStats: Record<string, number> = {}
    
    // Process all categories
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      console.log(`[${i + 1}/${categories.length}] Scanning: ${category.name}`)
      
      try {
        const products = await scraper.scrapeCategoryProducts(category.url, maxPagesPerCategory)
        allProducts.push(...products)
        categoryStats[category.name] = products.length
        console.log(`  Found ${products.length} products`)
        
        // Rate limiting delay
        if (i < categories.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenRequests))
        }
      } catch (error) {
        console.error(`  Error scanning ${category.name}:`, error)
        categoryStats[category.name] = 0
      }
    }
    
    console.log(`Total products discovered: ${allProducts.length}`)
    
    // Remove duplicates by ID
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.id, p])).values()
    )
    console.log(`Unique products after deduplication: ${uniqueProducts.length}`)
    
    // Map to INFOGRA format with no markup
    const mapper = new KimoProductMapper({
      pricing: {
        mode: 'unchanged',
        value: 0
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
    
    const mappedProducts = uniqueProducts.map(p => mapper.mapKimoProduct(p).product)
    
    // Import to storage
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      duration,
      catalogStats: {
        totalCategories: categories.length,
        categoriesScanned: categories.length,
        productsDiscovered: allProducts.length,
        uniqueProducts: uniqueProducts.length,
        categoryBreakdown: categoryStats
      },
      importResults: {
        productsImported: importResult.productsImported,
        productsUpdated: importResult.productsUpdated,
        productsSkipped: importResult.productsSkipped,
        productsFailed: importResult.productsFailed,
        categoriesAdded: importResult.categoriesAdded,
        brandsAdded: importResult.brandsAdded
      },
      errors: importResult.errors,
      warnings: importResult.warnings
    })
    
  } catch (error) {
    console.error('Full catalog import failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}