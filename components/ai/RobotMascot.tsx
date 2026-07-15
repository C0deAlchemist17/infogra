'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Global mouse position state shared across all Three.js instances
let globalMouseX = 0
let globalMouseY = 0
let globalMouseInitialized = false

function initGlobalMouseTracking() {
  if (typeof window === 'undefined' || globalMouseInitialized) return
  try {
    globalMouseInitialized = true
    window.addEventListener('mousemove', (e) => {
      // Convert screen coords to normalized -1 to 1 range
      globalMouseX = (e.clientX / window.innerWidth) * 2 - 1
      globalMouseY = -(e.clientY / window.innerHeight) * 2 + 1
    })
  } catch (error) {
    console.error('Failed to initialize mouse tracking:', error)
  }
}

interface RobotProps {
  isHovered: boolean
  isActive: boolean
}

function RobotBody({ isHovered, isActive }: RobotProps) {
  const bodyRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftPupilRef = useRef<THREE.Mesh>(null)
  const rightPupilRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const waveIntensityRef = useRef(0)

  const { mouse } = useThree()

  // Initialize global mouse tracking
  useEffect(() => {
    initGlobalMouseTracking()
  }, [])

  const [blinkState, setBlinkState] = useState({ isBlinking: false })

  useFrame((state) => {
    if (!bodyRef.current) return
    const t = state.clock.elapsedTime

    // Breathing
    bodyRef.current.scale.y = 1 + Math.sin(t * 2) * 0.02
    bodyRef.current.scale.x = 1 + Math.sin(t * 2 + Math.PI) * 0.01

    // Floating motion
    bodyRef.current.position.y = Math.sin(t * 1.5) * 0.05

    // Head slight rotation based on global mouse
    if (bodyRef.current.children[0]) {
      const head = bodyRef.current.children[0] as THREE.Group
      const headTargetX = globalMouseX * 0.7 + mouse.x * 0.3
      const headTargetY = globalMouseY * 0.7 + (-mouse.y) * 0.3
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, headTargetX * 0.3, 0.05)
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, headTargetY * 0.15, 0.05)
    }

    // Eye tracking - use global mouse position for page-wide tracking
    if (leftPupilRef.current && rightPupilRef.current) {
      const pupilOffset = 0.04
      // Blend global mouse with Three.js local mouse for smoother tracking
      const targetX = globalMouseX * 0.7 + mouse.x * 0.3
      const targetY = globalMouseY * 0.7 + (-mouse.y) * 0.3
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(leftPupilRef.current.position.x, targetX * pupilOffset, 0.08)
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(leftPupilRef.current.position.y, targetY * pupilOffset, 0.08)
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(rightPupilRef.current.position.x, targetX * pupilOffset, 0.08)
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(rightPupilRef.current.position.y, targetY * pupilOffset, 0.08)
    }

    // Eye brightness
    if (leftEyeRef.current && rightEyeRef.current) {
      const material = leftEyeRef.current.material as THREE.MeshStandardMaterial
      const targetEmissive = isHovered ? 0.8 : 0.3
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetEmissive, 0.1)
      const rightMaterial = rightEyeRef.current.material as THREE.MeshStandardMaterial
      rightMaterial.emissiveIntensity = THREE.MathUtils.lerp(rightMaterial.emissiveIntensity, targetEmissive, 0.1)
    }

    // Mouth smile
    if (mouthRef.current) {
      const scale = isHovered ? 1.2 : 1
      mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, scale, 0.1)
    }

    // Antenna glow
    if (antennaRef.current) {
      const material = antennaRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3
    }

    // Smooth wave intensity fade-in
    const targetIntensity = isHovered ? 1 : 0
    waveIntensityRef.current = THREE.MathUtils.lerp(waveIntensityRef.current, targetIntensity, 0.08)

    // Wave animation with smooth fade-in
    if (rightArmRef.current) {
      const waveAngle = Math.sin(t * 3) * 0.5 * waveIntensityRef.current
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.8 * waveIntensityRef.current + waveAngle, 0.1)
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.3 * waveIntensityRef.current, 0.1)
    }

    // Left arm subtle movement
    if (leftArmRef.current) {
      const targetZ = 0.5 * waveIntensityRef.current - 0.3 * (1 - waveIntensityRef.current)
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetZ, 0.1)
    }
  })

  // Blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlinkState({ isBlinking: true })
        setTimeout(() => setBlinkState({ isBlinking: false }), 150)
      }
    }, 3000)
    return () => clearInterval(blinkInterval)
  }, [])

  const eyeScale: [number, number, number] = blinkState.isBlinking ? [1, 0.1, 1] : [1, 1, 1]

  return (
    <group ref={bodyRef}>
      {/* Head */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.7} envMapIntensity={0.5} />
        </mesh>

        {/* Left eye */}
        <mesh ref={leftEyeRef} position={[-0.15, 0.05, 0.38]} scale={eyeScale}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} roughness={0.1} />
        </mesh>
        <mesh ref={leftPupilRef} position={[-0.15, 0.05, 0.44]} scale={eyeScale}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>

        {/* Right eye */}
        <mesh ref={rightEyeRef} position={[0.15, 0.05, 0.38]} scale={eyeScale}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} roughness={0.1} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0.15, 0.05, 0.44]} scale={eyeScale}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.12, 0.4]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color={isHovered ? '#22c55e' : '#8b5cf6'}
            emissive={isHovered ? '#22c55e' : '#8b5cf6'}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* Antenna */}
        <mesh ref={antennaRef} position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <capsuleGeometry args={[0.25, 0.3, 16, 32]} />
        <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Chest light */}
      <mesh position={[0, 0.25, 0.26]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={isActive ? 1 : 0.4} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.35, 0.3, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 8, 16]} />
          <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Right arm (waving) */}
      <group ref={rightArmRef} position={[0.35, 0.3, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 8, 16]} />
          <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

interface RobotMascotProps {
  isHovered: boolean
  isActive: boolean
  size?: number
}

export default function RobotMascot({ isHovered, isActive, size = 100 }: RobotMascotProps) {
  return (
    <div style={{ width: size, height: size }} className="cursor-pointer overflow-visible">
      <Canvas
        camera={{ position: [0, 0.4, 2.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 5]} intensity={1.2} />
        <pointLight position={[-2, 1.5, 2]} intensity={isHovered ? 2 : 0.8} color="#8b5cf6" />
        <pointLight position={[2, -1, 3]} intensity={0.4} color="#3b82f6" />

        <group position={[0, -0.3, 0]}>
          <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
            <RobotBody isHovered={isHovered} isActive={isActive} />
          </Float>
        </group>

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
