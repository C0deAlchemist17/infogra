'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Location data with lat/lon
const locations = [
  { name: 'Alexandria', country: 'Egypt', lat: 31.2001, lon: 29.9187, isOrigin: true },
  { name: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lon: 39.8262, isOrigin: false },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, isOrigin: false },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, isOrigin: false },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, isOrigin: false },
  { name: 'Philadelphia', country: 'USA', lat: 39.9526, lon: -75.1652, isOrigin: false },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, isOrigin: false },
  { name: 'Muscat', country: 'Oman', lat: 23.5859, lon: 58.3829, isOrigin: false },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, isOrigin: false },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, isOrigin: false },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, isOrigin: false },
]

// Check for reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  
  return prefersReducedMotion
}

// Check for mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// Convert lat/lon to 2D map coordinates (equirectangular projection)
function latLonToVector2(lat: number, lon: number, width: number, height: number) {
  const x = ((lon + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return new THREE.Vector3(x - width / 2, -(y - height / 2), 0)
}

// Create curved path between two points on 2D map
function createCurvePath(start: THREE.Vector3, end: THREE.Vector3) {
  const points = []
  const segments = 50
  const midPoint = start.clone().add(end).multiplyScalar(0.5)
  midPoint.z = 0.5 // Add some height for the curve

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const point = new THREE.Vector3()
      .copy(start)
      .lerp(midPoint, t)
      .lerp(end, t * t)
    points.push(point)
  }
  return points
}

function MapBackground() {
  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[8, 4]} />
      <meshBasicMaterial
        color="#0a0a1a"
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

function GridLines() {
  const lines = useMemo(() => {
    const grid = []
    // Vertical lines (longitude)
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = ((lon + 180) / 360) * 8 - 4
      grid.push(new THREE.Vector3(x, -2, 0))
      grid.push(new THREE.Vector3(x, 2, 0))
    }
    // Horizontal lines (latitude)
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = ((90 - lat) / 180) * 4 - 2
      grid.push(new THREE.Vector3(-4, y, 0))
      grid.push(new THREE.Vector3(4, y, 0))
    }
    return grid
  }, [])

  return (
    <Line
      points={lines}
      color="#1D54B8"
      lineWidth={0.5}
      transparent
      opacity={0.15}
    />
  )
}

function LocationPoint({ location, reducedMotion }: { location: typeof locations[0]; reducedMotion: boolean }) {
  const position = latLonToVector2(location.lat, location.lon, 8, 4)
  const pointRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (pointRef.current && location.isOrigin && !reducedMotion) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      pointRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={position}>
      <mesh ref={pointRef}>
        <circleGeometry args={location.isOrigin ? [0.12, 32] : [0.08, 32]} />
        <meshBasicMaterial
          color={location.isOrigin ? '#f59e0b' : '#6366f1'}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <circleGeometry args={location.isOrigin ? [0.18, 32] : [0.12, 32]} />
        <meshBasicMaterial
          color={location.isOrigin ? '#f59e0b' : '#6366f1'}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  )
}

function ConnectionRoute({ from, to, reducedMotion }: { from: typeof locations[0], to: typeof locations[0]; reducedMotion: boolean }) {
  const startPos = latLonToVector2(from.lat, from.lon, 8, 4)
  const endPos = latLonToVector2(to.lat, to.lon, 8, 4)
  const curvePoints = createCurvePath(startPos, endPos)

  const particleRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (particleRef.current && !reducedMotion) {
      const t = (state.clock.elapsedTime * 0.2) % 1
      const pointIndex = Math.floor(t * (curvePoints.length - 1))
      const nextIndex = Math.min(pointIndex + 1, curvePoints.length - 1)
      const localT = (t * (curvePoints.length - 1)) - pointIndex

      const currentPos = curvePoints[pointIndex]
      const nextPos = curvePoints[nextIndex]
      particleRef.current.position.lerpVectors(currentPos, nextPos, localT)
    }
  })

  return (
    <group>
      {/* Connection line */}
      <Line
        points={curvePoints}
        color="#6366f1"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      {/* Moving particle */}
      {!reducedMotion && (
        <mesh ref={particleRef}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      )}
    </group>
  )
}

function GlobalCustomerNetwork({ reducedMotion, isMobile }: { reducedMotion: boolean; isMobile: boolean }) {
  const origin = locations.find(l => l.isOrigin)!
  const destinations = locations.filter(l => !l.isOrigin)

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, isMobile ? 1 : 1.2]}
      >
        <MapBackground />
        <GridLines />

        {/* Origin point (Alexandria) */}
        <LocationPoint location={origin} reducedMotion={reducedMotion} />

        {/* Destination points */}
        {destinations.map((dest) => (
          <LocationPoint key={dest.name} location={dest} reducedMotion={reducedMotion} />
        ))}

        {/* Connection routes from Alexandria */}
        {destinations.map((dest) => (
          <ConnectionRoute
            key={`${origin.name}-${dest.name}`}
            from={origin}
            to={dest}
            reducedMotion={reducedMotion}
          />
        ))}
      </Canvas>
    </div>
  )
}

export default function GlobalCustomerNetworkMap() {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[500px] relative bg-background-secondary/50 flex items-center justify-center">
        <div className="text-text-secondary">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] relative">
      <GlobalCustomerNetwork reducedMotion={reducedMotion} isMobile={isMobile} />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass border border-white/10 rounded-lg p-4">
        <div className="space-y-2 text-caption">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-white/80">Alexandria / Headquarters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-white/80">Customer Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-indigo-500" />
            <span className="text-white/80">Active Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}
