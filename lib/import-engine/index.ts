/**
 * Enterprise Product Import Engine
 * Main orchestrator for importing products from various sources
 */

import { CSVParser } from './csv-parser'
import { JSONParser } from './json-parser'
import { XMLParser } from './xml-parser'
import { ExcelParser } from './excel-parser'
import { Product } from '@/types/store'

export type ImportFormat = 'csv' | 'json' | 'xml' | 'excel'
export type ImportSource = 'file' | 'woocommerce' | 'shopify' | 'api'

export interface ImportConfig {
  format: ImportFormat
  source: ImportSource
  fieldMapping: Record<string, string>
  skipDuplicates: boolean
  updateExisting: boolean
  dryRun?: boolean
}

export interface ImportResult {
  success: boolean
  imported: number
  updated: number
  skipped: number
  errors: string[]
  warnings: string[]
  duration: number
}

export interface ImportProgress {
  current: number
  total: number
  percentage: number
  currentProduct?: string
}

export class ProductImportEngine {
  private existingProducts: Map<string, Product> = new Map()
  private progressCallback?: (progress: ImportProgress) => void

  /**
   * Set existing products for duplicate checking
   */
  setExistingProducts(products: Product[]): void {
    this.existingProducts = new Map(
      products.map(p => [`${p.slug}-${p.sku || p.id}`, p])
    )
  }

  /**
   * Set progress callback for real-time updates
   */
  setProgressCallback(callback: (progress: ImportProgress) => void): void {
    this.progressCallback = callback
  }

