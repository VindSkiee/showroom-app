# Skill: Next.js Component

## Overview

Membuat komponen React untuk Showroom E-Catalog Motor.

---

## File Structure

```
frontend/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── vehicle/               # Vehicle components
│   │   ├── vehicle-card.tsx
│   │   ├── vehicle-grid.tsx
│   │   └── vehicle-detail.tsx
│   ├── filter/                # Filter components
│   │   ├── filter-bar.tsx
│   │   └── search-input.tsx
│   ├── layout/                # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── promo/                 # Promo components
│       └── promo-banner.tsx
├── lib/
│   ├── types.ts               # TypeScript types
│   ├── strapi.ts              # API client
│   └── utils.ts               # Helpers
└── hooks/
    ├── useVehicles.ts
    └── useFilters.ts
```

---

## Pattern: TypeScript Types

### lib/types.ts

```typescript
// Strapi Response
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}

// Media
export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    url: string;
    width: number;
    height: number;
    alternativeText?: string;
  };
}

// Vehicle
export interface Vehicle {
  id: number;
  attributes: {
    name: string;
    model: string;
    licensePlate: string;
    type: VehicleType;
    price: number;
    year: number;
    documentStatus: DocumentStatus;
    documentNote?: string;
    taxStatus: TaxStatus;
    taxExpiryYear?: number;
    taxExpiredFrom?: number;
    defectStatus: DefectStatus;
    status: VehicleStatus;
    defects?: DefectItem[];
    images?: StrapiMedia[];
    video?: StrapiMedia;
    promo?: StrapiSingleResponse<Promo>;
    createdAt: string;
    updatedAt: string;
  };
}

export type VehicleType = "matic" | "manual" | "sport" | "cruiser" | "scoopy";
export type VehicleStatus = "available" | "sold_out";
export type DocumentStatus = "complete" | "incomplete";
export type TaxStatus = "active" | "expired" | "unknown";
export type DefectStatus = "none" | "minor" | "major";

// Defect Item
export interface DefectItem {
  id: number;
  part: string;
  description: string;
  images?: StrapiMedia[];
}

// Sale
export interface Sale {
  id: number;
  attributes: {
    saleDate: string;
    salePrice: number;
    buyerName?: string;
    vehicle: StrapiSingleResponse<Vehicle>;
    createdAt: string;
  };
}

// Promo
export interface Promo {
  id: number;
  attributes: {
    title: string;
    description?: string;
    discount: number;
    isActive: boolean;
    banner?: StrapiMedia;
    vehicles?: StrapiResponse<Vehicle[]>;
    createdAt: string;
  };
}

// Filter State
export interface FilterState {
  search: string;
  type: VehicleType | "";
  minPrice: number | "";
  maxPrice: number | "";
  year: number | "";
  status: VehicleStatus | "";
}
```

---

## Pattern: Vehicle Card

### components/vehicle/vehicle-card.tsx

```tsx
import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { attributes } = vehicle;
  const imageUrl = attributes.images?.[0]?.attributes?.url;
  const isAvailable = attributes.status === "available";

  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="group block rounded-xl overflow-hidden bg-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-[#F0EFEC]">
        {imageUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`}
            alt={`${attributes.name} ${attributes.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#57534E]">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={isAvailable ? "success" : "danger"}>
            {isAvailable ? "Tersedia" : "Terjual"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1C1917] line-clamp-1">
          {attributes.name}
        </h3>
        <p className="text-sm text-[#57534E] mt-1">
          {attributes.model}
        </p>

        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-xl font-bold text-[#16A34A]">
            {formatCurrency(attributes.price)}
          </p>
          <span className="text-sm text-[#57534E]">
            {attributes.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

---

## Pattern: Vehicle Grid

### components/vehicle/vehicle-grid.tsx

```tsx
import { Vehicle } from "@/lib/types";
import { VehicleCard } from "./vehicle-card";
import { VehicleGridSkeleton } from "./vehicle-grid-skeleton";

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

export function VehicleGrid({ vehicles, isLoading }: VehicleGridProps) {
  if (isLoading) {
    return <VehicleGridSkeleton count={6} />;
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#57534E]">Tidak ada motor yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
```

---

## Pattern: Button

### components/ui/button.tsx

```tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#147536]",
      secondary: "bg-[#F0EFEC] text-[#1C1917] hover:bg-[#E5E4E1]",
      ghost: "bg-transparent text-[#1C1917] hover:bg-[#F0EFEC]",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-12 px-8 text-base w-full",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

---

## Pattern: Badge

### components/ui/badge.tsx

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-[#F0EFEC] text-[#57534E]",
    success: "bg-[#DCFCE7] text-[#16A34A]",
    danger: "bg-[#FEE2E2] text-[#EF4444]",
    warning: "bg-[#FEF3C7] text-[#D97706]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
```

---

## Pattern: Search Input

### components/filter/search-input.tsx

```tsx
"use client";

import { Search } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]"
          size={20}
        />
        <input
          ref={ref}
          type="text"
          placeholder="Cari motor..."
          className={`w-full h-11 pl-10 pr-4 rounded-lg bg-[#F0EFEC] text-[#1C1917] placeholder-[#57534E] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 focus:ring-offset-[#FAFAF9] transition-shadow ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
```

---

## Pattern: WhatsApp Button

### components/ui/whatsapp-button.tsx

```tsx
"use client";

import { MessageCircle } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface WhatsAppButtonProps {
  vehicle: Vehicle;
  phoneNumber: string;
}

export function WhatsAppButton({ vehicle, phoneNumber }: WhatsAppButtonProps) {
  const { attributes } = vehicle;

  const message = encodeURIComponent(
    `Halo, saya tertarik dengan ${attributes.name} ${attributes.model} (Rp ${attributes.price.toLocaleString("id-ID")}). Apakah masih tersedia?`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-0 left-0 right-0 h-14 bg-[#16A34A] text-white flex items-center justify-center gap-2 font-medium z-50 transition-colors hover:bg-[#15803D] active:bg-[#147536]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <MessageCircle size={24} />
      <span>Chat WhatsApp</span>
    </a>
  );
}
```

---

## Pattern: Skeleton with phantom-ui

### components/vehicle/vehicle-grid-skeleton.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { VehicleCardSkeleton } from "./vehicle-card-skeleton";

interface VehicleGridSkeletonProps {
  count?: number;
}

export function VehicleGridSkeleton({ count = 6 }: VehicleGridSkeletonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback - show plain layout
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl bg-[#F0EFEC] aspect-[4/3]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### components/vehicle/vehicle-card-skeleton.tsx

```tsx
"use client";

import { useEffect, useRef } from "react";

export function VehicleCardSkeleton() {
  const phantomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <phantom-ui
      ref={phantomRef}
      loading
      animation="pulse"
      className="rounded-xl overflow-hidden"
    >
      <div className="aspect-[4/3] bg-[#F0EFEC]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#F0EFEC] rounded w-3/4" />
        <div className="h-4 bg-[#F0EFEC] rounded w-1/2" />
        <div className="h-6 bg-[#F0EFEC] rounded w-1/3 mt-4" />
      </div>
    </phantom-ui>
  );
}
```

---

## Utils

### lib/utils.ts

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}
```

---

## Next Steps

1. Setup animasi → Lihat `motion-setup.md`
2. Tambahkan scroll animations → Lihat `motion-patterns.md`
3. Deploy → Lihat `deploy.md`
