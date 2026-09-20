// Parallel Kimo Store Scraper - Starts from multiple category entry points
import { KimoScraper, KimoProduct } from './kimo-scraper'

export class ParallelKimoScraper {
  private baseUrl = 'https://kimostore.net'
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  
  // Multiple entry points to start scraping from different categories
  private entryPoints = [
    'https://kimostore.net/collections/processor',
    'https://kimostore.net/collections/graphics-card',
    'https://kimostore.net/collections/ram',
    'https://kimostore.net/collections/monitor',
    'https://kimostore.net/collections/laptops',
    'https://kimostore.net/collections/desktops',
    'https://kimostore.net/collections/keyboard',
    'https://kimostore.net/collections/mice',
    'https://kimostore.net/collections/headset',
    'https://kimostore.net/collections/case',
    'https://kimostore.net/collections/networking',
    'https://kimostore.net/collections/printer',
    'https://kimostore.net/collections/internal-hard-disk',
    'https://kimostore.net/collections/motherboard',
    'https://kimostore.net/collections/power-supply-pc',
    'https://kimostore.net/collections/ssd',
    'https://kimostore.net/collections/external-hard-disk',
    'https://kimostore.net/collections/sound-card',
    'https://kimostore.net/collections/webcam',
    'https://kimostore.net/collections/speaker',
    'https://kimostore.net/collections/microphone',
    'https://kimostore.net/collections/adapter',
    'https://kimostore.net/collections/cable',
    'https://kimostore.net/collections/software',
    'https://kimostore.net/collections/tablet',
    'https://kimostore.net/collections/console',
    'https://kimostore.net/collections/headphones',
    'https://kimostore.net/collections/earbuds'
  ]

  async scrapeFromMultipleEntryPoints(maxPagesPerCategory: number = 2): Promise<{
    products: KimoProduct[]
    totalProducts: number
    entryPointsScanned: number
    errors: string[]
  }> {
    const allProducts: KimoProduct[] = []
    const errors: string[] = []
    const scraper = new KimoScraper(1000) // 1 second delay

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
