# Skill: Motion Patterns

## Overview

Pattern animasi untuk Showroom E-Catalog Motor menggunakan `motion/react`.

---

## Prerequisites

- Install: `npm install motion`
- Setup tokens: Lihat `motion-setup.md`
- Import dari `motion/react`

---

## Pattern 1: Fade Up (Card Entrance)

```tsx
"use client";

import { motion } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

export function FadeUp({ children, delay = 0 }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: motionTokens.distance.md }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...springs.gentle,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Pattern 2: Stagger Children

```tsx
"use client";

import { motion } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: motionTokens.distance.md },
  show: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

interface StaggerListProps {
  children: React.ReactNode;
}

export function StaggerList({ children }: StaggerListProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {children}
    </motion.div>
  );
}

// Usage
<StaggerList>
  {vehicles.map((v) => (
    <motion.div key={v.id} variants={item}>
      <VehicleCard vehicle={v} />
    </motion.div>
  ))}
</StaggerList>
```

---

## Pattern 3: Hover Effect

```tsx
"use client";

import { motion } from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";

interface HoverScaleProps {
  children: React.ReactNode;
}

export function HoverScale({ children }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale: motionTokens.scale.hover }}
      whileTap={{ scale: motionTokens.scale.press }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}

// Usage
<HoverScale>
  <VehicleCard vehicle={vehicle} />
</HoverScale>
```

---

## Pattern 4: Scroll Reveal

```tsx
"use client";

import { motion } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
  children,
  direction = "up",
}: ScrollRevealProps) {
  const directionMap = {
    up: { y: motionTokens.distance.lg },
    down: { y: -motionTokens.distance.lg },
    left: { x: motionTokens.distance.lg },
    right: { x: -motionTokens.distance.lg },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={springs.gentle}
    >
      {children}
    </motion.div>
  );
}
```

---

## Pattern 5: AnimatePresence (Exit)

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.fast }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: motionTokens.distance.md }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: motionTokens.distance.md }}
            transition={springs.gentle}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Pattern 6: Bottom Sheet (Filter)

```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springs.gentle}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            {/* Content */}
            <div className="px-4 pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Pattern 7: Page Transition

```tsx
"use client";

import { motion } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.fast }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Pattern 8: Button Animations

```tsx
"use client";

import { motion } from "motion/react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function AnimatedButton({ children, onClick }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className="w-full h-12 bg-[#16A34A] text-white font-medium rounded-lg"
    >
      {children}
    </motion.button>
  );
}
```

---

## Pattern 9: Image Gallery (Swipe)

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { springs, motionTokens } from "@/lib/motion-tokens";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? motionTokens.distance.xl : -motionTokens.distance.xl,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? motionTokens.distance.xl : -motionTokens.distance.xl,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={springs.gentle}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
          >
            →
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Usage Examples

### Vehicle Card with Entrance

```tsx
<StaggerList>
  {vehicles.map((vehicle, index) => (
    <motion.div key={vehicle.id} variants={item}>
      <HoverScale>
        <VehicleCard vehicle={vehicle} />
      </HoverScale>
    </motion.div>
  ))}
</StaggerList>
```

### Filter Bottom Sheet

```tsx
<BottomSheet isOpen={isFilterOpen} onClose={() => setFilterOpen(false)}>
  <FilterContent onApply={handleFilterApply} />
</BottomSheet>
```

### Page with Transition

```tsx
"use client";

import { AnimatePresence } from "motion/react";
import { PageTransition } from "@/components/motion/page-transition";

export default function Layout({ children }) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={pathname}>{children}</PageTransition>
    </AnimatePresence>
  );
}
```

---

## Performance Tips

1. **Use `LazyMotion`** for smaller bundle
2. **Animate only `transform` and `opacity`**
3. **Use `will-change: transform`** for complex animations
4. **Avoid animating many elements** at once
5. **Test on low-end devices**
