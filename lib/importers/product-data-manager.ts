// Product Data Manager
// Manages saving imported products to INFOGRA's data files

import { Product, Category, Brand } from '@/types/store'
import * as fs from 'fs'
import * as path from 'path'

export interface ProductDataFile {
  products: Product[]
  categories: Category[]
  brands: Brand[]
}

export interface ImportResult {
  success: boolean
  productsImported: number
  productsUpdated: number
  productsSkipped: number
  productsFailed: number
  categoriesAdded: number
  brandsAdded: number
  errors: Array<{ product: string; message: string }>
  warnings: string[]
}

export class ProductDataManager {
  private dataPath: string
  private productsFile: string
  private categoriesFile: string
  private brandsFile: string

  constructor(dataPath: string = 'D:/Systems/infogra/data') {
    this.dataPath = dataPath
    this.productsFile = path.join(dataPath, 'products.ts')
    this.categoriesFile = path.join(dataPath, 'categories.ts')
    this.brandsFile = path.join(dataPath, 'brands.ts')
  }

  /**
   * Load existing product data
   */
  async loadProductData(): Promise<ProductDataFile> {
    try {
      // Import the existing data files
      const { products: existingProducts } = await import('@/data/products')
      const { categories: existingCategories } = await import('@/data/products')
      const { brands: existingBrands } = await import('@/data/products')

      return {
        products: existingProducts || [],
        categories: existingCategories || [],
        brands: existingBrands || []
      }
    } catch (error) {
      console.error('Error loading product data:', error)
      return {
        products: [],
        categories: [],
        brands: []
      }
    }
  }

  /**
   * Save product data to files
   */
  async saveProductData(data: ProductDataFile): Promise<void> {
    try {
      // Save everything in the main products file
      await this.saveProductsFile(data.products, data.categories, data.brands)
      
    } catch (error) {
      console.error('Error saving product data:', error)
      throw error
    }
  }

  /**
   * Save products to products.ts file
   */
  private async saveProductsFile(products: Product[], categories: Category[], brands: Brand[]): Promise<void> {
    const fileContent = this.generateProductsFileContent(products, categories, brands)
    fs.writeFileSync(this.productsFile, fileContent, 'utf-8')
  }

  /**
   * Generate products.ts file content
   */
  private generateProductsFileContent(products: Product[], categories: Category[], brands: Brand[]): string {
    const productImports = `import { Product, Category, Brand } from '@/types/store'`
    
    const categoriesArray = this.generateCategoriesArray(categories)
    const brandsArray = this.generateBrandsArray(brands)
    const productsArray = this.generateProductsArray(products)

    return `${productImports}

${categoriesArray}

${brandsArray}

// Products - Source: Kimo Store (imported) + INFOGRA originals
export const products: Product[] = [
${productsArray}
]
`
  }

  /**
   * Generate categories array
   */
  private generateCategoriesArray(categories: Category[]): string {
    return `export const categories: Category[] = [
${categories.map(cat => this.formatCategory(cat)).join(',\n')}
]`
  }

  /**
   * Generate brands array
   */
  private generateBrandsArray(brands: Brand[]): string {
    return `export const brands: Brand[] = [
${brands.map(brand => this.formatBrand(brand)).join(',\n')}
]`
  }

  /**
   * Generate products array
   */
  private generateProductsArray(products: Product[]): string {
    return products.map(product => this.formatProduct(product)).join(',\n')
  }

  /**
   * Format a category object
   */
  private formatCategory(category: Category): string {
    return `  { id: '${category.id}', name: '${category.name}', slug: '${category.slug}', icon: '${category.icon}', subcategories: ${JSON.stringify(category.subcategories)}, productCount: ${category.productCount} }`
  }

  /**
   * Format a brand object
   */
  private formatBrand(brand: Brand): string {
    return `  { id: '${brand.id}', name: '${brand.name}', slug: '${brand.slug}', logo: '${brand.logo}', featured: ${brand.featured} }`
  }

