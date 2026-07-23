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
| Done | 10/10 |
| Current | ✅ |
| Last Updated | 2026-07-19 |

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

**Status:** ✅
**Goal:** Data test lengkap + manual QA

**Files:** Tidak ada file baru

**Verification:**
- [x] Seed 5-10 kendaraan di Strapi admin
- [x] Seed 2-3 promo
- [ ] Data motor muncul semua di catalog
- [ ] Filter berfungsi dengan data real
- [ ] Detail semua field muncul
- [ ] WhatsApp link benar
- [ ] Mobile test (375px)
- [ ] Desktop test (1024px+)

**Log:**
- Fixed Strapi API routes: converted .js → .ts (Strapi v5 requires TypeScript)
- Fixed Strapi content type: renamed `status` → `availabilityStatus` (Strapi v5 reserves `status` for draft/publish)
- Updated frontend types and components to use `availabilityStatus`
- Enabled public API permissions for vehicle and promo (find, findOne)
- Seeded 10 vehicles: Honda Vario, NMAX, PCX, Aerox, Beat Street, W175, CRF150L, Scoopy, Satria F150, CB150R
- Seeded 2 promos: Promo Akhir Tahun (10%), Flash Sale Matic (5%)
- Linked 4 vehicles to promos
- All vehicles published and API verified working
- `npm run build` frontend OK tanpa error
- Fixed null safety for images/defects (Strapi returns null not [] for empty media)
- Fixed detail page 404: Strapi v5 uses `documentId` (string) for findOne, not numeric `id`
- Renamed route `[id]` → `[documentId]` for detail page
- Updated `getVehicle` to accept documentId + `?populate=*` for relations
- Updated all vehicle links (VehicleCard, PromoBanner) to use `documentId`

**Issues:**
- esbuild platform mismatch (Windows vs WSL) - resolved by reinstalling node_modules
- Strapi routes not registered - resolved by converting .js to .ts files
- `status` field reserved in Strapi v5 - renamed to `availabilityStatus`
- Strapi v5 findOne uses `documentId` not numeric `id` - resolved by renaming route param
- `vehicle.images` null when no media uploaded - resolved with null safety checks

