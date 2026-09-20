// API endpoint to serve products from JSON storage
import { NextRequest, NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'
import { categories as staticCategories, brands as staticBrands } from '@/data/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const storageManager = new JSONStorageManager('I:/Systems/infogra/data/storage')
    
    // Check if we should use JSON storage or fall back to static data
    const useStorage = searchParams.get('storage') === 'true'
    
    // Check for single product request
    const productId = searchParams.get('id')
    if (productId && useStorage) {
      const product = await storageManager.getProductById(productId)
      if (product) {
        return NextResponse.json({
          success: true,
          product,
          source: 'json-storage'
        })
      }
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        product: null
      }, { status: 404 })
    }
    
    // Check for server-side filtering parameters
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10000')
    const priceMin = parseFloat(searchParams.get('priceMin') || '0')
    const priceMax = parseFloat(searchParams.get('priceMax') || '999999')
    const stockMin = parseInt(searchParams.get('stockMin') || '0')
    const stockMax = parseInt(searchParams.get('stockMax') || '999999')
    
    if (useStorage) {
      let products = await storageManager.getProducts()
      
      console.log(`API: Loaded ${products.length} products from storage`)
      
      // Server-side filtering for performance
      if (search || category || brand || status || priceMin > 0 || priceMax < 999999 || stockMin > 0 || stockMax < 999999) {
        products = products.filter((p: any) => {
          const matchesSearch = !search || 
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase())
          
          const matchesCategory = !category || p.category === category || p.category.toLowerCase().includes(category.toLowerCase())
          const matchesBrand = !brand || p.brand?.toLowerCase() === brand.toLowerCase() || p.brand?.toLowerCase().includes(brand.toLowerCase())
          const matchesStatus = !status || p.status === status
          const matchesPriceMin = (p.price || 0) >= priceMin
          const matchesPriceMax = (p.price || 0) <= priceMax
          const matchesStockMin = (p.stock || 0) >= stockMin
          const matchesStockMax = (p.stock || 0) <= stockMax
          
          return matchesSearch && matchesCategory && matchesBrand && matchesStatus && 
                 matchesPriceMin && matchesPriceMax && matchesStockMin && matchesStockMax
        })
        console.log(`API: Filtered to ${products.length} products`)
      }
      
      // Server-side pagination
      const startIndex = (page - 1) * limit
      const paginatedProducts = products.slice(startIndex, startIndex + limit)
      
      const categories = await storageManager.getCategories()
      const brands = await storageManager.getBrands()
      
      console.log(`API: Categories: ${categories.length}, Brands: ${brands.length}`)
      
      // Merge with static categories/brands if storage is empty
      const finalCategories = categories.length > 0 ? categories : staticCategories
      const finalBrands = brands.length > 0 ? brands : staticBrands
      
      return NextResponse.json({
        success: true,
        products: paginatedProducts,
        total: products.length,
        page,
        limit,
        totalPages: Math.ceil(products.length / limit),
        categories: finalCategories,
        brands: finalBrands,
        source: 'json-storage'
      })
    } else {
      // Fall back to static data
      const { products: staticProducts, categories, brands } = await import('@/data/products')
      return NextResponse.json({
        success: true,
        products: staticProducts,
        categories,
        brands,
        source: 'static'
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      products: [],
      categories: staticCategories,
      brands: staticBrands
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storageManager = new JSONStorageManager()
    
    if (body.action === 'search') {
      const products = await storageManager.searchProducts(body.query || '')
      return NextResponse.json({
        success: true,
        products
      })
    }
    
    if (body.action === 'category') {
      const products = await storageManager.getProductsByCategory(body.categoryId || '')
      return NextResponse.json({
        success: true,
        products
      })
    }
    
    if (body.action === 'product') {
      const product = await storageManager.getProductById(body.productId || '')
      return NextResponse.json({
        success: true,
        product
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}