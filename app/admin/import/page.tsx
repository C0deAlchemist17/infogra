'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  FileText, 
  Database, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  X,
  Loader2
} from 'lucide-react'
import { ProductImportEngine, ImportConfig, ImportFormat, ImportProgress } from '@/lib/import-engine'
import { WooCommerceAPI } from '@/lib/import-engine/woocommerce-api'
import { ShopifyAPI } from '@/lib/import-engine/shopify-api'

export default function ImportPage() {
  const [format, setFormat] = useState<ImportFormat>('csv')
  const [source, setSource] = useState<'file' | 'woocommerce' | 'shopify'>('file')
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [wcConfig, setWcConfig] = useState({ baseUrl: '', consumerKey: '', consumerSecret: '' })
  const [shopifyConfig, setShopifyConfig] = useState({ storeUrl: '', accessToken: '' })
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setProgress({ current: 0, total: 1, percentage: 0 })
    setImportResult(null)

    try {
      const content = await file.text()
      const engine = new ProductImportEngine()
      
      engine.setProgressCallback((p) => setProgress(p))
      
      const config: ImportConfig = {
        format,
        source: 'file',
        fieldMapping: ProductImportEngine.getDefaultMapping(format),
        skipDuplicates: true,
        updateExisting: false,
        dryRun: false
      }

      const result = await engine.importFromFile(content, config)
      setImportResult(result)
    } catch (error) {
      setImportResult({
        success: false,
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleWooCommerceImport = async () => {
    if (!wcConfig.baseUrl || !wcConfig.consumerKey || !wcConfig.consumerSecret) {
      setConnectionTest({ success: false, message: 'Please fill in all WooCommerce credentials' })
      return
    }

    setIsImporting(true)
    setProgress({ current: 0, total: 1, percentage: 0, currentProduct: 'Connecting...' })
    setImportResult(null)

    try {
      const api = new WooCommerceAPI(wcConfig)
      
      // Test connection first
      const testResult = await api.testConnection()
      setConnectionTest(testResult)
      
      if (!testResult.success) {
        setIsImporting(false)
        return
      }

      // Fetch all products
      const result = await api.fetchAllProducts((current, total) => {
        setProgress({
          current,
          total,
          percentage: Math.round((current / total) * 100),
          currentProduct: `Fetching product ${current} of ${total}`
        })
      })

      const products = result.products.map(p => WooCommerceAPI.convertToProduct(p))
      
      setImportResult({
        success: result.success,
        imported: products.length,
        updated: 0,
        skipped: 0,
        errors: result.errors,
        warnings: [],
        duration: 0
      })
    } catch (error) {
      setImportResult({
        success: false,
        errors: [`WooCommerce import failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleShopifyImport = async () => {
    if (!shopifyConfig.storeUrl || !shopifyConfig.accessToken) {
      setConnectionTest({ success: false, message: 'Please fill in all Shopify credentials' })
      return
    }

    setIsImporting(true)
    setProgress({ current: 0, total: 1, percentage: 0, currentProduct: 'Connecting...' })
    setImportResult(null)

    try {
      const api = new ShopifyAPI(shopifyConfig)
      
      // Test connection first
      const testResult = await api.testConnection()
      setConnectionTest(testResult)
      
      if (!testResult.success) {
        setIsImporting(false)
        return
      }

      // Fetch all products
      const result = await api.fetchAllProducts((current, total) => {
        setProgress({
          current,
          total,
          percentage: Math.round((current / total) * 100),
          currentProduct: `Fetching product ${current} of ${total}`
        })
      })

      const products = result.products.map(p => ShopifyAPI.convertToProduct(p))
      
      setImportResult({
        success: result.success,
        imported: products.length,
        updated: 0,
        skipped: 0,
        errors: result.errors,
        warnings: [],
        duration: 0
      })
    } catch (error) {
      setImportResult({
        success: false,
        errors: [`Shopify import failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-display font-bold text-text-primary mb-4">Import Products</h1>
        <p className="text-body-lg text-text-secondary">
          Import products from files, WooCommerce, or Shopify
        </p>
      </motion.div>

      {/* Source Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Select Import Source</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'file', icon: FileText, label: 'File Upload', description: 'CSV, JSON, XML, Excel' },
                { id: 'woocommerce', icon: Database, label: 'WooCommerce', description: 'REST API integration' },
                { id: 'shopify', icon: Globe, label: 'Shopify', description: 'REST API integration' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSource(option.id as any)
                    setConnectionTest(null)
                    setImportResult(null)
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    source === option.id
                      ? 'border-accent-primary bg-accent-primary/10'
                      : 'border-border-subtle hover:border-accent-primary/50 bg-background-tertiary/30'
                  }`}
                >
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <option.icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-2">{option.label}</h3>
                  <p className="text-small text-text-secondary">{option.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* File Upload */}
      {source === 'file' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-border-subtle">
            <CardContent className="p-6">
              <h2 className="text-h2 font-bold text-text-primary mb-6">Upload File</h2>
              
              <div className="mb-6">
                <label className="text-small font-medium text-text-primary mb-2 block">File Format</label>
                <div className="flex gap-4">
                  {(['csv', 'json', 'xml', 'excel'] as ImportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        format === fmt
                          ? 'bg-accent-primary text-white'
                          : 'bg-background-tertiary text-text-secondary hover:bg-background-tertiary/70'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-dashed border-border-subtle rounded-xl p-12 text-center hover:border-accent-primary/50 transition-colors cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-body text-text-primary mb-2">Click to upload or drag and drop</p>
                <p className="text-small text-text-tertiary">{format.toUpperCase()} files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={format === 'excel' ? '.xlsx,.xls' : `.${format}`}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* WooCommerce Configuration */}
      {source === 'woocommerce' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-border-subtle">
            <CardContent className="p-6">
              <h2 className="text-h2 font-bold text-text-primary mb-6">WooCommerce Configuration</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-small font-medium text-text-primary mb-2 block">Store URL</label>
                  <Input
                    placeholder="https://yourstore.com"
                    value={wcConfig.baseUrl}
                    onChange={(e) => setWcConfig({ ...wcConfig, baseUrl: e.target.value })}
                    className="glass border-border-subtle"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-text-primary mb-2 block">Consumer Key</label>
                  <Input
                    placeholder="ck_xxxxxxxxxxxx"
                    value={wcConfig.consumerKey}
                    onChange={(e) => setWcConfig({ ...wcConfig, consumerKey: e.target.value })}
                    className="glass border-border-subtle"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-text-primary mb-2 block">Consumer Secret</label>
                  <Input
                    type="password"
                    placeholder="cs_xxxxxxxxxxxx"
                    value={wcConfig.consumerSecret}
                    onChange={(e) => setWcConfig({ ...wcConfig, consumerSecret: e.target.value })}
                    className="glass border-border-subtle"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleWooCommerceImport}
                  disabled={isImporting}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Import from WooCommerce
                    </>
                  )}
                </Button>
              </div>

              {connectionTest && (
                <div className={`mt-4 p-4 rounded-xl ${
                  connectionTest.success ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'
                }`}>
                  {connectionTest.success ? (
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                  )}
                  {connectionTest.message}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Shopify Configuration */}
      {source === 'shopify' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-border-subtle">
            <CardContent className="p-6">
              <h2 className="text-h2 font-bold text-text-primary mb-6">Shopify Configuration</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-small font-medium text-text-primary mb-2 block">Store URL</label>
                  <Input
                    placeholder="https://yourstore.myshopify.com"
                    value={shopifyConfig.storeUrl}
                    onChange={(e) => setShopifyConfig({ ...shopifyConfig, storeUrl: e.target.value })}
                    className="glass border-border-subtle"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-text-primary mb-2 block">Access Token</label>
                  <Input
                    type="password"
                    placeholder="shpat_xxxxxxxxxxxx"
                    value={shopifyConfig.accessToken}
                    onChange={(e) => setShopifyConfig({ ...shopifyConfig, accessToken: e.target.value })}
                    className="glass border-border-subtle"
                  />
                </div>
              </div>

              <Button
                onClick={handleShopifyImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Import from Shopify
                  </>
                )}
              </Button>

              {connectionTest && (
                <div className={`mt-4 p-4 rounded-xl ${
                  connectionTest.success ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'
                }`}>
                  {connectionTest.success ? (
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                  )}
                  {connectionTest.message}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress */}
      {progress && isImporting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass border-border-subtle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-body font-medium text-text-primary">Import Progress</span>
                <span className="text-small text-text-tertiary">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-background-tertiary rounded-full h-2 mb-4">
                <div 
                  className="bg-accent-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-small text-text-secondary">
                {progress.currentProduct || `Processing ${progress.current} of ${progress.total}`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`glass border-2 ${
            importResult.success ? 'border-accent-success' : 'border-accent-error'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                {importResult.success ? (
                  <CheckCircle className="w-6 h-6 text-accent-success mr-3" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-accent-error mr-3" />
                )}
                <h2 className="text-h2 font-bold text-text-primary">
                  {importResult.success ? 'Import Successful' : 'Import Failed'}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-background-tertiary/50 rounded-xl">
                  <div className="text-h3 font-bold text-accent-success">{importResult.imported}</div>
                  <div className="text-small text-text-secondary">Imported</div>
                </div>
                <div className="text-center p-4 bg-background-tertiary/50 rounded-xl">
                  <div className="text-h3 font-bold text-accent-secondary">{importResult.updated}</div>
                  <div className="text-small text-text-secondary">Updated</div>
                </div>
                <div className="text-center p-4 bg-background-tertiary/50 rounded-xl">
                  <div className="text-h3 font-bold text-text-tertiary">{importResult.skipped}</div>
                  <div className="text-small text-text-secondary">Skipped</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-small font-semibold text-text-primary mb-2">Errors</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error: string, index: number) => (
                      <div key={index} className="text-small text-accent-error p-2 bg-accent-error/10 rounded-lg">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.warnings && importResult.warnings.length > 0 && (
                <div>
                  <h3 className="text-small font-semibold text-text-primary mb-2">Warnings</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importResult.warnings.map((warning: string, index: number) => (
                      <div key={index} className="text-small text-accent-highlight p-2 bg-accent-highlight/10 rounded-lg">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
