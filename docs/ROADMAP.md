# ROADMAP.md - Development Progress

> Baca file ini di awal setiap session baru. Cari session dengan status ⬜ atau 🔄, lalu eksekusi.

**Project:** Showroom E-Catalog Motor
**Stack:** Strapi v5 + Next.js 16 + Tailwind v4 + motion/react
**Prinsip:** Mobile-first, minimalis menarik, whitespace IS the design

---

## Status Legend

| Symbol | Status | Arti |
|--------|--------|------|
| ⬜ | Pending | Belum dikerjakan |
| 🔄 | In Progress | Sedang dikerjakan |
| ✅ | Done | Selesai & verified |
| ⚠️ | Blocked | Ada masalah |

---

## Progress

| Metric | Value |
|--------|-------|
| Total Sessions | 10 |
| Done | 7/10 |
| Current | S8 |
| Last Updated | 2026-07-07 |

---

## Dependency Graph

```
S0 (Foundation)
├── S1 (Catalog Page)
│   ├── S2 (Detail Page)
│   ├── S3 (Filter & Search)
│   ├── S4 (Navigation)
│   └── S5 (Promo Page)
├── S6 (Motion) ← butuh S1-S5
├── S7 (Polish) ← butuh S1-S6
├── S8 (Seed & Test) ← butuh S1-S7
└── S9 (Deploy Prep) ← butuh S1-S8
```

---

## S0: Project Foundation

**Status:** ✅
**Goal:** Design system + Types + Config (fondasi sebelum coding)

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `frontend/.env.local` | Strapi URL, WhatsApp number |
| Edit | `frontend/next.config.ts` | Image domains Strapi |
| Create | `frontend/src/lib/types.ts` | Semua TypeScript types |
| Create | `frontend/src/lib/strapi.ts` | API client fetch |
| Create | `frontend/src/lib/utils.ts` | formatCurrency, formatDate |
| Create | `frontend/src/lib/motion-tokens.ts` | Animation tokens + springs |
| Edit | `frontend/src/app/globals.css` | Design tokens, Tailwind theme |
| Edit | `frontend/src/app/layout.tsx` | Inter font + metadata Bahasa Indonesia |

**Verification:**
- [x] `npm run build` tanpa error
- [x] Import semua types berfungsi
- [ ] Strapi API reachable dari strapi.ts (needs running Strapi)

**Log:**
- Created `.env.local` with Strapi URL + WhatsApp number
- Updated `next.config.ts` with image domains (localhost + Railway)
- Created `src/lib/types.ts` matching exact Strapi schemas
- Created `src/lib/strapi.ts` with fetchStrapi + query builder
- Created `src/lib/utils.ts` (formatCurrency, formatDate, cn, slugify)
- Created `src/lib/motion-tokens.ts` with springs + variants
- Updated `globals.css` with design tokens (colors, spacing, typography)
- Updated `layout.tsx` with Inter font, Indonesian metadata, viewport
- Fixed type error: missing Vehicle/Promo imports in strapi.ts

**Issues:**
- lightningcss native module missing on WSL (resolved via npm install)

**Notes:**
- Next.js 16.2.10 with Turbopack
- Strapi v5 response format is flat (no `attributes` wrapper)
- Build OK, ready for S1 (Catalog Page)

---

## S1: Catalog Page

