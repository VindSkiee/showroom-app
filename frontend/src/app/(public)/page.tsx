import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { VehicleGrid } from "@/components/vehicle/vehicle-grid";
import { SearchInput } from "@/components/filter/search-input";
import { FilterChips } from "@/components/filter/filter-chips";
import { FilterSheet } from "@/components/filter/filter-sheet";
import { PageContent } from "@/components/motion/page-content";
import { ScrollRevealWrapper } from "@/components/motion/scroll-reveal-wrapper";
import { getVehicles } from "@/lib/strapi";
import type { Vehicle, VehicleType, VehicleStatus } from "@/lib/types";

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  let vehicles: Vehicle[] = [];
  let totalCount = 0;

  try {
    const res = await getVehicles({
      name: params.q || undefined,
      type: (params.type as VehicleType) || undefined,
      availabilityStatus: (params.status as VehicleStatus) || undefined,
      sort: params.sort || "createdAt:desc",
      pageSize: 20,
    });
    vehicles = res.data;
    totalCount = res.meta.pagination?.total || res.data.length;
  } catch {
    // Strapi not reachable - show empty state
  }

  return (
    <PageContent>
      <main className="py-6 sm:py-8">
        <Container>
          {/* Header */}
          <ScrollRevealWrapper>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">
                Katalog Motor
              </h1>
              <p className="mt-2 text-ink-muted">
                Temukan motor bekas berkualitas dengan surat lengkap
              </p>
            </div>
          </ScrollRevealWrapper>

        {/* Search + Filter Bar */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <Suspense>
              <SearchInput />
            </Suspense>
          </div>
          <FilterSheet />
        </div>

        {/* Type Filter Chips */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium text-ink-muted uppercase tracking-wide">
            Kategori
          </p>
          <Suspense>
            <FilterChips />
          </Suspense>
        </div>

        {/* Result count */}
        {vehicles.length > 0 && (
          <p className="mb-4 text-sm text-ink-muted">
            {totalCount} motor ditemukan
          </p>
        )}

        {/* Grid */}
        {vehicles.length > 0 ? (
          <VehicleGrid vehicles={vehicles} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="mb-4 h-12 w-12 text-ink-muted"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p className="text-lg text-ink-muted">
              {params.q
                ? `Tidak ada motor untuk "${params.q}"`
                : "Belum ada motor tersedia"}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {params.q
                ? "Coba kata kunci lain"
                : "Silakan cek kembali nanti"}
            </p>
          </div>
        )}
        </Container>
      </main>
    </PageContent>
  );
}
