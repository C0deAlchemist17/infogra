'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ServicesSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function ServicesScene({ progress, scrollProgress, isActive, deviceTier }: ServicesSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create abstract technology objects representing different services
  const objects = useMemo(() => {
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.TorusGeometry(0.5, 0.2, 16, 32),
      new THREE.OctahedronGeometry(0.7),
      new THREE.IcosahedronGeometry(0.6),
      new THREE.ConeGeometry(0.5, 1, 16),
    ]
    
    return geometries.map((geometry, i) => ({
      geometry,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 5
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.5,
      color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i],
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.01
          child.rotation.y += 0.015
          // Subtle floating
          child.position.y = objects[i].position[1] + Math.sin(state.clock.elapsedTime + i) * 0.2
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <mesh key={i} position={obj.position} scale={obj.scale}>
          <primitive object={obj.geometry} />
          <meshStandardMaterial
            color={obj.color}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}
