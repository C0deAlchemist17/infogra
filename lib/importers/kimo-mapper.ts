// Kimo to INFOGRA Product Mapper
// Converts Kimo products to INFOGRA's product schema

import { KimoProduct } from './kimo-scraper'
import { Product, Category, Brand } from '@/types/store'
import { categories as infograCategories, brands as infograBrands } from '@/data/products'

export interface MappingConfig {
  pricing: {
    mode: 'unchanged' | 'fixed' | 'percentage' | 'multiplier'
    value: number
  }
  stockSync: boolean
  fieldOverrides: {
    name: boolean
    description: boolean
    images: boolean
    specifications: boolean
    price: boolean
    stock: boolean
    category: boolean
    brand: boolean
  }
}

export interface MappingResult {
  product: Product
  categoryMapped: boolean
  brandMapped: boolean
  warnings: string[]
}

export class KimoProductMapper {
  private config: MappingConfig
  private categoryMap: Map<string, string>
  private brandMap: Map<string, string>

  constructor(config: Partial<MappingConfig> = {}) {
    this.config = {
      pricing: {
        mode: 'unchanged', // No markup - use original prices
        value: 0
      },
      stockSync: false,
      fieldOverrides: {
        name: true,
        description: true,
        images: true,
        specifications: true,
        price: true,
        stock: false,
        category: true,
        brand: true
      },
      ...config
    }

    this.categoryMap = this.buildCategoryMap()
    this.brandMap = this.buildBrandMap()
  }

  /**
   * Build category mapping from Kimo to INFOGRA
   */
  private buildCategoryMap(): Map<string, string> {
    const map = new Map<string, string>()
    
    // Kimo category (from URL) -> INFOGRA category mappings
    const mappings: Record<string, string> = {
      // PC Components
      'motherboard': 'motherboards',
      'processor': 'processors',
      'graphics card': 'graphics-cards',
      'ram': 'ram',
      'internal 1': 'storage',
      'internal hard disk': 'storage',
      'ssd': 'storage',
      'hdd': 'storage',
      'nvme': 'storage',
      'monitor': 'monitors',
      'case': 'cases',
      'computer case': 'cases',
      'power supply pc': 'power-supplies',
      'pc tower': 'desktops',
      'pc desktop': 'desktops',
      'desktop pc': 'desktops',
      'cooling': 'cooling',
      'internal fans cooling system': 'cooling',
      
      // Peripherals
      'keyboard': 'keyboards',
      'mice': 'mice',
      'mouse': 'mice',
      'headset': 'headsets',
      'speakers': 'headsets',
      'webcam': 'accessories',
      
      // Computers
      'laptops': 'laptops',
      'laptop': 'laptops',
      'desktops': 'desktops',
      'all in one': 'desktops',
      
      // Networking
      'networking': 'routers-networking',
      'router': 'routers-networking',
      'switch': 'routers-networking',
      
      // Printers
      'printers': 'printers',
      'printer': 'printers',
      'scanners': 'printers',
      
      // Accessories
      'cables': 'accessories',
      'adapters': 'accessories',
      'usb flash drive': 'storage',
      'external hard disk': 'storage',
      'power adapters': 'accessories',
      'chargers': 'accessories',
      'audio': 'headsets',
      'earbuds': 'headsets',
      'headphones': 'headsets',
      'microphone': 'headsets',
      'gaming peripherals': 'accessories',
      'personal care': 'accessories',
      'used': 'accessories',
      'cashier systems': 'accessories',
      'security systems': 'accessories',
      
      // Software
      'software': 'software',
      
      // Gaming
      'gaming': 'accessories',
      'game consoles': 'accessories',
      
      // Special categories
      'computer': 'desktops',
      'pc components': 'accessories',
      'new in kimo store': 'accessories',
      'limited time offers': 'accessories'
    }
    
    Object.entries(mappings).forEach(([kimo, infogra]) => {
      map.set(kimo.toLowerCase(), infogra)
    })
    
    return map
  }

