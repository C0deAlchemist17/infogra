'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Cpu, Monitor, HardDrive, MemoryStick, Zap, Box, Fan, 
  CheckCircle, AlertTriangle, XCircle, Share2, Save, RotateCcw, 
  Info, ShoppingCart, Star, Trophy, Target, TrendingUp, DollarSign, 
  Wrench, Sparkles, Package, Shield
} from 'lucide-react'
import { products } from '@/data/products'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})

interface Component {
  id: string
  name: string
  brand: string
  price: number
  category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'motherboard' | 'psu' | 'case' | 'cooling'
  specifications: Record<string, string>
  power: number
  image?: string
  rating: number
}

interface Build {
  cpu?: Component
  motherboard?: Component
  ram?: Component
  gpu?: Component
  storage?: Component
  psu?: Component
  case?: Component
  cooling?: Component
}

interface CompatibilityIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  components: string[]
}

// Map real products to PC Builder components
const mapProductsToComponents = (): Component[] => {
  const componentMap: Component[] = []
  
  products.forEach(product => {
    const category = product.category.toLowerCase()
    
    if (category.includes('processor')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'cpu',
        specifications: product.specifications,
        power: parseInt(product.specifications['TDP']) || 125,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('graphics')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'gpu',
        specifications: product.specifications,
        power: parseInt(product.specifications['TDP']) || 300,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('ram')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'ram',
        specifications: product.specifications,
        power: 10,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('storage')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'storage',
        specifications: product.specifications,
        power: 8,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('motherboard')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'motherboard',
        specifications: product.specifications,
        power: 50,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('power')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'psu',
        specifications: product.specifications,
        power: 0,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('case')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'case',
        specifications: product.specifications,
        power: 0,
        image: product.images[0],
        rating: product.rating
      })
    } else if (category.includes('cooling')) {
      componentMap.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: 'cooling',
        specifications: product.specifications,
        power: 15,
        image: product.images[0],
        rating: product.rating
      })
    }
  })
  
  return componentMap
}

const categoryIcons: Record<string, any> = {
  cpu: Cpu,
  gpu: Monitor,
  ram: MemoryStick,
  storage: HardDrive,
  motherboard: Box,
  psu: Zap,
  case: Package,
  cooling: Fan,
}

const categoryLabels: Record<string, string> = {
  cpu: 'Processor (CPU)',
  gpu: 'Graphics Card (GPU)',
  ram: 'Memory (RAM)',
  storage: 'Storage (SSD/HDD)',
  motherboard: 'Motherboard',
  psu: 'Power Supply (PSU)',
  case: 'PC Case',
  cooling: 'Cooling System',
}

const categoryDescriptions: Record<string, string> = {
  cpu: 'The brain of your computer - determines processing power',
  gpu: 'Handles graphics rendering - essential for gaming and creative work',
  ram: 'Temporary memory for running applications smoothly',
  storage: 'Where your files, games, and operating system are stored',
  motherboard: 'Connects all components together - choose based on CPU socket',
  psu: 'Powers all your components - never cheap out on this!',
  case: 'Houses and protects your components - pick for style and airflow',
  cooling: 'Keeps your components cool under load',
}

