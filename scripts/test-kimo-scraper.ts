// Test script for Kimo scraper
// Run with: npx ts-node scripts/test-kimo-scraper.ts

import { KimoScraper } from '../lib/importers/kimo-scraper'

async function runTest() {
  console.log('=== KIMO SCRAPER TEST ===\n')
  
  const scraper = new KimoScraper(2000)
  
  try {
    console.log('Starting quick test scan...')
    const result = await scraper.quickTestScan()
    
    console.log('\n=== TEST RESULTS ===')
    console.log(`Categories found: ${result.categories.length}`)
    console.log(`Pages scanned: ${result.pagesScanned}`)
    console.log(`Products discovered: ${result.products.length}`)
    console.log(`Errors: ${result.errors.length}`)
    
    if (result.categories.length > 0) {
      console.log('\n=== CATEGORIES ===')
      result.categories.slice(0, 5).forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name}: ${cat.url}`)
      })
    }
    
    if (result.products.length > 0) {
      console.log('\n=== PRODUCTS ===')
      result.products.slice(0, 5).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`)
        console.log(`   URL: ${product.url}`)
        console.log(`   Price: ${product.price} ${product.currency}`)
        console.log(`   Category: ${product.category}`)
        console.log(`   Brand: ${product.brand || 'N/A'}`)
        console.log(`   Images: ${product.images.length}`)
        if (product.description) {
          console.log(`   Description: ${product.description.substring(0, 100)}...`)
        }
        if (product.specifications && Object.keys(product.specifications).length > 0) {
          console.log(`   Specifications: ${Object.keys(product.specifications).length} items`)
        }
        if (product.variants && product.variants.length > 0) {
          console.log(`   Variants: ${product.variants.length}`)
        }
      })
    }
    
    if (result.errors.length > 0) {
      console.log('\n=== ERRORS ===')
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.url}: ${error.message}`)
      })
    }
    
    console.log('\n=== TEST COMPLETE ===')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

runTest()
