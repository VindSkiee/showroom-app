# Design System - Showroom E-Catalog Motor

## Design Philosophy

> "Minimalis bukan berarti kosong. Setiap elemen harus punya alasan ada."

**Minimalis tapi menarik** - clean, simple, tapi bukan boring. Whitespace IS the design.

### Prinsip Utama

1. **Typography is Hero** - Hierarki dari size/weight, bukan dekorasi
2. **Whitespace is Design** - Spasi memisahkan elemen, bukan border/shadow
3. **One Accent Color** - Satu warna untuk CTA, sisanya monokrom
4. **Content First** - Layout mengikuti konten, bukan template
5. **Motion as Information** - Animasi hanya jika memberi informasi
6. **Performance is Aesthetic** - Fast load = good design

---

## Color Palette

> Budget: 2 neutral + 1 ink + 1 accent. Itu saja yang boleh.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FAFAF9` | Background (warm off-white) |
| `--color-surface` | `#F0EFEC` | Card/rare surface |
| `--color-ink` | `#1C1917` | Primary text (near-black) |
| `--color-ink-muted` | `#57534E` | Secondary text (7.4:1 contrast) |
| `--color-accent` | `#16A34A` | CTA only (WhatsApp green) |
| `--color-accent-hover` | `#15803D` | CTA hover state |
| `--color-success` | `#22C55E` | Status: Available |
| `--color-danger` | `#EF4444` | Status: Sold Out |

### Contrast Ratios

| Pair | Ratio | WCAG |
|------|-------|------|
| `#1C1917` on `#FAFAF9` | 15.9:1 | AAA |
| `#57534E` on `#FAFAF9` | 7.4:1 | AAA |
| `#16A34A` on `#FAFAF9` | 4.8:1 | AA |

---

## Typography

> Hierarchy comes from size and weight alone. No decorative fonts.

### Font Family

- **Primary:** Inter (variable weight)
- **Fallback:** system-ui, -apple-system, sans-serif

### Modular Scale (1.25x Ratio)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | 0.64rem (10.2px) | 1.4 | Tiny captions |
| `--text-sm` | 0.8rem (12.8px) | 1.5 | Caption, metadata |
| `--text-base` | 1rem (16px) | 1.6 | Body text (MINIMUM!) |
| `--text-lg` | 1.25rem (20px) | 1.5 | Subheadings |
| `--text-xl` | 1.563rem (25px) | 1.4 | Section title |
| `--text-2xl` | 1.953rem (31.2px) | 1.3 | Page title |
| `--text-3xl` | 2.441rem (39px) | 1.2 | Hero (one per page) |

### Font Weights

| Weight | Usage |
|--------|-------|
| 400 | Body text |
| 500 | Labels, emphasis |
| 600 | Headings (h2-h6) |
| 700 | Display headings (h1) |

### Typographic Rules

- Body text minimum 16px (prevents iOS auto-zoom)
- Max width body: 65ch (optimal readability)
- Max width headings: 30ch
- Letter-spacing headings: -0.02em (tighten display sizes)
- Line-height body: 1.6 (optimal for reading)

---

## Spacing Scale

> 8px base grid. Whitespace IS the design system.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 0.5rem (8px) | Tight spacing |
| `--space-2` | 1rem (16px) | Component padding |
| `--space-3` | 1.5rem (24px) | Between elements |
| `--space-4` | 2rem (32px) | Between sections |
| `--space-6` | 3rem (48px) | Section padding |
| `--space-8` | 4rem (64px) | Large section gap |
| `--space-12` | 6rem (96px) | Page sections |

### Rules

- Separate elements with space, NOT borders or shadows
- Generous padding around CTAs (increases tap target)
- Micro-whitespace between text lines improves readability 20%

---

## Breakpoints

| Prefix | Min-width | Columns | Layout |
|--------|-----------|---------|--------|
| (base) | 0px | 1 | Single column, full width |
| `sm:` | 640px | 2 | Landscape phone |
| `md:` | 768px | 3 | Tablet |
| `lg:` | 1024px | 4 | Desktop |
| `xl:` | 1280px | 4 | Large desktop (max-w-7xl) |

---

## Component Design

### VehicleCard

```
┌─────────────────────┐
│ [Image]             │  ← aspect-ratio 4/3, object-fit cover
│                     │
│ Honda Vario 160     │  ← text-lg font-semibold
│ Techno ABS          │  ← text-sm text-muted
│                     │
│ Rp 18.500.000       │  ← text-xl font-bold text-accent
│                     │
│ ● Available         │  ← status dot + text
│                     │
│ [Chat WhatsApp]     │  ← full-width CTA button
└─────────────────────┘
```

- Background: transparent (whitespace separates)
- Border: none
- Border-radius: 12px
- No shadow (if you need shadow, add whitespace)
- Hover: subtle scale(1.02)
- Tap: scale(0.98)

### FilterBar

