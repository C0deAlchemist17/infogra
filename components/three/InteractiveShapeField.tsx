'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'

export interface InteractiveShape {
  id: number
  position: THREE.Vector3 | { x: number; y: number; z: number }
  rotation: THREE.Euler | { x: number; y: number; z: number }
  scale: number
  rotationSpeed: THREE.Vector3 | { x: number; y: number; z: number }
  color: string
  data?: any
}

interface InteractiveShapeFieldProps {
  shapes?: InteractiveShape[]
  onShapeClick?: (shape: InteractiveShape) => void
  onShapeHover?: (shape: InteractiveShape | null) => void
  particleCount?: number
  shapeCount?: number
  colorPalette?: string[]
  cameraRange?: number
}

function generateShapes(count: number, range: number, colorPalette: string[]): InteractiveShape[] {
  const shapes: InteractiveShape[] = []
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * range * 2,
        (Math.random() - 0.5) * range * 2,
        (Math.random() - 0.5) * range * 2
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      scale: 0.1 + Math.random() * 0.3,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)]
    })
  }
  return shapes
}

function toVector3(val: THREE.Vector3 | { x: number; y: number; z: number }): THREE.Vector3 {
  if (val instanceof THREE.Vector3) return val
  return new THREE.Vector3(val.x, val.y, val.z)
}

function toEuler(val: THREE.Euler | { x: number; y: number; z: number }): THREE.Euler {
  if (val instanceof THREE.Euler) return val
  return new THREE.Euler(val.x, val.y, val.z)
}

function Particles({ count = 200 }: { count: number }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

function Shape({ 
  shape, 
  selected, 
  hovered,
  onClick,
  onPointerOver,
  onPointerOut
}: { 
  shape: InteractiveShape
  selected: boolean
  hovered: boolean
  onClick: () => void
  onPointerOver: () => void
  onPointerOut: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { clock } = useThree()

  useFrame(() => {
    if (meshRef.current) {
      const time = clock.getElapsedTime()
      const rotSpeed = toVector3(shape.rotationSpeed)
      const pos = toVector3(shape.position)
      
      meshRef.current.rotation.x += rotSpeed.x
      meshRef.current.rotation.y += rotSpeed.y
      meshRef.current.rotation.z += rotSpeed.z
      
      // Subtle floating motion
      meshRef.current.position.x = pos.x + Math.sin(time * 0.5 + shape.id) * 0.1
      meshRef.current.position.y = pos.y + Math.cos(time * 0.5 + shape.id) * 0.1
      meshRef.current.position.z = pos.z + Math.sin(time * 0.3 + shape.id) * 0.1
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={toVector3(shape.position)}
      rotation={toEuler(shape.rotation)}
      scale={shape.scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={selected ? '#FFFF00' : hovered ? shape.color : '#111111'}
        emissive={selected ? '#FFFF00' : hovered ? shape.color : '#000000'}
        emissiveIntensity={selected ? 0.5 : hovered ? 0.3 : 0}
        flatShading
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function Scene({ 
  shapes, 
  onShapeClick, 
  onShapeHover,
  selectedShape,
  hoveredShape
}: { 
  shapes: InteractiveShape[]
  onShapeClick: (shape: InteractiveShape) => void
  onShapeHover: (shape: InteractiveShape | null) => void
  selectedShape: InteractiveShape | null
  hoveredShape: InteractiveShape | null
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, mouse } = useThree()
  const cameraRange = 3

  useFrame(() => {
    if (groupRef.current) {
      // Rotate group based on mouse position
      groupRef.current.rotation.y -= ((mouse.x * 2) + groupRef.current.rotation.y) * 0.05
      groupRef.current.rotation.x -= ((-mouse.y * 2) + groupRef.current.rotation.x) * 0.05
    }
  })

  // Camera zoom to selected shape
  useEffect(() => {
    if (selectedShape) {
      const pos = toVector3(selectedShape.position)
      const targetPosition = new THREE.Vector3(
        pos.x,
        pos.y,
        pos.z + cameraRange
      )
      
      // Smooth camera transition (using simple lerp instead of GSAP)
      const animateCamera = () => {
        camera.position.lerp(targetPosition, 0.05)
        camera.lookAt(pos)
        if (camera.position.distanceTo(targetPosition) > 0.01) {
          requestAnimationFrame(animateCamera)
        }
      }
      animateCamera()
    } else {
      // Reset camera
      const targetPosition = new THREE.Vector3(0, 0, cameraRange)
      const animateCamera = () => {
        camera.position.lerp(targetPosition, 0.05)
        camera.lookAt(0, 0, 0)
        if (camera.position.distanceTo(targetPosition) > 0.01) {
          requestAnimationFrame(animateCamera)
        }
      }
      animateCamera()
    }
  }, [selectedShape, camera, cameraRange])

  return (
    <group ref={groupRef}>
      <Particles count={200} />
      {shapes.map((shape) => (
        <Shape
          key={shape.id}
          shape={shape}
          selected={selectedShape?.id === shape.id}
          hovered={hoveredShape?.id === shape.id}
          onClick={() => onShapeClick(shape)}
          onPointerOver={() => onShapeHover(shape)}
          onPointerOut={() => onShapeHover(null)}
        />
      ))}
    </group>
  )
}

export default function InteractiveShapeField({
  shapes: customShapes,
  onShapeClick,
  onShapeHover,
  particleCount = 200,
  shapeCount = 30,
  colorPalette = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
  cameraRange = 3
}: InteractiveShapeFieldProps) {
  const [selectedShape, setSelectedShape] = useState<InteractiveShape | null>(null)
  const [hoveredShape, setHoveredShape] = useState<InteractiveShape | null>(null)
  
  const shapes = useMemo(() => {
    if (customShapes) return customShapes
    return generateShapes(shapeCount, 2, colorPalette)
  }, [customShapes, shapeCount, colorPalette])

  const handleShapeClick = (shape: InteractiveShape) => {
    setSelectedShape(selectedShape?.id === shape.id ? null : shape)
    onShapeClick?.(shape)
  }

  const handleShapeHover = (shape: InteractiveShape | null) => {
    setHoveredShape(shape)
    onShapeHover?.(shape)
  }

  return (
    <div className="w-full h-full cursor-crosshair">
      <Canvas
        camera={{ position: [0, 0, cameraRange], fov: 35 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 2.5, 3.5]} />
        
        <ambientLight intensity={0.1} />
        <spotLight 
          position={[5, 5, 2]} 
          intensity={3} 
          castShadow 
          penumbra={0.5}
        />
        <pointLight position={[0, -3, -1]} intensity={1} color="#0FFFFF" />
        
        <Scene
          shapes={shapes}
          onShapeClick={handleShapeClick}
          onShapeHover={handleShapeHover}
          selectedShape={selectedShape}
          hoveredShape={hoveredShape}
        />
      </Canvas>
    </div>
  )
}
