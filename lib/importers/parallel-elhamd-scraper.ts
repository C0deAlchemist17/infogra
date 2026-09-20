// Parallel Elhamd Store Scraper - Starts from multiple category entry points
import { ElhamdScraper, ElhamdProduct } from './elhamd-scraper'

export class ParallelElhamdScraper {
  private baseUrl = 'https://elhamdstore.com'
  
  // Multiple entry points to start scraping from different categories
  private entryPoints = [
    'https://elhamdstore.com/product-category/all-in-one/',
    'https://elhamdstore.com/product-category/computer-accessories/',
    'https://elhamdstore.com/product-category/laptops/',
    'https://elhamdstore.com/product-category/monitor/',
    'https://elhamdstore.com/product-category/processor/',
    'https://elhamdstore.com/product-category/ram/',
    'https://elhamdstore.com/product-category/graphics-card/',
    'https://elhamdstore.com/product-category/motherboard/',
    'https://elhamdstore.com/product-category/hard-disk/',
    'https://elhamdstore.com/product-category/ssd/',
    'https://elhamdstore.com/product-category/keyboard/',
    'https://elhamdstore.com/product-category/mouse/',
    'https://elhamdstore.com/product-category/headset/',
    'https://elhamdstore.com/product-category/cctv-camera/',
    'https://elhamdstore.com/product-category/network/',
    'https://elhamdstore.com/product-category/speaker/',
    'https://elhamdstore.com/product-category/microphone/',
    'https://elhamdstore.com/product-category/webcam/',
    'https://elhamdstore.com/product-category/printer/',
    'https://elhamdstore.com/product-category/scanner/',
    'https://elhamdstore.com/product-category/tablet/',
    'https://elhamdstore.com/product-category/mobile/',
    'https://elhamdstore.com/product-category/headphones/',
    'https://elhamdstore.com/product-category/earbuds/'
  ]

  async scrapeFromMultipleEntryPoints(maxPagesPerCategory: number = 2): Promise<{
    products: ElhamdProduct[]
    totalProducts: number
    entryPointsScanned: number
    errors: string[]
  }> {
    const allProducts: ElhamdProduct[] = []
    const errors: string[] = []
    const scraper = new ElhamdScraper(3000) // 3 second delay

    console.log(`Starting parallel scrape from ${this.entryPoints.length} entry points...`)

    // Scrape from each entry point
    for (let i = 0; i < this.entryPoints.length; i++) {
      const entryPoint = this.entryPoints[i]
      console.log(`Scraping entry point ${i + 1}/${this.entryPoints.length}: ${entryPoint}`)

      try {
        const products = await scraper.scrapeCategoryProducts(entryPoint, maxPagesPerCategory)
        console.log(`  Found ${products.length} products`)
        allProducts.push(...products)
      } catch (error) {
        const errorMsg = `Error scraping ${entryPoint}: ${String(error)}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }

      // Small delay between entry points
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Remove duplicates by ID
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.id, p])).values()
    )

    console.log(`Total products found: ${allProducts.length}`)
    console.log(`Unique products after deduplication: ${uniqueProducts.length}`)

    return {
      products: uniqueProducts,
      totalProducts: allProducts.length,
      entryPointsScanned: this.entryPoints.length,
      errors
    }
  }
}
