'use client'

import dynamic from 'next/dynamic'

// Lazy load the interactive shape field for dashboard
const InteractiveShapeField = dynamic(() => import('./InteractiveShapeField'), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/40">
      Loading visualization...
    </div>
  ),
  ssr: false
})

interface DashboardShapeFieldProps {
  categories: string[]
  onSelectCategory?: (category: string) => void
}

export default function DashboardShapeField({ categories, onSelectCategory }: DashboardShapeFieldProps) {
  // Convert categories to shapes
  const shapes = categories.map((category, index) => ({
    id: index,
    position: { 
      x: (Math.random() - 0.5) * 3, 
      y: (Math.random() - 0.5) * 3, 
      z: (Math.random() - 0.5) * 3 
    },
    rotation: { 
      x: Math.random() * Math.PI * 2, 
      y: Math.random() * Math.PI * 2, 
      z: Math.random() * Math.PI * 2 
    },
    scale: 0.3 + Math.random() * 0.2,
    rotationSpeed: { 
      x: (Math.random() - 0.5) * 0.005, 
      y: (Math.random() - 0.5) * 0.005, 
      z: (Math.random() - 0.5) * 0.005 
    },
    color: `hsl(${(index * 360) / categories.length}, 70%, 60%)`,
    data: { category }
  }))

  const handleShapeSelect = (shape: any) => {
    if (onSelectCategory && shape.data?.category) {
      onSelectCategory(shape.data.category)
    }
  }

  return (
    <div className="w-full h-[300px] relative">
      <InteractiveShapeField
        shapes={shapes}
        onShapeClick={handleShapeSelect}
      />
    </div>
  )
}
