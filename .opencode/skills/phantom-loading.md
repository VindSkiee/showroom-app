# Skill: Phantom UI Skeleton Loading

## Overview

Skeleton loading otomatis menggunakan `phantom-ui` Web Component.

---

## Installation

```bash
npm install @aejkatappaja/phantom-ui
```

---

## Setup (Next.js)

### 1. Import di Client Component

```tsx
"use client";

import { useEffect } from "react";
import "@aejkatappaja/phantom-ui";
```

### 2. JSX Type Declarations (Optional)

Buat file `phantom-ui.d.ts` di `src/`:

```typescript
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}
```

---

## Basic Usage

```tsx
"use client";

import { useEffect, useState } from "react";
import "@aejkatappaja/phantom-ui";

export function VehicleCard({ data, isLoading }) {
  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <phantom-ui loading={isLoading} animation="pulse" reveal={0.3}>
      <div className="rounded-xl overflow-hidden bg-white">
        <div className="aspect-[4/3] relative">
          <img src={data?.image} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{data?.name}</h3>
          <p className="text-sm text-gray-500">{data?.model}</p>
          <p className="text-xl font-bold text-green-600 mt-2">
            {data?.price}
          </p>
        </div>
      </div>
    </phantom-ui>
  );
}
```

---

## Options

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `loading` | boolean | false | Show/hide skeleton |
| `animation` | string | "shimmer" | Animation type: shimmer, pulse, breathe, solid |
| `reveal` | number | 0.3 | Fade-out duration (seconds) |
| `count` | number | 1 | Repeat template N times |
| `count-gap` | number | 0 | Gap between repeats (px) |
| `shimmer-direction` | string | "ltr" | Direction: ltr, rtl, ttb, btt |
| `shimmer-color` | string | - | Custom shimmer color |
| `background-color` | string | - | Base skeleton color |
| `duration` | number | - | Animation cycle duration (seconds) |
| `stagger` | number | 0 | Delay between blocks (seconds) |
| `fallback-radius` | number | - | Border radius for flat elements |
| `debug` | boolean | false | Show block outlines |

---

## SSR Pattern (Next.js)

```tsx
"use client";

import { useEffect, useRef } from "react";

export function VehicleCardSkeleton() {
  const phantomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Import client-side only
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <phantom-ui
      ref={phantomRef}
      loading
      animation="pulse"
      reveal={0.3}
      className="rounded-xl overflow-hidden"
    >
      {/* Real content structure - phantom-ui measures this */}
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-6 bg-gray-100 rounded w-1/3 mt-4" />
      </div>
    </phantom-ui>
  );
}
```

---

## List Skeleton with Count

```tsx
"use client";

import { useEffect } from "react";
import "@aejkatappaja/phantom-ui";

export function VehicleListSkeleton({ count = 6 }: { count?: number }) {
  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <phantom-ui
        loading
        count={count}
        count-gap={16}
        animation="pulse"
        className="rounded-xl overflow-hidden"
      >
        {/* Single template - repeated count times */}
        <div className="bg-white">
          <div className="aspect-[4/3] bg-gray-100" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-6 bg-gray-100 rounded w-1/3 mt-4" />
          </div>
        </div>
      </phantom-ui>
    </div>
  );
}
```

---

## Integration with TanStack Query

```tsx
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "@aejkatappaja/phantom-ui";

export function VehicleCard({ vehicleId }: { vehicleId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetch(`/api/vehicles/${vehicleId}`).then((r) => r.json()),
  });

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <phantom-ui
      loading={isLoading}
      animation="pulse"
      reveal={0.25}
      className="rounded-xl overflow-hidden"
    >
      <article className="bg-white">
        <img
          src={data?.image ?? "/placeholder.png"}
          width={400}
          height={300}
          alt={data?.name ?? "Motor"}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">
            {data?.name ?? "Loading..."}
          </h3>
          <p className="text-sm text-gray-500">
            {data?.model ?? "Model"}
          </p>
          <p className="text-xl font-bold text-green-600 mt-2">
            {data?.price ?? "Rp 0"}
          </p>
        </div>
      </article>
    </phantom-ui>
  );
}
```

---

## Animation Types

| Type | Description | Best For |
|------|-------------|----------|
| `shimmer` | Gradient sweep | Default, general use |
| `pulse` | Fade in/out | Subtle, elegant |
| `breathe` | Scale pulse | Hero sections |
| `solid` | Static blocks | Minimal, fast |

---

## Customization

### Custom Colors

```tsx
<phantom-ui
  loading
  shimmer-color="#16A34A"
  background-color="#F0EFEC"
>
  ...
</phantom-ui>
```

### Custom Duration

```tsx
<phantom-ui
  loading
  duration={0.8}
  stagger={0.1}
>
  ...
</phantom-ui>
```

### Force Element Size

```tsx
<phantom-ui loading>
  <div>
    <img
      data-shimmer-width={200}
      data-shimmer-height={150}
      src={imageUrl}
    />
  </div>
</phantom-ui>
```

---

## Tips

1. **Always import client-side** - Phantom-ui needs browser APIs
2. **Use `useEffect`** for SSR frameworks (Next.js, Nuxt)
3. **Provide realistic fallback** - Good placeholder = better skeleton
4. **Set `reveal`** for smooth transition
5. **Use `animation="pulse"`** for subtle effect
