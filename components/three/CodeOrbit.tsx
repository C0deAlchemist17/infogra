'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'

interface OrbitItemProps {
  radius: number
  speed: number
  offset: number
  color: string
  shape: 'box' | 'octahedron' | 'tetrahedron' | 'dodecahedron'
  size: number
}

function OrbitItem({ radius, speed, offset, color, shape, size }: OrbitItemProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset
      meshRef.current.position.x = Math.cos(t) * radius
      meshRef.current.position.z = Math.sin(t) * radius
      meshRef.current.position.y = Math.sin(t * 2) * 0.3
      meshRef.current.rotation.x += 0.02
      meshRef.current.rotation.y += 0.03
    }
  })
  
  const Geometry = useMemo(() => {
    switch (shape) {
      case 'box': return <boxGeometry args={[size, size, size]} />
      case 'octahedron': return <octahedronGeometry args={[size / 2]} />
      case 'tetrahedron': return <tetrahedronGeometry args={[size / 2]} />
      case 'dodecahedron': return <dodecahedronGeometry args={[size / 2]} />
    }
  }, [shape, size])
  
  return (
    <mesh ref={meshRef}>
      {Geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.7}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.6, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

function CodeOrbitScene() {
  const items: OrbitItemProps[] = [
    { radius: 1.2, speed: 0.4, offset: 0, color: '#3b82f6', shape: 'box', size: 0.15 },
    { radius: 1.2, speed: 0.4, offset: Math.PI * 0.5, color: '#8b5cf6', shape: 'octahedron', size: 0.12 },
    { radius: 1.2, speed: 0.4, offset: Math.PI, color: '#06b6d4', shape: 'tetrahedron', size: 0.14 },
    { radius: 1.2, speed: 0.4, offset: Math.PI * 1.5, color: '#ec4899', shape: 'dodecahedron', size: 0.13 },
    { radius: 1.8, speed: 0.3, offset: 0.5, color: '#10b981', shape: 'box', size: 0.1 },
    { radius: 1.8, speed: 0.3, offset: Math.PI + 0.5, color: '#f59e0b', shape: 'octahedron', size: 0.11 },
    { radius: 2.4, speed: 0.2, offset: 1, color: '#ef4444', shape: 'tetrahedron', size: 0.08 },
    { radius: 2.4, speed: 0.2, offset: Math.PI + 1, color: '#14b8a6', shape: 'dodecahedron', size: 0.09 },
  ]
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        <CentralCore />
        {items.map((item, i) => (
          <OrbitItem key={i} {...item} />
        ))}
      </group>
    </Float>
  )
}

export default function CodeOrbit() {
  return (
    <ThreeErrorBoundary>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#3b82f6" />
          <CodeOrbitScene />
        </Suspense>
      </Canvas>
    </ThreeErrorBoundary>
  )
}
