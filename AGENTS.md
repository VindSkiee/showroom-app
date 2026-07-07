# AGENTS.md - Project Rules

## Development Roadmap

> **WAJIB:** Baca `docs/ROADMAP.md` di awal setiap session baru.
> Cari session dengan status ⬜ atau 🔄, eksekusi, lalu update status ke ✅.

### Cara Kerja Agent

1. Baca `docs/ROADMAP.md`
2. Cari session dengan status ⬜ pertama atau 🔄
3. Baca goal, files, verification
4. Eksekusi semua file
5. Jalankan verification
6. Update status → ✅
7. Isi log, issues, notes
8. Jika semua ✅ → project selesai

---

## Project Overview

**Showroom E-Catalog Motor** - E-Catalog showroom motor dengan CMS Strapi dan frontend Next.js.

- **Design:** Minimalis tapi menarik
- **Prinsip:** Mobile-first, whitespace IS the design
- **Language:** Bahasa Indonesia

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CMS/Admin | Strapi v5 |
| Database | PostgreSQL |
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | motion/react (Framer Motion v12+) |
| Skeleton | phantom-ui |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Code Rules

### Must Follow

1. **Tailwind CSS only** - Tidak ada custom CSS kecuali sangat perlu
2. **Mobile-first** - Desain untuk 375px dulu, lalu scale up
3. **TypeScript typed** - Semua komponen harus punya interface
4. **Error handling** - Handle loading state dan error di setiap API call
5. **Currency format** - `Intl.NumberFormat('id-ID')` untuk Rupiah
6. **Strapi API v5** - REST atau GraphQL
7. **Import motion/react** - BUKAN dari "framer-motion"
8. **motionTokens** - Gunakan tokens untuk semua animasi
9. **phantom-ui** - Untuk semua skeleton loading
10. **useReducedMotion** - Cek sebelum animasi

### Must NOT Do

- ❌ Hardcode URL API, gunakan env variable
- ❌ Skip error handling
- ❌ Buat komponen tanpa TypeScript interface
- ❌ Lupa mobile-first di setiap halaman
- ❌ Import dari "framer-motion"
- ❌ Hardcode animasi values (stiffness, damping, duration)
- ❌ Gunakan shadow pada card (gunakan whitespace)
- ❌ Text < 16px
- ❌ Multiple CTAs per screen
- ❌ Decorative icons (hanya functional)
- ❌ Gradient backgrounds

---

## File Structure

```
showroom-app/
├── backend/              # Strapi CMS
│   ├── src/
│   │   ├── api/
│   │   │   ├── vehicle/  # Content Type: Kendaraan
│   │   │   ├── sale/     # Content Type: Penjualan
│   │   │   └── promo/    # Content Type: Promo
│   │   └── plugins/
│   ├── config/
│   └── .env
├── frontend/             # Next.js App
│   ├── app/
│   │   ├── (public)/     # Public routes
│   │   │   ├── page.tsx  # Homepage/Catalog
│   │   │   ├── vehicle/[id]/ # Detail
│   │   │   └── promo/    # Promo page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/           # Button, Card, Input
│   │   ├── vehicle/      # VehicleCard, VehicleGrid
│   │   ├── filter/       # FilterBar, SearchInput
│   │   ├── layout/       # Header, Footer
│   │   └── promo/        # PromoBanner
│   ├── lib/
│   │   ├── strapi.ts     # Strapi API client
│   │   ├── utils.ts      # Helpers
│   │   └── types.ts      # TypeScript types
│   └── hooks/
│       ├── useVehicles.ts
│       └── useFilters.ts
├── docs/                 # Dokumentasi
│   ├── FLOW_APP.docx
│   ├── DESIGN.md
│   └── API.md
└── .opencode/
    └── skills/           # Agent skills
```

---

## Commands

### Development

```bash
# Backend (Strapi)
cd backend && npm run develop
# Akses: http://localhost:1337/admin

# Frontend (Next.js)
cd frontend && npm run dev
# Akses: http://localhost:3000
```

### Build

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

---

