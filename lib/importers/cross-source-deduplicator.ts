// Cross-source deduplication - Compare Kimo and Elhamd products, keep cheaper
import { Product } from '@/types/store'

export interface DuplicateMatch {
  kimoProduct: Product
  elhamdProduct: Product
  matchType: 'id' | 'sku' | 'name' | 'url'
  confidence: number
}

export class CrossSourceDeduplicator {
  /**
   * Find duplicates between Kimo and Elhamd products
   */
  findDuplicates(kimoProducts: Product[], elhamdProducts: Product[]): DuplicateMatch[] {
    const duplicates: DuplicateMatch[] = []
    const processed = new Set<string>()

    for (const kimoProduct of kimoProducts) {
      for (const elhamdProduct of elhamdProducts) {
        const match = this.compareProducts(kimoProduct, elhamdProduct)
        
        if (match.confidence > 0.7) {
          const key = `${kimoProduct.id}-${elhamdProduct.id}`
          if (!processed.has(key)) {
            duplicates.push(match)
            processed.add(key)
          }
        }
      }
    }

    return duplicates
  }

  /**
   * Compare two products and determine if they are duplicates
   */
  private compareProducts(product1: Product, product2: Product): DuplicateMatch {
    let matchType: 'id' | 'sku' | 'name' | 'url' = 'name'
    let confidence = 0

    // Check SKU match
    if (product1.sku && product2.sku && product1.sku === product2.sku) {
      return {
        kimoProduct: product1,
        elhamdProduct: product2,
        matchType: 'sku',
        confidence: 1.0
      }
    }

    // Check URL similarity
    if (product1.sourceMetadata?.sourceUrl && product2.sourceMetadata?.sourceUrl) {
      const urlSimilarity = this.calculateUrlSimilarity(
        product1.sourceMetadata.sourceUrl,
        product2.sourceMetadata.sourceUrl
      )
      if (urlSimilarity > 0.8) {
        return {
          kimoProduct: product1,
          elhamdProduct: product2,
          matchType: 'url',
          confidence: urlSimilarity
        }
      }
    }

    // Check name similarity
    const nameSimilarity = this.calculateNameSimilarity(product1.name, product2.name)
    if (nameSimilarity > 0.7) {
      return {
        kimoProduct: product1,
        elhamdProduct: product2,
        matchType: 'name',
        confidence: nameSimilarity
      }
    }

    return {
      kimoProduct: product1,
      elhamdProduct: product2,
      matchType: 'name',
      confidence: 0
    }
  }

  /**
   * Calculate URL similarity
   */
  private calculateUrlSimilarity(url1: string, url2: string): number {
    const parts1 = url1.split('/').filter(Boolean)
    const parts2 = url2.split('/').filter(Boolean)
    
    // Compare slugs
    const slug1 = parts1[parts1.length - 1]
    const slug2 = parts2[parts2.length - 1]
    
    if (slug1 === slug2) return 1.0
    
    const similarity = this.calculateStringSimilarity(slug1, slug2)
    return similarity
  }

  /**
   * Calculate name similarity using Levenshtein distance
   */
  private calculateNameSimilarity(name1: string, name2: string): number {
    const normalized1 = this.normalizeString(name1)
    const normalized2 = this.normalizeString(name2)
    
    return this.calculateStringSimilarity(normalized1, normalized2)
  }

  /**
   * Normalize string for comparison
   */
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Calculate string similarity using simple algorithm
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0
    if (!str1 || !str2) return 0.0

    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Levenshtein distance algorithm
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * Merge products keeping the cheaper one
   */
  mergeProducts(
    kimoProducts: Product[],
    elhamdProducts: Product[],
    duplicates: DuplicateMatch[]
  ): { mergedProducts: Product[]; keptFrom: Record<string, string[]> } {
    const keptFrom: Record<string, string[]> = {
      'Kimo Store': [],
      'Elhamd Store': []
    }

    const kimoIds = new Set(kimoProducts.map(p => p.id))
    const elhamdIds = new Set(elhamdProducts.map(p => p.id))
    const removedIds = new Set<string>()

    // Process duplicates
    for (const duplicate of duplicates) {
      const kimoPrice = duplicate.kimoProduct.price
      const elhamdPrice = duplicate.elhamdProduct.price

      if (kimoPrice <= elhamdPrice) {
        // Keep Kimo, remove Elhamd
        removedIds.add(duplicate.elhamdProduct.id)
        keptFrom['Kimo Store'].push(duplicate.kimoProduct.name)
      } else {
        // Keep Elhamd, remove Kimo
        removedIds.add(duplicate.kimoProduct.id)
        keptFrom['Elhamd Store'].push(duplicate.elhamdProduct.name)
      }
    }

    // Build merged list
    const mergedProducts = [
      ...kimoProducts.filter(p => !removedIds.has(p.id)),
      ...elhamdProducts.filter(p => !removedIds.has(p.id))
    ]

    return { mergedProducts, keptFrom }
  }
}