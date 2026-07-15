import type { Metadata } from 'next'
import StoreFooter from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'INFOGRA Store - Premium Technology Products',
  description: 'Discover premium gaming laptops, desktop PCs, components, and accessories at INFOGRA Store. Shop from top brands like ASUS, MSI, NVIDIA, AMD, and more.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  )
}
