// Kimo Store Product Scraper
// Scrapes publicly accessible product data from kimostore.net

import * as cheerio from 'cheerio'

export interface KimoProduct {
  id: string
  sku?: string
  name: string
  url: string
  price: number
  originalPrice?: number
  currency: string
  category: string
  subcategory: string
  brand?: string
  description?: string
  specifications?: Record<string, string>
  images: string[]
  stock?: string
  availability?: string
  warranty?: string
  condition?: string
  tags?: string[]
  variants?: Array<{
    name: string
    value: string
    price?: number
    sku?: string
    available: boolean
  }>
}

export interface KimoCategory {
  name: string
  url: string
  subcategories: Array<{
    name: string
    url: string
  }>
}

export interface KimoScrapeResult {
  products: KimoProduct[]
  categories: KimoCategory[]
  pagesScanned: number
  errors: Array<{ url: string; message: string }>
}

export class KimoScraper {
  private baseUrl = 'https://kimostore.net'
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  private delay: number = 2000 // Increased to 2 seconds for safety

  constructor(delay: number = 2000) {
    this.delay = delay
  }

  /**
   * Scrape all categories from Kimo Store homepage
   */
  async scrapeCategories(): Promise<KimoCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        headers: {
          'User-Agent': this.userAgent
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch homepage: ${response.statusText}`)
      }

      const html = await response.text()
      return this.parseCategoriesFromHTML(html)
    } catch (error) {
      console.error('Error scraping categories:', error)
      throw error
    }
  }

  /**
   * Parse categories from HTML using cheerio
   */
  private parseCategoriesFromHTML(html: string): KimoCategory[] {
    const $ = cheerio.load(html)
    const categories: KimoCategory[] = []
    
    // Parse category links - Kimo uses /collections/ structure
    $('a[href*="/collections/"]').each((index, element) => {
      const $el = $(element)
      const href = $el.attr('href')
      const text = $el.text().trim()
      
      if (href && text && !href.includes('#') && !href.includes('javascript')) {
        const url = href.startsWith('http') ? href : `${this.baseUrl}${href}`
        
        // Avoid duplicates
        const exists = categories.some(c => c.url === url)
        if (!exists) {
          categories.push({
            name: text,
            url: url,
            subcategories: []
          })
        }
      }
    })

    return categories
  }

  /**
   * Scrape products from a category page
   */
  async scrapeCategoryProducts(categoryUrl: string, maxPages: number = 10): Promise<KimoProduct[]> {
    const products: KimoProduct[] = []
    let currentPage = 1
    let hasMore = true

    while (hasMore && currentPage <= maxPages) {
      try {
        const pageUrl = categoryUrl.includes('?') 
          ? `${categoryUrl}&page=${currentPage}`
          : `${categoryUrl}?page=${currentPage}`

        const response = await fetch(pageUrl, {
          headers: {
            'User-Agent': this.userAgent
          }
        })

        if (!response.ok) {
          console.error(`Failed to fetch page ${currentPage}: ${response.statusText}`)
          hasMore = false
          break
        }

        const html = await response.text()
        const pageProducts = this.parseProductsFromHTML(html, categoryUrl)

        if (pageProducts.length === 0) {
          hasMore = false
        } else {
          products.push(...pageProducts)
          currentPage++
          
          // Rate limiting
          await this.sleep(this.delay)
        }
      } catch (error) {
        console.error(`Error scraping page ${currentPage}:`, error)
        hasMore = false
      }
    }

    return products
  }

  /**
   * Parse products from HTML using cheerio
   */
  private parseProductsFromHTML(html: string, categoryUrl: string): KimoProduct[] {
    const $ = cheerio.load(html)
    const products: KimoProduct[] = []
    
    // Kimo uses .product-item class
    const $products = $('.product-item, .dpb-card, .product-collection__item')
    
    console.log(`Found ${$products.length} product items`)
    
    $products.each((index, element) => {
      const $el = $(element)
      
      // Extract product URL - Kimo uses /products/ structure
      const $link = $el.find('a[href*="/products/"]').first()
      const href = $link.attr('href')
      
      if (!href) return
      
      const productUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`
      
      // Extract product name - Kimo uses .product-title
      const $name = $el.find('.product-title, .card-content h3, h3, h4').first()
      const name = $name.text().trim()
      
      if (!name) return
      
      // Extract price - Kimo uses .product-price
      const $price = $el.find('.product-price, .price, .card-content .price').first()
      const priceText = $price.text().replace(/[^\d.]/g, '')
      const price = parseFloat(priceText) || 0
      
      // Extract original price if available
      const $originalPrice = $el.find('.original-price, .old-price, del, .compare-at-price').first()
      const originalPriceText = $originalPrice.text().replace(/[^\d.]/g, '')
      const originalPrice = parseFloat(originalPriceText) || undefined
      
      // Extract image - Kimo uses .product-image
      const $img = $el.find('.product-image img, .card-image img, img').first()
      const imgSrc = $img.attr('src') || $img.attr('data-src')
      const imageUrl = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `${this.baseUrl}${imgSrc}`) : ''
      
