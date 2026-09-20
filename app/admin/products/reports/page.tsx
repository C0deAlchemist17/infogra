'use client'

import dynamic from 'next/dynamic'

// Lazy load reports page for better initial load
const ReportsContent = dynamic(() => import('./ReportsContent'), {
  loading: () => (
    <div className="min-h-screen bg-[#0a0a1a] p-8 flex items-center justify-center">
      <div className="text-white/40">Loading reports...</div>
    </div>
  ),
  ssr: false
})

export default function ReportsPage() {
  return <ReportsContent />
}
