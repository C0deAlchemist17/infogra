/**
 * JSON Parser for Product Import
 * Handles parsing JSON files with product data
 */

export interface JSONProduct {
  [key: string]: any
}

export interface ParseResult {
  success: boolean
  data: JSONProduct[]
  errors: string[]
  rowCount: number
}

export class JSONParser {
  /**
   * Parse JSON string into array of product objects
   */
  static parse(jsonContent: string): ParseResult {
    const errors: string[] = []
    
    try {
      const parsed = JSON.parse(jsonContent)
      
      // Handle different JSON structures
      let products: JSONProduct[] = []
      
      if (Array.isArray(parsed)) {
        products = parsed
      } else if (parsed.products && Array.isArray(parsed.products)) {
        products = parsed.products
      } else if (parsed.data && Array.isArray(parsed.data)) {
        products = parsed.data
      } else if (parsed.items && Array.isArray(parsed.items)) {
        products = parsed.items
      } else if (typeof parsed === 'object') {
        // Single product wrapped in object
        products = [parsed]
      } else {
        return {
          success: false,
          data: [],
          errors: ['Invalid JSON structure. Expected array or object with products/data/items array'],
          rowCount: 0
        }
      }
      
      // Validate each product has required fields
      const validProducts = products.filter((product, index) => {
        if (!product || typeof product !== 'object') {
          errors.push(`Product at index ${index}: Invalid product object`)
          return false
        }
        
        // Check for at least a name or identifier
        if (!product.name && !product.title && !product.id && !product.sku) {
          errors.push(`Product at index ${index}: Missing identifier (name/title/id/sku)`)
          return false
        }
        
        return true
      })
      
      return {
        success: errors.length === 0,
        data: validProducts,
        errors,
        rowCount: validProducts.length
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        rowCount: 0
      }
    }
  }

  /**
   * Convert JSON product data to Product interface
   */
  static toProduct(jsonProduct: JSONProduct, mapping: Record<string, string>): any {
    const product: any = {}
    
    Object.entries(mapping).forEach(([targetField, sourceField]) => {
      const value = jsonProduct[sourceField]
      
      if (value !== undefined && value !== null && value !== '') {
        // Convert numeric fields
        if (['price', 'originalPrice', 'stock', 'rating', 'reviews', 'discount'].includes(targetField)) {
          product[targetField] = Number(value) || 0
        } 
        // Convert boolean fields
        else if (['isNew', 'isBestSeller', 'isFeatured', 'featured'].includes(targetField)) {
          product[targetField] = Boolean(value)
        }
        // Ensure array fields
        else if (['images', 'features', 'subcategories'].includes(targetField)) {
          product[targetField] = Array.isArray(value) ? value : [String(value)]
        }
        // Ensure specifications is object
        else if (targetField === 'specifications') {
          if (typeof value === 'object' && !Array.isArray(value)) {
            product[targetField] = value
          } else if (typeof value === 'string') {
            try {
              product[targetField] = JSON.parse(value)
            } catch {
              product[targetField] = {}
            }
          } else {
            product[targetField] = {}
          }
        }
        // String fields
        else {
          product[targetField] = String(value)
        }
      }
    })
    
    return product
  }

  /**
   * Generate slug from product name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}
