# Skill: Next.js Page

## Overview

Membuat halaman Next.js 14 (App Router) untuk Showroom E-Catalog Motor.

---

## File Structure

```
frontend/
├── app/
│   ├── (public)/              # Public routes (tanpa layout admin)
│   │   ├── page.tsx           # Homepage/Catalog
│   │   ├── vehicle/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detail kendaraan
│   │   └── promo/
│   │       └── page.tsx       # Promo page
│   ├── layout.tsx             # Root layout
│   └── globals.css
```

---

## Pattern: Catalog Page

### app/(public)/page.tsx

```tsx
import { Metadata } from "next";
import { CatalogContent } from "@/components/catalog/catalog-content";
import { fetchStrapi } from "@/lib/strapi";
import { Vehicle } from "@/lib/types";

export const metadata: Metadata = {
  title: "E-Catalog Showroom Motor",
  description: "Temukan motor impian Anda dengan harga terbaik",
};

interface SearchParams {
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  year?: string;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Build Strapi query
  const query = buildVehicleQuery(params);

  let vehicles: Vehicle[] = [];
  let error = null;

  try {
    const response = await fetchStrapi<{ data: Vehicle[] }>(`/vehicles${query}`);
    vehicles = response.data;
  } catch (e) {
    error = "Gagal memuat data kendaraan";
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <CatalogContent
        vehicles={vehicles}
        error={error}
        searchParams={params}
      />
    </main>
  );
}

function buildVehicleQuery(params: SearchParams): string {
  const filters: string[] = [];

  if (params.search) {
    filters.push(`filters[name][$containsi]=${params.search}`);
  }
  if (params.type) {
    filters.push(`filters[type][$eq]=${params.type}`);
  }
  if (params.minPrice) {
    filters.push(`filters[price][$gte]=${params.minPrice}`);
  }
  if (params.maxPrice) {
    filters.push(`filters[price][$lte]=${params.maxPrice}`);
  }
  if (params.year) {
    filters.push(`filters[year][$eq]=${params.year}`);
  }

  filters.push("sort=createdAt:desc");

  return filters.length > 0 ? `?${filters.join("&")}` : "";
}
```

---

## Pattern: Detail Page

### app/(public)/vehicle/[id]/page.tsx

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/vehicle/vehicle-detail";
import { fetchStrapi } from "@/lib/strapi";
import { Vehicle } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetchStrapi<{ data: Vehicle }>(`/vehicles/${id}`);
    const vehicle = response.data;

    return {
      title: `${vehicle.name} ${vehicle.model} | Showroom Motor`,
      description: `${vehicle.name} ${vehicle.model} - Rp ${vehicle.price.toLocaleString("id-ID")}`,
      openGraph: {
        title: `${vehicle.name} ${vehicle.model}`,
        description: `Harga: Rp ${vehicle.price.toLocaleString("id-ID")}`,
        images: vehicle.images?.[0]?.url ? [vehicle.images[0].url] : [],
      },
    };
  } catch {
    return {
      title: "Detail Kendaraan | Showroom Motor",
    };
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;

  let vehicle: Vehicle | null = null;

  try {
    const response = await fetchStrapi<{ data: Vehicle }>(`/vehicles/${id}`);
    vehicle = response.data;
  } catch {
    notFound();
  }

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <VehicleDetail vehicle={vehicle} />
    </main>
  );
}
```

---

## Pattern: Promo Page

### app/(public)/promo/page.tsx

```tsx
import { Metadata } from "next";
import { PromoContent } from "@/components/promo/promo-content";
import { fetchStrapi } from "@/lib/strapi";
import { Promo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Promo | Showroom Motor",
  description: "Promo spesial untuk motor pilihan Anda",
};

export default async function PromoPage() {
  let promos: Promo[] = [];

  try {
    const response = await fetchStrapi<{ data: Promo[] }>(
      "/promos?filters[isActive][$eq]=true"
    );
    promos = response.data;
  } catch (error) {
    // Handle error
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <PromoContent promos={promos} />
    </main>
  );
}
```

---

## Root Layout

### app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "E-Catalog Showroom Motor",
  description: "Temukan motor impian Anda dengan harga terbaik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

---

## Global CSS

### app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #FAFAF9;
    --color-surface: #F0EFEC;
    --color-ink: #1C1917;
    --color-ink-muted: #57534E;
    --color-accent: #16A34A;
  }

  body {
    @apply bg-[#FAFAF9] text-[#1C1917];
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}
```

---

## Environment Variables

### .env.local (Frontend)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

---

## Commands

```bash
# Development
cd frontend
npm run dev
# Akses: http://localhost:3000

# Build
npm run build

# Start production
npm start
```

---

## Next Steps

1. Buat komponen → Lihat `nextjs-component.md`
2. Setup skeleton loading → Lihat `phantom-loading.md`
3. Tambah animasi → Lihat `motion-setup.md`
