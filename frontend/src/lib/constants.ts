import type { FilterChipOption } from "@/components/filter/filter-chips";

export const CAR_TYPE_OPTIONS: FilterChipOption[] = [
  { value: "all", label: "Semua" },
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedan" },
  { value: "mpv", label: "MPV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "sport", label: "Sport" },
  { value: "lcgc", label: "LCGC" },
  { value: "pickup", label: "Pickup" },
  { value: "matic", label: "Matic" },
  { value: "manual", label: "Manual" },
  { value: "promo", label: "Promo", isPromo: true },
];