  /**
   * Format a product object
   */
  private formatProduct(product: Product): string {
    return `  {
    id: '${product.id}',
    sku: '${product.sku || ''}',
    name: '${this.escapeString(product.name)}',
    slug: '${product.slug}',
    category: '${product.category}',
    subcategory: '${product.subcategory}',
    price: ${product.price},
    originalPrice: ${product.originalPrice || 0},
    discount: ${product.discount || 0},
    brand: '${this.escapeString(product.brand)}',
    images: ${JSON.stringify(product.images)},
    specifications: ${JSON.stringify(product.specifications)},
    description: '${this.escapeString(product.description || '')}',
    features: ${JSON.stringify(product.features)},
    stock: ${product.stock},
    condition: '${product.condition}',
    warranty: '${product.warranty || ''}',
    rating: ${product.rating},
    reviews: ${product.reviews},
    isNew: ${product.isNew || false},
    isBestSeller: ${product.isBestSeller || false},
    isFeatured: ${product.isFeatured || false}
  }`
  }

  /**
   * Escape string for TypeScript
   */
  private escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  /**
   * Convert to title case
   */
  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  /**
   * Get category icon
   */
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'laptops': '💻',
      'desktops': '🖥️',
      'monitors': '🖥️',
      'graphics-cards': '🎮',
      'processors': '⚡',
      'motherboards': '🔧',
      'ram': '💾',
      'storage': '💿',
      'power-supplies': '🔌',
      'cases': '📦',
      'cooling': '❄️',
      'keyboards': '⌨️',
      'mice': '🖱️',
      'headsets': '🎧',
      'routers-networking': '📡',
      'printers': '🖨️',
      'accessories': '🎁',
      'gaming-peripherals': '🎮',
      'software': '💿',
      'security-systems': '🔒',
      'cashier-systems': '💰',
      'personal-care': '🧴',
      'used': '♻️'
    }
    
    return icons[category] || '📦'
  }

  /**
   * Get brand logo
   */
  private getBrandLogo(brand: string): string {
    const logos: Record<string, string> = {
      'asus': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
      'msi': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/MSI_logo.svg',
      'lenovo': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_logo_2015.svg',
      'hp': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/HP_logo_2012.svg',
      'dell': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Dell_logo.svg',
      'acer': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_Logo.svg',
      'nvidia': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
      'amd': 'https://upload.wikimedia.org/wikipedia/commons/2/22/AMD_logo.svg',
      'intel': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo.svg',
      'logitech': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Logitech_logo.svg',
      'corsair': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Corsair_Gaming_Logo.svg',
      'razer': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Razer_logo.svg',
      'samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      'gigabyte': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Gigabyte_Technology_logo.svg',
      'kingston': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Kingston_Technology_logo.svg',
      'crucial': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Crucial_logo.svg'
    }
    
    return logos[brand.toLowerCase()] || ''
  }

  /**
   * Check if brand is featured
   */
  private isFeaturedBrand(brand: string): boolean {
    const featuredBrands = ['asus', 'msi', 'lenovo', 'hp', 'dell', 'acer', 'nvidia', 'amd', 'intel', 'logitech', 'corsair', 'razer', 'gigabyte']
    return featuredBrands.includes(brand.toLowerCase())
  }

  /**
   * Check for duplicate products
   */
  checkForDuplicates(newProducts: Product[], existingProducts: Product[]): {
    duplicates: Product[]
    unique: Product[]
  } {
    const existingIds = new Set(existingProducts.map(p => p.id))
    const existingSkus = new Set(existingProducts.map(p => p.sku).filter(Boolean))
    
    const duplicates: Product[] = []
    const unique: Product[] = []
    
    newProducts.forEach(product => {
      if (existingIds.has(product.id) || (product.sku && existingSkus.has(product.sku))) {
        duplicates.push(product)
      } else {
        unique.push(product)
      }
    })
    
    return { duplicates, unique }
  }

  /**
   * Merge products (update existing, add new)
   */
  mergeProducts(newProducts: Product[], existingProducts: Product[]): {
    merged: Product[]
    added: number
    updated: number
  } {
    const merged = [...existingProducts]
    let added = 0
    let updated = 0
    
    newProducts.forEach(newProduct => {
      const existingIndex = merged.findIndex(p => p.id === newProduct.id)
      
      if (existingIndex >= 0) {
        // Update existing product
        merged[existingIndex] = { ...merged[existingIndex], ...newProduct }
        updated++
      } else {
        // Add new product
        merged.push(newProduct)
        added++
      }
    })
    
    return { merged, added, updated }
  }

  /**
   * Import products to data files
   */
  async importProducts(
    newProducts: Product[],
    mode: 'add' | 'update' | 'replace' = 'add'
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      productsImported: 0,
      productsUpdated: 0,
      productsSkipped: 0,
      productsFailed: 0,
      categoriesAdded: 0,
      brandsAdded: 0,
      errors: [],
      warnings: []
    }

    try {
      // Load existing data
      const existingData = await this.loadProductData()
      
      // Process based on mode
      let finalProducts: Product[]
      
      switch (mode) {
        case 'add':
          const { duplicates, unique } = this.checkForDuplicates(newProducts, existingData.products)
          finalProducts = [...existingData.products, ...unique]
          result.productsImported = unique.length
          result.productsSkipped = duplicates.length
          if (duplicates.length > 0) {
            result.warnings.push(`${duplicates.length} duplicate products skipped`)
          }
          break
          
        case 'update':
          const mergeResult = this.mergeProducts(newProducts, existingData.products)
          finalProducts = mergeResult.merged
          result.productsImported = mergeResult.added
          result.productsUpdated = mergeResult.updated
          break
          
        case 'replace':
          finalProducts = newProducts
          result.productsImported = newProducts.length
          break
      }

      // Extract new categories
      const newCategories = this.extractNewCategories(finalProducts, existingData.categories)
      const finalCategories = [...existingData.categories, ...newCategories]
      result.categoriesAdded = newCategories.length

      // Extract new brands
      const newBrands = this.extractNewBrands(finalProducts, existingData.brands)
      const finalBrands = [...existingData.brands, ...newBrands]
      result.brandsAdded = newBrands.length

      // Save the updated data
      await this.saveProductData({
        products: finalProducts,
        categories: finalCategories,
        brands: finalBrands
      })

    } catch (error) {
      result.success = false
      result.errors.push({
        product: 'All',
        message: String(error)
      })
    }

    return result
  }

  /**
   * Extract new categories
   */
  private extractNewCategories(products: Product[], existingCategories: Category[]): Category[] {
    const existingIds = new Set(existingCategories.map(c => c.id))
    const newCategories: Category[] = []
    
    const uniqueCategories = new Map<string, { name: string; icon: string; subcategories: Set<string> }>()
    
    products.forEach(product => {
      if (!uniqueCategories.has(product.category)) {
        uniqueCategories.set(product.category, {
          name: this.toTitleCase(product.category),
          icon: this.getCategoryIcon(product.category),
          subcategories: new Set()
        })
      }
      
      if (product.subcategory) {
        uniqueCategories.get(product.category)!.subcategories.add(product.subcategory)
      }
    })

    Array.from(uniqueCategories.entries()).forEach(([id, data]) => {
      if (!existingIds.has(id)) {
        newCategories.push({
          id,
          name: data.name,
          slug: id,
          icon: data.icon,
          subcategories: Array.from(data.subcategories),
          productCount: products.filter(p => p.category === id).length
        })
      }
    })

    return newCategories
  }

  /**
   * Extract new brands
   */
  private extractNewBrands(products: Product[], existingBrands: Brand[]): Brand[] {
    const existingIds = new Set(existingBrands.map(b => b.id))
    const newBrands: Brand[] = []
    
    const uniqueBrands = new Map<string, { name: string; logo: string; featured: boolean }>()
    
    products.forEach(product => {
      if (!uniqueBrands.has(product.brand)) {
        uniqueBrands.set(product.brand, {
          name: product.brand,
          logo: this.getBrandLogo(product.brand),
          featured: this.isFeaturedBrand(product.brand)
        })
      }
    })

    Array.from(uniqueBrands.entries()).forEach(([name, data]) => {
      const id = name.toLowerCase().replace(/\s+/g, '-')
      if (!existingIds.has(id)) {
        newBrands.push({
          id,
          name: data.name,
          slug: id,
          logo: data.logo,
          featured: data.featured
        })
      }
    })

    return newBrands
  }

  /**
   * Export products to CSV
   */
  async exportToCSV(products: Product[]): Promise<string> {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Subcategory', 'Price', 'Original Price', 'Discount', 'Brand', 'Stock', 'Condition', 'Warranty', 'Rating', 'Reviews']
    const rows = products.map(product => [
      product.id,
      product.sku || '',
      product.name,
      product.category,
      product.subcategory,
      product.price,
      product.originalPrice || '',
      product.discount || '',
      product.brand,
      product.stock,
      product.condition,
      product.warranty || '',
      product.rating,
      product.reviews
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
  }

  /**
   * Export products to Excel
   */
  async exportToExcel(products: Product[]): Promise<Buffer> {
    // This would use a library like xlsx or exceljs
    // For now, return CSV as fallback
    const csv = await this.exportToCSV(products)
    return Buffer.from(csv)
  }
}