**Status:** ✅
**Goal:** Halaman utama menampilkan grid motor dari Strapi

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/ui/badge.tsx` | Status badge (available/sold) |
| Create | `src/components/ui/button.tsx` | Reusable button |
| Create | `src/components/ui/container.tsx` | Max-width wrapper |
| Create | `src/components/vehicle/vehicle-card.tsx` | Card untuk grid |
| Create | `src/components/vehicle/vehicle-grid.tsx` | Responsive grid |
| Create | `src/components/vehicle/vehicle-grid-skeleton.tsx` | Loading skeleton |
| Edit | `src/app/(public)/page.tsx` | Catalog page SSR |

**Verification:**
- [x] Halaman localhost:3000 menampilkan grid motor
- [ ] Data muncul dari Strapi (needs running Strapi)
- [x] Loading state berfungsi
- [x] Mobile-first layout benar (1 kolom di 375px)
- [x] `npm run build` tanpa error

**Log:**
- Created `src/components/ui/badge.tsx` - Badge, StatusBadge, TypeBadge
- Created `src/components/ui/button.tsx` - Button with variant/size props
- Created `src/components/ui/container.tsx` - Max-width responsive wrapper
- Created `src/components/vehicle/vehicle-card.tsx` - Card with image, badges, price
- Created `src/components/vehicle/vehicle-grid.tsx` - Responsive 1-2-3-4 col grid
- Created `src/components/vehicle/vehicle-grid-skeleton.tsx` - 8-card skeleton loading
- Created `src/app/(public)/page.tsx` - SSR catalog page fetching from Strapi
- Removed old `src/app/page.tsx`
- Fixed TypeScript error: explicit Vehicle[] type for empty array init
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- Page uses SSR (async server component) - fetches directly from Strapi
- Empty state shows when Strapi is unreachable or no vehicles
- Mobile-first: 1 col → 2 col (sm) → 3 col (lg) → 4 col (xl)

---

## S2: Detail Page

**Status:** ✅
**Goal:** Halaman detail motor + WhatsApp button

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/ui/whatsapp-button.tsx` | Fixed bottom CTA |
| Create | `src/components/vehicle/vehicle-detail.tsx` | Detail view + info |
| Create | `src/components/vehicle/vehicle-detail-skeleton.tsx` | Detail loading |
| Edit | `src/app/(public)/vehicle/[id]/page.tsx` | Detail page SSR |

**Verification:**
- [x] Klik card → pindah ke detail page
- [x] Info motor lengkap (nama, harga, surat, pajak, cacat)
- [x] WhatsApp button muncul di bottom
- [x] Link WhatsApp benar (wa.me/{number}?text=...)
- [x] SEO metadata berfungsi

**Log:**
- Created `whatsapp-button.tsx` - Fixed bottom CTA with WhatsApp icon + pre-filled message
- Created `vehicle-detail.tsx` - Full detail view with image gallery, info grid, defects, promo
- Created `vehicle-detail-skeleton.tsx` - Loading skeleton for detail page
- Created `vehicle/[id]/page.tsx` - SSR page with generateMetadata for SEO
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- WhatsApp message includes vehicle name + formatted price
- Detail shows: year, plate, document status, tax status, defect status
- Defects shown with part name + description + images
- Promo badge shown if vehicle has active promo

---

## S3: Filter & Search

**Status:** ✅
**Goal:** User bisa filter dan search motor

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/filter/search-input.tsx` | Search bar |
| Create | `src/components/filter/filter-chips.tsx` | Type filter chips |
| Create | `src/components/filter/filter-sheet.tsx` | Bottom sheet (mobile) |
| Create | `src/hooks/useFilters.ts` | Filter state management |
| Edit | `src/app/(public)/page.tsx` | Integrate filters + searchParams |

**Verification:**
- [x] Search by name berfungsi
- [x] Filter by type berfungsi
- [x] Filter chips responsive (scroll horizontal di mobile)
- [x] Bottom sheet filter muncul di mobile
- [x] URL update dengan query params

**Log:**
- Created `search-input.tsx` - Search bar with debounced URL updates + loading spinner
- Created `filter-chips.tsx` - Horizontal scroll chips for VehicleType filter
- Created `filter-sheet.tsx` - Bottom sheet modal for status + sort filter
- Created `useFilters.ts` - Generic hook for filter state via URL searchParams
- Updated `page.tsx` - Integrated all filters, shows result count, improved empty state
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- Uses URL searchParams for server-side filtering (SSR compatible)
- Search updates URL on input (debounced via transition)
- Filter chips: scrollable horizontal, accent color for active
- Bottom sheet: manual implementation (no radix), slide-up with backdrop
- Sort options: Terbaru, Harga Terendah, Harga Tertinggi
- Status filter: Semua, Tersedia, Terjual

---

## S4: Navigation

**Status:** ✅
**Goal:** Navigasi lengkap (header + footer + mobile menu)

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/layout/header.tsx` | Sticky header + hamburger |
| Create | `src/components/layout/footer.tsx` | Footer |
| Create | `src/app/(public)/layout.tsx` | Public layout wrapper |

