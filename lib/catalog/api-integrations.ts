// API integrations for product catalog sync
// WooCommerce and Shopify API integrations

export interface WooCommerceConfig {
  baseUrl: string
  consumerKey: string
  consumerSecret: string
  currencyMultiplier?: number
}

export interface ShopifyConfig {
  shopDomain: string
  accessToken: string
  currencyMultiplier?: number
}

export interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: Array<{ product: string; message: string }>
  warnings: string[]
}

// WooCommerce API Integration
export class WooCommerceIntegration {
  private config: WooCommerceConfig

  constructor(config: WooCommerceConfig) {
    this.config = config
  }

  async fetchProducts(page: number = 1, perPage: number = 100): Promise<any[]> {
    const url = new URL(`${this.config.baseUrl}/wp-json/wc/v3/products`)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('per_page', perPage.toString())
    url.searchParams.append('status', 'publish')

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64')

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.statusText}`)
      }

      const products = await response.json()
      return Array.isArray(products) ? products : [products]
    } catch (error) {
      console.error('WooCommerce fetch error:', error)
      throw error
    }
  }

  async fetchAllProducts(): Promise<any[]> {
    const allProducts: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const products = await this.fetchProducts(page, 100)
      
      if (products.length === 0) {
        hasMore = false
      } else {
        allProducts.push(...products)
        page++
        
        // Rate limiting - WooCommerce has rate limits
        if (products.length === 100) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }

    return allProducts
  }

  async syncProducts(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
      warnings: []
    }

    try {
      const products = await this.fetchAllProducts()
      
      for (const product of products) {
        try {
          const mappedProduct = this.mapWooCommerceProduct(product)
          // In production, save to database
          result.synced++
        } catch (error) {
          result.failed++
          result.errors.push({
            product: product.name || 'Unknown',
            message: String(error)
          })
        }
      }
    } catch (error) {
      result.success = false
      result.errors.push({
        product: 'All',
        message: String(error)
      })
    }

    return result
  }

  private mapWooCommerceProduct(wcProduct: any): any {
    const multiplier = this.config.currencyMultiplier || 1

    return {
      id: wcProduct.id.toString(),
      name: wcProduct.name,
      sku: wcProduct.sku,
      price: parseFloat(wcProduct.price || '0') * multiplier,
      originalPrice: wcProduct.regular_price 
        ? parseFloat(wcProduct.regular_price) * multiplier 
        : undefined,
      discount: wcProduct.sale_price 
        ? Math.round((1 - parseFloat(wcProduct.sale_price) / parseFloat(wcProduct.regular_price)) * 100)
        : undefined,
      category: wcProduct.categories?.[0]?.name || 'Uncategorized',
      brand: wcProduct.attributes?.find((attr: any) => attr.name.toLowerCase() === 'brand')?.options?.[0] || 'Unknown',
      description: wcProduct.description || wcProduct.short_description,
      specifications: this.extractSpecifications(wcProduct.attributes),
      images: wcProduct.images?.map((img: any) => img.src) || [],
      stock: wcProduct.stock_quantity || wcProduct.manage_stock ? wcProduct.stock_quantity : 999,
      warranty: wcProduct.attributes?.find((attr: any) => attr.name.toLowerCase() === 'warranty')?.options?.[0],
      condition: wcProduct.attributes?.find((attr: any) => attr.name.toLowerCase() === 'condition')?.options?.[0],
      weight: wcProduct.weight,
      dimensions: wcProduct.dimensions 
        ? `${wcProduct.dimensions.length} x ${wcProduct.dimensions.width} x ${wcProduct.dimensions.height} cm`
        : undefined,
      attributes: wcProduct.attributes
    }
  }

  private extractSpecifications(attributes: any[]): Record<string, string> {
    const specs: Record<string, string> = {}
    
    attributes?.forEach((attr: any) => {
      if (attr.visible && attr.options?.length > 0) {
        specs[attr.name] = Array.isArray(attr.options) ? attr.options.join(', ') : attr.options
      }
    })

    return specs
  }

  async webhookHandler(event: string, data: any): Promise<void> {
    // Handle WooCommerce webhooks
    switch (event) {
      case 'product.created':
      case 'product.updated':
        await this.handleProductUpdate(data)
        break
      case 'product.deleted':
        await this.handleProductDelete(data)
        break
      case 'order.created':
        await this.handleOrderCreated(data)
        break
    }
  }

  private async handleProductUpdate(data: any): Promise<void> {
    const product = this.mapWooCommerceProduct(data)
    // In production, update database
  }

  private async handleProductDelete(data: any): Promise<void> {
    // In production, delete from database
  }

  private async handleOrderCreated(data: any): Promise<void> {
    // In production, update stock levels
  }
}

// Shopify API Integration
export class ShopifyIntegration {
  private config: ShopifyConfig

  constructor(config: ShopifyConfig) {
    this.config = config
  }

  async fetchProducts(limit: number = 250, after?: string): Promise<any[]> {
    const url = new URL(`https://${this.config.shopDomain}/admin/api/2024-01/products.json`)
    url.searchParams.append('limit', limit.toString())
    if (after) {
      url.searchParams.append('page_info', after)
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Shopify fetch error:', error)
      throw error
    }
  }

  async fetchAllProducts(): Promise<any[]> {
    const allProducts: any[] = []
    let after: string | undefined
    let hasMore = true

    while (hasMore) {
      const products = await this.fetchProducts(250, after)
      
      if (products.length === 0) {
        hasMore = false
      } else {
        allProducts.push(...products)
        
        // Check for pagination
        const linkHeader = products.length > 0 ? '' : ''
        if (linkHeader.includes('next')) {
          // Extract next page cursor
          const match = linkHeader.match(/page_info=([^&]+)/)
          after = match ? match[1] : undefined
        } else {
          hasMore = false
        }
      }
    }

    return allProducts
  }

  async syncProducts(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
      warnings: []
    }

    try {
      const products = await this.fetchAllProducts()
      
      for (const product of products) {
        try {
          const mappedProduct = this.mapShopifyProduct(product)
          // In production, save to database
          result.synced++
        } catch (error) {
          result.failed++
          result.errors.push({
            product: product.title || 'Unknown',
            message: String(error)
          })
        }
      }
    } catch (error) {
      result.success = false
      result.errors.push({
        product: 'All',
        message: String(error)
      })
    }

    return result
  }

  private mapShopifyProduct(shopifyProduct: any): any {
    const multiplier = this.config.currencyMultiplier || 1
    const variant = shopifyProduct.variants?.[0] || {}

    return {
      id: shopifyProduct.id.toString(),
      name: shopifyProduct.title,
      sku: variant.sku,
      price: parseFloat(variant.price || '0') * multiplier,
      originalPrice: variant.compare_at_price
        ? parseFloat(variant.compare_at_price) * multiplier
        : undefined,
      discount: variant.compare_at_price
        ? Math.round((1 - parseFloat(variant.price) / parseFloat(variant.compare_at_price)) * 100)
        : undefined,
      category: shopifyProduct.product_type || 'Uncategorized',
      brand: shopifyProduct.vendor || 'Unknown',
      description: shopifyProduct.body_html || shopifyProduct.body_plain,
      specifications: this.extractSpecifications(shopifyProduct),
      images: shopifyProduct.images?.map((img: any) => img.src) || [],
      stock: variant.inventory_quantity || 999,
      warranty: shopifyProduct.tags?.find((tag: string) => tag.toLowerCase().includes('warranty')),
      condition: shopifyProduct.tags?.find((tag: string) => tag.toLowerCase().includes('condition')),
      weight: variant.grams ? variant.grams / 1000 : undefined, // Convert to kg
      dimensions: variant.weight_unit,
      attributes: {
        tags: shopifyProduct.tags,
        options: shopifyProduct.options
      }
    }
  }

  private extractSpecifications(product: any): Record<string, string> {
    const specs: Record<string, string> = {}
    
    product.options?.forEach((option: any) => {
      if (option.name && option.values) {
        specs[option.name] = option.values.join(', ')
      }
    })

    // Extract metafields if available
    if (product.metafields) {
      product.metafields.forEach((metafield: any) => {
        specs[metafield.key] = metafield.value
      })
    }

    return specs
  }

  async webhookHandler(topic: string, data: any): Promise<void> {
    // Handle Shopify webhooks
    switch (topic) {
      case 'products/create':
      case 'products/update':
        await this.handleProductUpdate(data)
        break
      case 'products/delete':
        await this.handleProductDelete(data)
        break
      case 'orders/create':
        await this.handleOrderCreated(data)
        break
      case 'inventory_levels/update':
        await this.handleInventoryUpdate(data)
        break
    }
  }

  private async handleProductUpdate(data: any): Promise<void> {
    const product = this.mapShopifyProduct(data)
    // In production, update database
  }

  private async handleProductDelete(data: any): Promise<void> {
    // In production, delete from database
  }

  private async handleOrderCreated(data: any): Promise<void> {
    // In production, update stock levels
  }

  private async handleInventoryUpdate(data: any): Promise<void> {
    // In production, update specific product stock
  }
}

