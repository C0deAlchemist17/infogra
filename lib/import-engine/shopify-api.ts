/**
 * Shopify REST API Integration
 * Handles importing products from Shopify stores
 */

export interface ShopifyConfig {
  storeUrl: string
  accessToken: string
  apiVersion?: string
}

export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  product_type: string
  vendor: string
  status: string
  created_at: string
  updated_at: string
  published_at: string
  tags: string
  options: Array<{
    id: number
    name: string
    values: string[]
  }>
  variants: Array<{
    id: number
    product_id: number
    title: string
    price: string
    compare_at_price: string
    sku: string
    inventory_quantity: number
    weight: number
    weight_unit: string
    requires_shipping: boolean
    taxable: boolean
    available: boolean
  }>
  images: Array<{
    id: number
    src: string
    alt: string
    position: number
  }>
  body_html: string
  metafields: Array<{
    key: string
    value: string
    type: string
  }>
}

export interface ShopifyImportResult {
  success: boolean
  products: ShopifyProduct[]
  errors: string[]
}

export class ShopifyAPI {
  private config: ShopifyConfig
  private apiVersion: string

  constructor(config: ShopifyConfig) {
    this.config = config
    this.apiVersion = config.apiVersion || '2024-01'
  }

  /**
   * Fetch all products from Shopify
   */
  async fetchProducts(limit: number = 250, pageInfo?: string): Promise<ShopifyImportResult> {
    const errors: string[] = []
    
    try {
      const url = new URL(`${this.config.storeUrl}/admin/api/${this.apiVersion}/products.json`)
      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('status', 'active')
      
      if (pageInfo) {
        url.searchParams.append('page_info', pageInfo)
      }

      const response = await this.authenticatedRequest(url.toString())

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const products = data.products || []

      return {
        success: true,
        products,
        errors
      }
    } catch (error) {
      return {
        success: false,
        products: [],
        errors: [`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  /**
   * Fetch all products with pagination
   */
  async fetchAllProducts(onProgress?: (current: number, total: number) => void): Promise<ShopifyImportResult> {
    const allProducts: ShopifyProduct[] = []
    const errors: string[] = []
    let pageInfo: string | undefined

    try {
      while (true) {
        const result = await this.fetchProducts(250, pageInfo)

        if (!result.success) {
          errors.push(...result.errors)
          break
        }

        allProducts.push(...result.products)

        if (onProgress) {
          onProgress(allProducts.length, allProducts.length)
        }

        // Check if there are more products
        const linkHeader = this.getLinkHeader()
        if (!linkHeader || !linkHeader.next) {
          break
        }

        pageInfo = linkHeader.next
      }

      return {
        success: errors.length === 0,
        products: allProducts,
        errors
      }
    } catch (error) {
      return {
        success: false,
        products: allProducts,
        errors: [`Failed to fetch all products: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  /**
   * Fetch product by ID
   */
  async fetchProduct(id: number): Promise<ShopifyProduct | null> {
    try {
      const url = `${this.config.storeUrl}/admin/api/${this.apiVersion}/products/${id}.json`
      const response = await this.authenticatedRequest(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.product
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      return null
    }
  }

  /**
   * Fetch collections from Shopify
   */
  async fetchCollections(): Promise<Array<{ id: number; title: string; handle: string }>> {
    try {
      const url = `${this.config.storeUrl}/admin/api/${this.apiVersion}/collections.json`
      const response = await this.authenticatedRequest(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.collections || []
    } catch (error) {
      console.error('Failed to fetch collections:', error)
      return []
    }
  }

  /**
   * Convert Shopify product to internal Product format
   */
  static convertToProduct(shopifyProduct: ShopifyProduct, categoryMapping?: Record<string, string>): any {
    // Use the first variant as the main product data
    const mainVariant = shopifyProduct.variants[0] || shopifyProduct.variants[0]
    
    const product: any = {
      id: shopifyProduct.id.toString(),
      sku: mainVariant?.sku,
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      price: parseFloat(mainVariant?.price || '0'),
      originalPrice: mainVariant?.compare_at_price ? parseFloat(mainVariant.compare_at_price) : undefined,
      discount: mainVariant?.compare_at_price ? Math.round((1 - parseFloat(mainVariant.price) / parseFloat(mainVariant.compare_at_price)) * 100) : undefined,
      brand: shopifyProduct.vendor,
      images: shopifyProduct.images.map(img => img.src),
      description: this.stripHtml(shopifyProduct.body_html),
      features: this.extractFeatures(shopifyProduct),
      stock: mainVariant?.inventory_quantity || 0,
      condition: 'new',
      warranty: '1 Year',
      rating: 0, // Shopify doesn't have built-in ratings
      reviews: 0,
      isNew: shopifyProduct.created_at && this.isNewProduct(shopifyProduct.created_at),
      isBestSeller: false, // Would need external data
      isFeatured: shopifyProduct.tags.includes('featured'),
      specifications: this.extractSpecifications(shopifyProduct, mainVariant),
      category: this.mapCategory(shopifyProduct, categoryMapping),
      subcategory: this.mapSubcategory(shopifyProduct)
    }

    return product
  }

  /**
   * Strip HTML tags from string
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  /**
   * Extract features from Shopify product
   */
  private static extractFeatures(shopifyProduct: ShopifyProduct): string[] {
    const features: string[] = []

    // Extract from tags
    const tags = shopifyProduct.tags.split(',').filter(t => t.trim())
    features.push(...tags.slice(0, 3).map(t => t.trim()))

    // Extract from options
    shopifyProduct.options.forEach(option => {
      if (option.values.length > 0) {
        features.push(`${option.name}: ${option.values.join(', ')}`)
      }
    })

    return features.slice(0, 6)
  }

  /**
   * Extract specifications from Shopify product
   */
  private static extractSpecifications(shopifyProduct: ShopifyProduct, variant?: any): Record<string, string> {
    const specs: Record<string, string> = {}

    // Add variant specifications
    if (variant) {
      if (variant.weight) {
        specs['Weight'] = `${variant.weight} ${variant.weight_unit || 'kg'}`
      }
      if (variant.sku) {
        specs['SKU'] = variant.sku
      }
    }

    // Add metafields
    shopifyProduct.metafields.forEach(meta => {
      if (meta.key && meta.value) {
        specs[meta.key] = meta.value
      }
    })

    // Add options as specifications
    shopifyProduct.options.forEach(option => {
      if (option.values.length > 0) {
        specs[option.name] = option.values.join(', ')
      }
    })

    return specs
  }

  /**
   * Map Shopify product type to internal category
   */
  private static mapCategory(shopifyProduct: ShopifyProduct, mapping?: Record<string, string>): string {
    const productType = shopifyProduct.product_type.toLowerCase()
    
    if (mapping && mapping[productType]) {
      return mapping[productType]
    }

    // Try to match by product type
    const categoryMap: Record<string, string> = {
      'laptop': 'gaming-laptops',
      'laptops': 'gaming-laptops',
      'computer': 'desktop-pcs',
      'desktop': 'desktop-pcs',
      'graphics card': 'graphics-cards',
      'gpu': 'graphics-cards',
      'processor': 'processors',
      'cpu': 'processors',
      'monitor': 'gaming-monitors',
      'keyboard': 'gaming-keyboards',
      'mouse': 'gaming-mouse',
      'headphones': 'headsets',
      'headset': 'headsets'
    }

    return categoryMap[productType] || productType || 'accessories'
  }

  /**
   * Map Shopify subcategory
   */
  private static mapSubcategory(shopifyProduct: ShopifyProduct): string {
    const tags = shopifyProduct.tags.toLowerCase()
    
    // Try to extract subcategory from tags
    if (tags.includes('gaming')) return 'Gaming'
    if (tags.includes('professional')) return 'Professional'
    if (tags.includes('budget')) return 'Budget'
    if (tags.includes('premium')) return 'Premium'
    
    return 'Standard'
  }

  /**
   * Check if product is new (created within 30 days)
   */
  private static isNewProduct(dateString: string): boolean {
    const createdDate = new Date(dateString)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return createdDate > thirtyDaysAgo
  }

  /**
   * Make authenticated request to Shopify API
   */
  private async authenticatedRequest(url: string): Promise<Response> {
    return fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': this.config.accessToken,
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Extract pagination info from Link header
   */
  private getLinkHeader(): { next?: string; previous?: string } | null {
    // This would need to be implemented by storing the last response headers
    // For now, return null to indicate no pagination info available
    return null
  }

  /**
   * Test connection to Shopify API
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${this.config.storeUrl}/admin/api/${this.apiVersion}/shop.json`
      const response = await this.authenticatedRequest(url)

      if (response.ok) {
        return { success: true, message: 'Connection successful' }
      } else if (response.status === 401) {
        return { success: false, message: 'Authentication failed. Check access token.' }
      } else {
        return { success: false, message: `Connection failed: HTTP ${response.status}` }
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }
}
