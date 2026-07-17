'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'

interface ConnectorData {
  position: [number, number, number]
  quaternion: THREE.Quaternion
  length: number
  color: string
  sphereStart: [number, number, number]
  sphereEnd: [number, number, number]
}

function DNAHelixScene() {
  const groupRef = useRef<THREE.Group>(null)
  
  const { strand1Geom, strand2Geom, connectorsData } = useMemo(() => {
    const s1: THREE.Vector3[] = []
    const s2: THREE.Vector3[] = []
    const connectors: ConnectorData[] = []
    
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981']
    const upVector = new THREE.Vector3(0, 1, 0)
    
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 4
      const y = (i - 20) * 0.15
      const radius = 0.8
      
      const p1 = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      const p2 = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius)
      
      s1.push(p1)
      s2.push(p2)
      
      if (i % 3 === 0) {
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
        const direction = new THREE.Vector3().subVectors(p2, p1).normalize()
        const length = p1.distanceTo(p2)
        const quat = new THREE.Quaternion().setFromUnitVectors(upVector, direction)
        
        connectors.push({
          position: [mid.x, mid.y, mid.z],
          quaternion: quat,
          length,
          color: colors[(i / 3) % colors.length],
          sphereStart: [p1.x, p1.y, p1.z],
          sphereEnd: [p2.x, p2.y, p2.z],
        })
      }
    }
    
    const curve1 = new THREE.CatmullRomCurve3(s1)
    const curve2 = new THREE.CatmullRomCurve3(s2)
    
    return {
      strand1Geom: new THREE.TubeGeometry(curve1, 100, 0.04, 8, false),
      strand2Geom: new THREE.TubeGeometry(curve2, 100, 0.04, 8, false),
      connectorsData: connectors,
    }
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  return (
    <group ref={groupRef}>
      <mesh geometry={strand1Geom}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh geometry={strand2Geom}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {connectorsData.map((conn, i) => (
        <group key={i} position={conn.position}>
          <mesh quaternion={conn.quaternion}>
            <cylinderGeometry args={[0.02, 0.02, conn.length, 6]} />
            <meshStandardMaterial
              color={conn.color}
              emissive={conn.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
      
      {connectorsData.map((conn, i) => (
        <group key={`spheres-${i}`}>
          <mesh position={conn.sphereStart}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={conn.sphereEnd}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function DNAHelix() {
  return (
    <ThreeErrorBoundary>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#3b82f6" />
          <DNAHelixScene />
        </Suspense>
      </Canvas>
    </ThreeErrorBoundary>
  )
}
