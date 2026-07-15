export interface Product {
  id: string
  sku?: string
  name: string
  slug: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  discount?: number
  brand: string
  images: string[]
  specifications: Record<string, string>
  description: string
  features: string[]
  stock: number
  condition: 'new' | 'refurbished'
  warranty: string
  rating: number
  reviews: number
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  subcategories: string[]
  productCount: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  featured: boolean
}

export interface Filter {
  brand: string[]
  category: string[]
  subcategory: string[]
  priceRange: [number, number]
  availability: 'all' | 'in-stock' | 'out-of-stock'
  condition: ('new' | 'refurbished')[]
  rating: number
}

export interface CartItem {
  product: Product
  quantity: number
}
