// Batch Kimo import - process categories in batches to avoid timeout
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
  
  const searchParams = request.nextUrl.searchParams
  const startCategory = parseInt(searchParams.get('start') || '0')
  const batchSize = parseInt(searchParams.get('batch') || '10')
  const maxPages = parseInt(searchParams.get('pages') || '2')
  
  const startTime = Date.now()
  
  try {
    console.log(`=== BATCH KIMO IMPORT STARTED ===`)
    console.log(`Categories ${startCategory} to ${startCategory + batchSize - 1}`)
    
    const scraper = new KimoScraper(300)
    const categories = await scraper.scrapeCategories()
    console.log(`Total categories: ${categories.length}`)
    
    const batchCategories = categories.slice(startCategory, startCategory + batchSize)
    console.log(`Processing batch: ${batchCategories.length} categories`)
    
    const allProducts: any[] = []
    
    for (const category of batchCategories) {
      console.log(`Scanning: ${category.name}`)
      try {
        const products = await scraper.scrapeCategoryProducts(category.url, maxPages)
        allProducts.push(...products)
        console.log(`  Found ${products.length} products`)
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.error(`  Error: ${error}`)
      }
    }
    
    console.log(`Batch products: ${allProducts.length}`)
    
    const mapper = new KimoProductMapper({
      pricing: { mode: 'percentage', value: 20 },
      stockSync: false,
      fieldOverrides: {
        name: true, description: true, images: true,
        specifications: true, price: true, stock: false,
        category: true, brand: true
      }
    })
    
    const mappedProducts = allProducts.map(p => mapper.mapKimoProduct(p).product)
    
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'add')
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      duration,
      batchStart: startCategory,
      batchSize,
      categoriesProcessed: batchCategories.length,
      productsDiscovered: allProducts.length,
      productsImported: importResult.productsImported,
      productsSkipped: importResult.productsSkipped,
      totalCategories: categories.length,
      nextBatch: startCategory + batchSize < categories.length ? startCategory + batchSize : null
    })
    
  } catch (error) {
    console.error('Batch import failed:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}