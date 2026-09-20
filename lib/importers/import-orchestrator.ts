// Import Orchestrator
// Coordinates the entire Kimo import process

import { KimoScraper, KimoProduct, KimoScrapeResult } from './kimo-scraper'
import { KimoProductMapper, MappingConfig, MappingResult } from './kimo-mapper'
import { ProductDataManager, ImportResult } from './product-data-manager'
import { Product } from '@/types/store'

export interface ImportProgress {
  phase: 'scanning' | 'mapping' | 'importing' | 'completed' | 'failed'
  current: number
  total: number
  percentage: number
  currentProduct?: string
  currentOperation: string
}

export interface ImportOptions {
  mode: 'scan' | 'preview' | 'import-new' | 'update-existing' | 'full-sync' | 'retry-failed'
  maxPagesPerCategory: number
  mappingConfig: Partial<MappingConfig>
  onProgress?: (progress: ImportProgress) => void
}

export interface ImportReport {
  success: boolean
  duration: number
  kimoData: {
    productsDiscovered: number
    pagesScanned: number
    categoriesFound: number
    errors: number
  }
  mappingData: {
    productsMapped: number
    categoriesMapped: number
    brandsMapped: number
    warnings: number
  }
  importData: {
    productsImported: number
    productsUpdated: number
    productsSkipped: number
    productsFailed: number
    categoriesAdded: number
    brandsAdded: number
  }
  errors: Array<{ product: string; message: string }>
  warnings: string[]
}

export class ImportOrchestrator {
  private scraper: KimoScraper
  private mapper: KimoProductMapper
  private dataManager: ProductDataManager
  private importHistory: Map<string, ImportReport>

  constructor() {
    this.scraper = new KimoScraper(1000) // 1 second delay
    this.mapper = new KimoProductMapper()
    this.dataManager = new ProductDataManager()
    this.importHistory = new Map()
  }

  /**
   * Execute a full import process
   */
  async executeImport(options: ImportOptions): Promise<ImportReport> {
    const startTime = Date.now()
    const report: ImportReport = {
      success: true,
      duration: 0,
      kimoData: {
        productsDiscovered: 0,
        pagesScanned: 0,
        categoriesFound: 0,
        errors: 0
      },
      mappingData: {
        productsMapped: 0,
        categoriesMapped: 0,
        brandsMapped: 0,
        warnings: 0
      },
      importData: {
        productsImported: 0,
        productsUpdated: 0,
        productsSkipped: 0,
        productsFailed: 0,
        categoriesAdded: 0,
        brandsAdded: 0
      },
      errors: [],
      warnings: []
    }

    try {
      // Update mapping configuration
      // Temporarily disabled - updateConfig method doesn't exist
      // if (options.mappingConfig) {
      //   this.mapper.updateConfig(options.mappingConfig)
      // }

      // Phase 1: Scan Kimo catalog
      if (options.mode !== 'retry-failed') {
        report.kimoData = await this.scanCatalog(options, report)
      }

      // Phase 2: Map products to INFOGRA format
      const mappedProducts = await this.mapProducts(options, report)

      // Phase 3: Import to INFOGRA
      if (options.mode === 'scan' || options.mode === 'preview') {
        // Don't actually import, just report
        report.success = true
      } else {
        report.importData = await this.importProducts(mappedProducts, options, report)
      }

      // Calculate duration
      report.duration = Date.now() - startTime

      // Save to history
      const importId = this.generateImportId()
      this.importHistory.set(importId, report)

      return report

    } catch (error) {
      report.success = false
      report.errors.push({
        product: 'Import Process',
        message: String(error)
      })
      report.duration = Date.now() - startTime
      return report
    }
  }

  /**
   * Phase 1: Scan Kimo catalog
   */
  private async scanCatalog(
    options: ImportOptions,
    report: ImportReport
  ): Promise<{ productsDiscovered: number; pagesScanned: number; categoriesFound: number; errors: number }> {
    this.updateProgress(options, {
      phase: 'scanning',
      current: 0,
      total: 100,
      percentage: 0,
      currentOperation: 'Initializing catalog scan...'
    })

    try {
      const result: KimoScrapeResult = await this.scraper.scanFullCatalog(options.maxPagesPerCategory)

      report.kimoData = {
        productsDiscovered: result.products.length,
        pagesScanned: result.pagesScanned,
        categoriesFound: result.categories.length,
        errors: result.errors.length
      }

      report.errors.push(...result.errors.map(err => ({
        product: 'Catalog Scan',
        message: `${err.url}: ${err.message}`
      })))

      this.updateProgress(options, {
        phase: 'scanning',
        current: 100,
        total: 100,
        percentage: 100,
        currentOperation: 'Catalog scan complete'
      })

      return report.kimoData

    } catch (error) {
      report.errors.push({
        product: 'Catalog Scan',
        message: String(error)
      })
      throw error
    }
  }

