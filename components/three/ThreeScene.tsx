'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import ThreeErrorBoundary from './ThreeErrorBoundary'
import FloatingShapes from './FloatingShapes'
import ParticleField from './ParticleField'
import GeometricGrid from './GeometricGrid'
import TorusKnotField from './TorusKnotField'

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <ThreeErrorBoundary>
        <Canvas 
          dpr={[1, 2]} 
          performance={{ min: 0.5 }} 
          gl={{ 
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: true,
            depth: true
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <FloatingShapes />
            <ParticleField />
            <GeometricGrid />
            <TorusKnotField />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
