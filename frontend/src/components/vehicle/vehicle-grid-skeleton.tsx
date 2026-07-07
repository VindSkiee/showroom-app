export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      {/* Image skeleton */}
      <div className="aspect-[4/3] animate-pulse bg-stone-200" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-stone-200" />
        </div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 flex items-end justify-between">
          <div className="h-6 w-1/3 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
