"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { VehicleType, VehicleStatus, DocumentStatus, TaxStatus, DefectStatus } from "@/lib/types";

export interface FilterState {
  q: string;
  type: VehicleType | null;
  status: VehicleStatus | null;
  documentStatus: DocumentStatus | null;
  taxStatus: TaxStatus | null;
  defectStatus: DefectStatus | null;
  sort: string;
  page: number;
}

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push("?", { scroll: false });
    });
  }, [router, startTransition]);

  const filters: FilterState = {
    q: searchParams.get("q") || "",
    type: (searchParams.get("type") as VehicleType) || null,
    status: (searchParams.get("status") as VehicleStatus) || null,
    documentStatus: (searchParams.get("documentStatus") as DocumentStatus) || null,
    taxStatus: (searchParams.get("taxStatus") as TaxStatus) || null,
    defectStatus: (searchParams.get("defectStatus") as DefectStatus) || null,
    sort: searchParams.get("sort") || "createdAt:desc",
    page: Number(searchParams.get("page")) || 1,
  };

  const hasActiveFilters =
    filters.q ||
    filters.type ||
    filters.status ||
    filters.documentStatus ||
    filters.taxStatus ||
    filters.defectStatus;

  return {
    filters,
    hasActiveFilters,
    isPending,
    updateFilter,
    resetFilters,
  };
}
