'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'

interface RingProps {
  radius: number
  tube: number
  color: string
  speed: number
  rotationAxis: [number, number, number]
  opacity: number
}

function HoloRing({ radius, tube, color, speed, rotationAxis, opacity }: RingProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationAxis[0] * speed
      meshRef.current.rotation.y += rotationAxis[1] * speed
      meshRef.current.rotation.z += rotationAxis[2] * speed
      
      // Pulsing glow
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tube, 32, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={opacity}
        metalness={0.9}
        roughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function FloatingParticles({ count = 200, color = '#8b5cf6' }: { count?: number; color?: string }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 1.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      sz[i] = Math.random() * 0.03 + 0.01
    }
    return { positions: pos, sizes: sz }
  }, [count])
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002
      pointsRef.current.rotation.x += 0.001
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function HolographicRingScene() {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group>
        <HoloRing radius={1.5} tube={0.03} color="#3b82f6" speed={0.3} rotationAxis={[1, 0, 0]} opacity={0.6} />
        <HoloRing radius={1.8} tube={0.02} color="#8b5cf6" speed={0.4} rotationAxis={[0, 1, 0.5]} opacity={0.5} />
        <HoloRing radius={2.1} tube={0.025} color="#06b6d4" speed={0.25} rotationAxis={[0.5, 0, 1]} opacity={0.4} />
        <HoloRing radius={2.4} tube={0.015} color="#ec4899" speed={0.35} rotationAxis={[0, 0.5, 1]} opacity={0.3} />
        
        {/* Central glow */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        <FloatingParticles />
      </group>
    </Float>
  )
}

export default function HolographicRing() {
  return (
    <ThreeErrorBoundary>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#8b5cf6" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
          <HolographicRingScene />
        </Suspense>
      </Canvas>
    </ThreeErrorBoundary>
  )
}
