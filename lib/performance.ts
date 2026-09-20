// Performance utilities for INFOGRA

export interface PerformanceMetrics {
  fps: number
  memory: number
  dpr: number
  deviceTier: 'high' | 'medium' | 'low'
}

// Detect device performance tier
export function detectDeviceTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'medium'

  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  const deviceMemory = (navigator as any).deviceMemory || 4
  
  // Check for WebGL support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  const hasWebGL = !!gl
  
  if (!hasWebGL) return 'low'
  
  // High performance: 8+ cores, 8GB+ memory
  if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
    return 'high'
  }
  
  // Low performance: 2 cores, 2GB memory
  if (hardwareConcurrency <= 2 || deviceMemory <= 2) {
    return 'low'
  }
  
  return 'medium'
}

// Get appropriate DPR based on device tier
export function getOptimalDPR(tier: 'high' | 'medium' | 'low'): number {
  switch (tier) {
    case 'high':
      return window.devicePixelRatio || 1.5
    case 'medium':
      return Math.min(window.devicePixelRatio || 1, 1.5)
    case 'low':
      return 1
    default:
      return 1
  }
}

// Get appropriate particle count based on device tier
export function getOptimalParticleCount(tier: 'high' | 'medium' | 'low', baseCount: number): number {
  switch (tier) {
    case 'high':
      return baseCount
    case 'medium':
      return Math.floor(baseCount * 0.6)
    case 'low':
      return Math.floor(baseCount * 0.3)
    default:
      return baseCount
  }
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Performance monitoring
export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private interval: NodeJS.Timeout | null = null
  
  start(callback: (metrics: PerformanceMetrics) => void) {
    this.interval = setInterval(() => {
      const now = performance.now()
      const delta = now - this.lastTime
      this.fps = Math.round((this.frameCount * 1000) / delta)
      this.frameCount = 0
      this.lastTime = now
      
      const metrics: PerformanceMetrics = {
        fps: this.fps,
        memory: (performance as any).memory?.usedJSHeapSize / 1048576 || 0,
        dpr: window.devicePixelRatio || 1,
        deviceTier: detectDeviceTier()
      }
      
      callback(metrics)
    }, 1000)
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
  
  tick() {
    this.frameCount++
  }
}

// Debounce utility for search/filter operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility for scroll handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
