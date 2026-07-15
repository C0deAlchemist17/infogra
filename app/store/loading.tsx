export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Search bar skeleton */}
      <section className="py-8 bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-8">
          <div className="h-14 rounded-xl skeleton w-full max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Main content with sidebar skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="glass border-border-subtle rounded-2xl p-8">
                <div className="h-6 w-24 skeleton rounded mb-8" />
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 w-20 skeleton rounded mb-4" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-10 skeleton rounded-xl" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products grid skeleton */}
            <div className="flex-1 min-w-0">
              <div className="h-8 w-48 skeleton rounded mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="glass border-border-subtle rounded-2xl overflow-hidden">
                    <div className="aspect-square skeleton" />
                    <div className="p-6">
                      <div className="h-4 w-16 skeleton rounded mb-3" />
                      <div className="h-5 w-full skeleton rounded mb-2" />
                      <div className="h-5 w-3/4 skeleton rounded mb-4" />
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="h-4 w-4 skeleton rounded" />
                        ))}
                      </div>
                      <div className="h-6 w-28 skeleton rounded mb-4" />
                      <div className="h-10 w-full skeleton rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
