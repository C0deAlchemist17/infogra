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

  // Map-based globe with actual continent-like distribution
  const globeGeometry = useMemo(() => new THREE.SphereGeometry(50, 64, 64), [])
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#1e3a5f'),
        transparent: true,
        opacity: 0.15,
      }),
    []
  )

  // Map-style wireframe (latitude/longitude grid like a real map)
  const gridLines = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    
    // Latitude lines (horizontal)
    for (let lat = -90; lat <= 90; lat += 15) {
      const phi = (90 - lat) * (Math.PI / 180)
      const radius = 50 * Math.sin(phi)
      const y = 50 * Math.cos(phi)
      
      for (let lng = -180; lng < 180; lng += 10) {
        const theta1 = (lng + 180) * (Math.PI / 180)
        const theta2 = (lng + 190) * (Math.PI / 180)
        
        lines.push({
          start: new THREE.Vector3(
            radius * Math.cos(theta1),
            y,
            radius * Math.sin(theta1)
          ),
          end: new THREE.Vector3(
            radius * Math.cos(theta2),
            y,
            radius * Math.sin(theta2)
          )
        })
      }
    }
    
    // Longitude lines (vertical)
    for (let lng = -180; lng <= 180; lng += 30) {
      const theta = (lng + 180) * (Math.PI / 180)
      
      for (let lat = -90; lat < 90; lat += 10) {
        const phi1 = (90 - lat) * (Math.PI / 180)
        const phi2 = (90 - (lat + 10)) * (Math.PI / 180)
        
        lines.push({
          start: new THREE.Vector3(
            50 * Math.sin(phi1) * Math.cos(theta),
            50 * Math.cos(phi1),
            50 * Math.sin(phi1) * Math.sin(theta)
          ),
          end: new THREE.Vector3(
            50 * Math.sin(phi2) * Math.cos(theta),
            50 * Math.cos(phi2),
            50 * Math.sin(phi2) * Math.sin(theta)
          )
        })
      }
    }
    
    return lines
  }, [])

  // City/major hub points positioned at real world coordinates
  const cityPoints = useMemo(() => {
    const points: [number, number, number][] = []
    
    // Major cities with approximate lat/lng converted to 3D coordinates
    const cities = [
      { lat: 40.7128, lng: -74.0060 }, // New York
      { lat: 51.5074, lng: -0.1278 },  // London
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
      { lat: 48.8566, lng: 2.3522 },   // Paris
      { lat: 55.7558, lng: 37.6173 },  // Moscow
      { lat: 39.9042, lng: 116.4074 }, // Beijing
      { lat: -33.8688, lng: 151.2093 }, // Sydney
      { lat: 19.4326, lng: -99.1332 }, // Mexico City
      { lat: -23.5505, lng: -46.6333 }, // São Paulo
      { lat: 28.6139, lng: 77.2090 },  // New Delhi
      { lat: 25.2048, lng: 55.2708 },  // Dubai
      { lat: 1.3521, lng: 103.8198 },  // Singapore
      { lat: 37.5665, lng: 126.9780 }, // Seoul
      { lat: 52.5200, lng: 13.4050 },  // Berlin
      { lat: 43.6532, lng: -79.3832 }, // Toronto
    ]
    
    cities.forEach(city => {
      const phi = (90 - city.lat) * (Math.PI / 180)
      const theta = (city.lng + 180) * (Math.PI / 180)
      const x = 51 * Math.sin(phi) * Math.cos(theta)
      const y = 51 * Math.cos(phi)
      const z = 51 * Math.sin(phi) * Math.sin(theta)
      points.push([x, y, z])
    })
    
    return points
  }, [])

  const pointsGeometry = useMemo(() => {
    const positions = new Float32Array(cityPoints.flat())
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [cityPoints])

  // Network connections between major hubs
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    const connectionCount = deviceTier === 'low' ? 8 : deviceTier === 'medium' ? 12 : 18
    
    // Create connections between cities
    for (let i = 0; i < Math.min(connectionCount, cityPoints.length); i++) {
      for (let j = i + 1; j < cityPoints.length; j++) {
        // Connect some cities randomly but preferentially
        if (Math.random() > 0.7) {
          lines.push({
            start: new THREE.Vector3(...cityPoints[i]),
            end: new THREE.Vector3(...cityPoints[j])
          })
        }
      }
    }
    
    return lines
  }, [cityPoints, deviceTier])

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0003
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003
    }
    if (connectionsRef.current) {
      connectionsRef.current.rotation.y += 0.0003
    }
  })

  return (
    <group>
      {/* Globe base - Map-style */}
      <mesh ref={globeRef} geometry={globeGeometry} material={globeMaterial} />
      
      {/* Map grid lines (latitude/longitude) */}
      <group ref={connectionsRef}>
        {gridLines.map((line, i) => (
          <Line
            key={i}
            points={[line.start, line.end]}
            color="#3b82f6"
            lineWidth={0.5}
            transparent
            opacity={0.15}
          />
        ))}
      </group>
      
      {/* City/Hub points */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color="#60a5fa"
          size={0.8}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Network connections between cities */}
      <group ref={connectionsRef}>
        {connections.map((conn, i) => (
          <Line
            key={`conn-${i}`}
            points={[conn.start, conn.end]}
            color="#8b5cf6"
            lineWidth={1.5}
            transparent
            opacity={0.3}
          />
        ))}
      </group>

      {/* Outer glow */}
      <Sphere args={[52, 32, 32]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}
