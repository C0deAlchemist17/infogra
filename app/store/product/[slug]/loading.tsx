export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Breadcrumb skeleton */}
      <div className="bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 skeleton rounded" />
            <div className="h-4 w-4 skeleton rounded" />
            <div className="h-4 w-20 skeleton rounded" />
            <div className="h-4 w-4 skeleton rounded" />
            <div className="h-4 w-32 skeleton rounded" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product image skeleton */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square glass border-border-subtle rounded-2xl skeleton" />
          </div>

          {/* Product info skeleton */}
          <div className="w-full lg:w-1/2">
            <div className="h-4 w-24 skeleton rounded mb-4" />
            <div className="h-8 w-full skeleton rounded mb-2" />
            <div className="h-8 w-3/4 skeleton rounded mb-6" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-5 skeleton rounded" />
                ))}
              </div>
              <div className="h-4 w-16 skeleton rounded" />
            </div>

            <div className="h-10 w-40 skeleton rounded mb-6" />
            
            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 skeleton rounded" />
                  <div className="h-4 w-32 skeleton rounded" />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-8">
              <div className="h-14 flex-1 skeleton rounded-xl" />
              <div className="h-14 flex-1 skeleton rounded-xl" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 skeleton rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-16 pt-12 border-t border-border-subtle">
          <div className="h-8 w-48 skeleton rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass border-border-subtle rounded-2xl overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-6">
                  <div className="h-4 w-16 skeleton rounded mb-3" />
                  <div className="h-5 w-full skeleton rounded mb-2" />
                  <div className="h-6 w-28 skeleton rounded mb-4" />
                  <div className="h-10 w-full skeleton rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
