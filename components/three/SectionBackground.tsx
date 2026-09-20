'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'

// Check for reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  
  return prefersReducedMotion
}

// Check for mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

function FloatingOrb({ position, color, speed, reducedMotion }: { position: [number, number, number]; color: string; speed: number; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  )
}

function Particles({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 15 : 30
  const positions = useRef(new Float32Array(count * 3))
  
  if (positions.current[0] === 0) {
    for (let i = 0; i < count * 3; i += 3) {
      positions.current[i] = (Math.random() - 0.5) * 20
      positions.current[i + 1] = (Math.random() - 0.5) * 20
      positions.current[i + 2] = (Math.random() - 0.5) * 10 - 5
    }
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.03 : 0.05}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ reducedMotion, isMobile }: { reducedMotion: boolean; isMobile: boolean }) {
  if (reducedMotion) {
    // Static scene for reduced motion
    return (
      <>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#06b6d4" />
        
        <FloatingOrb position={[-4, 2, -3]} color="#8b5cf6" speed={0} reducedMotion={true} />
        <FloatingOrb position={[4, -1, -4]} color="#06b6d4" speed={0} reducedMotion={true} />
        <FloatingOrb position={[0, 3, -5]} color="#ec4899" speed={0} reducedMotion={true} />
        
        <Particles isMobile={isMobile} />
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#06b6d4" />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <FloatingOrb position={[-4, 2, -3]} color="#8b5cf6" speed={0.5} reducedMotion={false} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <FloatingOrb position={[4, -1, -4]} color="#06b6d4" speed={0.7} reducedMotion={false} />
      </Float>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
        <FloatingOrb position={[0, 3, -5]} color="#ec4899" speed={0.4} reducedMotion={false} />
      </Float>
      
      <Particles isMobile={isMobile} />
    </>
  )
}

interface SectionBackgroundProps {
  className?: string
  opacity?: number
}

export default function SectionBackground({ className = '', opacity = 1 }: SectionBackgroundProps) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0, opacity }}>
      <ThreeErrorBoundary>
        <Canvas
          dpr={[1, isMobile ? 1 : 1.5]}
          performance={{ min: 0.5 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Scene reducedMotion={reducedMotion} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