## Content Types

### Vehicle (Kendaraan)

| Field | Type | Description |
|-------|------|-------------|
| name | text | Nama Motor |
| model | text | Model Motor |
| licensePlate | text | Plat Nomor |
| type | enum | matic, manual, sport, cruiser, scoopy |
| price | integer | Harga (Rupiah) |
| year | integer | Tahun |
| documentStatus | enum | complete, incomplete |
| documentNote | text | Catatan surat |
| taxStatus | enum | active, expired, unknown |
| taxExpiryYear | integer | Tahun pajak berlaku |
| taxExpiredFrom | integer | Tahun pajak mati |
| defectStatus | enum | none, minor, major |
| defects | repeatable | DefectItem component |
| images | media | Foto motor (multiple) |
| video | media | Video motor |
| status | enum | available, sold_out |
| promo | relation | Promo terkait |

### Sale (Penjualan)

| Field | Type | Description |
|-------|------|-------------|
| vehicle | relation | Kendaraan terjual |
| saleDate | date | Tanggal Penjualan |
| salePrice | integer | Harga Jual |
| buyerName | text | Nama Pembeli |

### Promo

| Field | Type | Description |
|-------|------|-------------|
| title | text | Judul Promo |
| description | rich text | Deskripsi |
| discount | integer | Diskon (%) |
| banner | media | Banner gambar |
| vehicles | relation | Kendaraan terkait |
| isActive | boolean | Status aktif |

---

## API Endpoints

```bash
# Vehicles
GET /api/vehicles
GET /api/vehicles/:id

# Promos
GET /api/promos?filters[isActive][$eq]=true

# Sales (Admin only)
GET /api/sales
```

See `docs/API.md` for full documentation.

---

## Design Tokens

### Colors

```
--color-bg: #FAFAF9
--color-surface: #F0EFEC
--color-ink: #1C1917
--color-ink-muted: #57534E
--color-accent: #16A34A
```

### Spacing (8px base)

```
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-6: 48px
--space-8: 64px
--space-12: 96px
```

### Typography

```
--text-base: 16px (minimum!)
--text-lg: 20px
--text-xl: 25px
--text-2xl: 31.2px
--text-3xl: 39px
```

See `docs/DESIGN.md` for full design system.

---

## External Skills

| Skill | Purpose |
|-------|---------|
| taste-skill | Anti-slop frontend design |
| impeccable | Production-grade design |
| emilkowalski/skill | Design engineering |
| motion/react | React animations |
| phantom-ui | Skeleton loading |

---

## MCP Servers

| MCP Server | Package | Purpose |
|------------|---------|---------|
| **Context7** | `@upstash/context7-mcp` | Dokumentasi up-to-date untuk semua libraries |
| **Fetch** | `@j0hanz/fetch-url-mcp` | Fetch web content (docs, articles, repos) |
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | Baca/tulis file project |
| **Strapi** | `github:thinhnd028/strapi-mcp-server` | Kelola CMS via natural language |

### MCP Configuration (opencode.json)

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "fetch": {
      "type": "local",
      "command": ["npx", "-y", "@j0hanz/fetch-url-mcp@latest"]
    },
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "strapi": {
      "type": "local",
      "command": ["npx", "-y", "github:thinhnd028/strapi-mcp-server"],
      "environment": {
        "PROJECT_ROOT": "./backend",
        "STRAPI_URL": "http://localhost:1337",
        "STRAPI_TOKEN": "${STRAPI_TOKEN}"
      }
    }
  }
}
```

### Usage

- **Context7**: Tambahkan "use context7" di prompt untuk docs terbaru
- **Fetch**: Fetch documentation atau reference dari URL
- **Filesystem**: Baca/tulis file project
- **Strapi**: Query/manage content melalui natural language

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Bundle | < 500KB |
| Touch target | 48x48px min |
| Body text | 16px min |
| Contrast | 4.5:1 min |

---

## Deployment

- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Railway + PostgreSQL addon
- **Environment:** Production + Preview

See `.opencode/skills/deploy.md` for full guide.
