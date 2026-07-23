"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get("q") || "";

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="group relative">
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted stroke-2 group-focus-within:stroke-[2.5] group-focus-within:text-black transition-all duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        defaultValue={currentValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Cari motor..."
        className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-12 pr-4 text-base text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-black border-t-transparent" />
      )}
    </div>
  );
}
