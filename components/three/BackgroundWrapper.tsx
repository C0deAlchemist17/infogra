'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'
import { StarField } from './StarField'
import { detectDeviceTier, getOptimalDPR, getOptimalParticleCount, prefersReducedMotion } from '@/lib/performance'

export default function BackgroundWrapper() {
  const [deviceTier, setDeviceTier] = useState<'high' | 'medium' | 'low'>('medium')
  const [dpr, setDpr] = useState<[number, number]>([1, 1.2])
  const [particleCount, setParticleCount] = useState(1500)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Detect device performance
    const tier = detectDeviceTier()
    setDeviceTier(tier)
    
    // Set appropriate DPR
    const optimalDPR = getOptimalDPR(tier)
    setDpr([1, optimalDPR])
    
    // Set appropriate particle count
    const optimalCount = getOptimalParticleCount(tier, 1500)
    setParticleCount(optimalCount)
    
    // Check for reduced motion preference
    if (prefersReducedMotion()) {
      setShouldRender(false)
    }
  }, [])

  if (!shouldRender) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <ThreeErrorBoundary>
        <Canvas
          dpr={dpr}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: 'transparent' }}
          camera={{ position: [0, 0, 100], fov: 75 }}
        >
          <Suspense fallback={null}>
            <StarField count={particleCount} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
