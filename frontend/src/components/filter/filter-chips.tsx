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
    [router, searchParams, startTransition]
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {TYPE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilter(option.value)}
          disabled={isPending}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
            currentType === option.value
              ? "bg-accent text-white"
              : "bg-surface text-ink hover:bg-stone-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
