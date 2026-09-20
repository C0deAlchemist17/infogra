'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { Pane } from 'tweakpane'

interface MetaballShaderBackgroundProps {
  className?: string
}

const MetaballShaderBackground = ({ className = '' }: MetaballShaderBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)
  
  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // Animation state
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 })
  const targetMousePositionRef = useRef({ x: 0.5, y: 0.5 })
  const cursorSphere3DRef = useRef(new THREE.Vector3(0, 0, 0))
  const activeMergesRef = useRef(0)
  const fpsRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameCountRef = useRef(0)
  
  // Settings
  const settingsRef = useRef({
    sphereCount: 6,
    ambientIntensity: 0.12,
    diffuseIntensity: 1.2,
    specularIntensity: 2.5,
    specularPower: 3,
    fresnelPower: 0.8,
    backgroundColor: new THREE.Color(0x0a0a15),
    sphereColor: new THREE.Color(0x050510),
    lightColor: new THREE.Color(0x8b5cf6),
    lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
    smoothness: 0.8,
    contrast: 1.6,
    fogDensity: 0.06,
    cursorGlowIntensity: 1.2,
    cursorGlowRadius: 2.2,
    cursorGlowColor: new THREE.Color(0x6366f1),
    fixedTopLeftRadius: 0.8,
    fixedBottomRightRadius: 0.9,
    smallTopLeftRadius: 0.3,
    smallBottomRightRadius: 0.35,
    cursorRadiusMin: 0.08,
    cursorRadiusMax: 0.15,
    animationSpeed: 0.6,
    movementScale: 1.2,
    mouseSmoothness: 0.1,
    mergeDistance: 1.5,
    mouseProximityEffect: true,
    minMovementScale: 0.3,
    maxMovementScale: 1.0
  })
  
  const [isClient, setIsClient] = useState(false)
  
  // Device detection
  const isMobile = useRef(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  const isSafari = useRef(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  const isLowPowerDevice = useRef(isMobile.current || (navigator.hardwareConcurrency || 4) <= 4)
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile.current ? 1.5 : 2)
  
  // Presets adapted for INFOGRA branding
  const presets = {
    holographic: {
      sphereCount: isMobile.current ? 4 : 6,
      ambientIntensity: 0.12,
      diffuseIntensity: 1.2,
      specularIntensity: 2.5,
      specularPower: 3,
      fresnelPower: 0.8,
      backgroundColor: new THREE.Color(0x0a0a15),
      sphereColor: new THREE.Color(0x050510),
      lightColor: new THREE.Color(0x8b5cf6),
      lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
      smoothness: 0.8,
      contrast: 1.6,
      fogDensity: 0.06,
      cursorGlowIntensity: 1.2,
      cursorGlowRadius: 2.2,
      cursorGlowColor: new THREE.Color(0x6366f1)
    },
    cosmic: {
      sphereCount: isMobile.current ? 5 : 8,
      ambientIntensity: 0.03,
      diffuseIntensity: 0.8,
      specularIntensity: 1.6,
      specularPower: 6,
      fresnelPower: 1.4,
      backgroundColor: new THREE.Color(0x000011),
      sphereColor: new THREE.Color(0x000022),
      lightColor: new THREE.Color(0x3b82f6),
      lightPosition: new THREE.Vector3(0.5, 1, 0.5),
      smoothness: 0.4,
      contrast: 2.0,
      fogDensity: 0.15,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.5,
      cursorGlowColor: new THREE.Color(0x2563eb)
    },
    minimal: {
      sphereCount: isMobile.current ? 2 : 3,
      ambientIntensity: 0.0,
      diffuseIntensity: 0.25,
      specularIntensity: 1.3,
      specularPower: 11,
      fresnelPower: 1.7,
      backgroundColor: new THREE.Color(0x0a0a0a),
      sphereColor: new THREE.Color(0x000000),
      lightColor: new THREE.Color(0xffffff),
      lightPosition: new THREE.Vector3(1, 0.5, 0.8),
      smoothness: 0.25,
      contrast: 2.0,
      fogDensity: 0.1,
      cursorGlowIntensity: 0.3,
      cursorGlowRadius: 1.0,
      cursorGlowColor: new THREE.Color(0xffffff)
    },
    vibrant: {
      sphereCount: isMobile.current ? 6 : 10,
      ambientIntensity: 0.05,
      diffuseIntensity: 0.9,
      specularIntensity: 1.5,
      specularPower: 5,
      fresnelPower: 1.3,
      backgroundColor: new THREE.Color(0x0a0505),
      sphereColor: new THREE.Color(0x110000),
      lightColor: new THREE.Color(0xf59e0b),
      lightPosition: new THREE.Vector3(0.8, 1.2, 0.6),
      smoothness: 0.5,
      contrast: 2.0,
      fogDensity: 0.08,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.3,
      cursorGlowColor: new THREE.Color(0xf59e0b)
    },
    neon: {
      sphereCount: isMobile.current ? 4 : 7,
      ambientIntensity: 0.04,
      diffuseIntensity: 1.0,
      specularIntensity: 2.0,
      specularPower: 4,
      fresnelPower: 1.0,
      backgroundColor: new THREE.Color(0x000505),
      sphereColor: new THREE.Color(0x000808),
      lightColor: new THREE.Color(0x06b6d4),
      lightPosition: new THREE.Vector3(0.7, 1.3, 0.8),
      smoothness: 0.7,
      contrast: 2.0,
      fogDensity: 0.08,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.4,
      cursorGlowColor: new THREE.Color(0x06b6d4)
    },
    sunset: {
      sphereCount: isMobile.current ? 3 : 5,
      ambientIntensity: 0.04,
      diffuseIntensity: 0.7,
      specularIntensity: 1.4,
      specularPower: 7,
      fresnelPower: 1.5,
      backgroundColor: new THREE.Color(0x150505),
      sphereColor: new THREE.Color(0x100000),
      lightColor: new THREE.Color(0xf97316),
      lightPosition: new THREE.Vector3(1.2, 0.4, 0.6),
      smoothness: 0.35,
      contrast: 2.0,
      fogDensity: 0.1,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.4,
      cursorGlowColor: new THREE.Color(0xf97316)
    },
    midnight: {
      sphereCount: isMobile.current ? 3 : 4,
      ambientIntensity: 0.01,
      diffuseIntensity: 0.4,
      specularIntensity: 1.6,
      specularPower: 9,
      fresnelPower: 1.8,
      backgroundColor: new THREE.Color(0x000010),
      sphereColor: new THREE.Color(0x000015),
      lightColor: new THREE.Color(0x6366f1),
      lightPosition: new THREE.Vector3(0.9, 0.8, 1.0),
      smoothness: 0.28,
      contrast: 2.0,
      fogDensity: 0.14,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.6,
      cursorGlowColor: new THREE.Color(0x6366f1)
    },
    infogra: {
      sphereCount: isMobile.current ? 4 : 6,
      ambientIntensity: 0.08,
      diffuseIntensity: 0.85,
      specularIntensity: 1.7,
      specularPower: 6,
      fresnelPower: 1.1,
      backgroundColor: new THREE.Color(0x0d0d1a),
      sphereColor: new THREE.Color(0x050510),
      lightColor: new THREE.Color(0x8b5cf6),
      lightPosition: new THREE.Vector3(0.7, 1.1, 0.8),
      smoothness: 0.55,
      contrast: 1.8,
      fogDensity: 0.09,
      cursorGlowIntensity: 0.8,
      cursorGlowRadius: 1.7,
      cursorGlowColor: new THREE.Color(0x6366f1)
    }
  }
  
  const screenToWorldJS = useCallback((normalizedX: number, normalizedY: number) => {
    const uv_x = normalizedX * 2.0 - 1.0
    const uv_y = normalizedY * 2.0 - 1.0
    const aspect = window.innerWidth / window.innerHeight
    return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0)
  }, [])
  
  const onPointerMove = useCallback((event: MouseEvent | TouchEvent) => {
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY
    
    targetMousePositionRef.current.x = clientX / window.innerWidth
    targetMousePositionRef.current.y = 1.0 - clientY / window.innerHeight
    
    const normalizedX = targetMousePositionRef.current.x
    const normalizedY = targetMousePositionRef.current.y
    const worldPos = screenToWorldJS(normalizedX, normalizedY)
    cursorSphere3DRef.current.copy(worldPos)
    
    let closestDistance = 1000.0
    activeMergesRef.current = 0
    
    const fixedPositions = [
      screenToWorldJS(0.08, 0.92),
      screenToWorldJS(0.25, 0.72),
      screenToWorldJS(0.92, 0.08),
      screenToWorldJS(0.72, 0.25)
    ]
    
    fixedPositions.forEach((pos) => {
      const dist = cursorSphere3DRef.current.distanceTo(pos)
      closestDistance = Math.min(closestDistance, dist)
      if (dist < settingsRef.current.mergeDistance) activeMergesRef.current++
    })
    
    const proximityFactor = Math.max(0, 1.0 - closestDistance / settingsRef.current.mergeDistance)
    const smoothFactor = proximityFactor * proximityFactor * (3.0 - 2.0 * proximityFactor)
    const dynamicRadius = settingsRef.current.cursorRadiusMin + (settingsRef.current.cursorRadiusMax - settingsRef.current.cursorRadiusMin) * smoothFactor
    
    if (materialRef.current) {
      materialRef.current.uniforms.uCursorSphere.value.copy(cursorSphere3DRef.current)
      materialRef.current.uniforms.uCursorRadius.value = dynamicRadius
    }
  }, [screenToWorldJS])
  
  const init = useCallback(() => {
    if (!containerRef.current || mountedRef.current) return
    
    mountedRef.current = true
    
    const container = containerRef.current
    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    cameraRef.current = camera
    
    const clock = new THREE.Clock()
    clockRef.current = clock
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const pixelRatio = Math.min(devicePixelRatio, isMobile.current ? 1.5 : 2)
    
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile.current && !isLowPowerDevice.current,
      alpha: true,
      powerPreference: isMobile.current ? 'default' : 'high-performance',
      preserveDrawingBuffer: false,
      premultipliedAlpha: false
    })
    
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(viewportWidth, viewportHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer
    
    const canvas = renderer.domElement
    canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 0 !important;
      display: block !important;
    `
    container.appendChild(canvas)
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
        uActualResolution: {
          value: new THREE.Vector2(viewportWidth * pixelRatio, viewportHeight * pixelRatio)
        },
        uPixelRatio: { value: pixelRatio },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
        uCursorRadius: { value: settingsRef.current.cursorRadiusMin },
        uSphereCount: { value: settingsRef.current.sphereCount },
        uFixedTopLeftRadius: { value: settingsRef.current.fixedTopLeftRadius },
        uFixedBottomRightRadius: { value: settingsRef.current.fixedBottomRightRadius },
        uSmallTopLeftRadius: { value: settingsRef.current.smallTopLeftRadius },
        uSmallBottomRightRadius: { value: settingsRef.current.smallBottomRightRadius },
        uMergeDistance: { value: settingsRef.current.mergeDistance },
        uSmoothness: { value: settingsRef.current.smoothness },
        uAmbientIntensity: { value: settingsRef.current.ambientIntensity },
        uDiffuseIntensity: { value: settingsRef.current.diffuseIntensity },
        uSpecularIntensity: { value: settingsRef.current.specularIntensity },
        uSpecularPower: { value: settingsRef.current.specularPower },
        uFresnelPower: { value: settingsRef.current.fresnelPower },
        uBackgroundColor: { value: settingsRef.current.backgroundColor },
        uSphereColor: { value: settingsRef.current.sphereColor },
        uLightColor: { value: settingsRef.current.lightColor },
        uLightPosition: { value: settingsRef.current.lightPosition },
        uContrast: { value: settingsRef.current.contrast },
        uFogDensity: { value: settingsRef.current.fogDensity },
        uAnimationSpeed: { value: settingsRef.current.animationSpeed },
        uMovementScale: { value: settingsRef.current.movementScale },
        uMouseProximityEffect: { value: settingsRef.current.mouseProximityEffect },
        uMinMovementScale: { value: settingsRef.current.minMovementScale },
        uMaxMovementScale: { value: settingsRef.current.maxMovementScale },
        uCursorGlowIntensity: { value: settingsRef.current.cursorGlowIntensity },
        uCursorGlowRadius: { value: settingsRef.current.cursorGlowRadius },
        uCursorGlowColor: { value: settingsRef.current.cursorGlowColor },
        uIsSafari: { value: isSafari.current ? 1.0 : 0.0 },
        uIsMobile: { value: isMobile.current ? 1.0 : 0.0 },
        uIsLowPower: { value: isLowPowerDevice.current ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        ${isMobile.current || isSafari.current || isLowPowerDevice.current ? 'precision mediump float;' : 'precision highp float;'}
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uActualResolution;
        uniform float uPixelRatio;
        uniform vec2 uMousePosition;
        uniform vec3 uCursorSphere;
        uniform float uCursorRadius;
        uniform int uSphereCount;
        uniform float uFixedTopLeftRadius;
        uniform float uFixedBottomRightRadius;
        uniform float uSmallTopLeftRadius;
        uniform float uSmallBottomRightRadius;
        uniform float uMergeDistance;
        uniform float uSmoothness;
        uniform float uAmbientIntensity;
        uniform float uDiffuseIntensity;
        uniform float uSpecularIntensity;
        uniform float uSpecularPower;
        uniform float uFresnelPower;
        uniform vec3 uBackgroundColor;
        uniform vec3 uSphereColor;
        uniform vec3 uLightColor;
        uniform vec3 uLightPosition;
        uniform float uContrast;
        uniform float uFogDensity;
        uniform float uAnimationSpeed;
        uniform float uMovementScale;
        uniform bool uMouseProximityEffect;
        uniform float uMinMovementScale;
        uniform float uMaxMovementScale;
        uniform float uCursorGlowIntensity;
        uniform float uCursorGlowRadius;
        uniform vec3 uCursorGlowColor;
        uniform float uIsSafari;
        uniform float uIsMobile;
        uniform float uIsLowPower;
        
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float EPSILON = 0.001;
        const float MAX_DIST = 100.0;
        
        float smin(float a, float b, float k) {
          float h = max(k - abs(a - b), 0.0) / k;
          return min(a, b) - h * h * k * 0.25;
        }
        
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        vec3 screenToWorld(vec2 normalizedPos) {
          vec2 uv = normalizedPos * 2.0 - 1.0;
          uv.x *= uResolution.x / uResolution.y;
          return vec3(uv * 2.0, 0.0);
        }
        
        float getDistanceToCenter(vec2 pos) {
          float dist = length(pos - vec2(0.5, 0.5)) * 2.0;
          return smoothstep(0.0, 1.0, dist);
        }
        
        float sceneSDF(vec3 pos) {
          float result = MAX_DIST;
          
          vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
          float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
          
          vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
          float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
          
          vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
          float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
          
          vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
          float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
          
          float t = uTime * uAnimationSpeed;
          
          float dynamicMovementScale = uMovementScale;
          if (uMouseProximityEffect) {
            float distToCenter = getDistanceToCenter(uMousePosition);
            float mixFactor = smoothstep(0.0, 1.0, distToCenter);
            dynamicMovementScale = mix(uMinMovementScale, uMaxMovementScale, mixFactor);
          }
          
          int maxIter = uIsMobile > 0.5 ? 4 : (uIsLowPower > 0.5 ? 6 : min(uSphereCount, 10));
          for (int i = 0; i < 10; i++) {
            if (i >= uSphereCount || i >= maxIter) break;
            
            float fi = float(i);
            float speed = 0.4 + fi * 0.12;
            float radius = 0.12 + mod(fi, 3.0) * 0.06;
            float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * dynamicMovementScale;
            float phaseOffset = fi * PI * 0.35;
            
            float distToCursor = length(vec3(0.0) - uCursorSphere);
            float proximityScale = 1.0 + (1.0 - smoothstep(0.0, 1.0, distToCursor)) * 0.5;
            orbitRadius *= proximityScale;
            
            vec3 offset;
            if (i == 0) {
              offset = vec3(
                sin(t * speed) * orbitRadius * 0.7,
                sin(t * 0.5) * orbitRadius,
                cos(t * speed * 0.7) * orbitRadius * 0.5
              );
            } else if (i == 1) {
              offset = vec3(
                sin(t * speed + PI) * orbitRadius * 0.5,
                -sin(t * 0.5) * orbitRadius,
                cos(t * speed * 0.7 + PI) * orbitRadius * 0.5
              );
            } else {
              offset = vec3(
                sin(t * speed + phaseOffset) * orbitRadius * 0.8,
                cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
                sin(t * speed * 0.5 + phaseOffset) * 0.3
              );
            }
            
            vec3 toCursor = uCursorSphere - offset;
            float cursorDist = length(toCursor);
            if (cursorDist < uMergeDistance && cursorDist > 0.0) {
              float attraction = (1.0 - cursorDist / uMergeDistance) * 0.3;
              offset += normalize(toCursor) * attraction;
            }
            
            float movingSphere = sdSphere(pos - offset, radius);
            
            float blend = 0.05;
            if (cursorDist < uMergeDistance) {
              float influence = 1.0 - (cursorDist / uMergeDistance);
              blend = mix(0.05, uSmoothness, influence * influence * influence);
            }
            
            result = smin(result, movingSphere, blend);
          }
          
          float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
          
          float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
          float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
          
          result = smin(result, topLeftGroup, 0.3);
          result = smin(result, bottomRightGroup, 0.3);
          result = smin(result, cursorBall, uSmoothness);
          
          return result;
        }
        
        vec3 calcNormal(vec3 p) {
          float eps = uIsLowPower > 0.5 ? 0.002 : 0.001;
          return normalize(vec3(
            sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
            sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
            sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
          ));
        }
        
        float ambientOcclusion(vec3 p, vec3 n) {
          if (uIsLowPower > 0.5) {
            float h1 = sceneSDF(p + n * 0.03);
            float h2 = sceneSDF(p + n * 0.06);
            float occ = (0.03 - h1) + (0.06 - h2) * 0.5;
            return clamp(1.0 - occ * 2.0, 0.0, 1.0);
          } else {
            float occ = 0.0;
            float weight = 1.0;
            for (int i = 0; i < 6; i++) {
              float dist = 0.01 + 0.015 * float(i * i);
              float h = sceneSDF(p + n * dist);
              occ += (dist - h) * weight;
              weight *= 0.85;
            }
            return clamp(1.0 - occ, 0.0, 1.0);
          }
        }
        
        float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
          if (uIsLowPower > 0.5) {
            float result = 1.0;
            float t = mint;
            for (int i = 0; i < 3; i++) {
              t += 0.3;
              if (t >= maxt) break;
              float h = sceneSDF(ro + rd * t);
              if (h < EPSILON) return 0.0;
              result = min(result, k * h / t);
            }
            return result;
          } else {
            float result = 1.0;
            float t = mint;
            for (int i = 0; i < 20; i++) {
              if (t >= maxt) break;
              float h = sceneSDF(ro + rd * t);
              if (h < EPSILON) return 0.0;
              result = min(result, k * h / t);
              t += h;
            }
            return result;
          }
        }
        
        float rayMarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          int maxSteps = uIsMobile > 0.5 ? 16 : (uIsSafari > 0.5 ? 16 : 48);
          
          for (int i = 0; i < 48; i++) {
            if (i >= maxSteps) break;
            
            vec3 p = ro + rd * t;
            float d = sceneSDF(p);
            
            if (d < EPSILON) {
              return t;
            }
            
            if (t > 5.0) {
              break;
            }
            
            t += d * (uIsLowPower > 0.5 ? 1.2 : 0.9);
          }
          
          return -1.0;
        }
        
        vec3 lighting(vec3 p, vec3 rd, float t) {
          if (t < 0.0) {
            return vec3(0.0);
          }
          
          vec3 normal = calcNormal(p);
          vec3 viewDir = -rd;
          
          vec3 baseColor = uSphereColor;
          
          float ao = ambientOcclusion(p, normal);
          
          vec3 ambient = uLightColor * uAmbientIntensity * ao;
          
          vec3 lightDir = normalize(uLightPosition);
          float diff = max(dot(normal, lightDir), 0.0);
          
          float shadow = softShadow(p, lightDir, 0.01, 10.0, 20.0);
          
          vec3 diffuse = uLightColor * diff * uDiffuseIntensity * shadow;
          
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
          
          vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
          
          vec3 fresnelRim = uLightColor * fresnel * 0.4;
          
          float distToCursor = length(p - uCursorSphere);
          if (distToCursor < uCursorRadius + 0.4) {
            float highlight = 1.0 - smoothstep(0.0, uCursorRadius + 0.4, distToCursor);
            specular += uLightColor * highlight * 0.2;
            
            float glow = exp(-distToCursor * 3.0) * 0.15;
            ambient += uLightColor * glow * 0.5;
          }
          
          vec3 color = (baseColor + ambient + diffuse + specular + fresnelRim) * ao;
          
          color = pow(color, vec3(uContrast * 0.9));
          color = color / (color + vec3(0.8));
          
          return color;
        }
        
        float calculateCursorGlow(vec3 worldPos) {
          float dist = length(worldPos.xy - uCursorSphere.xy);
          float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
          glow = pow(glow, 2.0);
          return glow * uCursorGlowIntensity;
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
          uv.x *= uResolution.x / uResolution.y;
          
          vec3 ro = vec3(uv * 2.0, -1.0);
          vec3 rd = vec3(0.0, 0.0, 1.0);
          
          float t = rayMarch(ro, rd);
          
          vec3 p = ro + rd * t;
          
          vec3 color = lighting(p, rd, t);
          
          float cursorGlow = calculateCursorGlow(ro);
          vec3 glowContribution = uCursorGlowColor * cursorGlow;
          
          if (t > 0.0) {
            float fogAmount = 1.0 - exp(-t * uFogDensity);
            color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
            
            color += glowContribution * 0.3;
            
            gl_FragColor = vec4(color, 1.0);
          } else {
            if (cursorGlow > 0.01) {
              gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
            } else {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
          }
        }
      `,
      transparent: true
    })
    materialRef.current = material
    
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    meshRef.current = mesh
    scene.add(mesh)
    
    // Event listeners
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault()
      onPointerMove(e)
    }, { passive: false })
    window.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault()
      onPointerMove(e)
    }, { passive: false })
    window.addEventListener('touchend', (e: TouchEvent) => {
      e.preventDefault()
    }, { passive: false })
    window.addEventListener('resize', () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const currentPixelRatio = Math.min(devicePixelRatio, isMobile.current ? 1.5 : 2)
      
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(currentPixelRatio)
      
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(width, height)
        materialRef.current.uniforms.uActualResolution.value.set(
          width * currentPixelRatio,
          height * currentPixelRatio
        )
        materialRef.current.uniforms.uPixelRatio.value = currentPixelRatio
      }
    }, { passive: true })
    
    // Initial mouse position
    onPointerMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2
    } as MouseEvent)
    
    // Start animation loop
    const animate = () => {
      if (!mountedRef.current) return
      
      const currentTime = performance.now()
      frameCountRef.current++
      
      if (currentTime - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }
      
      // Smooth mouse movement
      mousePositionRef.current.x += (targetMousePositionRef.current.x - mousePositionRef.current.x) * settingsRef.current.mouseSmoothness
      mousePositionRef.current.y += (targetMousePositionRef.current.y - mousePositionRef.current.y) * settingsRef.current.mouseSmoothness
      
      if (materialRef.current && clockRef.current) {
        materialRef.current.uniforms.uTime.value = clockRef.current.getElapsedTime()
        materialRef.current.uniforms.uMousePosition.value = mousePositionRef.current
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [screenToWorldJS, onPointerMove])
  
  const cleanup = useCallback(() => {
    mountedRef.current = false
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose()
    }
    
    window.removeEventListener('mousemove', onPointerMove)
  }, [onPointerMove])
  
  useEffect(() => {
    setIsClient(true)
    
    if (containerRef.current) {
      init()
    }
    
    return cleanup
  }, [init, cleanup])
  
  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} style={{ background: '#0d0d1a' }} />
  )
}

export default MetaballShaderBackground