      // Extract brand if available - try multiple selectors
      const $brand = $el.find('.brand, [class*="brand"], .card-content .brand, .product-brand, .vendor').first()
      const brand = $brand.text().trim() || undefined
      
      // If no brand found in the card, try to extract from product name or URL
      let finalBrand = brand
      if (!finalBrand) {
        // Try to extract brand from product name (common pattern: "Brand Product Name")
        const brandMatch = name.match(/^([A-Z][A-Z0-9\s]+)\s+/)
        if (brandMatch) {
          finalBrand = brandMatch[1].trim()
        }
      }
      
      // Extract category from URL
      const category = this.extractCategoryFromUrl(categoryUrl)
      
      // Extract SKU if available
      const $sku = $el.find('.sku, [class*="sku"]').first()
      const sku = $sku.text().trim() || undefined
      
      products.push({
        id: this.generateProductId(productUrl),
        sku: sku,
        name: name,
        url: productUrl,
        price: price,
        originalPrice: originalPrice,
        currency: 'EGP',
        category: category,
        subcategory: '',
        brand: finalBrand,
        images: imageUrl ? [imageUrl] : [],
        stock: 'In Stock',
        availability: 'available'
      })
    })

    return products
  }

  /**
   * Scrape detailed product information from a product page
   */
  async scrapeProductDetails(productUrl: string): Promise<Partial<KimoProduct>> {
    try {
      const response = await fetch(productUrl, {
        headers: {
          'User-Agent': this.userAgent
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`)
      }

      const html = await response.text()
      return this.parseProductDetailsFromHTML(html)
    } catch (error) {
      console.error('Error scraping product details:', error)
      return {}
    }
  }

  /**
   * Parse product details from HTML using cheerio
   */
  private parseProductDetailsFromHTML(html: string): Partial<KimoProduct> {
    const $ = cheerio.load(html)
    const details: Partial<KimoProduct> = {}
    
    // First, try to extract JSON-LD structured data
    const jsonLdData = this.extractJsonLd(html)
    if (jsonLdData) {
      return this.parseJsonLdProduct(jsonLdData)
    }
    
    // Fallback to HTML parsing
    // Extract description - Kimo might use various selectors
    const $desc = $('.product-description, .description, [class*="description"], .product-details').first()
    details.description = this.cleanText($desc.text())
    
    // Extract specifications from table - Kimo might use different class names
    const $specs = $('.product-specs, .specifications, table.specs, .product-details table').first()
    const specifications: Record<string, string> = {}
    
    $specs.find('tr').each((index, row) => {
      const $row = $(row)
      const $cells = $row.find('td, th')
      
      if ($cells.length >= 2) {
        const key = this.cleanText($cells.eq(0).text())
        const value = this.cleanText($cells.eq(1).text())
        if (key && value) {
          specifications[key] = value
        }
      }
    })
    
    if (Object.keys(specifications).length > 0) {
      details.specifications = specifications
    }
    
    // Extract brand
    const $brand = $('.product-brand, .brand, [class*="brand"]').first()
    details.brand = this.cleanText($brand.text()) || undefined
    
    // Extract warranty
    const $warranty = $('.product-warranty, .warranty, [class*="warranty"]').first()
    details.warranty = this.cleanText($warranty.text()) || undefined
    
    // Extract all gallery images
    const images: string[] = []
    $('.product-gallery img, .gallery img, [class*="gallery"] img, .product-image img').each((index, img) => {
      const $img = $(img)
      const src = $img.attr('src') || $img.attr('data-src')
      if (src) {
        const imageUrl = src.startsWith('http') ? src : `${this.baseUrl}${src}`
        images.push(imageUrl)
      }
    })
    
    if (images.length > 0) {
      details.images = Array.from(new Set(images)) // Remove duplicates
    }
    
    // Extract variants if available
    const variants: Array<{ name: string; value: string; price?: number; sku?: string; available: boolean }> = []
    $('.variant-option, [class*="variant"], .swatch, .product-variant').each((index, element) => {
      const $el = $(element)
      const name = $el.attr('data-name') || $el.find('label').text().trim()
      const value = $el.attr('data-value') || $el.text().trim()
      const available = !$el.hasClass('out-of-stock') && !$el.hasClass('disabled')
      
      if (name && value) {
        variants.push({ name, value, available })
      }
    })
    
    if (variants.length > 0) {
      details.variants = variants
    }

    return details
  }

  /**
   * Extract JSON-LD structured data from HTML
   */
  private extractJsonLd(html: string): any {
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
    const matches = Array.from(html.matchAll(jsonLdRegex))
    
    for (const match of matches) {
      try {
        const data = JSON.parse(match[1])
        if (data['@type'] === 'Product' || data['@type'] === 'ProductModel') {
          return data
        }
      } catch (error) {
        // Invalid JSON, skip
      }
    }
    
    return null
  }

  /**
   * Parse product from JSON-LD data
   */
  private parseJsonLdProduct(data: any): Partial<KimoProduct> {
    const details: Partial<KimoProduct> = {}
    
    if (data.name) details.name = data.name
    if (data.description) details.description = this.cleanText(data.description)
    if (data.brand) details.brand = data.brand.name || data.brand
    if (data.offers && data.offers[0]) {
      const offer = data.offers[0]
      if (offer.price) details.price = parseFloat(offer.price)
      if (offer.priceCurrency) details.currency = offer.priceCurrency
      if (offer.availability) {
        details.availability = offer.availability
        details.stock = offer.availability.includes('InStock') ? 'In Stock' : 'Out of Stock'
      }
    }
    if (data.image) {
      details.images = Array.isArray(data.image) ? data.image : [data.image]
    }
    if (data.sku) details.sku = data.sku
    
    // Extract specifications from additionalProperty
    if (data.additionalProperty) {
      const specifications: Record<string, string> = {}
      data.additionalProperty.forEach((prop: any) => {
        if (prop.name && prop.value) {
          specifications[prop.name] = prop.value
        }
      })
      if (Object.keys(specifications).length > 0) {
        details.specifications = specifications
      }
    }
    
    return details
  }

  /**
   * Full catalog scan - COMPLETE SCAN (without product details to avoid timeout)
   */
  async scanFullCatalog(maxPagesPerCategory: number = 50): Promise<KimoScrapeResult> {
    const result: KimoScrapeResult = {
      products: [],
      categories: [],
      pagesScanned: 0,
      errors: []
    }

    try {
      // First, get all categories
      console.log('Scanning categories...')
      result.categories = await this.scrapeCategories()
      console.log(`Found ${result.categories.length} categories`)
      
      // Then scrape products from each category
      for (const category of result.categories) {
        try {
          console.log(`Scanning category: ${category.name}`)
          const products = await this.scrapeCategoryProducts(category.url, maxPagesPerCategory)
          console.log(`Found ${products.length} products in ${category.name}`)
          result.products.push(...products)
          result.pagesScanned++
          
          // Rate limiting between categories
          await this.sleep(this.delay * 2)
        } catch (error) {
          result.errors.push({
            url: category.url,
            message: String(error)
          })
        }
      }

      // Skip individual product details fetch (too slow - causes timeout)
      console.log(`Total products found: ${result.products.length}`)
      console.log('Skipping individual product details fetch to avoid timeout')

    } catch (error) {
      console.error('Error during full catalog scan:', error)
    }

    return result
  }

  /**
   * Quick test scan - scan only first category, 1 page
   */
  async quickTestScan(): Promise<KimoScrapeResult> {
    const result: KimoScrapeResult = {
      products: [],
      categories: [],
      pagesScanned: 0,
      errors: []
    }

    try {
      console.log('Starting quick test scan...')
      
      // Get categories
      result.categories = await this.scrapeCategories()
      console.log(`Found ${result.categories.length} categories`)
      
      if (result.categories.length === 0) {
        console.log('No categories found, trying direct URL scan')
        // Try scanning a known category directly
        const testUrl = `${this.baseUrl}/collections/processor`
        const products = await this.scrapeCategoryProducts(testUrl, 1)
        result.products.push(...products)
        result.pagesScanned = 1
      } else {
        // Scan first category only
        const firstCategory = result.categories[0]
        console.log(`Scanning first category: ${firstCategory.name}`)
        const products = await this.scrapeCategoryProducts(firstCategory.url, 1)
        result.products.push(...products)
        result.pagesScanned = 1
      }

      // Get details for first 5 products
      console.log('Fetching details for first 5 products...')
      for (let i = 0; i < Math.min(5, result.products.length); i++) {
        try {
          const details = await this.scrapeProductDetails(result.products[i].url)
          result.products[i] = { ...result.products[i], ...details }
          await this.sleep(this.delay)
        } catch (error) {
          result.errors.push({
            url: result.products[i].url,
            message: String(error)
          })
        }
      }

    } catch (error) {
      console.error('Error during quick test scan:', error)
      result.errors.push({
        url: 'Quick Test',
        message: String(error)
      })
    }

    return result
  }

  /**
   * Generate a unique product ID from URL
   */
  private generateProductId(url: string): string {
    const match = url.match(/\/products\/([^\/\?]+)/)
    return match ? match[1] : url
  }

  /**
   * Extract category name from URL
   */
  private extractCategoryFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/').filter(Boolean)
      
      // Kimo uses /collections/category-name structure
      // Extract the collection name as the category
      if (pathParts[0] === 'collections' && pathParts[1]) {
        return pathParts[1].replace(/-/g, ' ')
      }
      
      // Fallback to first path segment
      return pathParts[0]?.replace(/-/g, ' ') || 'Uncategorized'
    } catch {
      return 'Uncategorized'
    }
  }

  /**
   * Clean text from HTML
   */
  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp;
      .replace(/&amp;/g, '&') // Replace &amp;
      .replace(/&lt;/g, '<') // Replace &lt;
      .replace(/&gt;/g, '>') // Replace &gt;
      .replace(/\s+/g, ' ') // Replace multiple spaces
      .trim()
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