export default function PCBuilderPage() {
  const [build, setBuild] = useState<Build>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('price-asc')
  
  const mockComponents = useMemo(() => mapProductsToComponents(), [])

  const totalPower = useMemo(() => {
    return Object.values(build).reduce((sum, component) => sum + (component?.power || 0), 0)
  }, [build])

  const totalPrice = useMemo(() => {
    return Object.values(build).reduce((sum, component) => sum + (component?.price || 0), 0)
  }, [build])

  const buildProgress = useMemo(() => {
    const categories = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooling']
    const filled = categories.filter(cat => build[cat as keyof Build]).length
    return Math.round((filled / categories.length) * 100)
  }, [build])

  const performanceScore = useMemo(() => {
    let score = 0
    if (build.cpu) {
      const cpuCores = parseInt(build.cpu.specifications['Cores']) || 8
      score += Math.min(cpuCores * 4, 35)
    }
    if (build.gpu) {
      const gpuMemory = parseInt(build.gpu.specifications['VRAM']) || 8
      score += Math.min(gpuMemory * 3, 35)
    }
    if (build.ram) {
      const ramSize = parseInt(build.ram.specifications['Capacity']) || 16
      score += Math.min(ramSize * 0.5, 15)
    }
    if (build.storage) {
      const storageSize = parseInt(build.storage.specifications['Capacity']) || 512
      score += Math.min(storageSize / 100, 10)
    }
    if (build.motherboard) score += 5
    if (build.psu) score += 5
    return Math.min(Math.round(score), 100)
  }, [build])

  const performanceLabel = useMemo(() => {
    if (performanceScore >= 90) return { text: 'Extreme', color: 'text-accent-error' }
    if (performanceScore >= 75) return { text: 'High', color: 'text-accent-primary' }
    if (performanceScore >= 50) return { text: 'Medium', color: 'text-accent-highlight' }
    if (performanceScore >= 25) return { text: 'Entry', color: 'text-accent-success' }
    return { text: 'Incomplete', color: 'text-text-tertiary' }
  }, [performanceScore])

  const compatibilityIssues = useMemo(() => {
    const issues: CompatibilityIssue[] = []

    if (build.cpu && build.motherboard) {
      const cpuSocket = build.cpu.specifications['Socket']
      const mbSocket = build.motherboard.specifications['Socket']
      if (cpuSocket && mbSocket && !mbSocket.includes(cpuSocket.replace('Socket ', ''))) {
        issues.push({
          severity: 'error',
          message: `CPU socket (${cpuSocket}) may not match motherboard socket (${mbSocket})`,
          components: ['CPU', 'Motherboard']
        })
      }
    }

    if (build.psu) {
      const psuWattage = parseInt(build.psu.specifications['Wattage']) || 0
      const recommendedPower = totalPower * 1.2
      
      if (psuWattage < totalPower) {
        issues.push({
          severity: 'error',
          message: `PSU (${psuWattage}W) is insufficient for estimated power draw (${totalPower}W)`,
          components: ['PSU']
        })
      } else if (psuWattage < recommendedPower) {
        issues.push({
          severity: 'warning',
          message: `PSU headroom is low. Consider ${Math.ceil(recommendedPower)}W+ for stability`,
          components: ['PSU']
        })
      }
    }

    if (build.ram && build.motherboard) {
      const ramType = build.ram.specifications['Type']
      const mbMemory = build.motherboard.specifications['Memory']
      if (ramType && mbMemory && !mbMemory.includes(ramType)) {
        issues.push({
          severity: 'warning',
          message: `${ramType} RAM may not be compatible with this motherboard`,
          components: ['RAM', 'Motherboard']
        })
      }
    }

    if (!build.cpu && !build.motherboard && !build.ram && !build.gpu) {
      issues.push({
        severity: 'info',
        message: 'Start selecting components to build your dream PC!',
        components: []
      })
    }

    return issues
  }, [build, totalPower])

  const handleSelectComponent = useCallback((component: Component) => {
    setBuild(prev => ({
      ...prev,
      [component.category]: component
    }))
    setSelectedCategory(null)
  }, [])

  const handleRemoveComponent = useCallback((category: string) => {
    setBuild(prev => {
      const newBuild = { ...prev }
      delete newBuild[category as keyof Build]
      return newBuild
    })
  }, [])

  const handleClearBuild = useCallback(() => {
    setBuild({})
    setSelectedCategory(null)
  }, [])

  const handleShareBuild = useCallback(() => {
    const buildData = Object.entries(build).map(([cat, comp]) => 
      comp ? `${cat}: ${comp.name}` : null
    ).filter(Boolean).join('\n')
    
    const message = `Check out my PC Build!\n\n${buildData}\n\nTotal: EGP ${totalPrice.toLocaleString()}\nBuilt with INFOGRA PC Builder`
    navigator.clipboard.writeText(message)
    alert('Build summary copied to clipboard!')
  }, [build, totalPrice])

  const handleSaveBuild = useCallback(() => {
    localStorage.setItem('pc-build', JSON.stringify(build))
    alert('Build saved to your browser!')
  }, [build])

  const getCategoryComponents = useCallback((category: string) => {
    const components = mockComponents.filter(c => c.category === category)
    
    return components.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })
  }, [mockComponents, sortBy])

  const errorCount = compatibilityIssues.filter(i => i.severity === 'error').length
  const warningCount = compatibilityIssues.filter(i => i.severity === 'warning').length

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background-secondary to-background-primary overflow-hidden">
        <SectionBackground opacity={0.3} />
        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-subtle mb-6">
              <Wrench className="w-5 h-5 text-accent-primary" />
              <span className="text-small text-text-secondary">PC Builder Tool</span>
            </div>
            <h1 className="text-h2 md:text-h1 font-bold text-text-primary mb-4">
              <span className="gradient-text">Build Your Dream PC</span>
            </h1>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Choose the perfect components for your custom build. Real products with real prices from our store.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-4 bg-background-secondary/50 border-b border-border-subtle sticky top-0 z-40">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-background-tertiary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${buildProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-small font-medium text-text-primary">{buildProgress}%</span>
              </div>
              <span className="text-small text-text-tertiary">
                {Object.keys(build).length}/8 components selected
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {errorCount > 0 && (
                <Badge className="bg-accent-error/20 text-accent-error border-accent-error">
                  {errorCount} Error{errorCount > 1 ? 's' : ''}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge className="bg-accent-highlight/20 text-accent-highlight border-accent-highlight">
                  {warningCount} Warning{warningCount > 1 ? 's' : ''}
                </Badge>
              )}
              <div className="text-right">
                <div className="text-caption text-text-tertiary">Total</div>
                <div className="text-body font-bold gradient-text">EGP {totalPrice.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Component Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Build Summary - Visual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass border-border-subtle">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-h3 font-bold text-text-primary flex items-center gap-3">
                        <Package className="w-6 h-6 text-accent-primary" />
                        Your Build
                      </h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleClearBuild} className="px-4">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSaveBuild} className="px-4">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShareBuild} className="px-4">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Visual Build Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooling'] as const).map((category) => {
                        const Icon = categoryIcons[category]
                        const component = build[category]
                        
                        return (
                          <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              selectedCategory === category
                                ? 'border-accent-primary bg-accent-primary/10'
                                : component
                                ? 'border-accent-success/50 bg-accent-success/5'
                                : 'border-border-subtle bg-background-tertiary/30 hover:border-accent-primary/30'
                            }`}
                          >
                            {component ? (
                              <>
                                <div className="w-10 h-10 bg-accent-success/20 rounded-xl flex items-center justify-center mb-2">
                                  <CheckCircle className="w-5 h-5 text-accent-success" />
                                </div>
                                <div className="text-caption font-medium text-text-primary truncate">{component.name.split(' ').slice(0, 3).join(' ')}</div>
                                <div className="text-caption text-accent-primary font-bold mt-1">EGP {component.price.toLocaleString()}</div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveComponent(category)
                                  }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-error/20 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent-error/40 transition-all"
                                >
                                  <XCircle className="w-4 h-4 text-accent-error" />
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 bg-background-tertiary rounded-xl flex items-center justify-center mb-2">
                                  <Icon className="w-5 h-5 text-text-tertiary" />
                                </div>
                                <div className="text-caption font-medium text-text-secondary">{categoryLabels[category].split(' ')[0]}</div>
                                <div className="text-caption text-text-tertiary mt-1">Click to select</div>
                              </>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Component Browser */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass border-border-subtle">
                  <CardContent className="p-6">
                    {selectedCategory ? (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
                              {(() => { const Icon = categoryIcons[selectedCategory]; return <Icon className="w-5 h-5 text-accent-primary" /> })()}
                              {categoryLabels[selectedCategory]}
                            </h3>
                            <p className="text-small text-text-tertiary mt-1">{categoryDescriptions[selectedCategory]}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="px-3 py-2 rounded-xl glass border border-border-subtle text-small text-text-primary focus:outline-none focus:border-accent-primary"
                            >
                              <option value="price-asc">Price: Low to High</option>
                              <option value="price-desc">Price: High to Low</option>
                              <option value="rating">Best Rated</option>
                              <option value="name">Name A-Z</option>
                            </select>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                              <XCircle className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                          {getCategoryComponents(selectedCategory).length === 0 ? (
                            <div className="text-center py-12 text-text-tertiary">
                              <Info className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-body">No products available in this category</p>
                            </div>
                          ) : (
                            getCategoryComponents(selectedCategory).map((component, index) => {
                              const isSelected = (build as Record<string, Component | undefined>)[selectedCategory]?.id === component.id
                              
                              return (
                                <motion.button
                                  key={component.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handleSelectComponent(component)}
                                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                    isSelected
                                      ? 'border-accent-success bg-accent-success/10'
                                      : 'border-border-subtle bg-background-tertiary/30 hover:border-accent-primary/50 hover:bg-background-tertiary/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    {component.image && (
                                      <div className="w-20 h-20 bg-background-secondary rounded-xl overflow-hidden shrink-0 relative">
                                        <Image
                                          src={component.image}
                                          alt={component.name}
                                          fill
                                          className="object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-body font-semibold text-text-primary truncate">{component.name}</span>
                                        {isSelected && <CheckCircle className="w-4 h-4 text-accent-success shrink-0" />}
                                      </div>
                                      <div className="text-small text-text-tertiary mb-2">{component.brand}</div>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        {Object.entries(component.specifications).slice(0, 3).map(([key, value]) => (
                                          <span key={key} className="text-caption text-text-tertiary">
                                            <span className="text-accent-primary">{key}:</span> {value}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(component.rating) ? 'text-accent-primary fill-accent-primary' : 'text-text-tertiary'}`} />
                                          ))}
                                        </div>
                                        <span className="text-caption text-text-tertiary">({component.rating})</span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="text-h4 font-bold gradient-text">EGP {component.price.toLocaleString()}</div>
                                      <div className="text-caption text-text-tertiary mt-1">{component.power}W</div>
                                    </div>
                                  </div>
                                </motion.button>
                              )
                            })
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-accent-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Wrench className="w-12 h-12 text-accent-primary" />
                        </div>
                        <h3 className="text-h3 font-bold text-text-primary mb-3">Select a Component</h3>
                        <p className="text-body text-text-secondary max-w-md mx-auto">
                          Click on any component slot above to browse available options and start building your dream PC.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Stats & Info Sidebar */}
            <div className="space-y-6">
              {/* Performance Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass border-border-subtle">
                  <CardContent className="p-6">
                    <h2 className="text-h4 font-bold text-text-primary mb-6 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-accent-primary" />
                      Performance Score
                    </h2>
                    
                    <div className="text-center mb-6">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-background-tertiary" />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" strokeWidth="8" 
                            strokeDasharray={`${performanceScore * 2.51} 251`}
                            className="text-accent-primary transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-h2 font-bold text-text-primary">{performanceScore}</span>
                          <span className={`text-caption font-medium ${performanceLabel.color}`}>{performanceLabel.text}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(build).map(([category, component]) => (
                        component ? (
                          <div key={category} className="flex justify-between items-center text-small">
                            <span className="text-text-secondary capitalize">{categoryLabels[category]?.split(' ')[0]}</span>
                            <span className="font-medium text-text-primary">{component.power}W</span>
                          </div>
                        ) : null
                      ))}
                      
                      <div className="pt-3 border-t border-border-subtle">
                        <div className="flex justify-between items-center">
                          <span className="text-body font-semibold text-text-primary">Total Power</span>
                          <span className="text-h4 font-bold gradient-text">{totalPower}W</span>
                        </div>
                        {build.psu && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-small text-text-secondary">PSU Capacity</span>
                            <span className="text-small font-medium text-text-primary">{build.psu.specifications['Wattage'] || 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Compatibility Check */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass border-border-subtle">
                  <CardContent className="p-6">
                    <h2 className="text-h4 font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-accent-primary" />
                      Compatibility
                    </h2>

                    {compatibilityIssues.length === 0 ? (
                      <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 text-accent-success mx-auto mb-3" />
                        <p className="text-body font-medium text-text-primary">All good!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {compatibilityIssues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-xl text-small ${
                              issue.severity === 'error'
                                ? 'bg-accent-error/10 border border-accent-error/30 text-accent-error'
                                : issue.severity === 'warning'
                                ? 'bg-accent-highlight/10 border border-accent-highlight/30 text-accent-highlight'
                                : 'bg-accent-primary/10 border border-accent-primary/30 text-accent-primary'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {issue.severity === 'error' ? (
                                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              ) : issue.severity === 'warning' ? (
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                              ) : (
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                              )}
                              <span>{issue.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Build Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="glass border-border-subtle bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
                  <CardContent className="p-6">
                    <h3 className="text-h4 font-bold text-text-primary mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent-primary" />
                      Price Summary
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      {Object.entries(build).map(([category, component]) => (
                        component ? (
                          <div key={category} className="flex justify-between items-center text-small">
                            <span className="text-text-secondary truncate max-w-[60%]">{component.name.split(' ').slice(0, 3).join(' ')}</span>
                            <span className="font-medium text-text-primary">EGP {component.price.toLocaleString()}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-border-subtle">
                      <div className="flex justify-between items-center">
                        <span className="text-body font-bold text-text-primary">Total</span>
                        <span className="text-h3 font-bold gradient-text">EGP {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      variant="premium"
                      disabled={Object.keys(build).length === 0}
                      onClick={() => {
                        const buildSummary = Object.entries(build)
                          .filter(([_, comp]) => comp)
                          .map(([cat, comp]) => `${categoryLabels[cat]}: ${comp!.name} - EGP ${comp!.price.toLocaleString()}`)
                          .join('%0A')
                        const message = encodeURIComponent(`Hello INFOGRA! I'm interested in building this PC:%0A%0A${buildSummary}%0A%0ATotal: EGP ${totalPrice.toLocaleString()}%0A%0APlease help me with this build!`)
                        window.open(`https://wa.me/201061866211?text=${message}`, '_blank')
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Inquire on WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pro Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glass border-border-subtle">
                  <CardContent className="p-6">
                    <h3 className="text-h4 font-bold text-text-primary mb-4">💡 Pro Tips</h3>
                    <ul className="space-y-3 text-small text-text-secondary">
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                        <span>Always choose a PSU with 20%+ headroom for stability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                        <span>DDR5 RAM requires a compatible motherboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                        <span>High-end GPUs need powerful PSUs (650W+)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                        <span>CPU and motherboard sockets must match</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
