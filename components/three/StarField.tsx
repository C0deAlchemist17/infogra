'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarFieldProps {
  count?: number
}

export function StarField({ count = 1500 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // INFOGRA colors: blue and purple tones
    const colorPalette = [
      new THREE.Color(0x3b82f6), // blue-500
      new THREE.Color(0x8b5cf6), // purple-500
      new THREE.Color(0x06b6d4), // cyan-500
      new THREE.Color(0x6366f1), // indigo-500
    ]
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 50 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [count])
  
  useFrame((state) => {
    if (pointsRef.current) {
      // Slower rotation for better performance
      pointsRef.current.rotation.y += 0.00005
      pointsRef.current.rotation.x += 0.00002
    }
  })
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [positions, colors])
  
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // Reduced opacity for better performance
      sizeAttenuation: true,
    })
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (geometry) geometry.dispose()
      if (material) material.dispose()
    }
  }, [geometry, material])
  
  return <points ref={pointsRef} geometry={geometry} material={material} />
}
