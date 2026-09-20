'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, TrendingUp, TrendingDown, Package, DollarSign, BarChart3, Activity, RefreshCw, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ReportData {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalInventory: number
  totalCostValue: number
  totalSellingValue: number
  potentialProfit: number
  averageProfitMargin: number
  topSellingProducts: any[]
  lowStockProducts: any[]
  outOfStockProducts: any[]
  recentlyAdded: any[]
  recentlyUpdated: any[]
}

export default function ReportsContent() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<string>('overview')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchReportData()
  }, [selectedReport])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/products/reports')
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const reports = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory Valuation', icon: Package },
    { id: 'profitability', name: 'Profitability', icon: DollarSign },
    { id: 'activity', name: 'Activity', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Product Reports</h1>
              <p className="text-white/60">Inventory valuation, profitability, and activity reports</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={fetchReportData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <Card className="glass border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {reports.map((report) => (
                <Button
                  key={report.id}
                  variant={selectedReport === report.id ? 'default' : 'outline'}
                  className={
                    selectedReport === report.id
                      ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }
                  onClick={() => setSelectedReport(report.id)}
                >
                  <report.icon className="w-4 h-4 mr-2" />
                  {report.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date Range Filter */}
        <Card className="glass border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-white/60" />
              <div className="flex gap-4">
                <div>
                  <Label className="text-white/80 mb-2 block">Start Date</Label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">End Date</Label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12 text-white/40">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
            <p>Loading report data...</p>
          </div>
        ) : selectedReport === 'overview' && reportData ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-blue-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{reportData.totalProducts}</p>
                <p className="text-white/60 text-sm">Total Products</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">EGP {reportData.totalSellingValue.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Total Selling Value</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">EGP {reportData.potentialProfit.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Potential Profit</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-orange-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{reportData.averageProfitMargin.toFixed(1)}%</p>
                <p className="text-white/60 text-sm">Avg Profit Margin</p>
              </motion.div>
            </div>

            {/* Activity Summary */}
            <Card className="glass border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white/80 mb-3">Recently Added</h3>
                    <div className="space-y-2">
                      {reportData.recentlyAdded?.slice(0, 5).map((product, index) => (
                        <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">Added: {new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white/80 mb-3">Recently Updated</h3>
                    <div className="space-y-2">
                      {reportData.recentlyUpdated?.slice(0, 5).map((product, index) => (
                        <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedReport === 'inventory' && reportData ? (
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Inventory Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Total Inventory</p>
                    <p className="text-3xl font-bold text-white">{reportData.totalInventory.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">Units</p>
                  </div>
                  <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Cost Value</p>
                    <p className="text-3xl font-bold text-white">EGP {reportData.totalCostValue.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">Purchase cost</p>
                  </div>
                  <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Selling Value</p>
                    <p className="text-3xl font-bold text-white">EGP {reportData.totalSellingValue.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">Retail value</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Low Stock Products</h3>
                  <div className="space-y-2">
                    {reportData.lowStockProducts?.slice(0, 10).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div>
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-medium">{product.stock}</p>
                          <p className="text-white/40 text-xs">units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : selectedReport === 'profitability' && reportData ? (
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profitability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Potential Profit</p>
                    <p className="text-3xl font-bold text-white">EGP {reportData.potentialProfit.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">If all inventory sold</p>
                  </div>
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Average Profit Margin</p>
                    <p className="text-3xl font-bold text-white">{reportData.averageProfitMargin.toFixed(1)}%</p>
                    <p className="text-white/40 text-xs">Across all products</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Top Selling Products</h3>
                  <div className="space-y-2">
                    {reportData.topSellingProducts?.slice(0, 10).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div>
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">EGP {product.price?.toLocaleString()}</p>
                          <p className="text-white/40 text-xs">selling price</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : selectedReport === 'activity' && reportData ? (
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Activity Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Product Status Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <span className="text-white text-sm">Active Products</span>
                        <span className="text-green-400 font-bold">{reportData.activeProducts}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <span className="text-white text-sm">Inactive Products</span>
                        <span className="text-red-400 font-bold">{reportData.inactiveProducts}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <span className="text-white text-sm">Out of Stock</span>
                        <span className="text-yellow-400 font-bold">{reportData.outOfStockProducts?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Recent Changes</h3>
                    <div className="space-y-2">
                      {reportData.recentlyUpdated?.slice(0, 10).map((product, index) => (
                        <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">Last updated: {new Date(product.updatedAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 text-white/40">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a report type to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
