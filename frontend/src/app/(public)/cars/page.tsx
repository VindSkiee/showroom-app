import { Suspense } from "react";
import Link from "next/link";
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
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ink sm:text-3xl tracking-tighter">
                  Koleksi Mobil Terbaik
                </h1>
                <p className="mt-2 text-ink-muted tracking-tight">
                  Mobil bekas pilihan dengan kondisi prima. Surat lengkap,
                  harga transparan, siap antar kamu ke mana saja.
                </p>
              </div>

              <Link
                href="/"
                // 1. Ubah border menjadi ring-inset agar bebas glitch, dan set overflow-hidden
                className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-transparent px-5 py-3 text-sm font-medium text-ink ring-1 ring-inset ring-ink transition-all duration-300 ease-out active:scale-[0.98] hover:text-white hover:ring-0 hover:shadow-lg hover:shadow-red-600/30"
              >
                {/* 2. Layer Background Gradient (Absolute) - Animasinya diatur via opacity agar super mulus */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-red-600 to-black opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

                {/* 3. Bungkus teks dan panah dengan span relative z-10 agar selalu berada di atas gradient */}
                <span className="relative z-10 flex items-center tracking-tighter">
                  Lihat Koleksi Motor
                  <svg
                    className="h-4 w-0 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 5.25 6.75 6.75L9 18.75"
                    />
                  </svg>
                </span>
              </Link>
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
