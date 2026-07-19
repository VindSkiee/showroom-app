"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { motionTokens, slideUpVariants } from "@/lib/motion-tokens";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "available", label: "Tersedia" },
  { value: "sold_out", label: "Tidak Tersedia" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
] as const;

function getSortParam(sort: string): string {
  switch (sort) {
    case "newest":
      return "createdAt:desc";
    case "price_asc":
      return "price:asc";
    case "price_desc":
      return "price:desc";
    default:
      return "createdAt:desc";
  }
}

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      ...motionTokens.spring.gentle,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.in,
    },
  },
};

export function FilterSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [localSort, setLocalSort] = useState(currentSort);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setLocalStatus(currentStatus);
    setLocalSort(currentSort);
    setIsOpen(true);
  }, [currentStatus, currentSort]);

  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (localStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", localStatus);
    }

    params.set("sort", getSortParam(localSort));

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
    setIsOpen(false);
  }, [localStatus, localSort, router, searchParams, startTransition]);

  const handleReset = useCallback(() => {
    setLocalStatus("all");
    setLocalSort("newest");
  }, []);

  function FilterContent() {
    return (
      <>
        {/* Status */}
        <div className="mb-6 lg:mb-8">
          <h3 className="mb-3 lg:mb-4 text-sm font-medium text-ink-muted">
            Status
          </h3>
          <div className="w-fit rounded-xl bg-surface/50 px-3 py-2 sm:px-5 sm:py-2.5">
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {STATUS_OPTIONS.map((option) => {
                const isActive = localStatus === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setLocalStatus(option.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 ease-out sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                      isActive
                        ? "bg-accent text-white font-semibold shadow-md"
                        : "border border-stone-100 bg-white text-ink-muted hover:border-stone-200 hover:bg-stone-50 hover:text-ink hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="mb-3 lg:mb-4 text-sm font-medium text-ink-muted">
            Urutkan
          </h3>
          <div className="w-fit rounded-xl bg-surface/50 px-3 py-2 sm:px-5 sm:py-2.5">
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {SORT_OPTIONS.map((option) => {
                const isActive = localSort === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setLocalSort(option.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 ease-out sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                      isActive
                        ? "bg-accent text-white font-semibold shadow-md"
                        : "border border-stone-100 bg-white text-ink-muted hover:border-stone-200 hover:bg-stone-50 hover:text-ink hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-surface"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        Filter
      </button>

      {/* ===== MOBILE: Bottom Sheet ===== */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.fast }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={prefersReduced ? "visible" : "hidden"}
              animate="visible"
              exit="exit"
              variants={prefersReduced ? undefined : slideUpVariants}
              className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white overflow-hidden"
            >
              {/* Handle + Header */}
              <div className="shrink-0 px-4 pt-5 sm:px-6 sm:pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="h-1 w-10 rounded-full bg-stone-300" />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-ink">
                    Filter & Urutkan
                  </h2>
                  <button onClick={handleReset} className="text-sm text-accent">
                    Reset
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
                <FilterContent />
              </div>

              {/* Apply button */}
              <div className="shrink-0 border-t border-stone-100 px-4 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={handleApply}
                  disabled={isPending}
                  className="w-full rounded-xl bg-accent py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors duration-200"
                >
                  {isPending ? "Menerapkan..." : "Terapkan Filter"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== DESKTOP: Right Sidebar ===== */}
      <AnimatePresence>
        {isOpen && (
          <div className="hidden lg:block fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.fast }}
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.div
              initial={prefersReduced ? "visible" : "hidden"}
              animate="visible"
              exit="exit"
              variants={prefersReduced ? undefined : sidebarVariants}
              className="absolute right-0 top-0 flex h-full w-80 flex-col bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
                <h2 className="text-lg font-bold text-ink">
                  Filter & Urutkan
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="text-sm text-accent"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                <FilterContent />
              </div>

              {/* Apply button */}
              <div className="shrink-0 border-t border-stone-200 px-6 py-5">
                <button
                  onClick={handleApply}
                  disabled={isPending}
                  className="w-full rounded-xl bg-accent py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors duration-200"
                >
                  {isPending ? "Menerapkan..." : "Terapkan Filter"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
