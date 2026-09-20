'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Barcode, RefreshCw, Search, Plus, AlertTriangle, CheckCircle, Copy, Download } from 'lucide-react'
import Link from 'next/link'

interface BarcodeInfo {
  productId: string
  productName: string
  barcode: string
  sku: string
  category: string
  brand: string
}

export default function BarcodesPage() {
  const [barcodes, setBarcodes] = useState<BarcodeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [duplicateCheck, setDuplicateCheck] = useState<{ barcode: string; duplicates: BarcodeInfo[] } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [newBarcode, setNewBarcode] = useState('')

  useEffect(() => {
    fetchBarcodes()
  }, [])

  const fetchBarcodes = async () => {
    try {
      const response = await fetch('/api/products?storage=true')
      if (response.ok) {
        const data = await response.json()
        const productsWithBarcodes = (data.products || [])
          .filter((p: any) => p.barcode)
          .map((p: any) => ({
            productId: p.id,
            productName: p.name,
            barcode: p.barcode,
            sku: p.sku,
            category: p.category,
            brand: p.brand,
          }))
        setBarcodes(productsWithBarcodes)
      }
    } catch (error) {
      console.error('Failed to fetch barcodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkForDuplicates = async (barcode: string) => {
    try {
      const response = await fetch('/api/admin/products/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })

      if (response.ok) {
        const data = await response.json()
        const barcodeDuplicates = data.duplicates.filter((d: any) => d.field === 'barcode')
        setDuplicateCheck({
          barcode,
          duplicates: barcodeDuplicates.map((d: any) => ({
            productId: d.existingProduct.id,
            productName: d.existingProduct.name,
            barcode: d.value,
            sku: d.existingProduct.sku || '',
            category: '',
            brand: '',
          })),
        })
      }
    } catch (error) {
      console.error('Failed to check duplicates:', error)
    }
  }

  const generateBarcode = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/products/generate-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        setNewBarcode(data.barcode)
      }
    } catch (error) {
      console.error('Failed to generate barcode:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleBarcodeScan = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkForDuplicates(newBarcode)
    }
  }

  const filteredBarcodes = barcodes.filter(
    (b) =>
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-4xl font-bold text-white mb-2">Barcode Management</h1>
              <p className="text-white/60">Generate, scan, and manage product barcodes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchBarcodes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90" onClick={() => setShowGenerator(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Barcode
            </Button>
          </div>
        </div>

        {/* Barcode Generator */}
        {showGenerator && (
          <Card className="glass border border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Generate New Barcode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    onClick={generateBarcode}
                    disabled={generating}
                    className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
                  >
                    {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Barcode className="w-4 h-4 mr-2" />}
                    Generate Random Barcode
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setShowGenerator(false)}
                  >
                    Cancel
                  </Button>
                </div>
                {newBarcode && (
                  <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
                    <Label className="text-white/80 mb-2 block">Generated Barcode</Label>
                    <div className="flex gap-3">
                      <Input
                        value={newBarcode}
                        onChange={(e) => setNewBarcode(e.target.value)}
                        className="flex-1 bg-white/10 border-white/20 text-white"
                        onKeyDown={handleBarcodeScan}
                        placeholder="Or enter custom barcode"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          navigator.clipboard.writeText(newBarcode)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      className="mt-3 w-full bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                      onClick={() => checkForDuplicates(newBarcode)}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Check for Duplicates
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Duplicate Check Results */}
        {duplicateCheck && (
          <Card className={`glass border ${duplicateCheck.duplicates.length > 0 ? 'border-red-500/50' : 'border-green-500/50'} mb-8`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {duplicateCheck.duplicates.length > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${duplicateCheck.duplicates.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {duplicateCheck.duplicates.length > 0 ? 'Barcode Already Exists' : 'Barcode Available'}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">Barcode: {duplicateCheck.barcode}</p>
                  {duplicateCheck.duplicates.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-white/80 text-sm">Found in products:</p>
                      {duplicateCheck.duplicates.map((dup, index) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-white/80 text-sm">
                            <span className="font-medium text-white">{dup.productName}</span>
                          </p>
                          <p className="text-white/60 text-xs mt-1">SKU: {dup.sku} • Product ID: {dup.productId}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400 text-sm">This barcode is unique and can be assigned to a product.</p>
                  )}
                  <Button
                    variant="outline"
                    className="mt-4 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setDuplicateCheck(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="glass border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                  placeholder="Search by product name, barcode, or SKU..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barcodes List */}
        <Card className="glass border border-white/10">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-white/40">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading barcodes...</p>
              </div>
            ) : filteredBarcodes.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Barcode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No barcodes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBarcodes.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 glass border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Barcode className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.productName}</p>
                        <p className="text-white/60 text-sm">SKU: {item.sku}</p>
                        <p className="text-white/40 text-xs">
                          {item.category} • {item.brand}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-accent-primary font-mono text-lg">{item.barcode}</p>
                        <p className="text-white/40 text-xs">Barcode</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          navigator.clipboard.writeText(item.barcode)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
