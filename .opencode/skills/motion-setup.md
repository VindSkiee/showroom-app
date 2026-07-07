# Skill: Motion Setup (Framer Motion v12+)

## Overview

Setup animasi dengan `motion/react` (Framer Motion v12+) untuk Showroom E-Catalog Motor.

---

## Installation

```bash
npm install motion
```

---

## Import Rules

```tsx
// ✅ CORRECT - Import dari "motion/react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// ❌ WRONG - Jangan import dari "framer-motion"
import { motion } from "framer-motion";
```

---

## Required Setup

### 1. "use client" Directive

Setiap file yang import dari `motion/react` WAJIB punya:

```tsx
"use client";

import { motion } from "motion/react";
```

### 2. Motion Tokens

Buat file `lib/motion-tokens.ts`:

```typescript
// Duration tokens
export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },

  // Distance tokens
  distance: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Scale tokens
  scale: {
    press: 0.98,
    pop: 1.02,
    hover: 1.05,
  },
};
```

### 3. Spring Presets

```typescript
// lib/motion-tokens.ts

export const springs = {
  // Gentle spring (default)
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  },

  // Snappy spring (buttons)
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },

  // Bouncy spring (playful)
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 15,
  },
};
```

### 4. Reduced Motion Hook

```tsx
// hooks/use-reduced-motion.tsx
"use client";

import { useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";

export function useSafeMotion(distanceY: number = motionTokens.distance.md) {
  const shouldReduceMotion = useReducedMotion();

  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : distanceY },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -distanceY },
  };
}
```

---

## Rules

1. **Gunakan `motionTokens`** - Jangan hardcode values
2. **Gunakan `springs` presets** - Jangan inline stiffness/damping
3. **Cek `useReducedMotion`** - Sebelum animasi
4. **`initial` harus match server** - Untuk SSR safety
5. **Hanya animasi `transform` dan `opacity`** - Jangan animasi layout

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `transition={{ duration: 0.4 }}` | `transition={springs.gentle}` |
| `stiffness: 300, damping: 30` inline | Use `springs.snappy` |
| `initial={{ opacity: 0 }}` on SSR | Add mount guard |
| Skip `useReducedMotion` check | Always check |
| Animate `width`, `height` | Use `scaleX`, `scaleY` |

---

## Next Steps

- Lihat `motion-patterns.md` untuk contoh animasi
- Lihat `phantom-loading.md` untuk skeleton