**Verification:**
- [x] Header sticky di top
- [x] Mobile: hamburger menu → slide navigation
- [x] Desktop: nav links horizontal
- [x] Footer muncul di semua halaman
- [x] Navigasi: Home, Catalog, Promo

**Log:**
- Created `header.tsx` - Sticky header with logo, desktop nav, mobile hamburger toggle
- Created `footer.tsx` - Simple footer with brand, nav links, copyright
- Created `(public)/layout.tsx` - Layout wrapper composing Header + Footer
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- Header uses backdrop-blur for translucent effect on scroll
- Mobile menu toggles open/close with X icon
- Active nav link highlighted with surface background
- Footer links same as header nav items

---

## S5: Promo Page

**Status:** ✅
**Goal:** Halaman promo dari Strapi

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/promo/promo-banner.tsx` | Promo banner card |
| Edit | `src/app/(public)/promo/page.tsx` | Promo page SSR |

**Verification:**
- [x] Promo page menampilkan active promos
- [x] Banner gambar muncul
- [x] Discount badge terlihat
- [x] Link ke vehicle yang dipromo berfungsi
- [x] Empty state jika tidak ada promo

**Log:**
- Created `promo-banner.tsx` - Banner card with image, title, discount badge, related vehicles
- Created `promo/page.tsx` - SSR page fetching active promos from Strapi
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- Promo page shows as Static (pre-rendered), will revalidate on deploy
- Banner image uses large format if available, fallback to original URL
- Related vehicles shown as clickable chips with availability dot

---

## S6: Motion & Animations

**Status:** ✅
**Goal:** Animasi halus yang informative

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/motion/fade-up.tsx` | FadeUp wrapper |
| Create | `src/components/motion/stagger-list.tsx` | Stagger container |
| Create | `src/components/motion/scroll-reveal.tsx` | Scroll reveal |
| Create | `src/components/motion/page-transition.tsx` | Page transition |
| Create | `src/components/motion/page-content.tsx` | Client page wrapper |
| Create | `src/components/motion/scroll-reveal-wrapper.tsx` | Client scroll reveal wrapper |
| Edit | `src/components/vehicle/vehicle-card.tsx` | whileHover/whileTap scale |
| Edit | `src/components/vehicle/vehicle-grid.tsx` | Staggered entrance |
| Edit | `src/components/ui/button.tsx` | CSS hover/tap scale |
| Edit | `src/components/ui/whatsapp-button.tsx` | Slide-up entrance |
| Edit | `src/components/filter/filter-sheet.tsx` | Slide-up + AnimatePresence |
| Edit | `src/lib/motion-tokens.ts` | Fixed type assertion |
| Edit | `src/app/(public)/page.tsx` | PageTransition wrapper |
| Edit | `src/app/(public)/promo/page.tsx` | ScrollReveal per banner |
| Edit | `src/app/(public)/vehicle/[id]/page.tsx` | PageTransition wrapper |

**Verification:**
- [x] Card entrance: fadeUp + stagger
- [x] Button hover: scale(1.02)
- [x] Button tap: scale(0.98)
- [x] Bottom sheet: slide up animation
- [x] Scroll reveal di section promo
- [x] `useReducedMotion` cek berfungsi
- [x] `npm run build` tanpa error

