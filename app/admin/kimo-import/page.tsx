'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Database,
  Layers,
  ShoppingCart,
  FileText,
  Download as ExportIcon
} from 'lucide-react'

// Import the orchestrator (will be imported via API in production)
// For now, we'll create a mock interface

interface ImportProgress {
  phase: 'scanning' | 'mapping' | 'importing' | 'completed' | 'failed'
  current: number
  total: number
  percentage: number
  currentProduct?: string
  currentOperation: string
}

interface ImportReport {
  success: boolean
  duration: number
  kimoData: {
    productsDiscovered: number
    pagesScanned: number
    categoriesFound: number
    errors: number
  }
  mappingData: {
    productsMapped: number
    categoriesMapped: number
    brandsMapped: number
    warnings: number
  }
  importData: {
    productsImported: number
    productsUpdated: number
    productsSkipped: number
    productsFailed: number
    categoriesAdded: number
    brandsAdded: number
  }
  errors: Array<{ product: string; message: string }>
  warnings: string[]
}

export default function KimoImportPage() {
  const [importMode, setImportMode] = useState<'scan' | 'preview' | 'import-new' | 'update-existing' | 'full-sync' | 'retry-failed'>('scan')
  const [maxPages, setMaxPages] = useState(5)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const [report, setReport] = useState<ImportReport | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Pricing configuration
  const [pricingMode, setPricingMode] = useState<'unchanged' | 'fixed' | 'percentage' | 'multiplier'>('percentage')
  const [pricingValue, setPricingValue] = useState(20)
  const [stockSync, setStockSync] = useState(false)

  // Field overrides
  const [fieldOverrides, setFieldOverrides] = useState({
    name: true,
    description: true,
    images: true,
    specifications: true,
    price: true,
    stock: false,
    category: true,
    brand: true
  })

  const handleImport = async () => {
    setIsImporting(true)
    setProgress(null)
    setReport(null)

    // Simulate import process (in production, this would call the API)
    const simulateImport = async () => {
      // Phase 1: Scanning
      setProgress({
        phase: 'scanning',
        current: 0,
        total: 100,
        percentage: 0,
        currentOperation: 'Initializing catalog scan...'
      })

      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress({
          phase: 'scanning',
          current: i,
          total: 100,
          percentage: i,
          currentOperation: `Scanning Kimo catalog... ${i}%`
        })
      }

      // Phase 2: Mapping
      setProgress({
        phase: 'mapping',
        current: 0,
        total: 100,
        percentage: 0,
        currentOperation: 'Mapping products to INFOGRA format...'
      })

      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress({
          phase: 'mapping',
          current: i,
          total: 100,
          percentage: i,
          currentOperation: `Mapping product ${i * 10}...`,
          currentProduct: `Product ${i * 10}`
        })
      }

      // Phase 3: Importing
      setProgress({
        phase: 'importing',
        current: 0,
        total: 100,
        percentage: 0,
        currentOperation: 'Importing products to INFOGRA...'
      })

      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setProgress({
          phase: 'importing',
          current: i,
          total: 100,
          percentage: i,
          currentOperation: `Importing product ${i * 10}...`,
          currentProduct: `Product ${i * 10}`
        })
      }

      // Complete
      setProgress({
        phase: 'completed',
        current: 100,
        total: 100,
        percentage: 100,
        currentOperation: 'Import complete'
      })

      // Generate mock report
      setReport({
        success: true,
        duration: 45000,
        kimoData: {
          productsDiscovered: 5972,
          pagesScanned: 312,
          categoriesFound: 48,
          errors: 0
        },
        mappingData: {
          productsMapped: 5972,
          categoriesMapped: 42,
          brandsMapped: 35,
          warnings: 156
        },
        importData: {
          productsImported: 5120,
          productsUpdated: 127,
          productsSkipped: 852,
          productsFailed: 7,
          categoriesAdded: 6,
          brandsAdded: 4
        },
        errors: [
          { product: 'Product X', message: 'Failed to fetch product details' }
        ],
        warnings: [
          'Category not mapped: Computer Accessories -> accessories',
          'Brand not mapped: Unknown Brand -> unknown'
        ]
      })

      setIsImporting(false)
    }

    await simulateImport()
  }

  const handleStopImport = () => {
    setIsImporting(false)
    setProgress({
      phase: 'failed',
      current: progress?.current || 0,
      total: progress?.total || 0,
      percentage: progress?.percentage || 0,
      currentOperation: 'Import stopped by user'
    })
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Kimo Product Import
          </h1>
          <p className="text-gray-400">
            Import products from Kimo Store into INFOGRA catalog
          </p>
        </div>

        {/* Import Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Import Mode */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Import Mode</h2>
            </div>
            
            <div className="space-y-2">
              {[
                { id: 'scan', label: 'Scan Catalog Only', desc: 'Discover products without importing' },
                { id: 'preview', label: 'Preview Changes', desc: 'Show what will be imported' },
                { id: 'import-new', label: 'Import New', desc: 'Add only new products' },
                { id: 'update-existing', label: 'Update Existing', desc: 'Update existing products' },
                { id: 'full-sync', label: 'Full Synchronization', desc: 'Complete catalog sync' },
                { id: 'retry-failed', label: 'Retry Failed', desc: 'Retry only failed imports' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setImportMode(mode.id as any)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    importMode === mode.id
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-[#0a0a1a] border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-sm text-gray-400">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Settings */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Scan Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Max Pages per Category
                </label>
                <input
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value))}
                  className="w-full bg-[#0a0a1a] border border-gray-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                  min={1}
                  max={50}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Pricing Mode
                </label>
                <select
                  value={pricingMode}
                  onChange={(e) => setPricingMode(e.target.value as any)}
                  className="w-full bg-[#0a0a1a] border border-gray-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                >
                  <option value="unchanged">Unchanged</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                  <option value="multiplier">Multiplier</option>
                </select>
              </div>

              {pricingMode !== 'unchanged' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    {pricingMode === 'percentage' ? 'Markup Percentage' : 'Value'}
                  </label>
                  <input
                    type="number"
                    value={pricingValue}
                    onChange={(e) => setPricingValue(parseFloat(e.target.value))}
                    className="w-full bg-[#0a0a1a] border border-gray-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Sync Stock</label>
                <button
                  onClick={() => setStockSync(!stockSync)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    stockSync ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      stockSync ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Field Overrides */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold">Field Sync</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(fieldOverrides).map(([field, enabled]) => (
                <div key={field} className="flex items-center justify-between">
                  <label className="text-sm text-gray-400 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => setFieldOverrides(prev => ({
                      ...prev,
                      [field]: !prev[field as keyof typeof prev]
                    }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      enabled ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Import Controls */}
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Start Import</h2>
              <p className="text-gray-400 text-sm">
                {importMode === 'scan' && 'Will scan Kimo catalog without importing'}
                {importMode === 'preview' && 'Will preview changes without modifying database'}
                {importMode === 'import-new' && 'Will import only new products'}
                {importMode === 'update-existing' && 'Will update existing products'}
                {importMode === 'full-sync' && 'Will perform full catalog synchronization'}
                {importMode === 'retry-failed' && 'Will retry only failed imports'}
              </p>
            </div>
            
            <div className="flex gap-3">
              {!isImporting ? (
                <button
                  onClick={handleImport}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Import
                </button>
              ) : (
                <button
                  onClick={handleStopImport}
                  className="px-6 py-3 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Stop Import
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Display */}
        {progress && (
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Import Progress</h2>
              <div className="flex items-center gap-2">
                {progress.phase === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {progress.phase === 'failed' && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                {(progress.phase === 'scanning' || progress.phase === 'mapping' || progress.phase === 'importing') && (
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                )}
                <span className="text-sm text-gray-400 capitalize">{progress.phase}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{progress.currentOperation}</span>
                <span className="text-gray-400">{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-[#0a0a1a] rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-right text-sm text-gray-400 mt-1">{progress.percentage}%</div>
            </div>

            {progress.currentProduct && (
              <div className="text-sm text-gray-400">
                Current: <span className="text-white">{progress.currentProduct}</span>
              </div>
            )}
          </div>
        )}

        {/* Import Report */}
        {report && (
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Import Report</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {formatDuration(report.duration)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Kimo Data */}
              <div className="bg-[#0a0a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-blue-400" />
                  <h3 className="font-semibold">Kimo Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Discovered</span>
                    <span className="text-white">{report.kimoData.productsDiscovered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pages Scanned</span>
                    <span className="text-white">{report.kimoData.pagesScanned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categories Found</span>
                    <span className="text-white">{report.kimoData.categoriesFound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Errors</span>
                    <span className={report.kimoData.errors > 0 ? 'text-red-400' : 'text-green-400'}>
                      {report.kimoData.errors}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mapping Data */}
              <div className="bg-[#0a0a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold">Mapping Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Mapped</span>
                    <span className="text-white">{report.mappingData.productsMapped.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categories Mapped</span>
                    <span className="text-white">{report.mappingData.categoriesMapped}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Brands Mapped</span>
                    <span className="text-white">{report.mappingData.brandsMapped}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Warnings</span>
                    <span className={report.mappingData.warnings > 0 ? 'text-yellow-400' : 'text-green-400'}>
                      {report.mappingData.warnings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Import Data */}
              <div className="bg-[#0a0a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold">Import Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Imported</span>
                    <span className="text-green-400">{report.importData.productsImported.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Updated</span>
                    <span className="text-blue-400">{report.importData.productsUpdated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Skipped</span>
                    <span className="text-yellow-400">{report.importData.productsSkipped.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products Failed</span>
                    <span className={report.importData.productsFailed > 0 ? 'text-red-400' : 'text-green-400'}>
                      {report.importData.productsFailed}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#0a0a1a] border border-gray-800 rounded-lg text-sm hover:border-gray-700 transition-colors flex items-center gap-2">
                <ExportIcon className="w-4 h-4" />
                Export CSV
              </button>
              <button className="px-4 py-2 bg-[#0a0a1a] border border-gray-800 rounded-lg text-sm hover:border-gray-700 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        )}

        {/* Errors and Warnings */}
        {report && (report.errors.length > 0 || report.warnings.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Errors */}
            {report.errors.length > 0 && (
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-red-900/50">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h2 className="text-lg font-semibold">Errors ({report.errors.length})</h2>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {report.errors.map((error, index) => (
                    <div key={index} className="bg-[#0a0a1a] rounded-lg p-3 text-sm">
                      <div className="font-medium text-red-400">{error.product}</div>
                      <div className="text-gray-400">{error.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-yellow-900/50">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold">Warnings ({report.warnings.length})</h2>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {report.warnings.map((warning, index) => (
                    <div key={index} className="bg-[#0a0a1a] rounded-lg p-3 text-sm text-yellow-400">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Clock icon for duration display
function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
