# INFOGRA Kimo Product Import System

## Overview

The INFOGRA Kimo Product Import System is a production-ready solution for importing products from Kimo Store (https://kimostore.net/) into the INFOGRA catalog. The system ensures that all imported products use INFOGRA's branding, UI/UX, and architecture while maintaining product data integrity.

## Architecture

### Components

1. **KimoScraper** (`lib/importers/kimo-scraper.ts`)
   - Scrapes publicly accessible product data from Kimo Store
   - Handles rate limiting and error recovery
   - Supports category-based scanning and full catalog discovery

2. **KimoProductMapper** (`lib/importers/kimo-mapper.ts`)
   - Converts Kimo products to INFOGRA's product schema
   - Maps categories and brands to INFOGRA equivalents
   - Applies pricing rules and field overrides
   - Generates INFOGRA-compatible URLs and slugs

3. **ProductDataManager** (`lib/importers/product-data-manager.ts`)
   - Manages saving imported products to INFOGRA's data files
   - Handles duplicate detection and product merging
   - Generates TypeScript data files
   - Supports CSV/Excel export

4. **ImportOrchestrator** (`lib/importers/import-orchestrator.ts`)
   - Coordinates the entire import process
   - Manages import phases (scanning, mapping, importing)
   - Tracks progress and generates reports
   - Maintains import history

5. **Admin Interface** (`app/admin/kimo-import/page.tsx`)
   - UI for configuring and executing imports
   - Real-time progress tracking
   - Import report display
   - Error and warning management

6. **API Routes**
   - `app/api/kimo-import/route.ts` - Main import endpoint
   - `app/api/kimo-scan/route.ts` - Catalog scanning endpoint

## Key Features

### Import Modes

1. **Scan Catalog Only**
   - Discovers products without importing
   - Useful for initial catalog assessment

2. **Preview Changes**
   - Shows what will be imported
   - Dry-run mode without database changes

3. **Import New**
   - Adds only new products
   - Skips existing products

4. **Update Existing**
   - Updates existing products
   - Preserves manual edits for disabled fields

5. **Full Synchronization**
   - Complete catalog sync
   - Adds new and updates existing

6. **Retry Failed**
   - Retries only failed imports
   - Useful for error recovery

### Pricing Configuration

The system supports multiple pricing modes:

- **Unchanged**: Use Kimo price as-is
- **Fixed Amount**: Add fixed amount to Kimo price
- **Percentage**: Apply percentage markup
- **Multiplier**: Multiply Kimo price by factor

Example:
```
Kimo price: 1,000 EGP
Percentage markup: 20%
INFOGRA price: 1,200 EGP
```

### Category Mapping

The system includes a comprehensive category mapping from Kimo to INFOGRA:

```
Kimo Category → INFOGRA Category
- PC Components → processors, motherboards, graphics-cards, etc.
- Laptops → laptops
- Mobile & Tablet → accessories
- Network → routers-networking
- Security Systems → security-systems
- And 40+ more mappings
```

### Brand Mapping

The system includes brand mappings for major manufacturers:

```
Kimo Brand → INFOGRA Brand
- ASUS → asus
- MSI → msi
- Lenovo → lenovo
- HP → hp
- Dell → dell
- And 50+ more mappings
```

### Field-Level Sync Control

Administrators can control which fields are synchronized:

- Product Name
- Description
- Images
- Specifications
- Price
- Stock
- Category
- Brand

## Usage Guide

### 1. Access Import Interface

Navigate to: `/admin/kimo-import`

### 2. Configure Import Settings

**Import Mode**: Select the appropriate import mode based on your needs

**Scan Settings**:
- Max Pages per Category: Limit pages to scan (1-50)
- Pricing Mode: Choose pricing strategy
- Pricing Value: Set markup amount/percentage
- Sync Stock: Enable/disable stock synchronization

**Field Sync**: Toggle which fields to synchronize

### 3. Start Import

Click "Start Import" to begin the process. The system will:

1. Scan Kimo catalog
2. Map products to INFOGRA format
3. Import to INFOGRA data files
4. Generate import report

### 4. Monitor Progress

The progress display shows:
- Current phase (scanning/mapping/importing)
- Progress percentage
- Current operation
- Current product being processed

### 5. Review Import Report

After completion, review:
- Products discovered
- Products imported/updated/skipped/failed
- Categories and brands mapped
- Errors and warnings

### 6. Export Data (Optional)

Export imported products as:
- CSV file
- Excel file

## Product Schema

Imported products are converted to INFOGRA's schema:

```typescript
interface Product {
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
```

## Duplicate Prevention

The system prevents duplicate imports using:

- Product ID matching
- SKU matching
- URL matching

Existing products are updated rather than duplicated.

## Error Handling

The system handles errors gracefully:

- Single product errors don't stop the entire import
- Failed products are logged for retry
- Errors are displayed in the import report
- Warnings are shown for non-critical issues

## Performance Considerations

- Rate limiting: 1 second delay between requests
- Batch processing: Products processed in batches
- Progress tracking: Real-time progress updates
- Error recovery: Continues on individual failures

## Security

- Only accessible to authenticated administrators
- Input validation on all data
- Sanitization of HTML content
- Protection against malicious URLs

## API Endpoints

### POST /api/kimo-import

Execute a product import.

**Request Body:**
```json
{
  "mode": "import-new",
  "maxPagesPerCategory": 5,
  "mappingConfig": {
    "pricing": {
      "mode": "percentage",
      "value": 20
    },
    "stockSync": false,
    "fieldOverrides": {
      "name": true,
      "description": true,
      "images": true,
      "specifications": true,
      "price": true,
      "stock": false,
      "category": true,
      "brand": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "success": true,
    "duration": 45000,
    "kimoData": {
      "productsDiscovered": 5972,
      "pagesScanned": 312,
      "categoriesFound": 48,
      "errors": 0
    },
    "mappingData": {
      "productsMapped": 5972,
      "categoriesMapped": 42,
      "brandsMapped": 35,
      "warnings": 156
    },
    "importData": {
      "productsImported": 5120,
      "productsUpdated": 127,
      "productsSkipped": 852,
      "productsFailed": 7,
      "categoriesAdded": 6,
      "brandsAdded": 4
    },
    "errors": [],
    "warnings": []
  }
}
```

### GET /api/kimo-import

Get import history.

**Response:**
```json
{
  "success": true,
  "history": [
    [
      "import-1697324123456-abc123",
      { /* import report */ }
    ]
  ]
}
```

### GET /api/kimo-scan

Scan Kimo catalog.

**Query Parameters:**
- `maxPages`: Maximum pages to scan (default: 1)
- `category`: Specific category to scan

**Response:**
```json
{
  "success": true,
  "productsDiscovered": 5972,
  "pagesScanned": 312,
  "categoriesFound": 48,
  "errors": 0,
  "sampleProducts": [/* first 5 products */]
}
```

## Testing Guide

### Test 1: Small Scale (5 products)

1. Set max pages to 1
2. Use "Scan Catalog Only" mode
3. Review discovered products
4. Use "Preview Changes" mode
5. Review mapping results
6. Use "Import New" mode
7. Verify products appear in store

### Test 2: Medium Scale (25 products)

1. Set max pages to 2
2. Use "Import New" mode
3. Verify all products imported
4. Check category mappings
5. Check brand mappings
6. Verify pricing calculations

### Test 3: Large Scale (100 products)

1. Set max pages to 3
2. Use "Full Synchronization" mode
3. Monitor performance
4. Review import report
5. Check for errors/warnings
6. Verify data integrity

### Test 4: Full Catalog

1. Set max pages to 10 (or appropriate value)
2. Use "Full Synchronization" mode
3. Allow full catalog scan
4. Review complete report
5. Export data for backup
6. Verify all systems

## Troubleshooting

### Import Fails

- Check network connectivity
- Verify Kimo Store is accessible
- Review error messages in report
- Retry with "Retry Failed" mode

### Products Not Appearing

- Verify data files were updated
- Check product data format
- Rebuild the application
- Clear browser cache

### Category Mapping Issues

- Review category mappings in admin
- Add custom mappings if needed
- Verify category IDs are correct
- Check subcategory assignments

### Brand Mapping Issues

- Review brand mappings in admin
- Add custom mappings if needed
- Verify brand IDs are correct
- Check brand logos

### Pricing Incorrect

- Verify pricing mode settings
- Check pricing value
- Review calculation logic
- Test with individual products

## Best Practices

1. **Start Small**: Begin with small test imports before full catalog
2. **Preview First**: Always use preview mode before actual import
3. **Backup Data**: Export existing data before major imports
4. **Monitor Progress**: Watch progress during large imports
5. **Review Reports**: Carefully review import reports
6. **Handle Errors**: Address errors before proceeding
7. **Test Thoroughly**: Test all functionality after import
8. **Document Changes**: Keep records of import configurations

## Limitations

- Kimo Store must be publicly accessible
- Rate limiting may slow large imports
- HTML parsing may require adjustments if Kimo changes layout
- No real-time inventory sync (manual sync required)
- Image hotlinking used (download functionality available but not implemented)

## Future Enhancements

- Background job processing for large catalogs
- Scheduled automatic synchronization
- Real-time inventory sync via webhooks
- Image download and optimization
- Advanced duplicate detection
- Import templates and presets
- API integration for third-party systems
- Multi-store support

## Support

For issues or questions:
1. Review this documentation
2. Check import reports for error details
3. Review console logs for technical errors
4. Test with smaller imports first
5. Contact development team if issues persist

## Legal Considerations

- Ensure you have authorization to use Kimo's product data
- Respect rate limits and terms of service
- Do not bypass technical restrictions
- Use product data in accordance with applicable laws
- Properly attribute product information if required