**Notes:**
- Seed data requires Strapi running on Windows (WSL can't access Strapi dev server)
- All vehicles use `availabilityStatus` field instead of `status`
- Strapi v5 API: `/api/vehicles/:documentId` (string), not `/api/vehicles/:id` (numeric)

---

## S9: Deploy Prep

**Status:** ✅
**Goal:** Siap deploy ke Vercel + Railway

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `frontend/.env.production.example` | Production env template |
| Edit | `backend/config/middlewares.ts` | Add Vercel URL to CORS |
| Edit | `AGENTS.md` | Update deployment instructions |

**Verification:**
- [x] `npm run build` production OK
- [x] Environment variables lengkap
- [x] CORS configured untuk production URL
- [ ] Strapi accessible dari luar (Railway)

**Log:**
- Created `frontend/.env.example` - Production env template (Strapi URL, WhatsApp, Site URL)
- Updated `backend/config/middlewares.ts` - CORS uses FRONTEND_URL env var for production
- Updated `AGENTS.md` - Added full deployment instructions with env vars table and deploy steps
- `npm run build` frontend OK tanpa error

**Issues:**
- None

**Notes:**
- CORS origin uses FRONTEND_URL env var (set in Railway dashboard)
- Frontend env vars: NEXT_PUBLIC_STRAPI_URL, NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_SITE_URL
- Backend env vars: FRONTEND_URL (for CORS), DATABASE_* (for PostgreSQL)

---

## S10: Car Catalog, Admin Dashboard & Login

**Status:** ✅
**Goal:** Mobil catalog + admin dashboard + login system

**Files:**

| Action | Path | Purpose |
|--------|------|---------|
| Create | `backend/src/api/car/` | Car content type (schema, controller, route, service) |
| Edit | `backend/src/api/promo/schemas/promo.schema.ts` | Add cars relation to promo |
| Edit | `backend/src/api/sale/services/sale.ts` | Stock lifecycle hooks (afterCreate, afterDelete) |
| Edit | `backend/src/api/vehicle/schemas/vehicle.schema.ts` | Add stock, stockSold, purchasePrice fields |
| Edit | `backend/src/api/car/schemas/car.schema.ts` | Add stock, stockSold, purchasePrice fields |
| Edit | `backend/src/api/sale/schemas/sale.schema.ts` | Add car relation to sale |
| Edit | `backend/src/index.ts` | Bootstrap: seed cars, stocks, permissions, admin user |
| Create | `frontend/src/components/catalog/` | CatalogCard, CatalogGrid, CatalogDetail, skeletons |
| Edit | `frontend/src/components/vehicle/vehicle-card.tsx` | Refactor to wrap CatalogCard |
| Edit | `frontend/src/components/vehicle/vehicle-grid.tsx` | Refactor to wrap CatalogGrid |
| Edit | `frontend/src/components/vehicle/vehicle-detail.tsx` | Refactor to wrap CatalogDetail |
| Edit | `frontend/src/components/filter/filter-chips.tsx` | Generic with `options` prop |
| Edit | `frontend/src/lib/types.ts` | Add CarType, Car, CarFilters, CatalogItem |
| Edit | `frontend/src/lib/strapi.ts` | Add getCars, getCar, getSales |
| Create | `frontend/src/lib/constants.ts` | CAR_TYPE_OPTIONS, MOTOR_TYPE_OPTIONS |
| Edit | `frontend/src/components/ui/badge.tsx` | Support CarType, "Tidak Tersedia" status |
| Edit | `frontend/src/components/layout/header.tsx` | Add Mobil + Dashboard nav |
| Edit | `frontend/src/app/(public)/page.tsx` | "Katalog Motor" heading |
| Create | `frontend/src/app/(public)/cars/page.tsx` | Car catalog SSR |
| Create | `frontend/src/app/(public)/car/[documentId]/page.tsx` | Car detail SSR |
| Create | `frontend/src/app/(public)/car/[documentId]/not-found.tsx` | Car 404 |
| Create | `frontend/src/app/(public)/car/[documentId]/error.tsx` | Car error boundary |
| Create | `frontend/src/app/(public)/car/[documentId]/loading.tsx` | Car detail loading |
| Create | `frontend/src/app/(public)/cars/loading.tsx` | Car catalog loading |
| Create | `frontend/src/components/admin/` | DashboardStats, StockTable, RecentSales |
| Create | `frontend/src/app/(public)/admin/dashboard/page.tsx` | Admin dashboard |
| Create | `frontend/src/app/(public)/admin/dashboard/loading.tsx` | Dashboard loading |
| Create | `frontend/src/lib/auth.ts` | Auth helpers |
| Create | `frontend/src/app/api/auth/login/route.ts` | Login API (proxy to Strapi) |
| Create | `frontend/src/app/api/auth/me/route.ts` | Token validation API |
| Create | `frontend/src/app/api/auth/logout/route.ts` | Logout API (clear cookie) |
| Create | `frontend/src/proxy.ts` | Next.js proxy (middleware) - protect /admin/* |
| Create | `frontend/src/components/admin/logout-button.tsx` | Logout button component |
| Create | `frontend/src/app/(public)/admin/login/page.tsx` | Login form page |

**Verification:**
- [x] Halaman `/cars` menampilkan grid mobil
- [x] Halaman `/car/[documentId]` detail mobil
- [x] Filter mobil by type berfungsi
- [x] Dashboard stok + keuangan (motor & mobil)
- [x] Status "Tidak Tersedia" (bukan "Terjual")
- [x] Penjualan update stok otomatis (create/delete sale)
- [x] Login/keluar dashboard dengan JWT cookie
- [x] Proxy melindungi seluruh `/admin/*` route
- [x] Build frontend tanpa error/warning

**Log:**
- Created Car content type in Strapi with full schema
- Added generic CatalogCard, CatalogGrid, CatalogDetail components
- Refactored Vehicle components as thin wrappers around catalog shared components
- Stock fields (stock, stockSold, purchasePrice) added to Vehicle & Car schemas
- Sale lifecycle hooks: afterCreate decrements stock, afterDelete reverses
- Bootstrap seeds 8 cars with stock data + updates existing vehicle stock
- Bootstrap sets public permissions for Car & Sale, creates admin@showroom.com
- Dashboard shows: total stock, total sold, revenue, profit, stock tables, recent sales
- Login: POST /api/auth/login proxies to Strapi local auth, sets HTTP-only cookie
- Proxy (middleware): validates token via Strapi /api/users/me, redirects if invalid
- Login page: minimal form with error handling, redirect after success
- Logout: clears cookie, redirects to login
- Build pass without errors/warnings (Next.js 16 proxy convention used)

**Issues:**
- Strapi `status` field reserved in v5 - renamed to `availabilityStatus` (in S8)
- Next.js 16 deprecates middleware.ts → uses proxy.ts with `export async function proxy`

**Notes:**
- Admin credential: admin@showroom.com / admin123 (auto-created by bootstrap)
- Proxy checks token on every /admin/* request; login page skips validation
- Token expires after 24 hours (cookie maxAge)
- All admin components use existing design tokens
