import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main className="py-6 sm:py-8">
      <Container>
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface sm:h-9" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-surface" />
        </div>

        {/* Search skeleton */}
        <div className="mb-4 h-12 animate-pulse rounded-xl bg-surface" />

        {/* Chips skeleton */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-surface" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-surface">
              <div className="aspect-[4/3] animate-pulse bg-stone-200" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
                <div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
