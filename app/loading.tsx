export default function Loading() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-accent-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-body text-text-secondary">INFOGRA</span>
          <span className="text-accent-primary animate-pulse">...</span>
        </div>
      </div>
    </div>
  )
}
