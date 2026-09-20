// Test API for 100-product import
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
    console.log('=== KIMO 100-PRODUCT IMPORT TEST STARTED ===')
    
    // Step 1: Scrape products from multiple categories
    console.log('Step 1: Scraping products from Kimo...')
    const scraper = new KimoScraper(1000) // Faster for larger test
    
    // Get categories
    const categories = await scraper.scrapeCategories()
    console.log(`Found ${categories.length} categories`)
    
    // Scrape first 10 categories, 2 pages each to get ~100 products
    const allProducts: any[] = []
    const categoriesToScan = categories.slice(0, 10)
    
    for (const category of categoriesToScan) {
      console.log(`Scanning category: ${category.name}`)
      const products = await scraper.scrapeCategoryProducts(category.url, 2)
      allProducts.push(...products)
      console.log(`Found ${products.length} products in ${category.name}`)
      
      if (allProducts.length >= 100) break
    }
    
    console.log(`Total products scraped: ${allProducts.length}`)
    
    // Limit to 100 products for testing
    const testProducts = allProducts.slice(0, 100)
    console.log(`Testing with ${testProducts.length} products`)
    
    // Step 2: Map to INFOGRA format
    console.log('Step 2: Mapping products to INFOGRA format...')
    const mapper = new KimoProductMapper({
      pricing: {
        mode: 'unchanged',
        value: 20
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
      return mappingResult.product
    })
    
    console.log(`Mapped ${mappedProducts.length} products`)
    
    // Step 3: Import to JSON storage
    console.log('Step 3: Importing to JSON storage...')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    console.log('=== 100-PRODUCT IMPORT TEST COMPLETE ===')
    console.log(`Duration: ${duration}ms`)
    console.log(`Products imported: ${importResult.productsImported}`)
    console.log(`Products skipped: ${importResult.productsSkipped}`)
    console.log(`Categories added: ${importResult.categoriesAdded}`)
    console.log(`Brands added: ${importResult.brandsAdded}`)
    
    return NextResponse.json({
      success: true,
      duration,
      scrapeResults: {
        categoriesFound: categories.length,
        categoriesScanned: categoriesToScan.length,
        productsDiscovered: allProducts.length,
        productsTested: testProducts.length
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
    console.error('100-product import test failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}