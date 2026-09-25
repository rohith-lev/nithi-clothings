export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xs border border-[#E8E2D5] bg-[#FFFFFF]">
      <div className="aspect-[3/4] w-full skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded-xs skeleton-shimmer" />
        <div className="h-4 w-4/5 rounded-xs skeleton-shimmer" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-1/4 rounded-xs skeleton-shimmer" />
          <div className="h-3 w-1/4 rounded-xs skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-[3/4] w-full rounded-xs skeleton-shimmer" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xs skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-4 w-1/4 rounded-xs skeleton-shimmer" />
          <div className="h-8 w-3/4 rounded-xs skeleton-shimmer" />
          <div className="h-6 w-1/3 rounded-xs skeleton-shimmer" />
          <div className="h-20 w-full rounded-xs skeleton-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-1/4 rounded-xs skeleton-shimmer" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-16 rounded-xs skeleton-shimmer" />
              ))}
            </div>
          </div>
          <div className="h-12 w-full rounded-xs skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
