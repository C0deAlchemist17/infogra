'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'
import { StarField } from './StarField'

interface ExperienceProps {
  route?: string
}

export default function Experience({ route = 'home' }: ExperienceProps) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <ThreeErrorBoundary>
        <Canvas
          dpr={[1, 1.2]}
          gl={{
            antialias: false, // Disable antialias for performance
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
            <StarField count={1500} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
