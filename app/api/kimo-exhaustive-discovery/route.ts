// Kimo Exhaustive Discovery + Import API
// Uses sitemap + dynamic category discovery + extraction + upsert
import { NextRequest, NextResponse } from 'next/server'
import { KimoDiscovery } from '@/lib/importers/discovery/kimo-discovery'
import { KimoScraper } from '@/lib/importers/kimo-scraper'
import { KimoProductMapper } from '@/lib/importers/kimo-mapper'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }

  const startTime = Date.now()

  try {
    console.log('=== KIMO EXHAUSTIVE DISCOVERY + IMPORT STARTED ===')

    // Phase 1: Discovery
    console.log('\n=== PHASE 1: DISCOVERY ===')
    const discovery = new KimoDiscovery(500) // 500ms delay
    const discoveryResult = await discovery.discoverAll()

    console.log('\nDiscovery Metrics:')
    console.log(`  Sitemap URLs: ${discoveryResult.metrics.sitemapUrls}`)
    console.log(`  Sitemap Products: ${discoveryResult.metrics.sitemapProducts}`)
    console.log(`  Category URLs: ${discoveryResult.metrics.categoryUrls}`)
    console.log(`  Listing Pages Crawled: ${discoveryResult.metrics.listingPagesCrawled}`)
    console.log(`  Product URLs Discovered: ${discoveryResult.metrics.productUrlsDiscovered}`)
    console.log(`  Unique Product URLs: ${discoveryResult.metrics.uniqueProductUrls}`)
    console.log(`  Duplicate URLs Removed: ${discoveryResult.metrics.duplicateUrlsRemoved}`)
    console.log(`  Failed URLs: ${discoveryResult.metrics.failedUrls}`)
    console.log(`  Discovery Duration: ${discoveryResult.metrics.duration}ms`)

    // Phase 2: Product Extraction
    console.log('\n=== PHASE 2: PRODUCT EXTRACTION ===')
    const scraper = new KimoScraper(500)
    const extractedProducts = []
    const extractionErrors = []

    console.log(`Extracting details for ${discoveryResult.products.length} products...`)

    for (let i = 0; i < discoveryResult.products.length; i++) {
      const discovered = discoveryResult.products[i]
      try {
        console.log(`  Extracting ${i + 1}/${discoveryResult.products.length}: ${discovered.id}`)
        const details = await scraper.scrapeProductDetails(discovered.url)

        // Ensure required fields are present
        if (details.name && details.price) {
          extractedProducts.push({
            id: discovered.id,
            url: discovered.url,
            ...details
          })
        } else {
          console.log(`    Skipping: missing required fields`)
          extractionErrors.push({ url: discovered.url, error: 'Missing required fields (name or price)' })
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`    Error: ${error}`)
        extractionErrors.push({ url: discovered.url, error: String(error) })
      }
    }

    console.log(`Successfully extracted: ${extractedProducts.length}`)
    console.log(`Failed extractions: ${extractionErrors.length}`)

    // Phase 3: Mapping
    console.log('\n=== PHASE 3: MAPPING ===')
    const mapper = new KimoProductMapper({
      pricing: {
        mode: 'percentage',
        value: 0 // No markup - use original prices
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

    const mappedProducts = extractedProducts
      .filter(p => p.name && p.price) // Filter out products without required fields
      .map(product => {
        const mappingResult = mapper.mapKimoProduct(product as any)
        return mappingResult.product
      })

    console.log(`Mapped ${mappedProducts.length} products`)

    // Phase 4: Import/Upsert
    console.log('\n=== PHASE 4: IMPORT/UPSERT ===')
    const storageManager = new JSONStorageManager()
    const importResult = await storageManager.importProducts(mappedProducts, 'update')

    const totalDuration = Date.now() - startTime

    console.log('\n=== KIMO EXHAUSTIVE IMPORT COMPLETE ===')
    console.log(`Total Duration: ${totalDuration}ms`)
    console.log(`Products Imported: ${importResult.productsImported}`)
    console.log(`Products Updated: ${importResult.productsUpdated}`)
    console.log(`Products Skipped: ${importResult.productsSkipped}`)
    console.log(`Products Failed: ${importResult.productsFailed}`)

    return NextResponse.json({
      success: true,
      duration: totalDuration,
      discovery: discoveryResult.metrics,
      extraction: {
        totalDiscovered: discoveryResult.products.length,
        successfullyExtracted: extractedProducts.length,
        failedExtractions: extractionErrors.length,
        errors: extractionErrors
      },
      import: importResult
    })

  } catch (error) {
    console.error('Exhaustive import failed:', error)
    const duration = Date.now() - startTime

    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