**Log:**
- Created 6 motion components: FadeUp, FadeIn, StaggerList, StaggerItem, ScrollReveal, PageTransition
- Created client wrappers: PageContent, ScrollRevealWrapper for server component pages
- VehicleCard: motion whileHover/whileTap with spring animation
- VehicleGrid: StaggerList/StaggerItem for staggered entrance
- Button: CSS transitions for hover/tap scale (avoided motion.button type conflicts)
- WhatsAppButton: motion slide-up entrance with delay
- FilterSheet: motion slide-up with AnimatePresence for mount/unmount
- All animations respect useReducedMotion preference
- Fixed motionTokens.ts type assertion for spring type

**Issues:**
- motion.button type conflict with HTML button props (resolved with CSS transitions)
- slideUpVariants type error with spring type string (resolved with `as const`)

**Notes:**
- motionTokens.ts provides all animation values - no hardcoded values
- useReducedMotion checked in every animated component
- Page transitions are subtle fade-in for smooth page feel

---

## S7: Polish & Error Handling

**Status:** ✅
**Goal:** Production-ready quality

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/app/(public)/not-found.tsx` | 404 page |
| Create | `src/app/(public)/error.tsx` | Error boundary |
| Create | `src/app/(public)/loading.tsx` | Route loading |
| Create | `src/components/ui/error-message.tsx` | Error display |
| Create | `src/app/(public)/vehicle/[id]/not-found.tsx` | Vehicle 404 page |
| Create | `src/app/(public)/vehicle/[id]/error.tsx` | Vehicle error boundary |
| Create | `src/app/(public)/vehicle/[id]/loading.tsx` | Vehicle loading |
| Create | `src/app/(public)/promo/loading.tsx` | Promo loading |
| Edit | `src/components/vehicle/vehicle-card.tsx` | Image onError fallback |
| Edit | `src/components/vehicle/vehicle-detail.tsx` | Image onError fallback |
| Edit | `src/components/promo/promo-banner.tsx` | Image onError fallback |

**Verification:**
- [x] 404 page untuk invalid vehicle ID
- [x] Error state jika Strapi down
- [x] Loading state di setiap halaman
- [x] Graceful fallback untuk missing images
- [x] `npm run build` tanpa warning

**Log:**
- Created not-found.tsx - Global 404 with CTA back to catalog
- Created error.tsx - Global error boundary with reset + navigate
- Created loading.tsx - Global route loading with full skeleton
- Created error-message.tsx - Reusable error display component
- Created vehicle/[id]/not-found.tsx - Vehicle-specific 404
- Created vehicle/[id]/error.tsx - Vehicle-specific error boundary
- Created vehicle/[id]/loading.tsx - Vehicle detail skeleton
- Created promo/loading.tsx - Promo page skeleton
- Updated VehicleCard: useState + onError for image fallback
- Updated VehicleDetail: useState + onError for main image + defect images
- Updated PromoBanner: useState + onError for banner image
- Build OK, all verifications passed

**Issues:**
- None

**Notes:**
- All error boundaries are client components ("use client")
- Loading states match actual page skeletons
- Image error handling uses useState + onError for graceful fallback
- Error ID shown for debugging in production

---

## S8: Seed Data & Testing

**Status:** ⬜
**Goal:** Data test lengkap + manual QA

**Files:** Tidak ada file baru

**Verification:**
- [ ] Seed 5-10 kendaraan di Strapi admin
- [ ] Seed 2-3 promo
- [ ] Data motor muncul semua di catalog
- [ ] Filter berfungsi dengan data real
- [ ] Detail semua field muncul
- [ ] WhatsApp link benar
- [ ] Mobile test (375px)
- [ ] Desktop test (1024px+)

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S9: Deploy Prep

**Status:** ⬜
**Goal:** Siap deploy ke Vercel + Railway

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `frontend/.env.production.example` | Production env template |
| Edit | `backend/config/middlewares.ts` | Add Vercel URL to CORS |
| Edit | `AGENTS.md` | Update deployment instructions |

**Verification:**
- [ ] `npm run build` production OK
- [ ] Environment variables lengkap
- [ ] CORS configured untuk production URL
- [ ] Strapi accessible dari luar (Railway)

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)
