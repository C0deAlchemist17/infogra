// Merge Kimo and Elhamd catalogs with deduplication
import { NextRequest, NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { CrossSourceDeduplicator } from '@/lib/importers/cross-source-deduplicator'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const startTime = Date.now()
  
  try {
    console.log('=== CROSS-SOURCE MERGE STARTED ===')
    
    const storageManager = new JSONStorageManager()
    
    // Load all products from storage
    const { products } = await storageManager.loadProducts()
    
    // Separate by source
    const kimoProducts = products.filter(p => p.sourceMetadata?.source === 'Kimo Store')
    const elhamdProducts = products.filter(p => p.sourceMetadata?.source === 'Elhamd Store')
    
    console.log(`Kimo products: ${kimoProducts.length}`)
    console.log(`Elhamd products: ${elhamdProducts.length}`)
    
    // Find duplicates
    const deduplicator = new CrossSourceDeduplicator()
    const duplicates = deduplicator.findDuplicates(kimoProducts, elhamdProducts)
    
    console.log(`Duplicates found: ${duplicates.length}`)
    
    // Merge products keeping cheaper ones
    const { mergedProducts, keptFrom } = deduplicator.mergeProducts(
      kimoProducts,
      elhamdProducts,
      duplicates
    )
    
    console.log(`Merged products: ${mergedProducts.length}`)
    console.log(`Kept from Kimo: ${keptFrom['Kimo Store'].length}`)
    console.log(`Kept from Elhamd: ${keptFrom['Elhamd Store'].length}`)
    
    // Backup current storage
    await storageManager.createBackup()
    
    // Update storage with merged products
    await storageManager.saveProducts(mergedProducts)
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      duration,
      mergeStats: {
        totalBefore: products.length,
        totalAfter: mergedProducts.length,
        duplicatesFound: duplicates.length,
        removedCount: products.length - mergedProducts.length
      },
      keptFrom,
      sampleDuplicates: duplicates.slice(0, 5).map(d => ({
        kimoName: d.kimoProduct.name,
        kimoPrice: d.kimoProduct.price,
        elhamdName: d.elhamdProduct.name,
        elhamdPrice: d.elhamdProduct.price,
        matchType: d.matchType,
        confidence: d.confidence
      }))
    })
    
  } catch (error) {
    console.error('Cross-source merge failed:', error)
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      duration,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}