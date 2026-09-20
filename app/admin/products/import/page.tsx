'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseFile(selectedFile)
    }
  }

  const parseFile = async (file: File) => {
    // In a real app, this would parse Excel/CSV
    // For now, simulate parsing
    const mockData = [
      { name: 'Test Product 1', sku: 'TEST001', price: 1000, stock: 10, category: 'laptops', brand: 'lenovo' },
      { name: 'Test Product 2', sku: 'TEST002', price: 2000, stock: 5, category: 'monitors', brand: 'hp' },
    ]
    setPreview(mockData)
    setErrors([
      { row: 3, field: 'price', message: 'Price must be positive' },
    ])
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: preview }),
      })

      if (response.ok) {
        const result = await response.json()
        setImportResult(result)
      }
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    // In a real app, this would download an actual Excel/CSV template
    const template = 'name,sku,price,stock,category,brand\nTest Product,TEST001,1000,10,laptops,lenovo'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-import-template.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Import Products</h1>
              <p className="text-white/60">Import products from Excel or CSV</p>
            </div>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-accent-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <p className="text-white mb-2">Click to upload or drag and drop</p>
                <p className="text-white/40 text-sm">CSV or Excel files only</p>
              </div>

              {file && (
                <div className="mt-4 p-4 glass border border-white/10 rounded-lg">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-white/60 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Section */}
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {preview.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  Upload a file to see validation results
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>{preview.length} valid products</span>
                  </div>
                  {errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-5 h-5" />
                      <span>{errors.length} errors found</span>
                    </div>
                  )}

                  {errors.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-red-400 text-sm">Row {error.row}: {error.field}</p>
                              <p className="text-white/60 text-xs">{error.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={handleImport}
                    disabled={importing || errors.length > 0}
                    className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
                  >
                    {importing ? 'Importing...' : `Import ${preview.length} Products`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Import Result */}
        {importResult && (
          <Card className="glass border border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Import Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 glass border border-white/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{importResult.imported}</p>
                  <p className="text-white/60 text-sm">Imported</p>
                </div>
                <div className="p-4 glass border border-white/10 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{importResult.updated}</p>
                  <p className="text-white/60 text-sm">Updated</p>
                </div>
                <div className="p-4 glass border border-white/10 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{importResult.skipped}</p>
                  <p className="text-white/60 text-sm">Skipped</p>
                </div>
                <div className="p-4 glass border border-white/10 rounded-lg">
                  <p className="text-2xl font-bold text-red-400">{importResult.failed}</p>
                  <p className="text-white/60 text-sm">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
