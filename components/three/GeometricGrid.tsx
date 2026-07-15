'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface GeometricCellProps {
  position: [number, number, number]
  delay: number
}

function GeometricCell({ position, delay }: GeometricCellProps) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1 // Much slower animation
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color="#3b82f6"
        roughness={0.4}
        metalness={0.6}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function GeometricGrid() {
  const cells = []
  const gridSize = 3 // Reduced from 4 for better performance
  const spacing = 1.2
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const position: [number, number, number] = [
          (x - gridSize / 2) * spacing,
          (y - gridSize / 2) * spacing,
          (z - gridSize / 2) * spacing
        ]
        cells.push(
          <GeometricCell 
            key={`${x}-${y}-${z}`} 
            position={position} 
            delay={x + y + z}
          />
        )
      }
    }
  }

  return (
    <group rotation={[0.3, 0.5, 0]}>
      {cells}
    </group>
  )
}
