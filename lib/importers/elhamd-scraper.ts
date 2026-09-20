// Elhamd Store Scraper - WooCommerce-based scraper
import * as cheerio from 'cheerio'

export interface ElhamdProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  brand?: string
  stock?: string
  sku?: string
  url: string
  specifications: Record<string, any>
}

export class ElhamdScraper {
  private baseUrl: string
  private timeout: number

  constructor(timeout: number = 3000) {
    this.baseUrl = 'https://elhamdstore.com'
    this.timeout = timeout
  }

  private async fetchWithTimeout(url: string): Promise<string> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async scrapeCategories(): Promise<Array<{ name: string; url: string }>> {
    try {
      const html = await this.fetchWithTimeout(`${this.baseUrl}/shop/`)
      const $ = cheerio.load(html)
      const categories: Array<{ name: string; url: string }> = []

      // WooCommerce categories typically have class 'product-category'
      $('.product-category a').each((_, element) => {
        const $el = $(element)
        const name = $el.find('.woocommerce-loop-category__title').text().trim()
        const url = $el.attr('href')
        
        if (name && url) {
          categories.push({ name, url })
        }
      })

      // Also check for sidebar categories
      $('.product-categories li a').each((_, element) => {
        const $el = $(element)
        const name = $el.text().trim()
        const url = $el.attr('href')
        
        if (name && url && !categories.find(c => c.url === url)) {
          categories.push({ name, url })
        }
      })

      return categories
    } catch (error) {
      console.error('Error scraping Elhamd categories:', error)
      return []
    }
  }

