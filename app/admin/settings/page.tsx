'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Database, 
  Globe, 
  Key, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { ProductImportEngine } from '@/lib/import-engine'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)
  
  const [wcConfig, setWcConfig] = useState({
    baseUrl: '',
    consumerKey: '',
    consumerSecret: '',
    enabled: false
  })
  
  const [shopifyConfig, setShopifyConfig] = useState({
    storeUrl: '',
    accessToken: '',
    apiVersion: '2024-01',
    enabled: false
  })

  const [syncSettings, setSyncSettings] = useState({
    autoSync: false,
    syncInterval: '24',
    updateExisting: true,
    skipDuplicates: true
  })

  const [fieldMapping, setFieldMapping] = useState({
    csv: ProductImportEngine.getDefaultMapping('csv'),
    json: ProductImportEngine.getDefaultMapping('json'),
    xml: ProductImportEngine.getDefaultMapping('xml')
  })

  const handleSave = () => {
    setIsSaving(true)
    setSaveResult(null)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setSaveResult({ success: true, message: 'Settings saved successfully' })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-display font-bold text-text-primary mb-4">Settings</h1>
        <p className="text-body-lg text-text-secondary">
          Configure API keys, import settings, and field mappings
        </p>
      </motion.div>

      {/* WooCommerce Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 font-bold text-text-primary flex items-center gap-3">
                <Database className="w-6 h-6 text-accent-primary" />
                WooCommerce Integration
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wcConfig.enabled}
                  onChange={(e) => setWcConfig({ ...wcConfig, enabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-small text-text-secondary">Enabled</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-small font-medium text-text-primary mb-2 block">Store URL</label>
                <Input
                  placeholder="https://yourstore.com"
                  value={wcConfig.baseUrl}
                  onChange={(e) => setWcConfig({ ...wcConfig, baseUrl: e.target.value })}
                  className="glass border-border-subtle"
                  disabled={!wcConfig.enabled}
                />
              </div>
              <div>
                <label className="text-small font-medium text-text-primary mb-2 block">Consumer Key</label>
                <Input
                  placeholder="ck_xxxxxxxxxxxx"
                  value={wcConfig.consumerKey}
                  onChange={(e) => setWcConfig({ ...wcConfig, consumerKey: e.target.value })}
                  className="glass border-border-subtle"
                  disabled={!wcConfig.enabled}
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
                  disabled={!wcConfig.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shopify Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 font-bold text-text-primary flex items-center gap-3">
                <Globe className="w-6 h-6 text-accent-primary" />
                Shopify Integration
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shopifyConfig.enabled}
                  onChange={(e) => setShopifyConfig({ ...shopifyConfig, enabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-small text-text-secondary">Enabled</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-small font-medium text-text-primary mb-2 block">Store URL</label>
                <Input
                  placeholder="https://yourstore.myshopify.com"
                  value={shopifyConfig.storeUrl}
                  onChange={(e) => setShopifyConfig({ ...shopifyConfig, storeUrl: e.target.value })}
                  className="glass border-border-subtle"
                  disabled={!shopifyConfig.enabled}
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
                  disabled={!shopifyConfig.enabled}
                />
              </div>
              <div>
                <label className="text-small font-medium text-text-primary mb-2 block">API Version</label>
                <Input
                  placeholder="2024-01"
                  value={shopifyConfig.apiVersion}
                  onChange={(e) => setShopifyConfig({ ...shopifyConfig, apiVersion: e.target.value })}
                  className="glass border-border-subtle"
                  disabled={!shopifyConfig.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sync Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <h2 className="text-h2 font-bold text-text-primary mb-6 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-accent-primary" />
              Synchronization Settings
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-background-tertiary/50 rounded-xl">
                <input
                  type="checkbox"
                  checked={syncSettings.autoSync}
                  onChange={(e) => setSyncSettings({ ...syncSettings, autoSync: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <div className="text-body font-medium text-text-primary">Auto Sync</div>
                  <div className="text-small text-text-tertiary">Automatically sync products at regular intervals</div>
                </div>
              </label>

              <div>
                <label className="text-small font-medium text-text-primary mb-2 block">Sync Interval (hours)</label>
                <Input
                  type="number"
                  value={syncSettings.syncInterval}
                  onChange={(e) => setSyncSettings({ ...syncSettings, syncInterval: e.target.value })}
                  className="glass border-border-subtle"
                  disabled={!syncSettings.autoSync}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-background-tertiary/50 rounded-xl">
                <input
                  type="checkbox"
                  checked={syncSettings.updateExisting}
                  onChange={(e) => setSyncSettings({ ...syncSettings, updateExisting: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <div className="text-body font-medium text-text-primary">Update Existing Products</div>
                  <div className="text-small text-text-tertiary">Update product details when duplicates are found</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-background-tertiary/50 rounded-xl">
                <input
                  type="checkbox"
                  checked={syncSettings.skipDuplicates}
                  onChange={(e) => setSyncSettings({ ...syncSettings, skipDuplicates: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <div className="text-body font-medium text-text-primary">Skip Duplicates</div>
                  <div className="text-small text-text-tertiary">Skip products that already exist in inventory</div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Field Mapping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="glass border-border-subtle">
          <CardContent className="p-6">
            <h2 className="text-h2 font-bold text-text-primary mb-6 flex items-center gap-3">
              <Key className="w-6 h-6 text-accent-primary" />
              Field Mapping
            </h2>
            
            <div className="mb-4">
              <label className="text-small font-medium text-text-primary mb-2 block">Format</label>
              <div className="flex gap-2">
                {['csv', 'json', 'xml'].map((fmt) => (
                  <button
                    key={fmt}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      true // Default to CSV for now
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-tertiary text-text-secondary'
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(fieldMapping.csv).map(([target, source]) => (
                <div key={target} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-small text-text-tertiary block mb-1">Target Field</label>
                    <Input
                      value={target}
                      disabled
                      className="glass border-border-subtle text-small"
                    />
                  </div>
                  <div className="text-text-tertiary">→</div>
                  <div className="flex-1">
                    <label className="text-small text-text-tertiary block mb-1">Source Field</label>
                    <Input
                      value={source}
                      onChange={(e) => setFieldMapping({
                        ...fieldMapping,
                        csv: { ...fieldMapping.csv, [target]: e.target.value as string }
                      })}
                      className="glass border-border-subtle text-small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="xl"
        >
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>

      {/* Save Result */}
      {saveResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`glass border-2 ${
            saveResult.success ? 'border-accent-success' : 'border-accent-error'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center">
                {saveResult.success ? (
                  <CheckCircle className="w-6 h-6 text-accent-success mr-3" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-accent-error mr-3" />
                )}
                <span className="text-body text-text-primary">{saveResult.message}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
