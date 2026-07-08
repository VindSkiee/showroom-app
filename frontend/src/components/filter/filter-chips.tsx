"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";
import type { VehicleType } from "@/lib/types";

interface FilterOption {
  value: VehicleType | "all";
  label: string;
}

const TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua" },
  { value: "matic", label: "Matic" },
  { value: "manual", label: "Manual" },
  { value: "sport", label: "Sport" },
  { value: "cruiser", label: "Cruiser" },
  { value: "scoopy", label: "Scoopy" },
];

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "all";

  const handleFilter = useCallback(
    (type: string) => {
      if (type === currentType) return;

      const params = new URLSearchParams(searchParams.toString());
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, currentType],
  );

  return (
    <div className="w-fit rounded-xl bg-surface/50 px-4 py-2.5 sm:px-5">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {TYPE_OPTIONS.map((option) => {
          const isActive = currentType === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleFilter(option.value)}
              disabled={isPending}
              aria-pressed={isActive}
              className={cn(
                "whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 ease-out sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isActive
                  ? "bg-accent text-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]"
                  : "bg-white text-ink-muted hover:bg-stone-50 hover:text-ink hover:shadow-sm border border-stone-100",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
