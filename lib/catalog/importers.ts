// Product import types and utilities

export interface ImportedProduct {
  id?: string
  name: string
  sku?: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  brand: string
  description?: string
  specifications?: Record<string, string>
  images?: string[]
  stock?: number
  warranty?: string
  condition?: string
  weight?: number
  dimensions?: string
  attributes?: Record<string, any>
}

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: Array<{ row: number; message: string }>
  duplicates: number
  warnings: string[]
}

export interface ImportConfig {
  skipDuplicates?: boolean
  updateExisting?: boolean
  validateImages?: boolean
  autoCategorize?: boolean
  currencyMultiplier?: number
}

// CSV Import
export async function importFromCSV(
  csvContent: string,
  config: ImportConfig = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
    duplicates: 0,
    warnings: []
  }

  try {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows')
    }

    const headers = parseCSVLine(lines[0])
    const products: ImportedProduct[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i])
        const product = mapCSVToProduct(headers, values, config)
        
        if (product) {
          const validation = validateProduct(product)
          if (validation.valid) {
            products.push(product)
          } else {
            result.errors.push({ row: i + 1, message: validation.error })
            result.failed++
          }
        }
      } catch (error) {
        result.errors.push({ row: i + 1, message: String(error) })
        result.failed++
      }
    }

    // Process products (check duplicates, save, etc.)
    const processResult = await processImportedProducts(products, config)
    result.imported = processResult.imported
    result.duplicates = processResult.duplicates
    result.warnings = processResult.warnings

  } catch (error) {
    result.success = false
    result.errors.push({ row: 0, message: String(error) })
  }

  return result
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

function mapCSVToProduct(
  headers: string[],
  values: string[],
  config: ImportConfig
): ImportedProduct | null {
  const product: Partial<ImportedProduct> = {}
  
  headers.forEach((header, index) => {
    const value = values[index]?.trim()
    if (!value) return

    const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '')

    switch (normalizedHeader) {
      case 'name':
      case 'productname':
      case 'title':
        product.name = value
        break
      case 'sku':
      case 'productsku':
        product.sku = value
        break
      case 'price':
      case 'productprice':
        product.price = parseFloat(value) * (config.currencyMultiplier || 1)
        break
      case 'originalprice':
      case 'compareprice':
        product.originalPrice = parseFloat(value) * (config.currencyMultiplier || 1)
        break
      case 'discount':
      case 'discountpercent':
        product.discount = parseFloat(value)
        break
      case 'category':
      case 'productcategory':
        product.category = value
        break
      case 'brand':
      case 'manufacturer':
        product.brand = value
        break
      case 'description':
      case 'productdescription':
        product.description = value
        break
      case 'stock':
      case 'quantity':
      case 'inventory':
        product.stock = parseInt(value)
        break
      case 'warranty':
        product.warranty = value
        break
      case 'condition':
        product.condition = value
        break
      case 'images':
      case 'imageurls':
        product.images = value.split(',').map(url => url.trim())
        break
      case 'weight':
        product.weight = parseFloat(value)
        break
      case 'dimensions':
        product.dimensions = value
        break
    }
  })

  if (!product.name || !product.price) {
    return null
  }

  return {
    name: product.name || '',
    price: product.price || 0,
    sku: product.sku,
    originalPrice: product.originalPrice,
    discount: product.discount,
    category: product.category || 'Uncategorized',
    brand: product.brand || 'Unknown',
    description: product.description,
    specifications: product.specifications,
    images: product.images,
    stock: product.stock,
    warranty: product.warranty,
    condition: product.condition,
    weight: product.weight,
    dimensions: product.dimensions,
    attributes: product.attributes
  }
}

// JSON Import
export async function importFromJSON(
  jsonContent: string,
  config: ImportConfig = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
    duplicates: 0,
    warnings: []
  }

  try {
    const data = JSON.parse(jsonContent)
    const products = Array.isArray(data) ? data : [data]
    const validProducts: ImportedProduct[] = []

    products.forEach((item, index) => {
      try {
        const product = mapJSONToProduct(item, config)
        const validation = validateProduct(product)
        
        if (validation.valid) {
          validProducts.push(product)
        } else {
          result.errors.push({ row: index + 1, message: validation.error })
          result.failed++
        }
      } catch (error) {
        result.errors.push({ row: index + 1, message: String(error) })
        result.failed++
      }
    })

    const processResult = await processImportedProducts(validProducts, config)
    result.imported = processResult.imported
    result.duplicates = processResult.duplicates
    result.warnings = processResult.warnings

  } catch (error) {
    result.success = false
    result.errors.push({ row: 0, message: 'Invalid JSON format' })
  }

  return result
}

function mapJSONToProduct(
  item: any,
  config: ImportConfig
): ImportedProduct {
  return {
    id: item.id,
    name: item.name || item.title || item.product_name || 'Unknown Product',
    sku: item.sku || item.product_sku,
    price: ((item.price || item.product_price || 0) * (config.currencyMultiplier || 1)),
    originalPrice: item.original_price || item.compare_at_price
      ? ((item.original_price || item.compare_at_price) * (config.currencyMultiplier || 1))
      : undefined,
    discount: item.discount || item.discount_percentage,
    category: item.category || item.product_category || item.type || 'Uncategorized',
    brand: item.brand || item.vendor || item.manufacturer || 'Unknown',
    description: item.description || item.product_description || item.body_html,
    specifications: item.specifications || item.attributes,
    images: item.images || Array.isArray(item.image) ? item.image : item.image ? [item.image] : [],
    stock: item.stock || item.inventory_quantity || item.quantity,
    warranty: item.warranty,
    condition: item.condition || item.product_condition,
    weight: item.weight || item.grams,
    dimensions: item.dimensions,
    attributes: item.attributes || item.metafields
  }
}