  async scrapeCategoryProducts(categoryUrl: string, maxPages: number = 50): Promise<ElhamdProduct[]> {
    const allProducts: ElhamdProduct[] = []

    for (let page = 1; page <= maxPages; page++) {
      try {
        const pageUrl = page === 1 ? categoryUrl : `${categoryUrl}page/${page}/`
        const html = await this.fetchWithTimeout(pageUrl)
        const $ = cheerio.load(html)

        // WooCommerce product items - try multiple selectors
        const productSelectors = [
          '.product',
          '.type-product',
          '.product-item',
          '.woocommerce-loop-product'
        ]

        let foundProducts = false
        for (const selector of productSelectors) {
          const $products = $(selector)
          if ($products.length > 0) {
            $products.each((_, element) => {
              const $el = $(element)
              const productLink = $el.find('a').first()
              const productUrl = productLink.attr('href')
              const productName = $el.find('.woocommerce-loop-product__title').text().trim() || 
                               $el.find('.product-title').text().trim() ||
                               $el.find('h2').text().trim() ||
                               $el.find('h3').text().trim()

              if (productUrl && productName) {
                allProducts.push({
                  id: this.generateId(productUrl),
                  name: productName,
                  price: 0, // Will be updated from product page
                  description: '',
                  images: [],
                  category: '',
                  url: productUrl,
                  specifications: {}
                })
                foundProducts = true
              }
            })
            break
          }
        }

        // Check if there's a next page
        const nextPageLink = $('.next.page-numbers').attr('href')
        if (!nextPageLink || page >= maxPages || !foundProducts) {
          break
        }

        // Delay between pages
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error scraping Elhamd category page ${page}:`, error)
      }
    }

    return allProducts
  }

  async scrapeProductDetails(productUrl: string): Promise<Partial<ElhamdProduct>> {
    try {
      const html = await this.fetchWithTimeout(productUrl)
      const $ = cheerio.load(html)

      // Extract product name
      const name = $('.product_title').text().trim() || $('.entry-title').text().trim() || $('h1.product_title').text().trim()

      // Extract price
      let price = 0
      let originalPrice: number | undefined

      const priceEl = $('.price .amount').first()
      if (priceEl.length) {
        const priceText = priceEl.text().replace(/[^\d.]/g, '')
        price = parseFloat(priceText) || 0
      }

      // Check for sale price
      const delPriceEl = $('.price del .amount').first()
      if (delPriceEl.length) {
        const delPriceText = delPriceEl.text().replace(/[^\d.]/g, '')
        originalPrice = parseFloat(delPriceText) || undefined
      }

      // Extract description
      const description = $('.woocommerce-product-details__short-description').text().trim() ||
                         $('.product-description').text().trim() ||
                         $('.entry-summary').text().trim()

      // Extract images
      const images: string[] = []
      $('.woocommerce-product-gallery__image img').each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src')
        if (src) {
          images.push(src)
        }
      })

      // Extract category
      const category = $('.posted_in a').first().text().trim() ||
                      $('.product-category a').first().text().trim() ||
                      $('.product_cat a').first().text().trim()

      // Extract SKU
      const sku = $('.sku').text().trim().replace('SKU:', '').trim()

      // Extract stock status
      const stock = $('.stock').text().trim()

      // Ensure required fields
      if (!name) {
        console.warn(`Missing name for ${productUrl}`)
      }
      if (price === 0) {
        console.warn(`Missing price for ${productUrl}`)
      }

      return {
        id: this.generateId(productUrl),
        name: name || 'Unknown Product',
        price: price || 0,
        originalPrice,
        description: description || '',
        images: images.length > 0 ? images : [],
        category: category || 'Uncategorized',
        sku,
        stock,
        url: productUrl,
        specifications: {}
      }
    } catch (error) {
      console.error(`Error scraping Elhamd product details for ${productUrl}:`, error)
      return {
        id: this.generateId(productUrl),
        name: 'Unknown Product',
        price: 0,
        description: '',
        images: [],
        category: 'Uncategorized',
        url: productUrl,
        specifications: {}
      }
    }
  }

  async quickTestScan(): Promise<{ categories: Array<{ name: string; url: string }>; products: ElhamdProduct[]; errors: number }> {
    try {
      const categories = await this.scrapeCategories()
      const products: ElhamdProduct[] = []
      let errors = 0

      if (categories.length > 0) {
        // Try first few categories until we find one with products
        for (let i = 0; i < Math.min(5, categories.length); i++) {
          const categoryProducts = await this.scrapeCategoryProducts(categories[i].url, 1)
          
          if (categoryProducts.length > 0) {
            // Get details for first 5 products
            for (let j = 0; j < Math.min(5, categoryProducts.length); j++) {
              try {
                const details = await this.scrapeProductDetails(categoryProducts[j].url)
                products.push({
                  ...categoryProducts[j],
                  ...details
                })
              } catch (error) {
                errors++
              }
            }
            break // Found products, stop searching
          }
        }
      }

      return { categories, products, errors }
    } catch (error) {
      console.error('Elhamd quick test scan failed:', error)
      return { categories: [], products: [], errors: 1 }
    }
  }

  /**
   * Full catalog scan - COMPLETE SCAN (without product details to avoid timeout)
   */
  async scanFullCatalog(maxPagesPerCategory: number = 50): Promise<{ categories: Array<{ name: string; url: string }>; products: ElhamdProduct[]; errors: number }> {
    try {
      console.log('Scanning Elhamd categories...')
      const categories = await this.scrapeCategories()
      console.log(`Found ${categories.length} categories`)
      
      const allProducts: ElhamdProduct[] = []
      let errors = 0

      for (const category of categories) {
        try {
          console.log(`Scanning category: ${category.name}`)
          const categoryProducts = await this.scrapeCategoryProducts(category.url, maxPagesPerCategory)
          console.log(`Found ${categoryProducts.length} products in ${category.name}`)
          
          // Add products without fetching individual details (too slow)
          allProducts.push(...categoryProducts)
          
          // Delay between categories
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          console.error(`Error scanning category ${category.name}:`, error)
          errors++
        }
      }

      console.log(`Total products found: ${allProducts.length}`)
      return { categories, products: allProducts, errors }
    } catch (error) {
      console.error('Elhamd full catalog scan failed:', error)
      return { categories: [], products: [], errors: 1 }
    }
  }

  private generateId(url: string): string {
    return url.split('/').filter(Boolean).pop() || url
  }
}