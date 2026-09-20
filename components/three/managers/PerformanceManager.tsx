'use client'

import { useRef, useEffect, createContext, useContext } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface PerformanceContextType {
  deviceTier: 'low' | 'medium' | 'high'
  isMobile: boolean
  reducedMotion: boolean
  particleCount: number
  shadowQuality: number
  postProcessingEnabled: boolean
}

const PerformanceContext = createContext<PerformanceContextType>({
  deviceTier: 'high',
  isMobile: false,
  reducedMotion: false,
  particleCount: 1000,
  shadowQuality: 1,
  postProcessingEnabled: true,
})

export function usePerformance() {
  return useContext(PerformanceContext)
}

interface PerformanceManagerProps {
  children: React.ReactNode
}

export function PerformanceManager({ children }: PerformanceManagerProps) {
  const { gl } = useThree()
  const performanceRef = useRef<PerformanceContextType>({
    deviceTier: 'high',
    isMobile: false,
    reducedMotion: false,
    particleCount: 1000,
    shadowQuality: 1,
    postProcessingEnabled: true,
  })

  useEffect(() => {
    // Detect device capabilities
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Detect GPU performance (simplified)
    const renderer = gl as THREE.WebGLRenderer
    const maxTextureSize = renderer.capabilities.maxTextureSize
    
    let deviceTier: 'low' | 'medium' | 'high' = 'high'
    if (isMobile || maxTextureSize < 4096) {
      deviceTier = 'medium'
    }
    if (isMobile && maxTextureSize < 2048) {
      deviceTier = 'low'
    }

    // Configure performance settings based on device tier
    const settings: PerformanceContextType = {
      deviceTier,
      isMobile,
      reducedMotion: isReducedMotion,
      particleCount: deviceTier === 'low' ? 200 : deviceTier === 'medium' ? 500 : 1000,
      shadowQuality: deviceTier === 'low' ? 0.5 : deviceTier === 'medium' ? 0.75 : 1,
      postProcessingEnabled: deviceTier !== 'low',
    }

    performanceRef.current = settings

    // Configure renderer based on performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, deviceTier === 'low' ? 1 : 1.2))
    
    // Handle reduced motion preference
    if (isReducedMotion) {
      // Disable animations for reduced motion
    }
  }, [gl])

  return (
    <PerformanceContext.Provider value={performanceRef.current}>
      {children}
    </PerformanceContext.Provider>
  )
}
