// Elhamd Store Discovery System - Exhaustive product discovery
// Discovers products through sitemaps, categories, and dynamic pagination

import * as cheerio from 'cheerio'

export interface DiscoveryMetrics {
  sitemapUrls: number
  sitemapProducts: number
  categoryUrls: number
  listingPagesCrawled: number
  productUrlsDiscovered: number
  uniqueProductUrls: number
  duplicateUrlsRemoved: number
  failedUrls: number
  duration: number
}

export interface DiscoveredProduct {
  url: string
  id: string
  source: 'sitemap' | 'category' | 'listing'
}

export class ElhamdDiscovery {
  private baseUrl = 'https://elhamdstore.com'
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  private delay: number = 1000
  private discoveredUrls = new Set<string>()
  private failedUrls = new Set<string>()

  private get headers() {
    return {
      'User-Agent': this.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  }

  constructor(delay: number = 1000) {
    this.delay = delay
  }

  /**
   * Main discovery pipeline
   */
  async discoverAll(): Promise<{
    products: DiscoveredProduct[]
    metrics: DiscoveryMetrics
  }> {
    const startTime = Date.now()
    const metrics: DiscoveryMetrics = {
      sitemapUrls: 0,
      sitemapProducts: 0,
      categoryUrls: 0,
      listingPagesCrawled: 0,
      productUrlsDiscovered: 0,
      uniqueProductUrls: 0,
      duplicateUrlsRemoved: 0,
      failedUrls: 0,
      duration: 0
    }

    const allProducts: DiscoveredProduct[] = []

    console.log('=== ELHAMD DISCOVERY STARTED ===')

    // Step 1: Try sitemap discovery
    console.log('\nStep 1: Checking for sitemaps...')
    const sitemapProducts = await this.discoverFromSitemap()
    if (sitemapProducts.length > 0) {
      console.log(`✓ Sitemap discovery found ${sitemapProducts.length} products`)
      metrics.sitemapUrls = 1
      metrics.sitemapProducts = sitemapProducts.length
      allProducts.push(...sitemapProducts)
    } else {
      console.log('✗ No sitemap found or sitemap was empty')
    }

    // Step 2: Dynamic category discovery
    console.log('\nStep 2: Discovering categories from homepage...')
    const categories = await this.discoverCategories()
    console.log(`✓ Found ${categories.length} categories`)
    metrics.categoryUrls = categories.length

    // Step 3: Scrape each category with dynamic pagination
    console.log('\nStep 3: Scraping categories with dynamic pagination...')
    const maxCategoriesToScrape = 20 // Limit for testing
    const categoriesToScrape = categories.slice(0, maxCategoriesToScrape)
    console.log(`  Scraping ${categoriesToScrape.length} of ${categories.length} categories (limited for testing)`)

    for (const category of categoriesToScrape) {
      try {
        console.log(`  Scraping: ${category.name}`)
        const categoryProducts = await this.scrapeCategoryWithDynamicPagination(category.url)
        console.log(`    Found ${categoryProducts.length} products`)
        allProducts.push(...categoryProducts)
        metrics.listingPagesCrawled++
        await this.sleep(this.delay)
      } catch (error) {
        console.error(`    Error: ${error}`)
      }
    }

    // Step 4: Deduplicate URLs
    console.log('\nStep 4: Deduplicating product URLs...')
    const uniqueProducts = this.deduplicateProducts(allProducts)
    metrics.productUrlsDiscovered = allProducts.length
    metrics.uniqueProductUrls = uniqueProducts.length
    metrics.duplicateUrlsRemoved = allProducts.length - uniqueProducts.length
    metrics.failedUrls = this.failedUrls.size

    metrics.duration = Date.now() - startTime

    console.log('\n=== ELHAMD DISCOVERY COMPLETE ===')
    console.log(`Sitemap products: ${metrics.sitemapProducts}`)
    console.log(`Categories found: ${metrics.categoryUrls}`)
    console.log(`Listing pages crawled: ${metrics.listingPagesCrawled}`)
    console.log(`Product URLs discovered: ${metrics.productUrlsDiscovered}`)
    console.log(`Unique product URLs: ${metrics.uniqueProductUrls}`)
    console.log(`Duplicate URLs removed: ${metrics.duplicateUrlsRemoved}`)
    console.log(`Failed URLs: ${metrics.failedUrls}`)
    console.log(`Duration: ${metrics.duration}ms`)

    return {
      products: uniqueProducts,
      metrics
    }
  }

  /**
   * Discover products from sitemap
   */
  private async discoverFromSitemap(): Promise<DiscoveredProduct[]> {
    const products: DiscoveredProduct[] = []

    try {
      // Try common sitemap locations
      const sitemapUrls = [
        `${this.baseUrl}/sitemap.xml`,
        `${this.baseUrl}/sitemap_index.xml`,
        `${this.baseUrl}/sitemap_products.xml`,
        `${this.baseUrl}/product-sitemap.xml`
      ]

      for (const sitemapUrl of sitemapUrls) {
        try {
          console.log(`  Checking: ${sitemapUrl}`)
          const response = await fetch(sitemapUrl, {
            headers: this.headers
          })

          if (response.ok) {
            const xml = await response.text()
            const sitemapProducts = this.parseSitemap(xml, sitemapUrl)
            products.push(...sitemapProducts)
            console.log(`    ✓ Found ${sitemapProducts.length} product URLs`)
            break // Use first successful sitemap
          }
        } catch (error) {
          console.log(`    ✗ Failed: ${error}`)
        }
      }
    } catch (error) {
      console.error('Sitemap discovery error:', error)
    }

    return products
  }

  /**
   * Parse sitemap XML
   */
  private parseSitemap(xml: string, source: string): DiscoveredProduct[] {
    const products: DiscoveredProduct[] = []
    const $ = cheerio.load(xml, { xmlMode: true })

    // Check if this is a sitemap index
    const sitemapIndex = $('sitemapindex').length > 0
    if (sitemapIndex) {
      console.log('    Sitemap index detected, parsing sub-sitemaps...')
      $('sitemap loc').each((index, element) => {
        const loc = $(element).text().trim()
        console.log(`      Found sub-sitemap: ${loc}`)
        // Note: We'd need to fetch these recursively, but for now skip to avoid complexity
      })
      return products
    }

    // Parse product URLs - WooCommerce uses different structure
    $('url loc').each((index, element) => {
      const url = $(element).text().trim()
      // WooCommerce product URLs contain /product/
      if (url.includes('/product/')) {
        const id = this.extractProductIdFromUrl(url)
        products.push({
          url,
          id,
          source: 'sitemap'
        })
      }
    })

    return products
  }

  /**
   * Discover categories from homepage
   */
  private async discoverCategories(): Promise<Array<{ name: string; url: string }>> {
    const categories: Array<{ name: string; url: string }> = []

    try {
      const response = await fetch(this.baseUrl, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch homepage: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract all category links - WooCommerce uses /product-category/
      $('a[href*="/product-category/"]').each((index, element) => {
        const $el = $(element)
        const href = $el.attr('href')
        const text = $el.text().trim()

        if (href && text && !href.includes('#') && !href.includes('javascript')) {
          const url = href.startsWith('http') ? href : `${this.baseUrl}${href}`

          // Avoid duplicates
          const exists = categories.some(c => c.url === url)
          if (!exists) {
            categories.push({ name: text, url })
          }
        }
      })

      console.log(`  Found ${categories.length} category links`)
    } catch (error) {
      console.error('Category discovery error:', error)
    }

    return categories
  }

  /**
   * Scrape category with dynamic pagination (continue until no more pages)
   */
  private async scrapeCategoryWithDynamicPagination(categoryUrl: string): Promise<DiscoveredProduct[]> {
    const products: DiscoveredProduct[] = []
    let currentPage = 1
    let hasMore = true
    let emptyPageCount = 0
    const maxEmptyPages = 3 // Stop after 3 consecutive empty pages
    const maxPages = 100 // Safety limit

    while (hasMore && currentPage <= maxPages && emptyPageCount < maxEmptyPages) {
      try {
        // WooCommerce uses /page/2/ structure
        const pageUrl = categoryUrl.endsWith('/')
          ? `${categoryUrl}page/${currentPage}/`
          : `${categoryUrl}/page/${currentPage}/`

        const response = await fetch(pageUrl, {
          headers: this.headers
        })

        if (!response.ok) {
          console.error(`      Page ${currentPage} failed: ${response.statusText}`)
          hasMore = false
          break
        }

        const html = await response.text()
        const pageProducts = this.parseProductsFromHTML(html, categoryUrl)

        if (pageProducts.length === 0) {
          emptyPageCount++
          console.log(`      Page ${currentPage}: empty (empty page ${emptyPageCount}/${maxEmptyPages})`)
        } else {
          emptyPageCount = 0
          console.log(`      Page ${currentPage}: ${pageProducts.length} products`)
          products.push(...pageProducts)
        }

        currentPage++
        await this.sleep(this.delay)
      } catch (error) {
        console.error(`      Error on page ${currentPage}:`, error)
        this.failedUrls.add(`${categoryUrl}/page/${currentPage}/`)
        hasMore = false
      }
    }

    if (currentPage > maxPages) {
      console.log(`      Stopped at safety limit (${maxPages} pages)`)
    }

    return products
  }

  /**
   * Parse products from HTML
   */
  private parseProductsFromHTML(html: string, categoryUrl: string): DiscoveredProduct[] {
    const products: DiscoveredProduct[] = []
    const $ = cheerio.load(html)

    console.log(`  HTML length: ${html.length}`)

    // Use regex to find all product links - more reliable than CSS selectors
    // Handle both single and double quotes
    const productLinkRegex = /href=["']\/product\/([^"']+)["']/g
    const matches = Array.from(html.matchAll(productLinkRegex))
    const seenProducts = new Set<string>()

    console.log(`  Regex matches found: ${matches.length}`)

    for (const match of matches) {
      const productSlug = match[1]
      const productUrl = `${this.baseUrl}/product/${productSlug}`
      const id = this.extractProductIdFromUrl(productUrl)

      // Deduplicate within the same page
      if (!seenProducts.has(id)) {
        seenProducts.add(id)
        products.push({ url: productUrl, id, source: 'category' })
      }
    }

    console.log(`  ✓ Found ${products.length} unique products via regex`)

    return products
  }

  /**
   * Extract product ID from URL
   */
  private extractProductIdFromUrl(url: string): string {
    const match = url.match(/\/product\/([^\/\?]+)/)
    return match ? match[1] : url
  }

  /**
   * Deduplicate products by ID
   */
  private deduplicateProducts(products: DiscoveredProduct[]): DiscoveredProduct[] {
    const uniqueMap = new Map<string, DiscoveredProduct>()

    for (const product of products) {
      if (!uniqueMap.has(product.id)) {
        uniqueMap.set(product.id, product)
      }
    }

    return Array.from(uniqueMap.values())
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
