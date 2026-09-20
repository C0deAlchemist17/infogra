// JSON-based storage manager for imported products
// More sustainable than rewriting large TypeScript files

import { Product, Category, Brand } from '@/types/store'
import * as fs from 'fs'
import * as path from 'path'

export interface ProductStorage {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  metadata: {
    lastUpdated: string
    totalProducts: number
    importSource: string
  }
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

export class JSONStorageManager {
  private storagePath: string
  private productsFile: string

  constructor(storagePath: string = 'I:/Systems/infogra/data/storage') {
    this.storagePath = storagePath
    this.productsFile = path.join(storagePath, 'products.json')

    // Ensure storage directory exists
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true })
    }
  }

  /**
   * Load products from storage
   */
  async loadProducts(): Promise<{ products: Product[]; categories: Category[]; brands: Brand[] }> {
    const storage = await this.loadStorage()
    return {
      products: storage.products,
      categories: storage.categories,
      brands: storage.brands
    }
  }

  /**
   * Save products directly to storage
   */
  async saveProducts(products: Product[]): Promise<void> {
    const storage = await this.loadStorage()
    
    // Re-extract categories and brands from new product list
    const categories = this.extractNewCategories(products, [])
    const brands = this.extractNewBrands(products, [])
    
    await this.saveStorage({
      products,
      categories,
      brands,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalProducts: products.length,
        importSource: 'Merged'
      }
    })
  }

  /**
   * Create backup of current storage
   */
  async createBackup(): Promise<string> {
    const storage = await this.loadStorage()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const backupFile = path.join(this.storagePath, `products-backup-${timestamp}.json`)
    
    fs.writeFileSync(backupFile, JSON.stringify(storage, null, 2))
    console.log(`Backup created: ${backupFile}`)
    
    return backupFile
  }
  async loadStorage(): Promise<ProductStorage> {
    try {
      if (!fs.existsSync(this.productsFile)) {
        // Initialize with empty storage
        const initialStorage: ProductStorage = {
          products: [],
          categories: [],
          brands: [],
          metadata: {
            lastUpdated: new Date().toISOString(),
            totalProducts: 0,
            importSource: 'INFOGRA'
          }
        }
        await this.saveStorage(initialStorage)
        return initialStorage
      }

      const data = fs.readFileSync(this.productsFile, 'utf-8')
      return JSON.parse(data) as ProductStorage
    } catch (error) {
      console.error('Error loading storage:', error)
      throw error
    }
  }

  /**
   * Save product storage
   */
  async saveStorage(storage: ProductStorage): Promise<void> {
    try {
      storage.metadata.lastUpdated = new Date().toISOString()
      storage.metadata.totalProducts = storage.products.length
      
      fs.writeFileSync(this.productsFile, JSON.stringify(storage, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving storage:', error)
      throw error
    }
  }

  /**
   * Import products to JSON storage
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
      // Load existing storage
      const storage = await this.loadStorage()
      
      // Process based on mode
      let finalProducts: Product[]
      
      switch (mode) {
        case 'add':
          const { duplicates, unique } = this.checkForDuplicates(newProducts, storage.products)
          finalProducts = [...storage.products, ...unique]
          result.productsImported = unique.length
          result.productsSkipped = duplicates.length
          if (duplicates.length > 0) {
            result.warnings.push(`${duplicates.length} duplicate products skipped`)
          }
          break
          
        case 'update':
          const mergeResult = this.mergeProducts(newProducts, storage.products)
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
      const newCategories = this.extractNewCategories(finalProducts, storage.categories)
      const finalCategories = [...storage.categories, ...newCategories]
      result.categoriesAdded = newCategories.length

      // Extract new brands
      const newBrands = this.extractNewBrands(finalProducts, storage.brands)
      const finalBrands = [...storage.brands, ...newBrands]
      result.brandsAdded = newBrands.length

      // Save the updated storage
      await this.saveStorage({
        products: finalProducts,
        categories: finalCategories,
        brands: finalBrands,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalProducts: finalProducts.length,
          importSource: 'Kimo Store'
        }
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
        const existingProduct = merged[existingIndex]
        
        // Respect manual price override
        if (existingProduct.syncPrice === false) {
          // Keep existing price, update other fields
          merged[existingIndex] = { 
            ...existingProduct, 
            ...newProduct, 
            price: existingProduct.price 
          }
        } else {
          // Update all fields including price
          merged[existingIndex] = { ...existingProduct, ...newProduct }
        }
        
        // Update lastSynced timestamp
        if (newProduct.sourceMetadata) {
          merged[existingIndex].sourceMetadata = {
            ...existingProduct.sourceMetadata,
            ...newProduct.sourceMetadata,
            lastSynced: new Date().toISOString()
          }
        }
        
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
   * Add a single product
   */
  async addProduct(product: Product): Promise<boolean> {
    const storage = await this.loadStorage()
    storage.products.push(product)
    await this.saveStorage(storage)
    return true
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    const storage = await this.loadStorage()
    return storage.products
  }

  /**
   * Get all products (alias for compatibility)
   */
  async getAllProducts(): Promise<Product[]> {
    return this.getProducts()
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const storage = await this.loadStorage()
    return storage.categories
  }

  /**
   * Get all brands
   */
  async getBrands(): Promise<Brand[]> {
    const storage = await this.loadStorage()
    return storage.brands
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    const storage = await this.loadStorage()
    const lowerQuery = query.toLowerCase()
    
    return storage.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const storage = await this.loadStorage()
    return storage.products.filter(p => p.category === categoryId)
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<Product | undefined> {
    const storage = await this.loadStorage()
    return storage.products.find(p => p.id === productId)
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
    const storage = await this.loadStorage()
    const index = storage.products.findIndex(p => p.id === productId)
    
    if (index >= 0) {
      storage.products[index] = { 
        ...storage.products[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      await this.saveStorage(storage)
      return true
    }
    
    return false
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    const storage = await this.loadStorage()
    const initialLength = storage.products.length
    storage.products = storage.products.filter(p => p.id !== productId)
    
    if (storage.products.length < initialLength) {
      await this.saveStorage(storage)
      return true
    }
    
    return false
  }

  /**
   * Export to CSV
   */
  async exportToCSV(): Promise<string> {
    const storage = await this.loadStorage()
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Subcategory', 'Price', 'Original Price', 'Discount', 'Brand', 'Stock', 'Condition', 'Warranty', 'Rating', 'Reviews']
    const rows = storage.products.map(product => [
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
   * Helper methods
   */
  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

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

  private isFeaturedBrand(brand: string): boolean {
    const featuredBrands = ['asus', 'msi', 'lenovo', 'hp', 'dell', 'acer', 'nvidia', 'amd', 'intel', 'logitech', 'corsair', 'razer', 'gigabyte']
    return featuredBrands.includes(brand.toLowerCase())
  }
}
