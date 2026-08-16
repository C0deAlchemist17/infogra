'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'
import FloatingShapes from './FloatingShapes'
import ParticleField from './ParticleField'
import GeometricGrid from './GeometricGrid'
import TorusKnotField from './TorusKnotField'

function ScrollManager() {
  const groupRef = useRef<THREE.Group>(null)
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly interpolate rotation based on scroll position
      const targetRotationX = scrollY * 0.001
      const targetRotationY = scrollY * 0.0005
      
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotationX, 4, delta)
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotationY, 4, delta)
      
      // Move slightly up/down based on scroll
      const targetPositionY = scrollY * 0.005
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPositionY, 4, delta)
    }
  })

  return (
    <group ref={groupRef}>
      <FloatingShapes />
      <ParticleField />
      <GeometricGrid />
      <TorusKnotField />
    </group>
  )
}

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
            
            <ScrollManager />
            
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