  /**
   * Import products from file content
   */
  async importFromFile(
    content: string | ArrayBuffer,
    config: ImportConfig
  ): Promise<ImportResult> {
    const startTime = Date.now()
    const errors: string[] = []
    const warnings: string[] = []
    let imported = 0
    let updated = 0
    let skipped = 0

    try {
      // Parse based on format
      let parsedData: any[] = []

      switch (config.format) {
        case 'csv':
          const csvResult = CSVParser.parse(content as string)
          if (!csvResult.success) {
            return {
              success: false,
              imported: 0,
              updated: 0,
              skipped: 0,
              errors: csvResult.errors,
              warnings: [],
              duration: Date.now() - startTime
            }
          }
          parsedData = csvResult.data
          break

        case 'json':
          const jsonResult = JSONParser.parse(content as string)
          if (!jsonResult.success) {
            return {
              success: false,
              imported: 0,
              updated: 0,
              skipped: 0,
              errors: jsonResult.errors,
              warnings: [],
              duration: Date.now() - startTime
            }
          }
          parsedData = jsonResult.data
          break

        case 'xml':
          const xmlResult = await XMLParser.parse(content as string)
          if (!xmlResult.success) {
            return {
              success: false,
              imported: 0,
              updated: 0,
              skipped: 0,
              errors: xmlResult.errors,
              warnings: [],
              duration: Date.now() - startTime
            }
          }
          parsedData = xmlResult.data
          break

        case 'excel':
          const excelResult = await ExcelParser.parse(content as ArrayBuffer)
          if (!excelResult.success) {
            return {
              success: false,
              imported: 0,
              updated: 0,
              skipped: 0,
              errors: excelResult.errors,
              warnings: [],
              duration: Date.now() - startTime
            }
          }
          parsedData = excelResult.data
          break

        default:
          return {
            success: false,
            imported: 0,
            updated: 0,
            skipped: 0,
            errors: [`Unsupported format: ${config.format}`],
            warnings: [],
            duration: Date.now() - startTime
          }
      }

      // Process each product
      const total = parsedData.length
      for (let i = 0; i < parsedData.length; i++) {
        const rawData = parsedData[i]
        
        // Update progress
        if (this.progressCallback) {
          this.progressCallback({
            current: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100),
            currentProduct: rawData.name || rawData.title || rawData.id || `Product ${i + 1}`
          })
        }

        try {
          const product = this.convertToProduct(rawData, config.format, config.fieldMapping)
          
          // Validate required fields
          if (!product.name || !product.slug) {
            warnings.push(`Product ${i + 1}: Missing required fields (name/slug)`)
            continue
          }

          // Check for duplicates
          const productKey = `${product.slug}-${product.sku || product.id}`
          const existing = this.existingProducts.get(productKey)

          if (existing) {
            if (config.skipDuplicates) {
              skipped++
              continue
            }

            if (config.updateExisting) {
              // Update existing product
              Object.assign(existing, product)
              updated++
            } else {
              skipped++
            }
          } else {
            // Import new product
            this.existingProducts.set(productKey, product)
            imported++
          }
        } catch (error) {
          errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      return {
        success: errors.length === 0,
        imported,
        updated,
        skipped,
        errors,
        warnings,
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        imported,
        updated,
        skipped,
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings,
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * Convert raw data to Product interface based on format
   */
  private convertToProduct(
    rawData: any,
    format: ImportFormat,
    mapping: Record<string, string>
  ): Product {
    let product: any

    switch (format) {
      case 'csv':
        product = CSVParser.toProduct(rawData, mapping)
        break
      case 'json':
        product = JSONParser.toProduct(rawData, mapping)
        break
      case 'xml':
        product = XMLParser.toProduct(rawData, mapping)
        break
      case 'excel':
        product = ExcelParser.toProduct(rawData, mapping)
        break
      default:
        product = rawData
    }

    // Ensure required fields
    if (!product.slug && product.name) {
      product.slug = JSONParser.generateSlug(product.name)
    }

    // Set defaults
    product.id = product.id || product.sku || `import-${Date.now()}-${Math.random()}`
    product.stock = product.stock ?? 0
    product.rating = product.rating ?? 0
    product.reviews = product.reviews ?? 0
    product.condition = product.condition || 'new'
    product.warranty = product.warranty || '1 Year'
    product.isNew = product.isNew ?? false
    product.isBestSeller = product.isBestSeller ?? false
    product.isFeatured = product.isFeatured ?? false
    product.images = product.images || []
    product.features = product.features || []
    product.specifications = product.specifications || {}

    return product as Product
  }

  /**
   * Get imported products
   */
  getImportedProducts(): Product[] {
    return Array.from(this.existingProducts.values())
  }

  /**
   * Clear imported products
   */
  clearImportedProducts(): void {
    this.existingProducts.clear()
  }

  /**
   * Export products to CSV
   */
  exportToCSV(products: Product[]): string {
    if (products.length === 0) return ''

    const headers = Object.keys(products[0])
    const csvRows = [headers.join(',')]

    products.forEach(product => {
      const values = headers.map(header => {
        const value = product[header as keyof Product]
        
        if (value === null || value === undefined) {
          return ''
        }

        if (Array.isArray(value)) {
          return `"${value.join(',').replace(/"/g, '""')}"`
        }

        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }

        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }

        return stringValue
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  /**
   * Export products to JSON
   */
  exportToJSON(products: Product[]): string {
    return JSON.stringify({ products }, null, 2)
  }

  /**
   * Get default field mapping for common formats
   */
  static getDefaultMapping(format: ImportFormat): Record<string, string> {
    const commonMapping: Record<string, string> = {
      id: 'id',
      name: 'name',
      slug: 'slug',
      category: 'category',
      subcategory: 'subcategory',
      price: 'price',
      originalPrice: 'original_price',
      discount: 'discount',
      brand: 'brand',
      images: 'images',
      specifications: 'specifications',
      description: 'description',
      features: 'features',
      stock: 'stock',
      condition: 'condition',
      warranty: 'warranty',
      rating: 'rating',
      reviews: 'reviews',
      isNew: 'is_new',
      isBestSeller: 'is_best_seller',
      isFeatured: 'is_featured'
    }

    // Format-specific overrides
    switch (format) {
      case 'csv':
        return {
          ...commonMapping,
          originalPrice: 'original_price',
          isNew: 'is_new',
          isBestSeller: 'is_best_seller',
          isFeatured: 'is_featured'
        }
      case 'json':
        return commonMapping
      case 'xml':
        return {
          ...commonMapping,
          originalPrice: 'originalprice',
          isNew: 'isnew',
          isBestSeller: 'isbestseller',
          isFeatured: 'isfeatured'
        }
      default:
        return commonMapping
    }
  }
}
