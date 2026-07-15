'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Upload,
  Download,
  Settings,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const stats = [
    { icon: Package, label: 'Total Products', value: '1,247', change: '+12%', color: 'text-accent-primary' },
    { icon: ShoppingCart, label: 'Orders', value: '348', change: '+8%', color: 'text-accent-secondary' },
    { icon: Users, label: 'Customers', value: '1,892', change: '+15%', color: 'text-accent-highlight' },
    { icon: TrendingUp, label: 'Revenue', value: '$48,290', change: '+22%', color: 'text-accent-success' },
  ]

  const quickActions = [
    { icon: Upload, label: 'Import Products', href: '/admin/import', description: 'Import from CSV, JSON, XML, or API' },
    { icon: Package, label: 'Manage Inventory', href: '/admin/inventory', description: 'Bulk edit, stock management' },
    { icon: Download, label: 'Export Products', href: '/admin/export', description: 'Export to CSV or JSON' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', description: 'API keys, mappings, sync' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-display-xs md:text-display lg:text-display-lg font-bold text-text-primary mb-8">Admin Dashboard</h1>
        <p className="text-body-lg md:text-h4 text-text-secondary leading-relaxed">
          Manage your inventory, imports, and store settings
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Card className="glass border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow">
              <CardContent className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <span className="text-small text-accent-success font-medium">{stat.change}</span>
                </div>
                <div className="text-h3 font-bold text-text-primary mb-3">{stat.value}</div>
                <div className="text-body text-text-secondary">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-12">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link href={action.href}>
                <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow cursor-pointer group h-full">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 bg-accent-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-primary/20 transition-colors duration-700">
                      <action.icon className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h3 className="text-h4 font-semibold text-text-primary mb-4">{action.label}</h3>
                    <p className="text-body text-text-secondary leading-relaxed">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-12">Recent Activity</h2>
        <Card className="glass border-border-subtle">
          <CardContent className="p-10">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-6 pb-6 border-b border-border-subtle last:border-0 last:pb-0">
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-body font-semibold text-text-primary mb-1">Product imported successfully</div>
                    <div className="text-small text-text-tertiary">2 hours ago</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-tertiary" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