  /**
   * Phase 2: Map products to INFOGRA format
   */
  private async mapProducts(
    options: ImportOptions,
    report: ImportReport
  ): Promise<Product[]> {
    this.updateProgress(options, {
      phase: 'mapping',
      current: 0,
      total: report.kimoData.productsDiscovered,
      percentage: 0,
      currentOperation: 'Mapping products to INFOGRA format...'
    })

    const mappedProducts: Product[] = []
    let categoriesMapped = 0
    let brandsMapped = 0
    let warnings = 0

    // For performance, we'll map in batches
    const batchSize = 50
    const kimoProducts = await this.getKimoProductsFromCache() // In production, cache scraped data

    for (let i = 0; i < kimoProducts.length; i += batchSize) {
      const batch = kimoProducts.slice(i, i + batchSize)

      for (const kimoProduct of batch) {
        try {
          const mappingResult: MappingResult = this.mapper.mapKimoProduct(kimoProduct)
          mappedProducts.push(mappingResult.product)

          if (mappingResult.categoryMapped) categoriesMapped++
          if (mappingResult.brandMapped) brandsMapped++
          warnings += mappingResult.warnings.length

          report.warnings.push(...mappingResult.warnings)

        } catch (error) {
          report.errors.push({
            product: kimoProduct.name,
            message: String(error)
          })
        }
      }

      // Update progress
      this.updateProgress(options, {
        phase: 'mapping',
        current: Math.min(i + batchSize, kimoProducts.length),
        total: kimoProducts.length,
        percentage: Math.round((Math.min(i + batchSize, kimoProducts.length) / kimoProducts.length) * 100),
        currentOperation: `Mapping product ${i + 1} of ${kimoProducts.length}`,
        currentProduct: kimoProducts[Math.min(i, kimoProducts.length - 1)]?.name
      })

      // Small delay to prevent blocking
      await this.sleep(10)
    }

    report.mappingData = {
      productsMapped: mappedProducts.length,
      categoriesMapped,
      brandsMapped,
      warnings
    }

    return mappedProducts
  }

  /**
   * Phase 3: Import products to INFOGRA
   */
  private async importProducts(
    products: Product[],
    options: ImportOptions,
    report: ImportReport
  ): Promise<{ productsImported: number; productsUpdated: number; productsSkipped: number; productsFailed: number; categoriesAdded: number; brandsAdded: number }> {
    this.updateProgress(options, {
      phase: 'importing',
      current: 0,
      total: products.length,
      percentage: 0,
      currentOperation: 'Importing products to INFOGRA...'
    })

    let importMode: 'add' | 'update' | 'replace' = 'add'

    switch (options.mode) {
      case 'import-new':
        importMode = 'add'
        break
      case 'update-existing':
        importMode = 'update'
        break
      case 'full-sync':
        importMode = 'update'
        break
      case 'retry-failed':
        importMode = 'add'
        break
    }

    try {
      const result: ImportResult = await this.dataManager.importProducts(products, importMode)

      report.importData = {
        productsImported: result.productsImported,
        productsUpdated: result.productsUpdated,
        productsSkipped: result.productsSkipped,
        productsFailed: result.productsFailed,
        categoriesAdded: result.categoriesAdded,
        brandsAdded: result.brandsAdded
      }

      report.errors.push(...result.errors)
      report.warnings.push(...result.warnings)

      this.updateProgress(options, {
        phase: 'importing',
        current: products.length,
        total: products.length,
        percentage: 100,
        currentOperation: 'Import complete'
      })

      return report.importData

    } catch (error) {
      report.errors.push({
        product: 'Product Import',
        message: String(error)
      })
      throw error
    }
  }

  /**
   * Update progress callback
   */
  private updateProgress(options: ImportOptions, progress: ImportProgress): void {
    if (options.onProgress) {
      options.onProgress(progress)
    }
  }

  /**
   * Get Kimo products from cache (placeholder)
   */
  private async getKimoProductsFromCache(): Promise<KimoProduct[]> {
    // In production, this would retrieve cached scraped data
    // For now, return empty array
    return []
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generate unique import ID
   */
  private generateImportId(): string {
    return `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get import history
   */
  getImportHistory(): Map<string, ImportReport> {
    return new Map(this.importHistory)
  }

  /**
   * Get specific import report
   */
  getImportReport(importId: string): ImportReport | undefined {
    return this.importHistory.get(importId)
  }

  /**
   * Update mapping configuration
   */
  // Temporarily disabled - updateConfig method doesn't exist in mapper
  // updateMappingConfig(config: Partial<MappingConfig>): void {
  //   this.mapper.updateConfig(config)
  // }

  /**
   * Get current mapping configuration
   */
  // Temporarily disabled - getConfig method doesn't exist in mapper
  // getMappingConfig(): MappingConfig {
  //   return this.mapper.getConfig()
  // }

  /**
   * Add custom category mapping
   */
  addCategoryMapping(kimoCategory: string, infograCategory: string): void {
    this.mapper.addCategoryMapping(kimoCategory, infograCategory)
  }

  /**
   * Add custom brand mapping
   */
  addBrandMapping(kimoBrand: string, infograBrand: string): void {
    this.mapper.addBrandMapping(kimoBrand, infograBrand)
  }

  /**
   * Get category mappings
   */
  // Temporarily disabled - getCategoryMapping method doesn't exist in mapper
  // getCategoryMappings(): Map<string, string> {
  //   return this.mapper.getCategoryMapping()
  // }

  /**
   * Get brand mappings
   */
  // Temporarily disabled - getBrandMapping method doesn't exist in mapper
  // getBrandMappings(): Map<string, string> {
  //   return this.mapper.getBrandMapping()
  // }

  /**
   * Export products to CSV
   */
  async exportToCSV(products: Product[]): Promise<string> {
    return this.dataManager.exportToCSV(products)
  }

  /**
   * Export products to Excel
   */
  async exportToExcel(products: Product[]): Promise<Buffer> {
    return this.dataManager.exportToExcel(products)
  }
}
