'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface TorusKnotProps {
  position: [number, number, number]
  scale: number
  color: string
  rotationSpeed: [number, number, number]
}

function TorusKnot({ position, scale, color, rotationSpeed }: TorusKnotProps) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0]
      meshRef.current.rotation.y += rotationSpeed[1]
      meshRef.current.rotation.z += rotationSpeed[2]
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusKnotGeometry args={[0.5, 0.2, 64, 8]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function TorusKnotField() {
  const knots = [
    { position: [-6, 0, -8] as [number, number, number], scale: 1.5, color: '#3b82f6', rotationSpeed: [0.01, 0.02, 0.01] as [number, number, number] },
    { position: [5, 2, -7] as [number, number, number], scale: 1.2, color: '#8b5cf6', rotationSpeed: [0.02, 0.01, 0.02] as [number, number, number] },
    { position: [0, -3, -9] as [number, number, number], scale: 1.8, color: '#06b6d4', rotationSpeed: [0.015, 0.025, 0.015] as [number, number, number] },
  ]

  return (
    <group>
      {knots.map((knot, index) => (
        <TorusKnot key={index} {...knot} />
      ))}
    </group>
  )
}
