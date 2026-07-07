# Skill: Mobile-First Design

## Overview

Prinsip dan pola Mobile-First untuk Showroom E-Catalog Motor.

---

## Core Principles

> "Mobile-first bukan berarti 'make sure works on phone'. Tapi 'design for phone, then enhance for desktop'."

1. **Start at 375px** - Design untuk iPhone SE dulu
2. **Progressive Enhancement** - Tambah fitur untuk layar lebih besar
3. **Thumb Zone Friendly** - CTA di area bawah (mudah dijangkau)
4. **Performance First** - Sub-3s load on 4G

---

## Tailwind Breakpoints

```css
/* Base: 0px - 639px (Mobile) */
/* sm: 640px+ (Landscape phone) */
/* md: 768px+ (Tablet) */
/* lg: 1024px+ (Desktop) */
/* xl: 1280px+ (Large desktop) */
```

### Usage Pattern

```tsx
{/* Mobile: 1 column, Desktop: 3 columns */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

{/* Mobile: hidden, Desktop: visible */}
<div className="hidden lg:block">

{/* Mobile: full width, Desktop: half width */}
<div className="w-full md:w-1/2">
```

---

## Thumb Zone Layout

```
┌─────────────────────┐
│  🔴 Hard to reach    │  ← Header, back button
│                     │
│  🟡 Medium reach     │  ← Content, images
│                     │
│  🟢 Easy reach       │  ← Primary CTA
└─────────────────────┘
```

### Rules

- Primary CTA: bottom 50% of screen
- Secondary actions: middle area
- Navigation: top (but accessible)
- Minimum touch target: 48x48px

---

## Layout Patterns

### Mobile (0-639px)

```
┌─────────────────────┐
│ Logo    [Menu ☰]    │  ← Header
├─────────────────────┤
│ 🔍 Search...        │  ← Search
├─────────────────────┤
│ [Chip] [Chip] [Chip]│  ← Filter (scroll)
├─────────────────────┤
│ ┌─────────────────┐ │
│ │     Card 1      │ │  ← Single column
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │     Card 2      │ │
│ └─────────────────┘ │
├─────────────────────┤
│ 📱 Chat WhatsApp    │  ← Fixed bottom CTA
└─────────────────────┘
```

### Tablet (640-1023px)

```
┌──────────────────────────────┐
│ Logo        Nav Links        │
├──────────────────────────────┤
│ 🔍 Search...                 │
├──────────────────────────────┤
│ [Chip] [Chip] [Chip] [Chip]  │
├──────────────────────────────┤
│ ┌────────┐ ┌────────┐       │
│ │ Card 1 │ │ Card 2 │       │  ← 2 columns
│ └────────┘ └────────┘       │
│ ┌────────┐ ┌────────┐       │
│ │ Card 3 │ │ Card 4 │       │
│ └────────┘ └────────┘       │
├──────────────────────────────┤
│ 📱 Chat WhatsApp             │
└──────────────────────────────┘
```

### Desktop (1024px+)

```
┌────────────────────────────────────────────┐
│ Logo    Nav Links           Search 🔍      │
├────────────────────────────────────────────┤
│ ┌──────┐ ┌────────────────────────────┐   │
│ │Filter│ │ [Chip] [Chip] [Chip]       │   │
│ │ Bar  │ ├────────────────────────────┤   │
│ │      │ │ ┌─────┐ ┌─────┐ ┌─────┐  │   │
│ │ Type │ │ │  1  │ │  2  │ │  3  │  │   │
│ │ Price│ │ └─────┘ └─────┘ └─────┘  │   │
│ │ Year │ │ ┌─────┐ ┌─────┐ ┌─────┐  │   │
│ │      │ │ │  4  │ │  5  │ │  6  │  │   │
│ │      │ │ └─────┘ └─────┘ └─────┘  │   │
│ └──────┘ └────────────────────────────┘   │
└────────────────────────────────────────────┘
```

---

## Touch Targets

### Minimum Sizes