// XML Import
export async function importFromXML(
  xmlContent: string,
  config: ImportConfig = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
    duplicates: 0,
    warnings: []
  }

  try {
    // Simple XML parser (in production, use a proper XML library)
    const products = parseXMLProducts(xmlContent)
    const validProducts: ImportedProduct[] = []

    products.forEach((product, index) => {
      const validation = validateProduct(product)
      
      if (validation.valid) {
        validProducts.push(product)
      } else {
        result.errors.push({ row: index + 1, message: validation.error })
        result.failed++
      }
    })

    const processResult = await processImportedProducts(validProducts, config)
    result.imported = processResult.imported
    result.duplicates = processResult.duplicates
    result.warnings = processResult.warnings

  } catch (error) {
    result.success = false
    result.errors.push({ row: 0, message: 'Invalid XML format' })
  }

  return result
}

function parseXMLProducts(xmlContent: string): ImportedProduct[] {
  // Simple XML parsing - in production use a proper XML library
  const products: ImportedProduct[] = []
  
  // Extract product nodes using regex (simplified approach)
  const productRegex = /<product[^>]*>([\s\S]*?)<\/product>/gi
  let match
  
  while ((match = productRegex.exec(xmlContent)) !== null) {
    const productXML = match[1]
    const product: Partial<ImportedProduct> = {}
    
    // Extract fields
    const nameMatch = productXML.match(/<name[^>]*>([^<]+)<\/name>/i)
    if (nameMatch) product.name = nameMatch[1]
    
    const priceMatch = productXML.match(/<price[^>]*>([^<]+)<\/price>/i)
    if (priceMatch) product.price = parseFloat(priceMatch[1])
    
    const skuMatch = productXML.match(/<sku[^>]*>([^<]+)<\/sku>/i)
    if (skuMatch) product.sku = skuMatch[1]
    
    const categoryMatch = productXML.match(/<category[^>]*>([^<]+)<\/category>/i)
    if (categoryMatch) product.category = categoryMatch[1]
    
    const brandMatch = productXML.match(/<brand[^>]*>([^<]+)<\/brand>/i)
    if (brandMatch) product.brand = brandMatch[1]
    
    if (product.name && product.price) {
      products.push({
        name: product.name,
        price: product.price,
        sku: product.sku,
        originalPrice: product.originalPrice,
        discount: product.discount,
        category: product.category || 'Uncategorized',
        brand: product.brand || 'Unknown',
        description: product.description,
        specifications: product.specifications,
        images: product.images,
        stock: product.stock,
        warranty: product.warranty,
        condition: product.condition,
        weight: product.weight,
        dimensions: product.dimensions,
        attributes: product.attributes
      })
    }
  }
  
  return products
}

// Validation
function validateProduct(product: ImportedProduct): { valid: boolean; error: string } {
  if (!product.name || product.name.trim() === '') {
    return { valid: false, error: 'Product name is required' }
  }
  
  if (!product.price || product.price <= 0) {
    return { valid: false, error: 'Valid price is required' }
  }
  
  if (!product.category || product.category.trim() === '') {
    return { valid: false, error: 'Category is required' }
  }
  
  if (!product.brand || product.brand.trim() === '') {
    return { valid: false, error: 'Brand is required' }
  }
  
  return { valid: true, error: '' }
}

// Process imported products (check duplicates, save to database, etc.)
async function processImportedProducts(
  products: ImportedProduct[],
  config: ImportConfig
): Promise<{ imported: number; duplicates: number; warnings: string[] }> {
  const result = { imported: 0, duplicates: 0, warnings: [] as string[] }
  
  // In production, this would:
  // 1. Check for existing products by SKU or name
  // 2. Update existing if config.updateExisting is true
  // 3. Skip duplicates if config.skipDuplicates is true
  // 4. Save new products to database
  // 5. Process and optimize images
  // 6. Generate thumbnails
  // 7. Update search index
  
  // For now, simulate the process
  for (const product of products) {
    // Simulate duplicate check
    const isDuplicate = await checkForDuplicate(product)
    
    if (isDuplicate) {
      result.duplicates++
      if (!config.skipDuplicates) {
        // Would update existing product
        result.imported++
      }
    } else {
      // Would save new product
      result.imported++
    }
  }
  
  return result
}

async function checkForDuplicate(product: ImportedProduct): Promise<boolean> {
  // In production, check database for existing product with same SKU or name
  // For now, return false to simulate no duplicates
  return false
}

// Excel Import (requires additional library like xlsx)
export async function importFromExcel(
  fileBuffer: Buffer,
  config: ImportConfig = {}
): Promise<ImportResult> {
  // This would use a library like 'xlsx' to parse Excel files
  // For now, return a placeholder result
  return {
    success: false,
    imported: 0,
    failed: 0,
    errors: [{ row: 0, message: 'Excel import requires xlsx library' }],
    duplicates: 0,
    warnings: []
  }
}
