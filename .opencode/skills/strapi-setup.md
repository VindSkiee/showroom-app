# Skill: Strapi Setup

## Overview

Setup Strapi v5 dengan PostgreSQL untuk backend CMS Showroom E-Catalog Motor.

---

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm atau yarn
- PostgreSQL (local atau Railway)

---

## Installation

### 1. Create Strapi Project

```bash
npx create-strapi@latest backend --quickstart
```

Pilih:
- **Quickstart:** PostgreSQL
- **Database client:** PostgreSQL

### 2. Configure Environment

Edit `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/showroom_db

# Server
HOST=0.0.0.0
PORT=1337

# Security
JWT_SECRET=your-random-jwt-secret-here
API_TOKEN_SALT=your-random-api-token-salt

# App
APP_KEYS=key1,key2,key3,key4
```

### 3. Start Development

```bash
cd backend
npm run develop
```

Akses admin: `http://localhost:1337/admin`

---

## First Admin Setup

1. Buka `http://localhost:1337/admin`
2. Create admin account:
   - First name: Admin
   - Last name: Showroom
   - Email: admin@showroom.com
   - Password: (secure password)
3. Klik "Let's start"

---

## Project Structure

```
backend/
├── src/
│   ├── api/                    # Content Types
│   │   ├── vehicle/
│   │   │   ├── content-types/vehicle/schema.json
│   │   │   ├── controllers/vehicle.ts
│   │   │   ├── routes/vehicle.ts
│   │   │   └── services/vehicle.ts
│   │   ├── sale/
│   │   └── promo/
│   ├── components/             # Reusable Components
│   │   └── defect-item/
│   └── plugins/
├── config/
│   ├── database.ts
│   ├── middlewares.ts
│   └── plugins.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## Essential Configuration

### config/database.ts

```typescript
import path from "path";

export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "showroom"),
      user: env("DATABASE_USERNAME", "strapi"),
      password: env("DATABASE_PASSWORD", "strapi"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
```

### config/middlewares.ts

```typescript
export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
```

### config/plugins.ts

```typescript
export default ({ env }) => ({
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        sizeLimit: 10 * 1024 * 1024, // 10MB
      },
    },
  },
});
```

---

## API Endpoints (Default)

Setelah membuat content type, Strapi otomatis membuat:

```bash
# Vehicles
GET    /api/vehicles          # List
GET    /api/vehicles/:id      # Detail
POST   /api/vehicles          # Create (admin)
PUT    /api/vehicles/:id      # Update (admin)
DELETE /api/vehicles/:id      # Delete (admin)

# Same pattern for Sales and Promos
```

---

## CORS Configuration

Untuk development, allow localhost:

```typescript
// config/middlewares.ts
export default [
  {
    name: "strapi::cors",
    config: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      keepHeaderOnError: true,
    },
  },
  // ... other middlewares
];
```

---

## Deployment (Railway)

### 1. Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial Strapi setup"
git remote add origin https://github.com/youruser/showroom-backend.git
git push -u origin main
```

### 2. Deploy to Railway

1. Login ke `railway.app`
2. New Project → Deploy from GitHub
3. Pilih repository `showroom-backend`
4. Railway akan auto-detect Strapi

### 3. Add PostgreSQL

1. Di Railway dashboard, klik New → Database → PostgreSQL
2. Railway otomatis generate `DATABASE_URL`
3. Copy `DATABASE_URL` ke Environment Variables

### 4. Set Environment Variables

Di Railway, klik service → Variables:

```
DATABASE_URL= (otomatis dari PostgreSQL addon)
HOST=0.0.0.0
PORT=1337
JWT_SECRET= (generate random string)
API_TOKEN_SALT= (generate random string)
APP_KEYS= (generate 4 random strings, comma separated)
NODE_ENV=production
```

### 5. Generate Secrets

```bash
# Jalankan di terminal untuk generate random strings
openssl rand -base64 32  # untuk JWT_SECRET
openssl rand -base64 32  # untuk API_TOKEN_SALT
openssl rand -base64 32  # untuk APP_KEYS (4x)
```

---

## Troubleshooting

### Database Connection Error

```bash
# Cek apakah PostgreSQL running
pg_isready

# Cek DATABASE_URL format
# Format: postgresql://user:password@host:port/database
```

### Port Already in Use

```bash
# Cari process yang using port 1337
lsof -i :1337

# Kill process
kill -9 <PID>
```

### CORS Error

Pastikan frontend URL ada di CORS config:

```typescript
origin: ["http://localhost:3000"]
```

---

## Next Steps

1. Buat Content Types → Lihat `strapi-content-type.md`
2. Seed data motor
3. Test API endpoints
4. Deploy ke Railway
