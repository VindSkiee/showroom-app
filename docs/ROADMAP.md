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
| Done | 1/10 |
| Current | S1 |
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

**Status:** ⬜
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
- [ ] Halaman localhost:3000 menampilkan grid motor
- [ ] Data muncul dari Strapi
- [ ] Loading state berfungsi
- [ ] Mobile-first layout benar (1 kolom di 375px)
- [ ] `npm run build` tanpa error

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S2: Detail Page

**Status:** ⬜
**Goal:** Halaman detail motor + WhatsApp button

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/ui/whatsapp-button.tsx` | Fixed bottom CTA |
| Create | `src/components/vehicle/vehicle-detail.tsx` | Detail view + info |
| Create | `src/components/vehicle/vehicle-detail-skeleton.tsx` | Detail loading |
| Edit | `src/app/(public)/vehicle/[id]/page.tsx` | Detail page SSR |

**Verification:**
- [ ] Klik card → pindah ke detail page
- [ ] Info motor lengkap (nama, harga, surat, pajak, cacat)
- [ ] WhatsApp button muncul di bottom
- [ ] Link WhatsApp benar (wa.me/{number}?text=...)
- [ ] SEO metadata berfungsi

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S3: Filter & Search

**Status:** ⬜
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
- [ ] Search by name berfungsi
- [ ] Filter by type berfungsi
- [ ] Filter chips responsive (scroll horizontal di mobile)
- [ ] Bottom sheet filter muncul di mobile
- [ ] URL update dengan query params

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S4: Navigation

**Status:** ⬜
**Goal:** Navigasi lengkap (header + footer + mobile menu)

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/layout/header.tsx` | Sticky header + hamburger |
| Create | `src/components/layout/footer.tsx` | Footer |
| Create | `src/app/(public)/layout.tsx` | Public layout wrapper |

**Verification:**
- [ ] Header sticky di top
- [ ] Mobile: hamburger menu → slide navigation
- [ ] Desktop: nav links horizontal
- [ ] Footer muncul di semua halaman
- [ ] Navigasi: Home, Catalog, Promo

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S5: Promo Page

**Status:** ⬜
**Goal:** Halaman promo dari Strapi

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/promo/promo-banner.tsx` | Promo banner card |
| Edit | `src/app/(public)/promo/page.tsx` | Promo page SSR |

**Verification:**
- [ ] Promo page menampilkan active promos
- [ ] Banner gambar muncul
- [ ] Discount badge terlihat
- [ ] Link ke vehicle yang dipromo berfungsi
- [ ] Empty state jika tidak ada promo

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S6: Motion & Animations

**Status:** ⬜
**Goal:** Animasi halus yang informative

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/motion/fade-up.tsx` | FadeUp wrapper |
| Create | `src/components/motion/stagger-list.tsx` | Stagger container |
| Create | `src/components/motion/scroll-reveal.tsx` | Scroll reveal |
| Create | `src/components/motion/page-transition.tsx` | Page transition |
| Edit | Semua komponen | Tambah animasi |

**Verification:**
- [ ] Card entrance: fadeUp + stagger
- [ ] Button hover: scale(1.02)
- [ ] Button tap: scale(0.98)
- [ ] Bottom sheet: slide up animation
- [ ] Scroll reveal di section promo
- [ ] `useReducedMotion` cek berfungsi

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

---

## S7: Polish & Error Handling

**Status:** ⬜
**Goal:** Production-ready quality

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/app/(public)/not-found.tsx` | 404 page |
| Create | `src/app/(public)/error.tsx` | Error boundary |
| Create | `src/app/(public)/loading.tsx` | Route loading |
| Create | `src/components/ui/error-message.tsx` | Error display |
| Edit | Semua komponen | Tambah error handling |

**Verification:**
- [ ] 404 page untuk invalid vehicle ID
- [ ] Error state jika Strapi down
- [ ] Loading state di setiap halaman
- [ ] Graceful fallback untuk missing images
- [ ] `npm run build` tanpa warning

**Log:**
- (diisi saat selesai)

**Issues:**
- (diisi saat ada masalah)

**Notes:**
- (diisi untuk sesi berikutnya)

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