// Duplicate Detection
export class DuplicateDetector {
  async findDuplicates(products: any[]): Promise<Map<string, any[]>> {
    const duplicates = new Map<string, any[]>()
    const seen = new Map<string, any>()

    for (const product of products) {
      const key = this.generateProductKey(product)
      
      if (seen.has(key)) {
        const existing = seen.get(key)
        if (!duplicates.has(key)) {
          duplicates.set(key, [existing])
        }
        duplicates.get(key)!.push(product)
      } else {
        seen.set(key, product)
      }
    }

    return duplicates
  }

  private generateProductKey(product: any): string {
    // Generate a unique key based on SKU, name, and brand
    const sku = product.sku || ''
    const name = (product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const brand = (product.brand || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    
    const key = `${sku}-${name}-${brand}`.replace(/-+/g, '-')
    return key.length > 0 ? key : 'unknown'
  }

  async mergeDuplicates(duplicates: Map<string, any[]>): Promise<any[]> {
    const merged: any[] = []

    for (const [key, products] of Array.from(duplicates.entries())) {
      // Merge duplicate products - keep the most complete data
      const mergedProduct = this.mergeProducts(products)
      merged.push(mergedProduct)
    }

    return merged
  }

  private mergeProducts(products: any[]): any {
    // Start with the first product as base
    const merged = { ...products[0] }

    // Merge data from all duplicates
    products.slice(1).forEach(product => {
      // Keep the highest price
      if (product.price > merged.price) {
        merged.price = product.price
      }

      // Merge images
      if (product.images?.length > 0) {
        merged.images = [...(merged.images || []), ...product.images]
      }

      // Merge specifications
      if (product.specifications) {
        merged.specifications = {
          ...(merged.specifications || {}),
          ...product.specifications
        }
      }

      // Keep the most complete description
      if (product.description?.length > (merged.description?.length || 0)) {
        merged.description = product.description
      }
    })

    // Remove duplicate images
    if (merged.images) {
      merged.images = Array.from(new Set(merged.images))
    }

    return merged
  }
}

// Data Validation
export class DataValidator {
  validateProduct(product: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!product.name || product.name.trim() === '') {
      errors.push('Product name is required')
    }

    if (!product.price || product.price <= 0) {
      errors.push('Valid price is required')
    }

    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required')
    }

    if (!product.brand || product.brand.trim() === '') {
      errors.push('Brand is required')
    }

    if (product.images && product.images.length > 0) {
      const invalidUrls = product.images.filter((url: string) => !this.isValidUrl(url))
      if (invalidUrls.length > 0) {
        errors.push(`${invalidUrls.length} invalid image URLs`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  validateBatch(products: any[]): { valid: number; invalid: number; errors: Array<{ product: string; errors: string[] }> } {
    const result = {
      valid: 0,
      invalid: 0,
      errors: [] as Array<{ product: string; errors: string[] }>
    }

    products.forEach(product => {
      const validation = this.validateProduct(product)
      
      if (validation.valid) {
        result.valid++
      } else {
        result.invalid++
        result.errors.push({
          product: product.name || 'Unknown',
          errors: validation.errors
        })
      }
    })

    return result
  }
}
