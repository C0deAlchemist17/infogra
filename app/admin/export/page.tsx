'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  FileText, 
  Database, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { ProductImportEngine } from '@/lib/import-engine'
import { products } from '@/data/products'

export default function ExportPage() {
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleExport = () => {
    setIsExporting(true)
    setExportResult(null)

    try {
      const engine = new ProductImportEngine()
      let content: string
      let filename: string
      let mimeType: string

      if (format === 'csv') {
        content = engine.exportToCSV(products)
        filename = 'infogra-products.csv'
        mimeType = 'text/csv'
      } else {
        content = engine.exportToJSON(products)
        filename = 'infogra-products.json'
        mimeType = 'application/json'
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      if (typeof window !== 'undefined') {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      setExportResult({ success: true, message: `Successfully exported ${products.length} products to ${format.toUpperCase()}` })
    } catch (error) {
      setExportResult({ 
        success: false, 
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      })
    } finally {
      setIsExporting(false)
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
        <h1 className="text-display font-bold text-text-primary mb-4">Export Products</h1>
        <p className="text-body-lg text-text-secondary">
          Export your product catalog to CSV or JSON format
        </p>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Export Options</h2>
            
            <div className="mb-6">
              <label className="text-small font-medium text-text-primary mb-2 block">Export Format</label>
              <div className="flex gap-4">
                {(['csv', 'json'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                      format === fmt
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-border-subtle bg-background-tertiary/30 text-text-secondary hover:border-accent-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {fmt === 'csv' ? <FileText className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                      <span className="text-body font-medium">{fmt.toUpperCase()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-background-tertiary/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body text-text-primary">Total Products</span>
                <span className="text-h3 font-bold text-accent-primary">{products.length}</span>
              </div>
              <div className="text-small text-text-tertiary">
                {format === 'csv' ? 'Comma-separated values file' : 'JavaScript Object Notation file'}
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="xl"
              className="w-full"
            >
              {isExporting ? (
                'Exporting...'
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Export {products.length} Products as {format.toUpperCase()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Result */}
      {exportResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`glass border-2 ${
            exportResult.success ? 'border-accent-success' : 'border-accent-error'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center">
                {exportResult.success ? (
                  <CheckCircle className="w-6 h-6 text-accent-success mr-3" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-accent-error mr-3" />
                )}
                <span className="text-body text-text-primary">{exportResult.message}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Format Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Format Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-h4 font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-primary" />
                  CSV Format
                </h3>
                <ul className="space-y-2 text-body text-text-secondary">
                  <li>• Compatible with Excel, Google Sheets</li>
                  <li>• Easy to edit manually</li>
                  <li>• Smaller file size</li>
                  <li>• Best for bulk editing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-h4 font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent-primary" />
                  JSON Format
                </h3>
                <ul className="space-y-2 text-body text-text-secondary">
                  <li>• Preserves data structure</li>
                  <li>• Best for API integration</li>
                  <li>• Supports nested data</li>
                  <li>• Ideal for developers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
