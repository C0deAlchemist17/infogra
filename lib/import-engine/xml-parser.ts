/**
 * XML Parser for Product Import
 * Handles parsing XML files with product data
 */

export interface XMLProduct {
  [key: string]: any
}

export interface ParseResult {
  success: boolean
  data: XMLProduct[]
  errors: string[]
  rowCount: number
}

export class XMLParser {
  /**
   * Parse XML string into array of product objects
   */
  static async parse(xmlContent: string): Promise<ParseResult> {
    const errors: string[] = []
    
    try {
      // Use DOMParser for browser-like XML parsing
      if (typeof window !== 'undefined') {
        return this.parseWithDOMParser(xmlContent, errors)
      }
      
      // Server-side parsing using simple regex-based approach
      // In production, you'd want to use a proper XML parser library
      return this.parseServerSide(xmlContent, errors)
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [`XML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        rowCount: 0
      }
    }
  }

  /**
   * Parse XML using DOMParser (browser)
   */
  private static parseWithDOMParser(xmlContent: string, errors: string[]): ParseResult {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      return {
        success: false,
        data: [],
        errors: [`XML parsing error: ${parseError.textContent}`],
        rowCount: 0
      }
    }

    const products: XMLProduct[] = []
    
    // Try common XML structures
    const productNodes = 
      xmlDoc.querySelectorAll('product') ||
      xmlDoc.querySelectorAll('item') ||
      xmlDoc.querySelectorAll('Product') ||
      xmlDoc.querySelectorAll('Item')

    productNodes.forEach((node, index) => {
      try {
        const product = this.xmlNodeToObject(node)
        products.push(product)
      } catch (error) {
        errors.push(`Product at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })

    if (products.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['No products found in XML. Expected <product> or <item> elements'],
        rowCount: 0
      }
    }

    return {
      success: errors.length === 0,
      data: products,
      errors,
      rowCount: products.length
    }
  }

  /**
   * Simple server-side XML parser (regex-based)
   * Note: In production, use a proper XML parser library like 'xml2js'
   */
  private static parseServerSide(xmlContent: string, errors: string[]): ParseResult {
    // This is a simplified parser for demonstration
    // In production, install and use 'xml2js' or similar library
    
    try {
      // Extract product nodes using regex
      const productRegex = /<(?:product|item|Product|Item)[^>]*>([\s\S]*?)<\/\s*(?:product|item|Product|Item)\s*>/gi
      const matches = xmlContent.match(productRegex)
      
      if (!matches || matches.length === 0) {
        return {
          success: false,
          data: [],
          errors: ['No products found in XML. Expected <product> or <item> elements'],
          rowCount: 0
        }
      }

      const products: XMLProduct[] = []
      
      matches.forEach((match, index) => {
        try {
          const product = this.parseXMLProductString(match)
          products.push(product)
        } catch (error) {
          errors.push(`Product at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })

      return {
        success: errors.length === 0,
        data: products,
        errors,
        rowCount: products.length
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [`Server-side XML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        rowCount: 0
      }
    }
  }

  /**
   * Convert XML node to object
   */
  private static xmlNodeToObject(node: Element): XMLProduct {
    const product: XMLProduct = {}
    
    if (node.children) {
      Array.from(node.children).forEach(child => {
        const key = child.tagName.toLowerCase()
        const value = child.textContent?.trim() || ''
        
        // Handle nested elements
        if (child.children.length > 0) {
          product[key] = this.xmlNodeToObject(child)
        } else {
          product[key] = value
        }
      })
    }
    
    // Also check attributes
    if (node.attributes) {
      Array.from(node.attributes).forEach(attr => {
        product[attr.name] = attr.value
      })
    }
    
    return product
  }

  /**
   * Parse XML product string to object (regex-based)
   */
  private static parseXMLProductString(xmlString: string): XMLProduct {
    const product: XMLProduct = {}
    
    // Extract all key-value pairs
    const tagRegex = /<([^>]+)>([^<]*)<\/\s*\1\s*>/gi
    let match
    
    while ((match = tagRegex.exec(xmlString)) !== null) {
      const key = match[1].trim().toLowerCase()
      const value = match[2].trim()
      
      // Skip if already exists (handle duplicates)
      if (!product[key]) {
        product[key] = value
      }
    }
    
    return product
  }

  /**
   * Convert XML product data to Product interface
   */
  static toProduct(xmlProduct: XMLProduct, mapping: Record<string, string>): any {
    const product: any = {}
    
    Object.entries(mapping).forEach(([targetField, sourceField]) => {
      const value = xmlProduct[sourceField]
      
      if (value !== undefined && value !== null && value !== '') {
        // Convert numeric fields
        if (['price', 'originalPrice', 'stock', 'rating', 'reviews', 'discount'].includes(targetField)) {
          product[targetField] = Number(value) || 0
        } 
        // Convert boolean fields
        else if (['isNew', 'isBestSeller', 'isFeatured', 'featured'].includes(targetField)) {
          product[targetField] = String(value).toLowerCase() === 'true' || value === '1'
        }
        // Ensure array fields
        else if (['images', 'features', 'subcategories'].includes(targetField)) {
          if (Array.isArray(value)) {
            product[targetField] = value
          } else if (typeof value === 'string') {
            // Handle comma-separated or pipe-separated values
            product[targetField] = value.split(/[,|]/).map(s => s.trim())
          } else {
            product[targetField] = [String(value)]
          }
        }
        // Ensure specifications is object
        else if (targetField === 'specifications') {
          if (typeof value === 'object' && !Array.isArray(value)) {
            product[targetField] = value
          } else if (typeof value === 'string') {
            try {
              product[targetField] = JSON.parse(value)
            } catch {
              product[targetField] = this.parseKeyValuePairs(String(value))
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
   * Parse key:value pairs string into object
   */
  private static parseKeyValuePairs(pairsString: string): Record<string, string> {
    const result: Record<string, string> = {}
    const pairs = pairsString.split(/[,|]/)
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(/[:=]/).map(s => s.trim())
      if (key && value) {
        result[key] = value
      }
    })
    
    return result
  }
}
