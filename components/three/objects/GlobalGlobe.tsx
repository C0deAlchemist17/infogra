'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

interface GlobalGlobeProps {
  progress?: number
  deviceTier?: string
}

export function GlobalGlobe({ progress = 0, deviceTier = 'high' }: GlobalGlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const connectionsRef = useRef<THREE.Group>(null)

  // Create globe geometry with wireframe
  const globeGeometry = useMemo(() => new THREE.SphereGeometry(2, 64, 64), [])
  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#6366f1'),
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    []
  )

  // Create data points on the globe
  const dataPoints = useMemo(() => {
    const points: [number, number, number][] = []
    const pointCount = deviceTier === 'low' ? 30 : deviceTier === 'medium' ? 50 : 80
    
    // Generate points along latitude/longitude lines
    for (let lat = -80; lat <= 80; lat += deviceTier === 'low' ? 30 : 20) {
      for (let lng = -180; lng <= 180; lng += deviceTier === 'low' ? 45 : 30) {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        const x = -2.05 * Math.sin(phi) * Math.cos(theta)
        const y = 2.05 * Math.cos(phi)
        const z = 2.05 * Math.sin(phi) * Math.sin(theta)
        points.push([x, y, z])
      }
    }
    return points
  }, [deviceTier])

  const pointsGeometry = useMemo(() => {
    const positions = new Float32Array(dataPoints.flat())
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [dataPoints])

  // Create connection lines between points
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    const points: THREE.Vector3[] = []
    
    // Generate random connection points
    const connectionCount = deviceTier === 'low' ? 5 : deviceTier === 'medium' ? 8 : 12
    for (let i = 0; i < connectionCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      points.push(
        new THREE.Vector3(
          2.05 * Math.sin(phi) * Math.cos(theta),
          2.05 * Math.cos(phi),
          2.05 * Math.sin(phi) * Math.sin(theta)
        )
      )
    }

    // Connect some points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (Math.random() > 0.6) {
          lines.push({ start: points[i], end: points[j] })
        }
      }
    }

    return lines
  }, [deviceTier])

  useFrame((state) => {
    if (globeRef.current) {
      // Smooth rotation
      globeRef.current.rotation.y += 0.002
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (connectionsRef.current) {
      connectionsRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      {/* Globe wireframe */}
      <mesh ref={globeRef} geometry={globeGeometry} material={wireframeMaterial} />
      
      {/* Data points */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color="#8b5cf6"
          size={deviceTier === 'low' ? 0.05 : 0.03}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Glow effect */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Connection lines */}
      <group ref={connectionsRef}>
        {connections.map((conn, i) => (
          <Line
            key={i}
            points={[conn.start, conn.end]}
            color="#6366f1"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        ))}
      </group>
    </group>
  )
}
