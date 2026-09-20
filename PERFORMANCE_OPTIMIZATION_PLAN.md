# INFOGRA Performance Optimization Plan

## Current Performance Issues Identified

### 1. Frontend Rendering Issues
- **All Products Page**: Client-side filtering of entire dataset (5,613 products) on every render
  - Issue: `filteredProducts` recalculated on every render
  - Impact: Slow filtering, unnecessary re-renders
  - Status: ⚠️ IN PROGRESS - Adding useMemo/useCallback

- **Store Page**: Similar client-side filtering issue
  - Issue: Loads all products at once, filters in browser
  - Impact: Slow initial load, memory intensive
  - Status: ⚠️ NOT OPTIMIZED

- **Product Edit Page**: Fetches ALL products to find one
  - Issue: `fetch('/api/products?storage=true')` loads entire catalog
  - Impact: Unnecessary data transfer
  - Status: ⚠️ NOT OPTIMIZED

### 2. Database Query Issues
- **Products API**: No specific endpoint for single product lookup
  - Impact: Must fetch all products, then filter client-side
  - Status: ⚠️ NOT OPTIMIZED

- **No indexes identified**: Common search fields may lack indexes
  - Fields: name, sku, barcode, category, brand
  - Status: ⚠️ NOT AUDITED

### 3. Three.js Rendering Issues
- **Background scenes may not dispose properly**
  - Issue: Need to verify cleanup on unmount
  - Status: ⚠️ NOT AUDITED

- **Particle counts**: Some scenes may have excessive particles
  - Status: ⚠️ NOT AUDITED

### 4. Image Optimization Issues
- **No WebP/AVIF formats detected**
  - Issue: Using traditional formats
  - Status: ⚠️ NOT OPTIMIZED

- **Lazy loading**: Inconsistent implementation
  - Status: ⚠️ NOT AUDITED

### 5. Bundle Size Issues
- **Large dependencies**: Need to analyze final bundle
  - Status: ⚠️ NOT AUDITED

- **Code splitting**: Minimal implementation
  - Status: ⚠️ NOT OPTIMIZED

## Optimization Priority Matrix

### P0 - Critical (Immediate Impact)
| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Products API single-product endpoint | High | Medium | P0 |
| Client-side filtering → Server-side | High | Medium | P0 |
| Add database indexes | High | Low | P0 |
| Image lazy loading | Medium | Low | P0 |
| useMemo/useCallback for expensive computations | Medium | Low | P0 |

### P1 - High Impact (After P0)
| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Three.js scene cleanup | Medium | Medium | P1 |
| Code splitting for heavy routes | High | Medium | P1 |
| WebP/AVIF conversion | Medium | Medium | P1 |
| Bundle size analysis | High | Low | P1 |
| Remove unused dependencies | Medium | Low | P1 |

### P2 - Medium Impact (Long-term)
| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Virtual scrolling for large tables | Medium | High | P2 |
| Service worker caching | Medium | Medium | P2 |
| Font optimization | Low | Low | P2 |
| Icon tree-shaking | Low | Low | P2 |

## Proposed Implementation Plan

### Phase 1: Database & API Optimization (P0)
1. **Add single-product API endpoint**
   - Create: `/api/products/[id]`
   - Benefit: Load only the product you need
   - Effort: 1-2 hours

2. **Add database indexes**
   - Index: name, sku, barcode, category, brand, status
   - Benefit: Faster queries
   - Effort: 30 minutes

3. **Server-side filtering API**
   - Create: `/api/products?search=&category=&brand=&page=&limit=`
   - Benefit: Client only receives needed data
   - Effort: 2-3 hours

### Phase 2: Frontend Optimization (P0-P1)
4. **Update components to use new filtered API**
   - Pages: All Products, Store, Stock, etc.
   - Benefit: Eliminate client-side filtering
   - Effort: 3-4 hours

5. **Add useMemo/useCallback to expensive computations**
   - Components: Product lists, filters, charts
   - Benefit: Prevent unnecessary re-renders
   - Effort: 2-3 hours

6. **Three.js scene cleanup**
   - Add proper dispose on unmount
   - Stop animation loops when not visible
   - Benefit: Prevent memory leaks
   - Effort: 2 hours

### Phase 3: Asset Optimization (P1)
7. **Image optimization**
   - Convert to WebP/AVIF
   - Add proper lazy loading
   - Add responsive sizes
   - Benefit: Faster load, less bandwidth
   - Effort: 3-4 hours

8. **Code splitting**
   - Lazy load: Reports, Charts, Three.js scenes
   - Benefit: Smaller initial bundle
   - Effort: 2-3 hours

### Phase 4: Advanced (P2)
9. **Bundle analysis & dependency cleanup**
   - Analyze with webpack-bundle-analyzer
   - Remove unused dependencies
   - Benefit: Smaller bundles
   - Effort: 2-3 hours

10. **Virtual scrolling for large tables**
    - Use react-window or similar
    - Benefit: Smooth scrolling with 10,000+ rows
    - Effort: 4-5 hours

## Estimated Total Effort
- Phase 1: 3.5-5.5 hours
- Phase 2: 7-9 hours
- Phase 3: 5-7 hours
- Phase 4: 6-8 hours
- **Total: 21.5-29.5 hours**

## Recommendation

Given the scope, I recommend we proceed in phases:

**Option A:** Complete Phase 1 only (Database & API optimization)
- Immediate, high-impact improvements
- 3.5-5.5 hours
- Will dramatically improve product-related pages

**Option B:** Complete Phase 1 + Phase 2 (Database + Frontend)
- Most impactful optimizations
- 10.5-14.5 hours
- Will make the application feel significantly faster

**Option C:** Complete all phases
- Comprehensive optimization
- 21.5-29.5 hours
- Will make the application feel "extremely fast, smooth, lightweight"

## What I've Already Started
- ✅ Fixed TypeScript errors in InteractiveShapeField
- ✅ Started optimizing All Products page with useMemo/useCallback
- ✅ Created comprehensive Three.js experience matrix
- ✅ Created this performance optimization plan

## Next Steps
Please choose which option you'd like me to proceed with, or let me know if you want me to focus on specific areas first.