| Element | Minimum Size | Recommended |
|---------|-------------|-------------|
| Buttons | 48x48px | 56x56px |
| Links | 48x48px | 44x44px |
| Form inputs | 48px height | 56px height |
| Checkboxes | 48x48px | 44x44px |
| Icons | 44x44px | 48x48px |

### Spacing Between Targets

```css
/* Minimum 8px between touch targets */
.gap-2 { gap: 0.5rem; } /* 8px */

/* Recommended 16px */
.gap-4 { gap: 1rem; } /* 16px */
```

---

## Typography Rules

### Mobile Typography

```css
/* Minimum body text: 16px (prevents iOS auto-zoom) */
body { font-size: 16px; }

/* Headings scale */
h1 { font-size: 1.953rem; } /* 31.2px */
h2 { font-size: 1.563rem; } /* 25px */
h3 { font-size: 1.25rem; }  /* 20px */

/* Line height */
body { line-height: 1.6; }
h1 { line-height: 1.2; }
```

### Rules

- Body text minimum 16px
- Headings: tight line-height (1.2-1.3)
- Max width body: 65ch
- Max width headings: 30ch

---

## Navigation Patterns

### Mobile Navigation

**Option 1: Hamburger Menu**

```
┌─────────────────────┐
│ Logo      [☰ Menu]  │
└─────────────────────┘

Menu open:
┌─────────────────────┐
│ Logo      [✕ Close] │
├─────────────────────┤
│ Home                │
│ Catalog             │
│ Promo               │
│ Contact             │
└─────────────────────┘
```

**Option 2: Bottom Tab Bar (3-5 items)**

```
┌─────────────────────┐
│     Content         │
│                     │
│                     │
├─────────────────────┤
│ 🏠  📷  📞  👤     │
│ Home Search Promo   │
└─────────────────────┘
```

### Desktop Navigation

```
┌────────────────────────────────────────────┐
│ Logo    Home  Catalog  Promo  Contact      │
└────────────────────────────────────────────┘
```

---

## Form Patterns

### Mobile Forms

```tsx
{/* Full-width inputs on mobile */}
<input className="w-full h-12 px-4" />

{/* Stack labels above inputs */}
<label className="block mb-2">Name</label>
<input className="w-full h-12 px-4" />

{/* Large tap targets for selects */}
<select className="w-full h-12 px-4">
```

### Validation

```tsx
{/* Inline validation */}
<div className="space-y-1">
  <label>Email</label>
  <input className="w-full h-12 px-4 border" />
  <p className="text-sm text-red-500">Email tidak valid</p>
</div>
```

---

## Responsive Images

### Next.js Image Component

```tsx
import Image from "next/image";

<Image
  src="/motor.jpg"
  alt="Honda Vario 160"
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

### Rules

- Always use `sizes` attribute
- Use `object-fit: cover` for thumbnails
- Lazy load below-the-fold images
- Preload hero images

---

## Performance Budget

| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | First impression |
| INP | < 200ms | Interactivity |
| CLS | < 0.1 | Visual stability |
| Bundle | < 500KB | Load speed |
| Touch target | 48x48px | Accessibility |
| Body text | 16px | iOS zoom prevention |
| Contrast | 4.5:1 | Readability |

---

## Common Mistakes

| ❌ Don't | ✅ Do |
|----------|-------|
| Design desktop first | Design mobile first |
| Hide content on mobile | Show same content, re-compose |
| Use small touch targets | 48x48px minimum |
| Use < 16px text | Minimum 16px body |
| Multi-level hamburger | Priority navigation |
| Lazy load everything | Preload critical |
| Skip loading states | Always show skeleton |

---

## Testing Checklist

- [ ] Test at 375px width
- [ ] Test on real device (not just browser)
- [ ] Check touch targets 48x48px
- [ ] Verify no horizontal scroll
- [ ] Test loading states
- [ ] Check contrast 4.5:1
- [ ] Verify text 16px minimum
- [ ] Test orientation change
