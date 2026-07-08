"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";
import type { VehicleType } from "@/lib/types";

interface FilterOption {
  value: VehicleType | "all" | "promo";
  label: string;
}

const TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua" },
  { value: "matic", label: "Matic" },
  { value: "manual", label: "Manual" },
  { value: "sport", label: "Sport" },
  { value: "cruiser", label: "Cruiser" },
  { value: "scoopy", label: "Scoopy" },
  { value: "promo", label: "Promo" },
];

function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.12 4-8 0 4.5 3 6.5 4 8.5 1-2 2-4 2-4s3 2 4 4.5c.34.83.5 1.72.5 2.63 0 1.6-.67 3.05-1.75 4.12A8.93 8.93 0 0112 23zm0-2c1.58 0 3-.67 4-1.75-.5-.5-1.5-2-2-3.5-.5 1.5-1.5 3-2 3.5 1 1.08 2.42 1.75 4 1.75z" />
    </svg>
  );
}

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "all";
  const currentPromo = searchParams.get("promo") === "true";
  const currentValue = currentPromo ? "promo" : currentType;

  const handleFilter = useCallback(
    (value: string) => {
      if (value === currentValue) return;

      const params = new URLSearchParams(searchParams.toString());

      if (value === "promo") {
        params.delete("type");
        params.set("promo", "true");
      } else if (value === "all") {
        params.delete("type");
        params.delete("promo");
      } else {
        params.delete("promo");
        params.set("type", value);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, currentValue],
  );

  return (
    <div className="w-fit rounded-xl bg-surface/50 px-4 py-2.5 sm:px-5">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {TYPE_OPTIONS.map((option) => {
          const isActive = currentValue === option.value;
          const isPromo = option.value === "promo";

          if (isPromo) {
            return (
              <button
                key={option.value}
                onClick={() => handleFilter(option.value)}
                disabled={isPending}
                aria-pressed={isActive}
                className={cn(
                  "relative overflow-hidden whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 ease-out sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isActive
                    ? "bg-danger text-white shadow-md"
                    : "animate-shimmer border border-danger/30 text-danger hover:bg-danger/10 hover:border-danger/50 hover:shadow-sm hover:scale-[1.02]",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <FireIcon />
                  {option.label}
                </span>
              </button>
            );
          }

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
