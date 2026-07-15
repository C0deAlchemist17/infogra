export default function PCBuilderLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="h-10 w-64 skeleton rounded mb-2" />
          <div className="h-5 w-96 skeleton rounded" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Component selection skeleton */}
          <div className="flex-1">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="glass border-border-subtle rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 skeleton rounded-xl" />
                      <div>
                        <div className="h-5 w-32 skeleton rounded mb-2" />
                        <div className="h-3 w-20 skeleton rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-24 skeleton rounded-lg" />
                  </div>
                  <div className="h-20 skeleton rounded-xl" />
                </div>
              ))}
            </div>
          </div>
          {/* Summary skeleton */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="glass border-border-subtle rounded-2xl p-6 sticky top-24">
              <div className="h-6 w-32 skeleton rounded mb-6" />
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 skeleton rounded" />
                    <div className="h-4 w-20 skeleton rounded" />
                  </div>
                ))}
              </div>
              <div className="border-t border-border-subtle pt-4 mb-6">
                <div className="flex justify-between">
                  <div className="h-5 w-16 skeleton rounded" />
                  <div className="h-5 w-28 skeleton rounded" />
                </div>
              </div>
              <div className="h-12 w-full skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
