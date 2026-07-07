import { Container } from "@/components/ui/container";

export default function PromoLoading() {
  return (
    <main className="py-6 sm:py-8">
      <Container>
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface sm:h-9" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded-lg bg-surface" />
        </div>

        {/* Promo banner skeletons */}
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-surface">
              <div className="aspect-[2/1] animate-pulse bg-stone-200 sm:aspect-[3/1]" />
              <div className="p-4 sm:p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-stone-200" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-stone-200" />
                <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
