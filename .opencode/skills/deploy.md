# Skill: Deploy

## Overview

Deploy Showroom E-Catalog Motor ke Vercel (frontend) dan Railway (backend).

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                 Vercel                       │
│  Frontend: Next.js                          │
│  URL: https://showroom-app.vercel.app       │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│                Railway                       │
│  Backend: Strapi v5                         │
│  Database: PostgreSQL                       │
│  URL: https://showroom-api.up.railway.app   │
└─────────────────────────────────────────────┘
```

---

## Step 1: Deploy Backend (Railway)

### 1.1 Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial Strapi setup"
git remote add origin https://github.com/youruser/showroom-backend.git
git push -u origin main
```

### 1.2 Create Railway Project

1. Login ke `railway.app`
2. Klik **New Project**
3. Pilih **Deploy from GitHub**
4. Pilih repository `showroom-backend`
5. Railway akan auto-detect Strapi

### 1.3 Add PostgreSQL

1. Di Railway dashboard, klik **New** → **Database** → **PostgreSQL**
2. Railway otomatis generate `DATABASE_URL`
3. Service akan restart otomatis

### 1.4 Set Environment Variables

Klik service → **Variables** tab → Add:

```env
# Database (otomatis dari PostgreSQL addon)
DATABASE_URL=postgresql://...

# Server
HOST=0.0.0.0
PORT=1337

# Security (generate random strings)
JWT_SECRET=<random-32-chars>
API_TOKEN_SALT=<random-32-chars>
APP_KEYS=<key1>,<key2>,<key3>,<key4>

# Production
NODE_ENV=production
```

### 1.5 Generate Secrets

```bash
# Jalankan di terminal
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # API_TOKEN_SALT
openssl rand -base64 32  # APP_KEYS (4x)
```

### 1.6 Custom Domain (Optional)

1. Di Railway service → **Settings** → **Networking**
2. Klik **Generate Domain**
3. Atau custom domain: tambahkan CNAME record

### 1.7 Verify Deployment

```bash
# Test API
curl https://your-app.up.railway.app/api/vehicles

# Buka admin
https://your-app.up.railway.app/admin
```

---

## Step 2: Deploy Frontend (Vercel)

### 2.1 Push to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial Next.js setup"
git remote add origin https://github.com/youruser/showroom-frontend.git
git push -u origin main
```

### 2.2 Create Vercel Project

1. Login ke `vercel.com`
2. Klik **Add New** → **Project**
3. Import repository `showroom-frontend`
4. Framework: **Next.js** (auto-detected)
5. Root Directory: `./frontend` (if monorepo)

### 2.3 Set Environment Variables

```
NEXT_PUBLIC_STRAPI_URL=https://your-app.up.railway.app
NEXT_PUBLIC_SITE_URL=https://showroom-app.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

### 2.4 Deploy

Klik **Deploy** → Vercel akan build dan deploy otomatis

### 2.5 Custom Domain (Optional)

1. Di Vercel project → **Settings** → **Domains**
2. Tambah custom domain
3. Update DNS records sesuai instruksi

---

## Step 3: Configure CORS

Di Strapi backend, pastikan frontend URL ada di CORS:

```typescript
// backend/config/middlewares.ts
export default [
  {
    name: "strapi::cors",
    config: {
      origin: [
        "http://localhost:3000",
        "https://showroom-app.vercel.app",
        "https://your-custom-domain.com",
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

## Step 4: Seed Data

Setelah deploy, seed data melalui admin panel:

1. Buka `https://your-app.up.railway.app/admin`
2. Login dengan admin credentials
3. Buat content: Vehicles, Promos
4. Upload images
5. Test public API

---

## Environment Variables Summary

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL URL | postgresql://... |
| `HOST` | Server host | 0.0.0.0 |
| `PORT` | Server port | 1337 |
| `JWT_SECRET` | JWT secret | random-32-chars |
| `API_TOKEN_SALT` | API token salt | random-32-chars |
| `APP_KEYS` | App keys | key1,key2,key3,key4 |
| `NODE_ENV` | Environment | production |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Backend URL | https://...up.railway.app |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL | https://...vercel.app |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number | 6281234567890 |

---

## Troubleshooting

### Build Error (Railway)

```bash
# Cek logs di Railway dashboard
# Common issues:
# - Missing environment variables
# - Database connection failed
# - Node.js version mismatch
```

### CORS Error

```bash
# Pastikan frontend URL ada di CORS config
# Railway URL harus HTTPS
# Vercel URL harus HTTPS
```

### Image Not Loading

```bash
# Cek NEXT_PUBLIC_STRAPI_URL
# Pastikan Strapi media URL benar
# Cek CORS untuk images
```

### Deployment Failed (Vercel)

```bash
# Cek build logs
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

---

## Monitoring

### Railway

- Dashboard: `railway.app/dashboard`
- Logs: Real-time logs available
- Metrics: CPU, Memory, Network

### Vercel

- Dashboard: `vercel.com/dashboard`
- Analytics: Web Vitals, Traffic
- Logs: Function logs available

---

## Cost Estimate

### Railway (Free Tier)

- $5 credit/month
- PostgreSQL: ~$1-2/month
- Strapi: ~$1-2/month
- **Total: ~$3-4/month**

### Vercel (Free Tier)

- 100GB bandwidth/month
- Serverless functions
- **Free for hobby projects**

---

## CI/CD (Optional)

### Auto-deploy on Push

Both Vercel and Railway auto-deploy on push to `main` branch.

### Preview Deployments

- Vercel: Auto-generates preview URLs for PRs
- Railway: Manual environment creation

---

## Next Steps

1. Seed data melalui admin panel
2. Test semua API endpoints
3. Test frontend di mobile
4. Monitor performance
5. Setup custom domain
