export default function Loading() {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

      {/* Stats loading */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>

      {/* Tables grid loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
