export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Breadcrumb skeleton */}
      <div className="bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 skeleton rounded" />
            <div className="h-4 w-4 skeleton rounded" />
            <div className="h-4 w-24 skeleton rounded" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="glass border-border-subtle rounded-2xl p-6 sticky top-24">
              <div className="h-8 w-32 skeleton rounded mb-6" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 skeleton rounded-xl" />
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border-subtle">
                <div className="h-4 w-28 skeleton rounded mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 skeleton rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid skeleton */}
          <main className="flex-1">
            <div className="h-8 w-48 skeleton rounded mb-2" />
            <div className="h-4 w-64 skeleton rounded mb-8" />
            <div className="flex justify-between items-center mb-8">
              <div className="h-4 w-32 skeleton rounded" />
              <div className="h-10 w-40 skeleton rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass border-border-subtle rounded-2xl overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-6">
                    <div className="h-4 w-16 skeleton rounded mb-3" />
                    <div className="h-5 w-full skeleton rounded mb-2" />
                    <div className="h-5 w-3/4 skeleton rounded mb-4" />
                    <div className="h-6 w-28 skeleton rounded mb-4" />
                    <div className="h-10 w-full skeleton rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
