// Elhamd Product Mapper - Map Elhamd products to INFOGRA format
import { ElhamdProduct } from './elhamd-scraper'
import { Product } from '@/types/store'

export interface ElhamdMappingConfig {
  pricing: {
    mode: 'unchanged' | 'percentage' | 'fixed' | 'multiplier'
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

export class ElhamdProductMapper {
  private config: ElhamdMappingConfig
  private categoryMap: Map<string, string>
  private brandMap: Map<string, string>

  constructor(config: ElhamdMappingConfig) {
    this.config = config
    this.categoryMap = this.buildCategoryMap()
    this.brandMap = this.buildBrandMap()
  }

  private buildCategoryMap(): Map<string, string> {
    const map = new Map<string, string>()
    
    const mappings: Record<string, string> = {
      // Elhamd categories -> INFOGRA categories
      'laptops': 'laptops',
      'mobile': 'accessories',
      'phone': 'accessories',
      'tablets': 'tablets',
      'accessories': 'accessories',
      'headphones': 'headsets',
      'earbuds': 'headsets',
      'chargers': 'accessories',
      'cables': 'accessories',
      'audio': 'headsets',
      'computers': 'desktops',
      'monitors': 'monitors',
      'keyboards': 'accessories',
      'mice': 'accessories',
      'printers': 'accessories',
      'network': 'accessories',
      'router': 'accessories',
      'power': 'accessories',
      'storage': 'accessories',
      'memory': 'accessories',
      'processor': 'accessories',
      'graphics': 'accessories',
      'motherboard': 'accessories',
      'cases': 'accessories',
      'cooling': 'accessories',
      'software': 'software',
      'gaming': 'accessories',
      'smart home': 'accessories',
      'security': 'accessories',
      'cameras': 'accessories',
      'tv': 'accessories',
      'audio systems': 'headsets',
      'home appliances': 'accessories',
      'kitchen': 'accessories',
      'personal care': 'accessories'
    }
    
    Object.entries(mappings).forEach(([elhamd, infogra]) => {
      map.set(elhamd.toLowerCase(), infogra)
    })
    
    return map
  }

  private buildBrandMap(): Map<string, string> {
    const map = new Map<string, string>()
    
    const mappings: Record<string, string> = {
      'apple': 'Apple',
      'samsung': 'Samsung',
      'xiaomi': 'Xiaomi',
      'huawei': 'Huawei',
      'lenovo': 'Lenovo',
      'hp': 'HP',
      'dell': 'Dell',
      'asus': 'ASUS',
      'msi': 'MSI',
      'acer': 'Acer',
      'lg': 'LG',
      'sony': 'Sony',
      'philips': 'Philips',
      'canon': 'Canon',
      'epson': 'Epson',
      'logitech': 'Logitech',
      'razer': 'Razer',
      'corsair': 'Corsair',
      'kingston': 'Kingston',
      'sandisk': 'SanDisk',
      'seagate': 'Seagate',
      'western digital': 'Western Digital',
      'toshiba': 'Toshiba',
      'microsoft': 'Microsoft',
      'intel': 'Intel',
      'amd': 'AMD',
      'nvidia': 'NVIDIA'
    }
    
    Object.entries(mappings).forEach(([elhamd, infogra]) => {
      map.set(elhamd.toLowerCase(), infogra)
    })
    
    return map
  }

  mapElhamdProduct(elhamdProduct: ElhamdProduct): { product: Product; categoryMapped: boolean; brandMapped: boolean; warnings: string[] } {
    const warnings: string[] = []
    
    // Map category
    const elhamdCategory = elhamdProduct.category.toLowerCase()
    const infograCategory = this.categoryMap.get(elhamdCategory) || 'accessories'
    const categoryMapped = this.categoryMap.has(elhamdCategory)
    
    if (!categoryMapped) {
      warnings.push(`Category not mapped: ${elhamdProduct.category} -> ${infograCategory}`)
    }
    
    // Map brand (extract from name if not directly available)
    const elhamdBrand = elhamdProduct.brand?.toLowerCase() || this.extractBrandFromName(elhamdProduct.name)
    const infograBrand = this.brandMap.get(elhamdBrand) || (elhamdProduct.brand || 'Unknown')
    const brandMapped = this.brandMap.has(elhamdBrand)
    
    if (!brandMapped && elhamdProduct.brand) {
      warnings.push(`Brand not mapped: ${elhamdProduct.brand} -> ${infograBrand}`)
    }
    
    // Calculate price
    const sourcePrice = elhamdProduct.price
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
    if (elhamdProduct.originalPrice && elhamdProduct.originalPrice > sourcePrice) {
      discount = Math.round(((elhamdProduct.originalPrice - sourcePrice) / elhamdProduct.originalPrice) * 100)
    }
    
    // Clean description
    const cleanedDescription = this.cleanDescription(elhamdProduct.description || '')
    
    // Generate slug
    const slug = this.generateSlug(infograCategory, elhamdProduct.name)
    
    // Generate ID
    const id = elhamdProduct.id || this.generateId(elhamdProduct.name, elhamdProduct.brand)
    
    // Build product
    const product: Product = {
      id,
      sku: elhamdProduct.sku || this.generateId(elhamdProduct.name, elhamdProduct.brand),
      name: this.config.fieldOverrides.name ? elhamdProduct.name : elhamdProduct.name,
      slug,
      category: this.config.fieldOverrides.category ? infograCategory : infograCategory,
      subcategory: '',
      price: finalPrice,
      originalPrice: elhamdProduct.originalPrice || sourcePrice,
      discount,
      brand: this.config.fieldOverrides.brand ? infograBrand : infograBrand,
      images: this.config.fieldOverrides.images ? elhamdProduct.images : elhamdProduct.images,
      specifications: this.config.fieldOverrides.specifications ? elhamdProduct.specifications || {} : {},
      description: this.config.fieldOverrides.description ? cleanedDescription : cleanedDescription,
      features: this.extractFeatures(cleanedDescription),
      stock: this.config.fieldOverrides.stock ? this.parseStock(elhamdProduct.stock || '100') : 100,
      condition: 'new',
      warranty: '1 Year Warranty',
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10,
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      syncPrice: true,
      sourceMetadata: {
        source: 'Elhamd Store',
        sourceProductId: elhamdProduct.id,
        sourceUrl: elhamdProduct.url,
        sourceSku: elhamdProduct.sku,
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

  private extractBrandFromName(name: string): string {
    const brandPatterns = [
      'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'HP', 'Dell', 'ASUS', 'MSI', 'Acer',
      'LG', 'Sony', 'Philips', 'Canon', 'Epson', 'Logitech', 'Razer', 'Corsair', 'Kingston',
      'SanDisk', 'Seagate', 'Western Digital', 'Toshiba', 'Microsoft', 'Intel', 'AMD', 'NVIDIA'
    ]
    
    const lowerName = name.toLowerCase()
    for (const brand of brandPatterns) {
      if (lowerName.includes(brand.toLowerCase())) {
        return brand
      }
    }
    
    return 'unknown'
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
  }

  private extractFeatures(description: string): string[] {
    const features: string[] = []
    const sentences = description.split(/[.!?]/)
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim()
      if (trimmed.length > 10 && trimmed.length < 100) {
        features.push(trimmed)
      }
    })
    
    return features.slice(0, 5)
  }

  private parseStock(stock: string): number {
    if (stock.toLowerCase().includes('out of stock') || stock.toLowerCase().includes('unavailable')) {
      return 0
    }
    if (stock.toLowerCase().includes('in stock')) {
      return 100
    }
    const match = stock.match(/\d+/)
    return match ? parseInt(match[0]) : 100
  }

  private generateSlug(category: string, name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100)
    
    return `${category}/${slug}`
  }

  private generateId(name: string, brand?: string): string {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
    
    return `${brand ? brand.toLowerCase() + '-' : ''}${id}`
  }
}