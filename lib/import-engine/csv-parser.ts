/**
 * CSV Parser for Product Import
 * Handles parsing CSV files with product data
 */

export interface CSVProduct {
  [key: string]: string | number
}

export interface ParseResult {
  success: boolean
  data: CSVProduct[]
  errors: string[]
  rowCount: number
}

export class CSVParser {
  /**
   * Parse CSV string into array of objects
   */
  static parse(csvContent: string, delimiter: string = ','): ParseResult {
    const errors: string[] = []
    const data: CSVProduct[] = []
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim())
    
    if (lines.length === 0) {
      return { success: false, data: [], errors: ['Empty CSV file'], rowCount: 0 }
    }

    // Extract headers
    const headers = this.parseLine(lines[0], delimiter)
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseLine(lines[i], delimiter)
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`)
          continue
        }

        const row: CSVProduct = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })
        
        data.push(row)
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: errors.length === 0,
      data,
      errors,
      rowCount: data.length
    }
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private static parseLine(line: string, delimiter: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"'
          i++
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes
        }
      } else if (char === delimiter && !inQuotes) {
        // End of field
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  /**
   * Convert CSV product data to Product interface
   */
  static toProduct(csvProduct: CSVProduct, mapping: Record<string, string>): any {
    const product: any = {}
    
    Object.entries(mapping).forEach(([targetField, sourceField]) => {
      const value = csvProduct[sourceField]
      
      if (value !== undefined && value !== '') {
        // Convert numeric fields
        if (['price', 'originalPrice', 'stock', 'rating', 'reviews', 'discount'].includes(targetField)) {
          product[targetField] = parseFloat(String(value)) || 0
        } 
        // Convert boolean fields
        else if (['isNew', 'isBestSeller', 'isFeatured', 'featured'].includes(targetField)) {
          product[targetField] = String(value).toLowerCase() === 'true' || value === '1'
        }
        // Convert array fields (comma-separated)
        else if (['images', 'features', 'subcategories'].includes(targetField)) {
          product[targetField] = String(value).split(',').map(s => s.trim())
        }
        // Convert specifications (JSON or key:value format)
        else if (targetField === 'specifications') {
          try {
            product[targetField] = JSON.parse(String(value))
          } catch {
            // Parse as key:value pairs
            product[targetField] = this.parseKeyValuePairs(String(value))
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
   * Format: "key1:value1,key2:value2"
   */
  private static parseKeyValuePairs(pairsString: string): Record<string, string> {
    const result: Record<string, string> = {}
    const pairs = pairsString.split(',')
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim())
      if (key && value) {
        result[key] = value
      }
    })
    
    return result
  }
}
