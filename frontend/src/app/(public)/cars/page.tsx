import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { SearchInput } from "@/components/filter/search-input";
import { FilterChips } from "@/components/filter/filter-chips";
import { FilterSheet } from "@/components/filter/filter-sheet";
import { PageContent } from "@/components/motion/page-content";
import { ScrollRevealWrapper } from "@/components/motion/scroll-reveal-wrapper";
import { getCars } from "@/lib/strapi";
import { CAR_TYPE_OPTIONS } from "@/lib/constants";
import type { CarType, VehicleStatus } from "@/lib/types";

interface CarsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;

  let cars: import("@/lib/types").Car[] = [];
  let totalCount = 0;

  try {
    const hasPromo = params.promo === "true";

    const res = await getCars({
      name: params.q || undefined,
      type: (params.type as CarType) || undefined,
      availabilityStatus: (params.status as VehicleStatus) || undefined,
      hasPromo: hasPromo || undefined,
      sort: params.sort || "createdAt:desc",
      pageSize: 20,
    });
    cars = res.data;
    totalCount = res.meta.pagination?.total || res.data.length;
  } catch {
    // Strapi not reachable - show empty state
  }

  // Sort: promo vehicles first
  cars = [...cars].sort((a, b) => {
    if (a.promo?.isActive && !b.promo?.isActive) return -1;
    if (!a.promo?.isActive && b.promo?.isActive) return 1;
    return 0;
  });

  return (
    <PageContent>
      <main className="py-6 sm:py-8">
        <Container>
          {/* Header */}
          <ScrollRevealWrapper>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">
                Katalog Mobil
              </h1>
              <p className="mt-2 text-ink-muted">
                Temukan mobil bekas berkualitas dengan surat lengkap
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
              <FilterChips options={CAR_TYPE_OPTIONS} />
            </Suspense>
          </div>

          {/* Result count */}
          {cars.length > 0 && (
            <p className="mb-4 text-sm text-ink-muted">
              Menampilkan {totalCount} item{totalCount > 1 ? "" : ""} {params.q && `untuk "${params.q}"`}
            </p>
          )}

          {/* Grid */}
          {cars.length > 0 ? (
            <CatalogGrid items={cars} basePath="/car" />
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
                  ? `Tidak ada mobil untuk "${params.q}"`
                  : "Belum ada mobil tersedia"}
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
