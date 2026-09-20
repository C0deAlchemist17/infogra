// Test API for complete import process (5 products)
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
    console.log('=== KIMO IMPORT TEST STARTED ===')
    
    // Step 1: Scrape 5 products
    console.log('Step 1: Scraping products...')
    const scraper = new KimoScraper(2000)
    const scrapeResult = await scraper.quickTestScan()
    
    console.log(`Scraped ${scrapeResult.products.length} products`)
    
    // Limit to 5 products for testing
    const testProducts = scrapeResult.products.slice(0, 5)
    console.log(`Testing with ${testProducts.length} products`)
    
    // Step 2: Map to INFOGRA format
    console.log('Step 2: Mapping products to INFOGRA format...')
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
    
    const mappedProducts = testProducts.map(kimoProduct => {
      const mappingResult = mapper.mapKimoProduct(kimoProduct)
      console.log(`Mapped: ${kimoProduct.name} -> ${mappingResult.product.category}`)
      return mappingResult.product
    })
    
    // Step 3: Import to JSON storage
    console.log('Step 3: Importing to JSON storage...')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    console.log('=== IMPORT TEST COMPLETE ===')
    console.log(`Duration: ${duration}ms`)
    console.log(`Products imported: ${importResult.productsImported}`)
    console.log(`Categories added: ${importResult.categoriesAdded}`)
    console.log(`Brands added: ${importResult.brandsAdded}`)
    
    return NextResponse.json({
      success: true,
      duration,
      scrapeResults: {
        categoriesFound: scrapeResult.categories.length,
        productsDiscovered: scrapeResult.products.length,
        errors: scrapeResult.errors.length
      },
      mappingResults: {
        productsMapped: mappedProducts.length,
        sampleMappings: mappedProducts.map(p => ({
          kimoName: testProducts.find(kp => kp.id === p.id)?.name,
          infograName: p.name,
          kimoCategory: testProducts.find(kp => kp.id === p.id)?.category,
          infograCategory: p.category,
          kimoPrice: testProducts.find(kp => kp.id === p.id)?.price,
          infograPrice: p.price,
          markup: p.price - (testProducts.find(kp => kp.id === p.id)?.price || 0)
        }))
      },
      importResults: {
        productsImported: importResult.productsImported,
        productsUpdated: importResult.productsUpdated,
        productsSkipped: importResult.productsSkipped,
        productsFailed: importResult.productsFailed,
        categoriesAdded: importResult.categoriesAdded,
        brandsAdded: importResult.brandsAdded
      },
      sampleProducts: mappedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        brand: p.brand,
        images: p.images.length
      })),
      errors: importResult.errors,
      warnings: importResult.warnings
    })

  } catch (error) {
    console.error('Import test failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}