  /**
   * Build brand mapping from Kimo to INFOGRA
   */
  private buildBrandMap(): Map<string, string> {
    const map = new Map<string, string>()
    
    // Kimo brand -> INFOGRA brand mappings
    const mappings: Record<string, string> = {
      'asus': 'ASUS',
      'msi': 'MSI',
      'lenovo': 'Lenovo',
      'hp': 'HP',
      'dell': 'Dell',
      'acer': 'Acer',
      'gigabyte': 'GIGABYTE',
      'samsung': 'Samsung',
      'lg': 'LG',
      'intel': 'Intel',
      'amd': 'AMD',
      'nvidia': 'NVIDIA',
      'corsair': 'Corsair',
      'kingston': 'Kingston',
      'crucial': 'Crucial',
      'logitech': 'Logitech',
      'razer': 'Razer',
      'hyperx': 'HyperX',
      'steelseries': 'SteelSeries',
      'tp-link': 'TP-Link',
      'aoc': 'AOC',
      'nzxt': 'NZXT',
      'cooler master': 'Cooler Master',
      'deepcool': 'DeepCool',
      'thermaltake': 'Thermaltake',
      'noctua': 'Noctua',
      'evga': 'EVGA',
      'id-cooling': 'ID-COOLING',
      'zero': 'Zero',
      'tecno': 'Tecno',
      'g.skill': 'G.Skill',
      'blisbond': 'BLISBOND',
      'mix max': 'MIX MAX',
      'momo': 'MOMO'
    }
    
    Object.entries(mappings).forEach(([kimo, infogra]) => {
      map.set(kimo.toLowerCase(), infogra)
    })
    
    return map
  }

  /**
   * Map a Kimo product to INFOGRA format
   */
  mapKimoProduct(kimoProduct: KimoProduct): MappingResult {
    const warnings: string[] = []
    
    // Map category
    const kimoCategory = kimoProduct.category.toLowerCase()
    const infograCategory = this.categoryMap.get(kimoCategory) || 'accessories'
    const categoryMapped = this.categoryMap.has(kimoCategory)
    
    if (!categoryMapped) {
      warnings.push(`Category not mapped: ${kimoProduct.category} -> ${infograCategory}`)
    }
    
    // Map brand
    const kimoBrand = kimoProduct.brand?.toLowerCase() || 'unknown'
    const infograBrand = this.brandMap.get(kimoBrand) || (kimoProduct.brand || 'Unknown')
    const brandMapped = this.brandMap.has(kimoBrand)
    
    if (!brandMapped && kimoProduct.brand) {
      warnings.push(`Brand not mapped: ${kimoProduct.brand} -> ${infograBrand}`)
    }
    
    // Calculate price
    const sourcePrice = kimoProduct.price
    let finalPrice = sourcePrice
    
    if (this.config.fieldOverrides.price) {
      switch (this.config.pricing.mode) {
        case 'percentage':
          finalPrice = sourcePrice * (1 + this.config.pricing.value / 100)
          break
        case 'fixed':
          finalPrice = sourcePrice + this.config.pricing.value
          break
        case 'multiplier':
          finalPrice = sourcePrice * this.config.pricing.value
          break
        case 'unchanged':
          finalPrice = sourcePrice
          break
      }
    }
    
    // Calculate discount if original price exists
    let discount = 0
    if (kimoProduct.originalPrice && kimoProduct.originalPrice > sourcePrice) {
      discount = Math.round(((kimoProduct.originalPrice - sourcePrice) / kimoProduct.originalPrice) * 100)
    }
    
    // Clean description
    const cleanedDescription = this.cleanDescription(kimoProduct.description || '')
    
    // Generate slug
    const slug = this.generateSlug(infograCategory, kimoProduct.name)
    
    // Generate ID
    const id = kimoProduct.id || this.generateId(kimoProduct.name, kimoProduct.brand)
    
    // Build product
    const product: Product = {
      id,
      sku: kimoProduct.sku || this.generateId(kimoProduct.name, kimoProduct.brand),
      name: this.config.fieldOverrides.name ? kimoProduct.name : kimoProduct.name,
      slug,
      category: this.config.fieldOverrides.category ? infograCategory : infograCategory,
      subcategory: kimoProduct.subcategory || '',
      price: finalPrice,
      originalPrice: kimoProduct.originalPrice || sourcePrice,
      discount,
      brand: this.config.fieldOverrides.brand ? infograBrand : infograBrand,
      images: this.config.fieldOverrides.images ? kimoProduct.images : kimoProduct.images,
      specifications: this.config.fieldOverrides.specifications ? kimoProduct.specifications || {} : {},
      description: this.config.fieldOverrides.description ? cleanedDescription : cleanedDescription,
      features: this.extractFeatures(cleanedDescription),
      stock: this.config.fieldOverrides.stock ? this.parseStock(kimoProduct.stock || '100') : 100,
      condition: (kimoProduct.condition === 'new' || kimoProduct.condition === 'refurbished') ? kimoProduct.condition : 'new',
      warranty: kimoProduct.warranty || '1 Year Warranty',
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10,
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      syncPrice: true, // Default to true, allows synchronization
      sourceMetadata: {
        source: 'Kimo Store',
        sourceProductId: kimoProduct.id,
        sourceUrl: kimoProduct.url,
        sourceSku: kimoProduct.sku,
        lastSeen: new Date().toISOString(),
        lastSynced: new Date().toISOString(),
        sourcePrice: sourcePrice
      }
    }
    
    return {
      product,
      categoryMapped,
      brandMapped,
      warnings
    }
  }

