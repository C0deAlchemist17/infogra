import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-accent-primary text-sm font-semibold tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-body-lg text-text-secondary mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="premium">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search Site
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
