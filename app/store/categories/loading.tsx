export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="h-10 w-64 skeleton rounded mx-auto mb-4" />
          <div className="h-5 w-96 skeleton rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="glass border-border-subtle rounded-2xl p-6">
              <div className="h-12 w-12 skeleton rounded-xl mx-auto mb-4" />
              <div className="h-5 w-28 skeleton rounded mx-auto mb-2" />
              <div className="h-4 w-20 skeleton rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
