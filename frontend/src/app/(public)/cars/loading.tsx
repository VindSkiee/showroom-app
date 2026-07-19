import { Container } from "@/components/ui/container";
import { CatalogGridSkeleton } from "@/components/catalog/catalog-grid-skeleton";

export default function CarsLoading() {
  return (
    <div className="py-6 sm:py-8">
      <Container>
        <div className="mb-6 sm:mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface sm:h-9" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-surface" />
        </div>

        <div className="mb-4 flex gap-3">
          <div className="flex-1 h-12 animate-pulse rounded-xl bg-surface" />
          <div className="w-24 h-12 animate-pulse rounded-xl bg-surface" />
        </div>

        <div className="mb-6">
          <div className="h-4 w-16 animate-pulse rounded bg-surface mb-2" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-surface" />
        </div>

        <CatalogGridSkeleton count={8} />
      </Container>
    </div>
  );
}
