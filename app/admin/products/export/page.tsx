'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Download, FileSpreadsheet, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ExportProductsPage() {
  const [format, setFormat] = useState('csv')
  const [filter, setFilter] = useState('all')

  const handleExport = () => {
    const url = `/api/admin/products/export?format=${format}&filter=${filter}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Export Products</h1>
            <p className="text-white/60">Export products to CSV or JSON</p>
          </div>
        </div>

        <Card className="glass border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-white/80 mb-2 block">Format</Label>
              <Select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              >
                <SelectContent className="bg-[#1a1a2e] border-white/20">
                  <SelectItem value="csv">CSV (Excel-compatible)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/80 mb-2 block">Filter</Label>
              <Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              >
                <SelectContent className="bg-[#1a1a2e] border-white/20">
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Products
            </Button>

            <div className="p-4 glass border border-white/10 rounded-lg">
              <p className="text-white/60 text-sm">
                The export will include all product data including name, SKU, category, brand, price, stock, and status.
                Filtered exports will only include products matching the selected criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