- **Mobile:** Bottom sheet (slide up from bottom)
- **Desktop:** Left sidebar
- Chips/pills for filter options
- Active state: filled accent color
- Touch targets: 48x48px minimum

### Header

- Position: sticky top-0, z-50
- Mobile: Logo + Hamburger menu
- Desktop: Logo + Nav links (3-5 items max)
- Background: bg-bg with backdrop-blur
- No shadow (border-bottom: 1px if needed)

### WhatsApp Button (Sticky Bottom)

- Position: fixed bottom-0, full-width
- Height: 56px (thumb zone friendly)
- Background: accent color (#16A34A)
- Icon: WhatsApp logo + "Chat Kami"
- Safe area: env(safe-area-inset-bottom)
- Always visible on detail page

---

## Layout Patterns

### Catalog Page (Mobile)

```
┌─────────────────────┐
│ Header (sticky)     │
├─────────────────────┤
│ Search Bar          │
├─────────────────────┤
│ Filter Chips (scroll│
├─────────────────────┤
│ ┌──────┐ ┌──────┐  │
│ │Card 1│ │Card 2│  │
│ └──────┘ └──────┘  │
│ ┌──────┐ ┌──────┐  │
│ │Card 3│ │Card 4│  │
│ └──────┘ └──────┘  │
├─────────────────────┤
│ WhatsApp CTA (fixed)│
└─────────────────────┘
```

### Detail Page (Mobile)

```
┌─────────────────────┐
│ ← Back   Share      │
├─────────────────────┤
│ [Image Gallery]     │
│ (swipeable)         │
├─────────────────────┤
│ Motor Name          │  ← text-2xl
│ Rp Harga            │  ← text-xl accent
├─────────────────────┤
│ Detail Info         │
│ • Plat: B 1234 ABC  │
│ • Tahun: 2023       │
│ • Surat: Lengkap    │
│ • Pajak: Hidup 2026 │
├─────────────────────┤
│ Keterangan          │
│ Kecacatan: Minor    │
│ • Body: Lecet 10cm  │
│ [foto] [foto]       │
├─────────────────────┤
│ [Chat WhatsApp]     │  ← fixed bottom
└─────────────────────┘
```

---

## Animation Rules

> Motion as Information. If it doesn't convey info, cut it.

| Element | Animation | Duration | Notes |
|---------|-----------|----------|-------|
| Card entrance | fadeUp + stagger | 0.3s spring | 0.1s delay between cards |
| Filter sheet | slideUp | 0.3s spring | From bottom |
| Button hover | scale(1.02) | 0.2s | Subtle lift |
| Button tap | scale(0.98) | 0.1s | Feedback |
| Page transition | fade | 0.2s | Opacity only |
| Skeleton | phantom-ui pulse | auto | Auto-generated |

### Rules

- Import from `motion/react`, NOT `framer-motion`
- Use `motionTokens` for all values
- Check `useReducedMotion` before animating
- Animate only `transform` and `opacity`
- Never animate layout properties

---

## Skeleton Loading

```tsx
import "@aejkatappaja/phantom-ui";

<phantom-ui loading={isLoading} animation="pulse" reveal={0.3}>
  <VehicleCard {...data} />
</phantom-ui>
```

No separate skeleton components needed!

---

## Accessibility

- Touch targets: 48x48px minimum
- Contrast: 4.5:1 minimum (AA), 7:1 preferred (AAA)
- Body text: 16px minimum
- `prefers-reduced-motion`: disable transforms
- Keyboard navigation: visible focus states
- Semantic HTML: proper heading hierarchy
- Alt text on all images

---

## Anti-Patterns (HARUS DIHINDARI)

| ❌ Don't | ✅ Do |
|----------|-------|
| Gunakan shadow untuk card | Gunakan whitespace |
| Gradient backgrounds | Solid colors |
| Decorative icons | Functional icons only |
| Text < 16px | Minimum 16px body |
| Hidden navigation | Visible priority nav |
| Multiple CTAs per screen | One primary CTA |
| Hardcoded animasi values | Use motionTokens |
| Import dari "framer-motion" | Import dari "motion/react" |

---

## Tailwind CSS Mapping

```css
/* Custom properties → Tailwind */
--color-bg: #FAFAF9      → bg-[#FAFAF9]
--color-surface: #F0EFEC → bg-[#F0EFEC]
--color-ink: #1C1917     → text-[#1C1917]
--color-ink-muted: #57534E → text-[#57534E]
--color-accent: #16A34A  → bg-[#16A34A] text-[#16A34A]

/* Spacing */
--space-1: 8px  → p-2 / gap-2
--space-2: 16px → p-4 / gap-4
--space-3: 24px → p-6 / gap-6
--space-4: 32px → p-8 / gap-8

/* Typography */
--text-base: 16px → text-base
--text-lg: 20px   → text-lg
--text-xl: 25px   → text-xl
```
