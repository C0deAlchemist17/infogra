'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)

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
    // Generate points along latitude/longitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng <= 180; lng += 30) {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        const x = -2.05 * Math.sin(phi) * Math.cos(theta)
        const y = 2.05 * Math.cos(phi)
        const z = 2.05 * Math.sin(phi) * Math.sin(theta)
        points.push([x, y, z])
      }
    }
    return points
  }, [])

  const pointsGeometry = useMemo(() => {
    const positions = new Float32Array(dataPoints.flat())
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [dataPoints])

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
  })

  return (
    <group>
      {/* Globe wireframe */}
      <mesh ref={globeRef} geometry={globeGeometry} material={wireframeMaterial} />
      
      {/* Data points */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color="#8b5cf6"
          size={0.03}
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
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particlesGeometry = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005
      particlesRef.current.rotation.x += 0.0002
    }
  })

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        color="#a78bfa"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null)

  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    const points: THREE.Vector3[] = []
    
    // Generate random connection points
    for (let i = 0; i < 8; i++) {
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
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={linesRef}>
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
  )
}

export default function InteractiveGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Globe />
        <FloatingParticles />
        <ConnectionLines />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  )
}