  /**
   * Clean description text
   */
  private cleanDescription(description: string): string {
    // Remove HTML tags
    let cleaned = description.replace(/<[^>]*>/g, '')
    
    // Remove tracking scripts
    cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    
    // Remove source-site buttons and navigation
    cleaned = cleaned.replace(/Add to Cart|Buy Now|View Details|Share|Wishlist/gi, '')
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    
    // Limit length
    if (cleaned.length > 2000) {
      cleaned = cleaned.substring(0, 2000) + '...'
    }
    
    return cleaned
  }

  /**
   * Extract features from description
   */
  private extractFeatures(description: string): string[] {
    const features: string[] = []
    
    // Look for common feature patterns
    const featurePatterns = [
      /(\d+ Year Warranty)/gi,
      /(\d+ Years Warranty)/gi,
      /(\d+ Year Guarantee)/gi,
      /(\d+ Years Guarantee)/gi,
      /(Bluetooth V?\d+\.?\d*)/gi,
      /(Wi-Fi \d+)/gi,
      /(USB Type-C)/gi,
      /(USB \d+\.?\d*)/gi,
      /(Warranty: [^,.]+)/gi,
      /(Color: [^,.]+)/gi,
      /(Memory: [^,.]+)/gi,
      /(Storage: [^,.]+)/gi,
      /(Display: [^,.]+)/gi,
      /(Processor: [^,.]+)/gi,
      /(Graphics: [^,.]+)/gi
    ]
    
    featurePatterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        features.push(...matches)
      }
    })
    
    return features.slice(0, 10) // Limit to 10 features
  }

  /**
   * Parse stock string to number
   */
  private parseStock(stock: string | number): number {
    if (typeof stock === 'number') return stock
    
    const lower = stock.toLowerCase()
    if (lower.includes('out of stock') || lower.includes('unavailable')) {
      return 0
    }
    if (lower.includes('in stock') || lower.includes('available')) {
      return 100 // Default stock for available items
    }
    
    // Try to extract number
    const match = stock.match(/\d+/)
    return match ? parseInt(match[0]) : 100
  }

  /**
   * Generate URL slug
   */
  private generateSlug(category: string, name: string): string {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
    const nameSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    return `${categorySlug}/${nameSlug}`
  }

  /**
   * Generate product ID
   */
  private generateId(name: string, brand?: string): string {
    const base = (brand ? `${brand} ` : '') + name
    return base
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Get unmapped categories
   */
  getUnmappedCategories(): string[] {
    return Array.from(this.categoryMap.keys()).filter(key => 
      key === 'unknown' || key === 'uncategorized'
    )
  }

  /**
   * Get unmapped brands
   */
  getUnmappedBrands(): string[] {
    return Array.from(this.brandMap.keys()).filter(key => 
      key === 'unknown'
    )
  }

  /**
   * Add custom category mapping
   */
  addCategoryMapping(kimoCategory: string, infograCategory: string): void {
    this.categoryMap.set(kimoCategory.toLowerCase(), infograCategory)
  }

  /**
   * Add custom brand mapping
   */
  addBrandMapping(kimoBrand: string, infograBrand: string): void {
    this.brandMap.set(kimoBrand.toLowerCase(), infograBrand)
  }
}
