'use client'

import { useState } from 'react'
import * as THREE from 'three'
import InteractiveShapeField, { InteractiveShape } from '@/components/three/InteractiveShapeField'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

// Usage Example: Interactive Project Portfolio
export function InteractivePortfolio({ projects }: { projects: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // Convert projects to shapes
  const shapes = projects.map((project, index) => ({
    id: index,
    position: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 4 },
    rotation: { x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2, z: Math.random() * Math.PI * 2 },
    scale: 0.2 + Math.random() * 0.2,
    rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 },
    color: project.color || '#3b82f6',
    data: project
  } as InteractiveShape))

  return (
    <div className="relative h-screen">
      <InteractiveShapeField
        shapes={shapes}
        shapeCount={projects.length}
        onShapeClick={(shape) => setSelectedProject(shape.data)}
        onShapeHover={(shape) => {
          // Show tooltip or preview
        }}
        colorPalette={['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981']}
      />
      
      {/* Selected Project Detail Panel */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-96"
        >
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h3>
              <p className="text-white/60 mb-4">{selectedProject.description}</p>
              <button className="w-full bg-accent-primary text-white py-2 rounded-lg">
                View Project
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Usage Example: Services Visualization
export function InteractiveServices({ services }: { services: any[] }) {
  return (
    <div className="relative h-[600px]">
      <InteractiveShapeField
        shapeCount={services.length}
        onShapeClick={(shape) => {
          // Navigate to service detail
        }}
        colorPalette={['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981']}
      />
    </div>
  )
}
