'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface FloatingShapeProps {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
  rotationSpeed: [number, number, number]
}

function FloatingShape({ position, scale, color, speed, rotationSpeed }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3
      meshRef.current.rotation.x += rotationSpeed[0] * 0.3
      meshRef.current.rotation.y += rotationSpeed[1] * 0.3
      meshRef.current.rotation.z += rotationSpeed[2] * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function FloatingShapes() {
  const shapes: FloatingShapeProps[] = [
    { position: [-4, 2, -5], scale: 0.8, color: '#3b82f6', speed: 0.3, rotationSpeed: [0.003, 0.006, 0.002] },
    { position: [3, -1, -4], scale: 1.2, color: '#8b5cf6', speed: 0.4, rotationSpeed: [0.006, 0.003, 0.005] },
    { position: [-2, -2, -6], scale: 0.6, color: '#06b6d4', speed: 0.25, rotationSpeed: [0.005, 0.008, 0.003] },
    { position: [4, 3, -5], scale: 0.9, color: '#10b981', speed: 0.35, rotationSpeed: [0.003, 0.004, 0.006] },
    { position: [0, 4, -7], scale: 0.5, color: '#f59e0b', speed: 0.45, rotationSpeed: [0.006, 0.003, 0.004] },
    { position: [-3, 1, -4], scale: 1.0, color: '#ec4899', speed: 0.3, rotationSpeed: [0.004, 0.006, 0.003] },
    { position: [2, 2, -8], scale: 0.7, color: '#14b8a6', speed: 0.2, rotationSpeed: [0.002, 0.005, 0.003] },
    { position: [-5, -1, -7], scale: 1.1, color: '#f97316', speed: 0.35, rotationSpeed: [0.005, 0.002, 0.004] },
  ]

  return (
    <group>
      {shapes.map((shape, index) => (
        <FloatingShape key={`shape-${index}`} {...shape} />
      ))}
    </group>
  )
}
