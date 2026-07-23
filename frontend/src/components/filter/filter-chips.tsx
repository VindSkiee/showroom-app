"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";

export interface FilterChipOption {
  value: string;
  label: string;
  isPromo?: boolean;
}

const MOTOR_OPTIONS: FilterChipOption[] = [
  { value: "all", label: "Semua" },
  { value: "matic", label: "Matic" },
  { value: "manual", label: "Manual" },
  { value: "sport", label: "Sport" },
  { value: "cruiser", label: "Cruiser" },
  { value: "scoopy", label: "Scoopy" },
  { value: "promo", label: "Promo", isPromo: true },
];

interface FilterChipsProps {
  options?: FilterChipOption[];
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3 w-3 sm:h-4 sm:w-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.12 4-8 0 4.5 3 6.5 4 8.5 1-2 2-4 2-4s3 2 4 4.5c.34.83.5 1.72.5 2.63 0 1.6-.67 3.05-1.75 4.12A8.93 8.93 0 0112 23zm0-2c1.58 0 3-.67 4-1.75-.5-.5-1.5-2-2-3.5-.5 1.5-1.5 3-2 3.5 1 1.08 2.42 1.75 4 1.75z" />
    </svg>
  );
}

export function FilterChips({ options = MOTOR_OPTIONS }: FilterChipsProps) {
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
    <div className="w-full max-w-full sm:w-fit rounded-xl bg-surface/50 p-1.5 sm:px-5 sm:py-2.5">
      {/* Tambahkan pr-2 di mobile agar item terakhir tidak mentok di pinggir container */}
      <div className="flex w-full gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-1 pr-2 sm:pb-0 sm:pr-0 sm:flex-wrap sm:overflow-visible">
        {options.map((option) => {
          const isActive = currentValue === option.value;

          if (option.isPromo) {
            return (
              <button
                key={option.value}
                onClick={() => handleFilter(option.value)}
                disabled={isPending}
                aria-pressed={isActive}
                className={cn(
                  // Tambahkan shrink-0 di sini
                  "shrink-0 group relative overflow-hidden whitespace-nowrap rounded-xl px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-bold snap-start transition-all duration-300 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                  isActive
                    ? "bg-danger text-white shadow-[0_4px_15px_-3px_rgba(225,29,72,0.4)]"
                    : "border border-danger/30 text-danger hover:bg-danger/10 hover:border-danger/50",
                  !isActive &&
                    "after:absolute after:inset-0 after:animate-glare after:bg-gradient-to-r after:from-transparent after:via-danger/20 after:to-transparent",
                )}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="inline-block transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12">
                    <FireIcon />
                  </span>
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
                // Tambahkan shrink-0 di sini juga
                "shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium snap-start transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
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