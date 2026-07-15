/**
 * WooCommerce REST API Integration
 * Handles importing products from WooCommerce stores
 */

export interface WooCommerceConfig {
  baseUrl: string
  consumerKey: string
  consumerSecret: string
  version?: string
}

export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  stock_quantity: number
  stock_status: string
  manage_stock: boolean
  backorders: string
  backorders_allowed: boolean
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  attributes: Array<{
    id: number
    name: string
    options: string[]
  }>
  meta_data: Array<{
    key: string
    value: any
  }>
}

export interface WooCommerceImportResult {
  success: boolean
  products: WooCommerceProduct[]
  totalPages: number
  totalProducts: number
  errors: string[]
}

export class WooCommerceAPI {
  private config: WooCommerceConfig
  private version: string

  constructor(config: WooCommerceConfig) {
    this.config = config
    this.version = config.version || 'wc/v3'
  }

  /**
   * Fetch all products from WooCommerce
   */
  async fetchProducts(page: number = 1, perPage: number = 100): Promise<WooCommerceImportResult> {
    const errors: string[] = []
    
    try {
      const url = new URL(`${this.config.baseUrl}/wp-json/${this.version}/products`)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('per_page', perPage.toString())
      url.searchParams.append('status', 'publish')

      const response = await this.authenticatedRequest(url.toString())

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const products = Array.isArray(data) ? data : [data]

      // Get pagination headers
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1')
      const totalProducts = parseInt(response.headers.get('X-WP-Total') || products.length.toString())

      return {
        success: true,
        products,
        totalPages,
        totalProducts,
        errors
      }
    } catch (error) {
      return {
        success: false,
        products: [],
        totalPages: 0,
        totalProducts: 0,
        errors: [`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  /**
   * Fetch all products with pagination
   */
  async fetchAllProducts(onProgress?: (current: number, total: number) => void): Promise<WooCommerceImportResult> {
    const allProducts: WooCommerceProduct[] = []
    const errors: string[] = []
    let page = 1
    let totalPages = 1

    try {
      while (page <= totalPages) {
        const result = await this.fetchProducts(page, 100)

        if (!result.success) {
          errors.push(...result.errors)
          break
        }

        allProducts.push(...result.products)
        totalPages = result.totalPages

        if (onProgress) {
          onProgress(allProducts.length, result.totalProducts)
        }

        page++
      }

      return {
        success: errors.length === 0,
        products: allProducts,
        totalPages,
        totalProducts: allProducts.length,
        errors
      }
    } catch (error) {
      return {
        success: false,
        products: allProducts,
        totalPages,
        totalProducts: allProducts.length,
        errors: [`Failed to fetch all products: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  /**
   * Fetch product by ID
   */
  async fetchProduct(id: number): Promise<WooCommerceProduct | null> {
    try {
      const url = `${this.config.baseUrl}/wp-json/${this.version}/products/${id}`
      const response = await this.authenticatedRequest(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      return null
    }
  }

  /**
   * Fetch categories from WooCommerce
   */
  async fetchCategories(): Promise<Array<{ id: number; name: string; slug: string }>> {
    try {
      const url = `${this.config.baseUrl}/wp-json/${this.version}/products/categories`
      const response = await this.authenticatedRequest(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  }

  /**
   * Convert WooCommerce product to internal Product format
   */
  static convertToProduct(wcProduct: WooCommerceProduct, categoryMapping?: Record<number, string>): any {
    const product: any = {
      id: wcProduct.id.toString(),
      sku: wcProduct.sku,
      name: wcProduct.name,
      slug: wcProduct.slug,
      price: parseFloat(wcProduct.price) || 0,
      originalPrice: wcProduct.sale_price ? parseFloat(wcProduct.regular_price) : undefined,
      discount: wcProduct.sale_price ? Math.round((1 - parseFloat(wcProduct.sale_price) / parseFloat(wcProduct.regular_price)) * 100) : undefined,
      brand: this.extractBrand(wcProduct),
      images: wcProduct.images.map(img => img.src),
      description: wcProduct.description || wcProduct.short_description,
      features: this.extractFeatures(wcProduct),
      stock: wcProduct.stock_quantity || 0,
      condition: 'new',
      warranty: '1 Year',
      rating: parseFloat(wcProduct.average_rating) || 0,
      reviews: wcProduct.rating_count || 0,
      isNew: wcProduct.date_created && this.isNewProduct(wcProduct.date_created),
      isBestSeller: wcProduct.total_sales > 50,
      isFeatured: wcProduct.featured,
      specifications: this.extractSpecifications(wcProduct),
      category: this.mapCategory(wcProduct, categoryMapping),
      subcategory: this.mapSubcategory(wcProduct)
    }

    return product
  }

  /**
   * Extract brand from WooCommerce product
   */
  private static extractBrand(wcProduct: WooCommerceProduct): string {
    // Try to get brand from attributes
    const brandAttribute = wcProduct.attributes.find(attr => 
      attr.name.toLowerCase() === 'brand' || 
      attr.name.toLowerCase() === 'manufacturer'
    )
    
    if (brandAttribute && brandAttribute.options.length > 0) {
      return brandAttribute.options[0]
    }

    // Try to get brand from tags
    const brandTag = wcProduct.tags.find(tag => 
      ['asus', 'msi', 'razer', 'corsair', 'logitech', 'intel', 'amd', 'nvidia', 'samsung', 'lg', 'dell', 'hp']
        .includes(tag.slug.toLowerCase())
    )
    
    if (brandTag) {
      return brandTag.name
    }

    // Default to first category name as brand fallback
    return wcProduct.categories[0]?.name || 'Unknown'
  }

  /**
   * Extract features from WooCommerce product
   */
  private static extractFeatures(wcProduct: WooCommerceProduct): string[] {
    const features: string[] = []

    // Add from short description
    if (wcProduct.short_description) {
      const sentences = wcProduct.short_description.split(/[.!?]/).filter(s => s.trim())
      features.push(...sentences.slice(0, 3).map(s => s.trim()))
    }

    // Add from attributes
    wcProduct.attributes.forEach(attr => {
      // @ts-ignore - WooCommerce may have additional properties
      if ((!attr.visible || attr.visible) && attr.options.length > 0) {
        features.push(`${attr.name}: ${attr.options.join(', ')}`)
      }
    })

    return features.slice(0, 6)
  }

  /**
   * Extract specifications from WooCommerce product
   */
  private static extractSpecifications(wcProduct: WooCommerceProduct): Record<string, string> {
    const specs: Record<string, string> = {}

    // Add dimensions
    if (wcProduct.dimensions) {
      if (wcProduct.dimensions.length) specs['Length'] = wcProduct.dimensions.length
      if (wcProduct.dimensions.width) specs['Width'] = wcProduct.dimensions.width
      if (wcProduct.dimensions.height) specs['Height'] = wcProduct.dimensions.height
    }

    if (wcProduct.weight) {
      specs['Weight'] = wcProduct.weight
    }

    // Add attributes as specifications
    wcProduct.attributes.forEach(attr => {
      if (attr.options.length > 0) {
        specs[attr.name] = attr.options.join(', ')
      }
    })

    // Add meta data
    wcProduct.meta_data.forEach(meta => {
      if (meta.key && meta.value !== undefined && meta.value !== null && meta.value !== '') {
        specs[meta.key] = String(meta.value)
      }
    })

    return specs
  }

  /**
   * Map WooCommerce category to internal category
   */
  private static mapCategory(wcProduct: WooCommerceProduct, mapping?: Record<number, string>): string {
    if (!wcProduct.categories || wcProduct.categories.length === 0) {
      return 'accessories'
    }

    const mainCategory = wcProduct.categories[0]
    
    if (mapping && mapping[mainCategory.id]) {
      return mapping[mainCategory.id]
    }

    // Try to match by slug
    const categorySlugMap: Record<string, string> = {
      'laptops': 'gaming-laptops',
      'gaming-laptops': 'gaming-laptops',
      'desktop-pcs': 'desktop-pcs',
      'graphics-cards': 'graphics-cards',
      'processors': 'processors',
      'monitors': 'gaming-monitors',
      'keyboards': 'gaming-keyboards',
      'mice': 'gaming-mouse',
      'headphones': 'headsets'
    }

    return categorySlugMap[mainCategory.slug] || mainCategory.slug
  }

  /**
   * Map WooCommerce subcategory
   */
  private static mapSubcategory(wcProduct: WooCommerceProduct): string {
    if (!wcProduct.categories || wcProduct.categories.length < 2) {
      return 'Standard'
    }

    return wcProduct.categories[1].name
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
   * Make authenticated request to WooCommerce API
   */
  private async authenticatedRequest(url: string): Promise<Response> {
    const credentials = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`)
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Test connection to WooCommerce API
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${this.config.baseUrl}/wp-json/${this.version}/products?per_page=1`
      const response = await this.authenticatedRequest(url)

      if (response.ok) {
        return { success: true, message: 'Connection successful' }
      } else if (response.status === 401) {
        return { success: false, message: 'Authentication failed. Check consumer key and secret.' }
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
