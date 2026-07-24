# MIGRATION.md — Roadmap Migrasi Strapi v5 → Laravel 11

> **Dokumen ini adalah panduan lengkap untuk migrasi backend dari Strapi v5 ke Laravel 11.**
> **Setiap agent di session lain WAJIB membaca file ini sebelum memulai development.**

---

## Daftar Isi

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Analisis Sistem Saat Ini](#3-analisis-sistem-saat-ini)
4. [Arsitektur Target](#4-arsitektur-target)
5. [Database Schema](#5-database-schema)
6. [API Endpoints](#6-api-endpoints)
7. [Response Format (Mimic Strapi)](#7-response-format-mimic-strapi)
8. [Autentikasi](#8-autentikasi)
9. [Business Logic](#9-business-logic)
10. [Media Handling](#10-media-handling)
11. [Admin Dashboard (Filament)](#11-admin-dashboard-filament)
12. [Perubahan Frontend](#12-perubahan-frontend)
13. [Milestones (Session Goals)](#13-milestones-session-goals)
14. [Struktur File](#14-struktur-file)
15. [Environment Variables](#15-environment-variables)
16. [Testing Checklist](#16-testing-checklist)
17. [Catatan Penting](#17-catatan-penting)

---

## 1. Overview

### Tujuan
Migrasi backend dari Strapi v5 (Node.js Headless CMS) ke Laravel 11 (PHP Framework) untuk memenuhi keharusan dosen, sekaligus menjaga agar frontend Next.js tetap berfungsi tanpa perubahan signifikan.

### Scope Migrasi
| Layer | Saat Ini | Target | Status |
|-------|----------|--------|--------|
| Backend | Strapi v5 | Laravel 11 | **MIGRASI** |
| Database | PostgreSQL (SQLite dev) | MySQL (Laragon) | **MIGRASI** |
| Admin Panel | Strapi CMS | Laravel Filament | **MIGRASI** |
| Frontend | Next.js 14 | Next.js 14 | **TIDAK BERUBAH** (hanya base URL) |
| Deploy Backend | Railway | Railway | **TIDAK BERUBAH** |
| Deploy Frontend | Vercel | Vercel | **TIDAK BERUBAH** |

### Prinsip Pengembangan
1. **Mimic Strapi Response Format** — Agar frontend tidak perlu diubah
2. **Satu Endpoint = Satu Fungsi** — REST API yang jelas
3. **Business Logic di Service Layer** — Bukan di Controller
4. **Migration-Driven** — Database schema dari Strapi, di-convert ke Laravel migrations

---

## 2. Tech Stack

### Backend

| Layer | Technology | Version | Keterangan |
|-------|-----------|---------|------------|
| Framework | Laravel | 11.x | PHP Framework |
| PHP | PHP | 8.2+ | Minimal 8.2 |
| Database | MySQL | 8.0+ | Via Laragon (dev) |
| ORM | Eloquent | Bawaan Laravel | Relational DB |
| Auth | Laravel Sanctum | 4.x | SPA token auth |
| Admin Panel | Laravel Filament | 3.x | Admin dashboard |
| Media Storage | Storage (public disk) | Bawaan Laravel | File uploads |
| API Style | REST | - | JSON response |
| Package Manager | Composer | - | PHP dependencies |

### Composer Packages

```bash
composer require laravel/framework:^11.0
composer require laravel/sanctum:^4.0
composer require laravel/filament:^3.0
composer require spatie/laravel-query-builder:^5.0
```

### Frontend (Tidak Berubah)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 14+ (App Router) |
| React | React | 19.x |
| TypeScript | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Animation | motion/react | 12.x |
| Icons | Lucide React | 1.x |

---

## 3. Analisis Sistem Saat Ini

### 3.1 Strapi Content Types

#### Vehicle (Collection: `vehicles`)

| Field | Type | Required | Default | Enum Values |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | - | - |
| `model` | string | Yes | - | - |
| `licensePlate` | string | Yes | - | - |
| `type` | enum | Yes | - | `matic`, `manual`, `sport`, `cruiser`, `scoopy` |
| `price` | integer | Yes | - | min: 0 |
| `year` | integer | Yes | - | min: 1990, max: 2030 |
| `documentStatus` | enum | No | `complete` | `complete`, `incomplete` |
| `documentNote` | text | No | - | - |
| `taxStatus` | enum | No | `unknown` | `active`, `expired`, `unknown` |
| `taxExpiryYear` | integer | No | - | min: 2020, max: 2030 |
| `taxExpiredFrom` | integer | No | - | min: 2020, max: 2030 |
| `defectStatus` | enum | No | `none` | `none`, `minor`, `major` |
| `availabilityStatus` | enum | No | `available` | `available`, `sold_out` |
| `stock` | integer | Yes | `1` | min: 0 |
| `stockSold` | integer | No | `0` | min: 0 |
| `purchasePrice` | integer | No | - | min: 0 |
| `defects` | component[] | No | - | repeatable: defect-item |
| `images` | media | No | - | multiple, images only |
| `video` | media | No | - | single, videos only |
| `promo` | relation | No | - | manyToOne → Promo |
| `sales` | relation | No | - | oneToMany → Sale |

#### Car (Collection: `cars`)

| Field | Type | Required | Default | Enum Values |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | - | - |
| `model` | string | Yes | - | - |
| `licensePlate` | string | Yes | - | - |
| `type` | enum | Yes | - | `suv`, `sedan`, `mpv`, `hatchback`, `sport`, `lcgc`, `pickup`, `matic`, `manual` |
| `price` | integer | Yes | - | min: 0 |
| `year` | integer | Yes | - | min: 1990, max: 2030 |
| `documentStatus` | enum | No | `complete` | `complete`, `incomplete` |
| `documentNote` | text | No | - | - |
| `taxStatus` | enum | No | `unknown` | `active`, `expired`, `unknown` |
| `taxExpiryYear` | integer | No | - | min: 2020, max: 2030 |
| `taxExpiredFrom` | integer | No | - | min: 2020, max: 2030 |
| `defectStatus` | enum | No | `none` | `none`, `minor`, `major` |
| `availabilityStatus` | enum | No | `available` | `available`, `sold_out` |
| `stock` | integer | Yes | `1` | min: 0 |
| `stockSold` | integer | No | `0` | min: 0 |
| `purchasePrice` | integer | No | - | min: 0 |
| `defects` | component[] | No | - | repeatable: defect-item |
| `images` | media | No | - | multiple, images only |
| `video` | media | No | - | single, videos only |
| `promo` | relation | No | - | manyToOne → Promo |
| `sales` | relation | No | - | oneToMany → Sale |

#### Sale (Collection: `sales`)

| Field | Type | Required | Draft/Publish |
|-------|------|----------|---------------|
| `saleDate` | date | Yes | No |
| `salePrice` | integer | Yes | No |
| `buyerName` | string | No | No |
| `quantity` | integer | No | No |
| `vehicle` | relation | No | manyToOne → Vehicle |
| `car` | relation | No | manyToOne → Car |

#### Promo (Collection: `promos`)

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | Yes | - |
| `description` | richtext | No | - |
| `discount` | integer | Yes | min: 0, max: 100 |
| `isActive` | boolean | No | `true` |
| `banner` | media | No | single, images only |
| `vehicles` | relation | No | oneToMany → Vehicle |
| `cars` | relation | No | oneToMany → Car |

#### DefectItem (Component)

| Field | Type | Required |
|-------|------|----------|
| `part` | string | Yes |
| `description` | text | Yes |
| `images` | media | No (max 3, images only) |

### 3.2 Relasi Antar Tabel

```
Promo (1) ────────< (N) Vehicle
Promo (1) ────────< (N) Car
Vehicle (1) ──────< (N) Sale
Car (1) ───────────< (N) Sale
Vehicle (1) ──────< (N) DefectItem
Car (1) ───────────< (N) DefectItem
Vehicle (1) ──────< (N) VehicleImage
Car (1) ───────────< (N) CarImage
```

### 3.3 Strapi Query Parameters

| Parameter | Syntax | Contoh |
|-----------|--------|--------|
| Populate | `populate=*` | `?populate=*` |
| Filter eq | `filters[field][$eq]=val` | `?filters[type][$eq]=matic` |
| Filter contains | `filters[name][$containsi]=val` | `?filters[name][$containsi]=honda` |
| Filter gte | `filters[price][$gte]=val` | `?filters[price][$gte]=10000000` |
| Filter lte | `filters[price][$lte]=val` | `?filters[price][$lte]=50000000` |
| Sort | `sort=field:direction` | `?sort=price:desc` |
| Pagination | `pagination[page]=N&pagination[pageSize]=N` | `?pagination[page]=1&pagination[pageSize]=20` |

### 3.4 Frontend API Calls (15 endpoints)

| # | Method | Endpoint | Auth | Called By | Response |
|---|--------|----------|------|-----------|----------|
| 1 | GET | `/api/vehicles?populate=*{filters}` | No (SSR) | Homepage | StrapiResponse |
| 2 | GET | `/api/vehicles/:id?populate=*` | No (SSR) | Vehicle Detail | StrapiSingle |
| 3 | GET | `/api/cars?populate=*{filters}` | No (SSR) | Cars Page | StrapiResponse |
| 4 | GET | `/api/cars/:id?populate=*` | No (SSR) | Car Detail | StrapiSingle |
| 5 | GET | `/api/promos?filters[isActive][$eq]=true&populate=*` | No (SSR) | (unused) | StrapiResponse |
| 6 | GET | `/api/vehicles?pagination[pageSize]=100` | Cookie | Dashboard | StrapiResponse |
| 7 | GET | `/api/cars?pagination[pageSize]=100` | Cookie | Dashboard | StrapiResponse |
| 8 | GET | `/api/sales?populate=vehicle,car{filters}` | Cookie | Dashboard | StrapiResponse |
| 9 | POST | `/api/sales` | Cookie | StockUpdateModal | StrapiSingle |
| 10 | PUT | `/api/vehicles/:id` | Cookie | StockUpdateModal | StrapiSingle |
| 11 | PUT | `/api/cars/:id` | Cookie | StockUpdateModal | StrapiSingle |
| 12 | POST | `/api/auth/login` | No | Admin Login | JWT |
| 13 | POST | `/api/auth/logout` | No | Logout Button | OK |
| 14 | GET | `/api/auth/me` | Cookie | Auth Check | User |
| 15 | POST | `/api/upload` | Cookie | Media Upload | File[] |

### 3.5 Business Logic: Sale Lifecycle

**Saat Sale dibuat (afterCreate):**
1. Find related Vehicle atau Car
2. Decrement `stock` by 1
3. Increment `stockSold` by 1
4. Jika `stock` = 0, set `availabilityStatus` = `"sold_out"`

**Saat Sale dihapus (afterDelete):**
1. Find related Vehicle atau Car
2. Increment `stock` by 1
3. Decrement `stockSold` by 1
4. Set `availabilityStatus` = `"available"`

---

## 4. Arsitektur Target

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Homepage    │  │  Cars Page   │  │   Admin Dashboard      │ │
│  │   (SSR)      │  │  (SSR)       │  │   (Client-side)        │ │
│  │              │  │              │  │                        │ │
│  │ getVehicles()│  │ getCars()    │  │  /api/vehicles         │ │
│  └──────┬───────┘  └──────┬───────┘  │  /api/cars             │ │
│         │                 │          │  /api/sales             │ │
│         │ direct SSR      │          │  /api/auth/*            │ │
│         │                 │          └───────────┬────────────┘ │
│         │                 │                      │ BFF proxy    │
│         ▼                 ▼                      ▼              │
│  ┌──────────────────────────────────────────────────────────────┐
│  │                    lib/strapi.ts                              │
│  │                    app/api/* (BFF Routes)                     │
│  └─────────────────────────────┬────────────────────────────────┘
│                                │                                 │
│         NEXT_PUBLIC_STRAPI_URL │ http://localhost:8000            │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND (Laravel 11)                            │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  routes/api.php  │  │ Controllers  │  │  Filament Admin    │ │
│  │                  │  │              │  │  /admin            │ │
│  │  GET /vehicles   │  │ VehicleCtrl  │  │                    │ │
│  │  GET /cars       │  │ CarCtrl      │  │  VehicleResource   │ │
│  │  POST /sales     │  │ SaleCtrl     │  │  CarResource       │ │
│  │  POST /auth/*    │  │ AuthCtrl     │  │  SaleResource      │ │
│  │  POST /upload    │  │ UploadCtrl   │  │  PromoResource     │ │
│  └────────┬─────────┘  └──────┬───────┘  └─────────┬──────────┘ │
│           │                   │                     │            │
│           ▼                   ▼                     ▼            │
│  ┌──────────────────────────────────────────────────────────────┐
│  │                    Eloquent Models                            │
│  │  Vehicle, Car, Sale, Promo, DefectItem, User                  │
│  │  + SaleService (business logic)                               │
│  └─────────────────────────────┬────────────────────────────────┘
│                                │                                 │
│                                ▼                                 │
│  ┌──────────────────────────────────────────────────────────────┐
│  │                      MySQL Database                           │
│  │  vehicles, cars, sales, promos, defect_items, users           │
│  │  + media tables (vehicle_images, car_images, etc.)            │
│  └──────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Database Schema

### 5.1 users table (bawaan Laravel)

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.2 promos table

```sql
CREATE TABLE promos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    discount SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    banner_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.3 vehicles table

```sql
CREATE TABLE vehicles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(255) NOT NULL,
    type ENUM('matic','manual','sport','cruiser','scoopy') NOT NULL,
    price BIGINT UNSIGNED NOT NULL,
    year SMALLINT UNSIGNED NOT NULL,
    document_status ENUM('complete','incomplete') DEFAULT 'complete',
    document_note TEXT NULL,
    tax_status ENUM('active','expired','unknown') DEFAULT 'unknown',
    tax_expiry_year SMALLINT UNSIGNED NULL,
    tax_expired_from SMALLINT UNSIGNED NULL,
    defect_status ENUM('none','minor','major') DEFAULT 'none',
    availability_status ENUM('available','sold_out') DEFAULT 'available',
    stock INT UNSIGNED NOT NULL DEFAULT 1,
    stock_sold INT UNSIGNED DEFAULT 0,
    purchase_price BIGINT UNSIGNED NULL,
    promo_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promo_id) REFERENCES promos(id) ON DELETE SET NULL
);
```

### 5.4 cars table

```sql
CREATE TABLE cars (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(255) NOT NULL,
    type ENUM('suv','sedan','mpv','hatchback','sport','lcgc','pickup','matic','manual') NOT NULL,
    price BIGINT UNSIGNED NOT NULL,
    year SMALLINT UNSIGNED NOT NULL,
    document_status ENUM('complete','incomplete') DEFAULT 'complete',
    document_note TEXT NULL,
    tax_status ENUM('active','expired','unknown') DEFAULT 'unknown',
    tax_expiry_year SMALLINT UNSIGNED NULL,
    tax_expired_from SMALLINT UNSIGNED NULL,
    defect_status ENUM('none','minor','major') DEFAULT 'none',
    availability_status ENUM('available','sold_out') DEFAULT 'available',
    stock INT UNSIGNED NOT NULL DEFAULT 1,
    stock_sold INT UNSIGNED DEFAULT 0,
    purchase_price BIGINT UNSIGNED NULL,
    promo_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promo_id) REFERENCES promos(id) ON DELETE SET NULL
);
```

### 5.5 sales table

```sql
CREATE TABLE sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE NOT NULL,
    sale_price BIGINT UNSIGNED NOT NULL,
    buyer_name VARCHAR(255) NULL,
    quantity INT UNSIGNED DEFAULT 1,
    vehicle_id BIGINT UNSIGNED NULL,
    car_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
);
```

### 5.6 defect_items table

```sql
CREATE TABLE defect_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED NULL,
    car_id BIGINT UNSIGNED NULL,
    part VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
```

### 5.7 Media tables

```sql
CREATE TABLE vehicle_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE car_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_videos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    video_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE car_videos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT UNSIGNED NOT NULL,
    video_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE TABLE defect_item_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    defect_item_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (defect_item_id) REFERENCES defect_items(id) ON DELETE CASCADE
);
```

---

## 6. API Endpoints

### 6.1 Public Routes

```php
// routes/api.php — Public (no auth)
Route::prefix('api')->group(function () {
    // Vehicles
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{id}', [VehicleController::class, 'show']);

    // Cars
    Route::get('/cars', [CarController::class, 'index']);
    Route::get('/cars/{id}', [CarController::class, 'show']);

    // Promos
    Route::get('/promos', [PromoController::class, 'index']);

    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);
});
```

### 6.2 Protected Routes (Auth Required)

```php
// routes/api.php — Protected (auth:sanctum)
Route::prefix('api')->middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Vehicles CRUD
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

    // Cars CRUD
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{id}', [CarController::class, 'update']);
    Route::delete('/cars/{id}', [CarController::class, 'destroy']);

    // Sales
    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::delete('/sales/{id}', [SaleController::class, 'destroy']);

    // Upload
    Route::post('/upload', [UploadController::class, 'store']);
});
```

### 6.3 Query Parameters Implementation

| Strapi Syntax | Laravel Implementation |
|--------------|----------------------|
| `populate=*` | Eloquent `with()` (eager loading) |
| `filters[type][$eq]=matic` | `where('type', 'matic')` |
| `filters[name][$containsi]=honda` | `where('name', 'LIKE', '%honda%')` |
| `filters[price][$gte]=10000000` | `where('price', '>=', 10000000)` |
| `filters[price][$lte]=50000000` | `where('price', '<=', 50000000)` |
| `filters[promo][$notNull]=true` | `whereNotNull('promo_id')` |
| `sort=price:desc` | `orderBy('price', 'desc')` |
| `pagination[page]=1&pagination[pageSize]=20` | `paginate(20, ['*'], 'page', 1)` |

---

## 7. Response Format (Mimic Strapi)

### 7.1 List Response

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "a1b2c3d4e5f6",
      "name": "Honda Beat",
      "model": "CBS",
      "licensePlate": "D 1234 AB",
      "type": "matic",
      "price": 18000000,
      "year": 2023,
      "documentStatus": "complete",
      "documentNote": null,
      "taxStatus": "active",
      "taxExpiryYear": 2028,
      "taxExpiredFrom": null,
      "defectStatus": "none",
      "availabilityStatus": "available",
      "stock": 5,
      "stockSold": 2,
      "purchasePrice": 14000000,
      "createdAt": "2026-01-15T08:30:00.000Z",
      "updatedAt": "2026-07-20T10:15:00.000Z",
      "promo": {
        "id": 1,
        "documentId": "x1y2z3",
        "title": "Promo Lebaran",
        "description": "Diskon spesial...",
        "discount": 10,
        "isActive": true,
        "banner": {
          "id": 1,
          "url": "/uploads/promo-banner.jpg",
          "name": "promo-banner.jpg"
        }
      },
      "images": [
        {
          "id": 1,
          "url": "/uploads/vehicles/beat-1.jpg",
          "name": "beat-1.jpg",
          "mime": "image/jpeg",
          "size": 204800
        }
      ],
      "video": null,
      "defects": []
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 3,
      "total": 55
    }
  }
}
```

### 7.2 Single Response

```json
{
  "data": {
    "id": 1,
    "documentId": "a1b2c3d4e5f6",
    "name": "Honda Beat",
    ...
  }
}
```

### 7.3 Document ID

Strapi menggunakan `documentId` (UUID-like string) sebagai identifier. Laravel bisa mimic ini dengan:
- Hash dari `id` menggunakan `Hashids` atau `intval base_convert`
- Atau tambah kolom `document_id` UUID di migration

**Rekomendasi:** Pakai `Hashids` package untuk generate documentId dari numeric id.

```php
// Contoh: VehicleResource
public function toArray($request): array
{
    return [
        'id' => $this->id,
        'documentId' => Hashids::encode($this->id),
        // ... sisa fields
    ];
}
```

### 7.4 Resource Class Pattern

```php
// app/Http/Resources/VehicleResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'documentId' => $this->document_id_hash,
            'name' => $this->name,
            'model' => $this->model,
            'licensePlate' => $this->license_plate,
            'type' => $this->type,
            'price' => (int) $this->price,
            'year' => (int) $this->year,
            'documentStatus' => $this->document_status,
            'documentNote' => $this->document_note,
            'taxStatus' => $this->tax_status,
            'taxExpiryYear' => $this->tax_expiry_year ? (int) $this->tax_expiry_year : null,
            'taxExpiredFrom' => $this->tax_expired_from ? (int) $this->tax_expired_from : null,
            'defectStatus' => $this->defect_status,
            'availabilityStatus' => $this->availability_status,
            'stock' => (int) $this->stock,
            'stockSold' => (int) $this->stock_sold,
            'purchasePrice' => $this->purchase_price ? (int) $this->purchase_price : null,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'promo' => new PromoResource($this->whenLoaded('promo')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'video' => new VideoResource($this->whenLoaded('video')),
            'defects' => DefectItemResource::collection($this->whenLoaded('defects')),
            'sales' => SaleResource::collection($this->whenLoaded('sales')),
        ];
    }
}
```

---

## 8. Autentikasi

### 8.1 Login Flow

```
Frontend                    Laravel                     MySQL
   │                          │                           │
   │ POST /api/auth/login     │                           │
   │ { email, password }      │                           │
   │ ───────────────────────> │                           │
   │                          │ SELECT * FROM users       │
   │                          │ WHERE email = ?           │
   │                          │ ───────────────────────>  │
   │                          │ <───────────────────────  │
   │                          │ Verify password (Hash)    │
   │                          │ Generate Sanctum token    │
   │ { jwt, user }            │                           │
   │ <─────────────────────── │                           │
   │                          │                           │
   │ Set cookie: token        │                           │
   │                          │                           │
   │ GET /api/vehicles        │                           │
   │ Authorization: Bearer x  │                           │
   │ ───────────────────────> │                           │
   │                          │ Verify token              │
   │ { data, meta }           │                           │
   │ <─────────────────────── │                           │
```

### 8.2 Login Controller

```php
// app/Http/Controllers/Api/AuthController.php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'jwt' => $token,
        'user' => [
            'id' => $user->id,
            'username' => $user->name,
            'email' => $user->email,
        ]
    ]);
}
```

### 8.3 Default Admin User

```php
// database/seeders/AdminSeeder.php
User::create([
    'name' => 'Admin',
    'email' => 'admin@showroom.com',
    'password' => Hash::make('admin123'),
]);
```

---

## 9. Business Logic

### 9.1 SaleService.php

```php
// app/Services/SaleService.php
namespace App\Services;

use App\Models\{Vehicle, Car, Sale};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleService
{
    /**
     * Create a new sale and update stock
     */
    public function createSale(array $data): Sale
    {
        DB::beginTransaction();

        try {
            // 1. Find the related vehicle or car
            $item = null;
            $itemType = null;

            if (!empty($data['vehicle_id'])) {
                $item = Vehicle::findOrFail($data['vehicle_id']);
                $itemType = 'vehicle';
            } elseif (!empty($data['car_id'])) {
                $item = Car::findOrFail($data['car_id']);
                $itemType = 'car';
            }

            if (!$item) {
                throw new \Exception('Vehicle or Car must be specified');
            }

            // 2. Create sale record
            $sale = Sale::create([
                'sale_date' => $data['sale_date'] ?? now()->toDateString(),
                'sale_price' => $data['sale_price'],
                'buyer_name' => $data['buyer_name'] ?? null,
                'quantity' => $data['quantity'] ?? 1,
                'vehicle_id' => $data['vehicle_id'] ?? null,
                'car_id' => $data['car_id'] ?? null,
            ]);

            // 3. Update stock
            $quantity = $data['quantity'] ?? 1;
            $item->stock = max(0, $item->stock - $quantity);
            $item->stock_sold = $item->stock_sold + $quantity;

            // 4. Update availability status
            if ($item->stock <= 0) {
                $item->availability_status = 'sold_out';
            }

            $item->save();

            DB::commit();

            Log::info("Sale created: ID {$sale->id}, {$itemType} ID {$item->id}, stock updated: {$item->stock}");

            return $sale->load($itemType);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Sale creation failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a sale and rollback stock
     */
    public function deleteSale(Sale $sale): void
    {
        DB::beginTransaction();

        try {
            // Find the related item
            $item = $sale->vehicle ?? $sale->car;
            $itemType = $sale->vehicle ? 'vehicle' : 'car';

            if ($item) {
                $quantity = $sale->quantity ?? 1;
                $item->stock = $item->stock + $quantity;
                $item->stock_sold = max(0, $item->stock_sold - $quantity);
                $item->availability_status = 'available';
                $item->save();

                Log::info("Stock rollback: {$itemType} ID {$item->id}, new stock: {$item->stock}");
            }

            $sale->delete();

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Sale deletion failed: " . $e->getMessage());
            throw $e;
        }
    }
}
```

---

## 10. Media Handling

### 10.1 Upload Controller

```php
// app/Http/Controllers/Api/UploadController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'file|mimes:jpg,jpeg,png,gif,webp,mp4|max:10240',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('uploads', 'public');

            $uploadedFiles[] = [
                'id' => uniqid(),
                'name' => $file->getClientOriginalName(),
                'url' => '/storage/' . $path,
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
                'width' => null,
                'height' => null,
            ];
        }

        return response()->json($uploadedFiles);
    }
}
```

### 10.2 Storage Setup

```bash
# Buat symbolic link untuk public access
php artisan storage:link

# Struktur storage
storage/app/public/
└── uploads/
    ├── vehicles/
    ├── cars/
    ├── promos/
    └── defect-items/
```

---

## 11. Admin Dashboard (Filament)

### 11.1 Setup

```bash
composer require filament/filament:"^3.0"
php artisan filament:install --panels

# Buat Resources
php artisan make:filament-resource Vehicle --generate
php artisan make:filament-resource Car --generate
php artisan make:filament-resource Sale --generate
php artisan make:filament-resource Promo --generate
```

### 11.2 Filament Resources

```
app/Filament/Resources/
├── VehicleResource.php
│   ├── Pages/
│   │   ├── ListVehicles.php
│   │   ├── CreateVehicle.php
│   │   └── EditVehicle.php
├── CarResource.php
│   ├── Pages/
│   │   ├── ListCars.php
│   │   ├── CreateCar.php
│   │   └── EditCar.php
├── SaleResource.php
│   ├── Pages/
│   │   ├── ListSales.php
│   │   └── CreateSale.php
└── PromoResource.php
    ├── Pages/
    │   ├── ListPromos.php
    │   ├── CreatePromo.php
    │   └── EditPromo.php
```

### 11.3 Filament Access

- **URL:** `http://localhost:8000/admin`
- **Login:** `admin@showroom.com` / `admin123`

---

## 12. Perubahan Frontend

### 12.1 Environment Variables

```env
# .env (Next.js frontend) — HANYA GANTI INI
NEXT_PUBLIC_STRAPI_URL=http://localhost:8000
```

### 12.2 API Client

```typescript
// src/lib/strapi.ts
// Base URL sudah menggunakan env variable, tidak perlu ubah
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:8000';
```

### 12.3 Yang TIDAK Berubah

- ✅ Semua page.tsx (Server Components)
- ✅ Semua component files
- ✅ Semua hooks (useFilters.ts)
- ✅ Semua types (lib/types.ts)
- ✅ Semua utility functions (lib/utils.ts)
- ✅ Semua motion components
- ✅ Semua catalog components
- ✅ WhatsApp integration

---

## 13. Milestones (Session Goals)

> **SETIAP MILESTONE = 1 SESSION GOAL**
> Agent harus menyelesaikan SEMUA tasks dalam milestone sebelum lanjut ke milestone berikutnya.
> Setelah selesai, centang semua checkbox dan tandai milestone sebagai `[✅ COMPLETED]`.

---

### MILESTONE 1: Project Setup & Database
**Status:** ✅ COMPLETED
**Goal:** Laravel project bisa jalan dengan database MySQL dan semua migration berhasil dijalankan.

**Tasks:**
- [ ] Buat Laravel project baru: `composer create-project laravel/laravel backend-laravel`
- [ ] Install packages: `composer require laravel/sanctum laravel/filament spatie/laravel-query-builder`
- [ ] Konfigurasi MySQL connection di `.env`
- [ ] Buat migration files sesuai schema di Section 5 (9 migration files)
- [ ] Jalankan `php artisan migrate:fresh`
- [ ] Buat Eloquent Models (Vehicle, Car, Sale, Promo, DefectItem)
- [ ] Setup relationships di Models (belongsTo, hasMany, etc.)
- [ ] Buat DatabaseSeeder dengan sample data (5 vehicles, 5 cars, 2 promos)
- [ ] Jalankan `php artisan db:seed`
- [ ] Verifikasi via `php artisan tinker`

**Verification:**
```bash
php artisan migrate:fresh --seed
php artisan tinker
>>> App\Models\Vehicle::count()  # Expected: 5
>>> App\Models\Car::count()      # Expected: 5
>>> App\Models\Promo::count()    # Expected: 2
```

**Deliverable:** Laravel project berjalan, database terisi, semua model berfungsi.

---

### MILESTONE 2: API Controllers & Response Format
**Status:** ✅ COMPLETED
**Goal:** Semua public API endpoints berfungsi dan response format mimic Strapi.

**Tasks:**
- [ ] Buat `VehicleController.php` (index, show, store, update, destroy)
- [ ] Buat `CarController.php` (index, show, store, update, destroy)
- [ ] Buat `SaleController.php` (index, store, destroy)
- [ ] Buat `PromoController.php` (index)
- [ ] Buat Resource classes (VehicleResource, CarResource, SaleResource, PromoResource, DefectItemResource)
- [ ] Implement query parameter parsing (filters, sort, populate, pagination)
- [ ] Implement Strapi response format {data, meta.pagination}
- [ ] Buat `routes/api.php` dengan semua endpoints
- [ ] Test semua endpoints via Postman/curl

**Verification:**
```bash
# Public endpoints — harus return format Strapi
curl http://localhost:8000/api/vehicles
curl http://localhost:8000/api/vehicles/1?populate=*
curl http://localhost:8000/api/cars
curl http://localhost:8000/api/promos

# Filter test
curl "http://localhost:8000/api/vehicles?type=matic"
curl "http://localhost:8000/api/vehicles?sort=price:desc"
curl "http://localhost:8000/api/vehicles?pagination[page]=1&pagination[pageSize]=2"

# Response harus: { "data": [...], "meta": { "pagination": {...} } }
```

**Deliverable:** Semua API endpoints berfungsi dengan format response yang benar.

---

### MILESTONE 3: Autentikasi (Breeze API + Sanctum)
**Status:** ✅ COMPLETED
**Goal:** Production-ready auth dengan rate limiting, token expiration, password reset.

**Stack:** Laravel Breeze API + Sanctum (token-based for BFF pattern)

**Tasks:**
- [x] Install Laravel Breeze API: `composer require laravel/breeze && php artisan breeze:install api`
- [x] Konfigurasi Sanctum (`config/sanctum.php`) — expiration: 1440 menit (24 jam)
- [x] Buat `AuthenticatedSessionController.php` — login (return `{ jwt, user }`), logout (revoke token)
- [x] Buat `RegisteredUserController.php` — register (return `{ jwt, user }`)
- [x] Buat `CurrentUserController.php` — `/api/user` dan `/api/auth/me` (return `{ authenticated, user }`)
- [x] Buat `NewPasswordController.php` — forgot-password dan reset-password
- [x] Rate limiting: login 5/menit, register 3/menit, password 3/menit
- [x] Brute force protection: `ensureIsNotRateLimited()` + Lockout event
- [x] User model: `HasApiTokens`, `$fillable`, `$hidden`, password hashing
- [x] AdminSeeder (admin@showroom.com / admin123)
- [x] Custom JSON error responses (401, 422, 403, 404)
- [x] Update frontend BFF routes (`/api/login`, `/api/user`, `/api/logout`)

**API Routes (16 endpoints):**
```
POST /api/login              → { jwt, user }
POST /api/register           → { jwt, user }
POST /api/logout             → { ok: true }
GET  /api/user               → { authenticated, user }
GET  /api/auth/me            → { authenticated, user } (alias)
POST /api/forgot-password    → { message }
POST /api/reset-password     → { message }
GET  /api/vehicles           → StrapiResponse
GET  /api/vehicles/{id}      → StrapiSingle
GET  /api/cars               → StrapiResponse
GET  /api/cars/{id}          → StrapiSingle
GET  /api/promos             → StrapiResponse
GET  /api/sales              → StrapiResponse (protected)
POST /api/sales              → StrapiSingle (protected)
DELETE /api/sales/{id}       → OK (protected)
POST /api/upload             → File[] (protected)
```

**Verification:**
```bash
# Login (rate limited: 5 attempts/min)
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@showroom.com","password":"admin123"}'
# → { "jwt": "...", "user": { "id": 1, "username": "Admin", "email": "..." } }

# Wrong password → 422
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@showroom.com","password":"wrong"}'
# → { "message": "Validation failed", "errors": { "email": ["..."] } }

# No token → 401
curl http://localhost:8000/api/user
# → { "error": "Unauthenticated" }

# With token → 200
curl http://localhost:8000/api/user -H "Authorization: Bearer {token}"
# → { "authenticated": true, "user": { ... } }

# Rate limit hit → 429
# After 5 wrong attempts: { "message": "Too Many Attempts." }
```

**Security Features:**
- ✅ Rate limiting (Breeze `LoginRequest`)
- ✅ Brute force lockout (5 attempts → lockout)
- ✅ Token expiration (24h)
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ CSRF protection (stateful API middleware)
- ✅ Sanctum token revocation on logout
- ✅ JSON error responses (no stack traces in production)
- ✅ Filament admin panel (session-based, separate from API tokens)

**Deliverable:** Production-ready auth: login, register, logout, me, password reset, rate limiting.

---

### MILESTONE 4: Business Logic & Sale Service
**Status:** ✅ COMPLETED
**Goal:** Sale creation otomatis decrement stock, sale deletion increment stock.

**Tasks:**
- [ ] Buat `SaleService.php` di `app/Services/`
- [ ] Implement `createSale()` dengan DB transaction + stock decrement
- [ ] Implement `deleteSale()` dengan stock rollback
- [ ] Integrasikan SaleService ke SaleController
- [ ] Test: buat sale → stock berkurang
- [ ] Test: hapus sale → stock bertambah
- [ ] Test: stock habis → availabilityStatus = "sold_out"

**Verification:**
```bash
# Check initial stock
curl http://localhost:8000/api/vehicles/1
# Expected: stock: 5

# Create sale (dengan auth token)
curl -X POST http://localhost:8000/api/sales \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id":1,"sale_price":18000000}'

# Check stock after sale
curl http://localhost:8000/api/vehicles/1
# Expected: stock: 4, stockSold: 1

# Delete sale
curl -X DELETE http://localhost:8000/api/sales/1 \
  -H "Authorization: Bearer {token}"

# Check stock after deletion
curl http://localhost:8000/api/vehicles/1
# Expected: stock: 5, stockSold: 0
```

**Deliverable:** Sale lifecycle berfungsi: create → stock down, delete → stock up.

---

### MILESTONE 5: Media Upload
**Status:** ✅ COMPLETED
**Goal:** Upload images dan videos berfungsi, file bisa diakses via URL.

**Tasks:**
- [ ] Buat `UploadController.php`
- [ ] Konfigurasi storage disk (public)
- [ ] Buat media tables migrations
- [ ] Buat `php artisan storage:link`
- [ ] Implement upload endpoint
- [ ] Test upload file
- [ ] Test akses file via `/storage/{path}`

**Verification:**
```bash
# Upload image
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer {token}" \
  -F "files=@test-image.jpg"

# Expected: [{ "id": "...", "url": "/storage/uploads/...jpg", ... }]

# Akses file
curl -I http://localhost:8000/storage/uploads/...jpg
# Expected: HTTP 200, Content-Type: image/jpeg
```

**Deliverable:** Media upload dan serving berfungsi.

---

### MILESTONE 6: Filament Admin Panel
**Status:** ✅ COMPLETED
**Goal:** Admin panel berfungsi untuk CRUD semua content types.

**Tasks:**
- [ ] Install Filament: `composer require filament/filament`
- [ ] Jalankan `php artisan filament:install --panels`
- [ ] Buat VehicleResource dengan form & table
- [ ] Buat CarResource dengan form & table
- [ ] Buat SaleResource dengan form & table
- [ ] Buat PromoResource dengan form & table
- [ ] Konfigurasi form fields sesuai schema
- [ ] Konfigurasi table columns
- [ ] Test semua CRUD operations via Filament

**Verification:**
- [ ] Buka `http://localhost:8000/admin` → Login berhasil
- [ ] Bisa list, create, edit, delete Vehicles
- [ ] Bisa list, create, edit, delete Cars
- [ ] Bisa list, create, delete Sales
- [ ] Bisa list, create, edit, delete Promos
- [ ] Upload gambar via Filament berfungsi

**Deliverable:** Admin panel lengkap dan berfungsi.

---

### MILESTONE 7: Frontend Integration
**Status:** ✅ COMPLETED
**Goal:** Frontend Next.js bisa connect ke Laravel backend dan semua halaman berfungsi.

**Tasks:**
- [x] Update `.env` frontend: `NEXT_PUBLIC_STRAPI_URL=http://localhost:8000`
- [x] Update BFF auth routes (`/api/login`, `/api/user`, `/api/logout`)
- [x] Update BFF vehicles/cars/sales routes to forward token + simplified format
- [x] Fix `lib/auth.ts` fallback port to 8000
- [x] Fix `strapi.ts` fallback port to 8000
- [x] Fix `next.config.ts` — port 8000, `/storage/**` patterns, CORS methods
- [x] Create `middleware.ts` from dead `proxy.ts` code — admin route protection
- [x] Add `update()` methods to VehicleController and CarController
- [x] Add PUT routes for vehicles/cars (protected, auth:sanctum)
- [x] Fix Strapi-style filters (name, price, year, promo, documentStatus, taxStatus, defectStatus)
- [x] Add date filter support to SaleController
- [x] Simplify BFF sales POST → uses Laravel SaleService (not manual stock update)
- [x] Fix StockUpdateModal → sends `vehicleId`/`carId` (numeric) not `vehicleDocumentId`/`carDocumentId`
- [x] Frontend builds successfully with all routes

**References:**
- Frontend BFF routes: `frontend/src/app/api/auth/*/route.ts`
- Frontend proxy: `frontend/src/proxy.ts`
- Frontend auth lib: `frontend/src/lib/auth.ts`
- Frontend strapi lib: `frontend/src/lib/strapi.ts`
- Backend API routes: `backend-laravel/routes/api.php`

**Verification:**
- [ ] Homepage loads vehicle catalog dengan benar
- [ ] Search & filter berfungsi
- [ ] Detail page menampilkan images, defects, promo
- [ ] Admin login berhasil (→ `/api/login` BFF → Laravel)
- [ ] Dashboard menampilkan stats
- [ ] Stock update berfungsi
- [ ] Sale recording berfungsi
- [ ] WhatsApp button berfungsi

**Deliverable:** Full-stack application berfungsi: frontend + backend.

---

### MILESTONE 8: Testing & Bug Fixes
**Status:** ⬜ Belum Dikerjakan
**Goal:** Semua fitur berfungsi tanpa error.

**Tasks:**
- [ ] Test semua API endpoints (positive & negative cases)
- [ ] Test semua frontend pages
- [ ] Test edge cases (empty data, invalid input, unauthorized access)
- [ ] Fix all bugs found
- [ ] Test responsive design (mobile & desktop)
- [ ] Check Laravel logs for errors
- [ ] Check browser console for errors

**Verification:**
- [ ] Tidak ada error di browser console
- [ ] Tidak ada error di Laravel logs (`storage/logs/laravel.log`)
- [ ] Semua CRUD operations work
- [ ] Auth flow complete
- [ ] Media upload & display work
- [ ] Responsive design OK

**Deliverable:** Production-ready application, semua fitur tested.

---

### MILESTONE 9: Deployment
**Status:** ⬜ Belum Dikerjakan
**Goal:** Laravel backend di-deploy ke Railway, frontend ke Vercel.

**Tasks:**
- [ ] Push Laravel code ke GitHub
- [ ] Setup Railway project baru
- [ ] Add MySQL addon di Railway
- [ ] Set environment variables di Railway
- [ ] Deploy Laravel ke Railway
- [ ] Setup storage link di production
- [ ] Seed database di production
- [ ] Update frontend env: `NEXT_PUBLIC_STRAPI_URL=https://your-app.up.railway.app`
- [ ] Deploy frontend ke Vercel
- [ ] Update CORS config untuk production URL
- [ ] Test full production deployment

**Verification:**
- [ ] `https://your-backend.up.railway.app/api/vehicles` returns data
- [ ] `https://your-frontend.vercel.app` loads correctly
- [ ] All features work in production
- [ ] Admin login works in production
- [ ] File upload works in production

**Deliverable:** Fully deployed application accessible via internet.

---

## 14. Struktur File (Updated)

```
backend-laravel/
├── app/
│   ├── Filament/
│   │   └── Resources/
│   │       ├── VehicleResource.php (+ Pages/)
│   │       ├── CarResource.php (+ Pages/)
│   │       ├── SaleResource.php (+ Pages/)
│   │       └── PromoResource.php (+ Pages/)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── VehicleController.php
│   │   │   │   ├── CarController.php
│   │   │   │   ├── SaleController.php
│   │   │   │   ├── PromoController.php
│   │   │   │   └── UploadController.php
│   │   │   └── Auth/
│   │   │       ├── AuthenticatedSessionController.php  ← Breeze (login/logout)
│   │   │       ├── RegisteredUserController.php         ← Breeze (register)
│   │   │       ├── CurrentUserController.php            ← /api/user + /api/auth/me
│   │   │       ├── NewPasswordController.php            ← Breeze (forgot/reset)
│   │   │       └── PasswordResetLinkController.php      ← Breeze
│   │   ├── Middleware/
│   │   │   └── EnsureEmailIsVerified.php
│   │   └── Requests/
│   │       └── Auth/
│   │           └── LoginRequest.php                     ← Breeze (rate limiting)
│   ├── Models/
│   │   ├── User.php         (HasApiTokens)
│   │   ├── Vehicle.php
│   │   ├── Car.php
│   │   ├── Sale.php
│   │   ├── Promo.php
│   │   ├── DefectItem.php
│   │   ├── VehicleImage.php
│   │   ├── CarImage.php
│   │   ├── VehicleVideo.php
│   │   ├── CarVideo.php
│   │   └── DefectItemImage.php
│   ├── Providers/
│   │   └── AppServiceProvider.php    ← Rate limiters defined here
│   └── Services/
│       └── SaleService.php           ← Stock lifecycle business logic
├── config/
│   └── sanctum.php                   ← Token expiration: 1440 min (24h)
├── database/
│   ├── migrations/ (14 files)
│   └── seeders/ (5 files)
├── routes/
│   └── api.php                       ← 16 API endpoints
├── bootstrap/
│   └── app.php                       ← JSON error responses, statefulApi
└── .env
```

**Frontend files (unchanged):**
```
frontend/src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              ← Homepage catalog
│   │   ├── vehicle/[id]/        ← Vehicle detail
│   │   ├── cars/                 ← Cars page
│   │   └── promo/               ← Promo page
│   ├── (admin)/
│   │   └── admin/
│   │       ├── login/            ← Admin login
│   │       └── dashboard/        ← Admin dashboard
│   └── api/
│       └── auth/
│           ├── login/route.ts    ← BFF → /api/login
│           ├── logout/route.ts   ← BFF → /api/logout
│           └── me/route.ts       ← BFF → /api/user
├── lib/
│   ├── auth.ts                   ← getStrapiUrl()
│   ├── strapi.ts                 ← API client
│   └── types.ts                  ← TypeScript types
└── components/
    └── ... (existing components)
```

---

## 15. Environment Variables

### Backend Laravel (.env)

```env
APP_NAME="Showroom API"
APP_ENV=local
APP_KEY=base64:generated-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=showroom
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

### Frontend Next.js (.env.local)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:8000
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Railway)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.up.railway.app

DB_CONNECTION=mysql
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-password

FRONTEND_URL=https://your-frontend.vercel.app

SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
```

---

## 16. Testing Checklist

### API Testing (Postman/curl)

**Public Endpoints:**
- [ ] `GET /api/vehicles` — returns list with pagination
- [ ] `GET /api/vehicles/1` — returns single vehicle
- [ ] `GET /api/vehicles?type=matic` — filter by type
- [ ] `GET /api/vehicles?sort=price:desc` — sort by price
- [ ] `GET /api/vehicles?pagination[page]=1&pagination[pageSize]=2` — pagination
- [ ] `GET /api/vehicles?populate=*` — includes relations
- [ ] `GET /api/cars` — returns list with pagination
- [ ] `GET /api/cars/1` — returns single car
- [ ] `GET /api/cars?type=suv` — filter by type
- [ ] `GET /api/promos` — returns active promos

**Auth Endpoints:**
- [ ] `POST /api/auth/login` — returns JWT token
- [ ] `POST /api/auth/login` — wrong password returns 401
- [ ] `GET /api/auth/me` — returns current user (with token)
- [ ] `GET /api/auth/me` — no token returns 401
- [ ] `POST /api/auth/logout` — clears session

**Protected Endpoints:**
- [ ] `POST /api/vehicles` — creates vehicle (with token)
- [ ] `PUT /api/vehicles/1` — updates vehicle (with token)
- [ ] `DELETE /api/vehicles/1` — deletes vehicle (with token)
- [ ] `POST /api/cars` — creates car (with token)
- [ ] `PUT /api/cars/1` — updates car (with token)
- [ ] `DELETE /api/cars/1` — deletes car (with token)
- [ ] `POST /api/sales` — creates sale + decrements stock
- [ ] `GET /api/sales` — returns sales list
- [ ] `DELETE /api/sales/1` — deletes sale + increments stock
- [ ] `POST /api/upload` — uploads file

### Frontend Testing

**Public Pages:**
- [ ] Homepage loads vehicle catalog
- [ ] Search by name works
- [ ] Filter by type works
- [ ] Filter by availability works
- [ ] Sort by price works
- [ ] Vehicle detail page loads with images
- [ ] Vehicle detail shows promo (if any)
- [ ] Vehicle detail shows defects (if any)
- [ ] WhatsApp button works (deep link)
- [ ] Cars page loads car catalog
- [ ] Car detail page loads correctly
- [ ] Empty state shows correctly

**Admin Pages:**
- [ ] Admin login works
- [ ] Dashboard loads stats (motor stock, car stock, sold, revenue)
- [ ] Dashboard shows vehicle list
- [ ] Dashboard shows car list
- [ ] Dashboard shows sales list
- [ ] Stock update works (increase)
- [ ] Stock update works (decrease)
- [ ] Sale recording works
- [ ] PDF export works
- [ ] Logout works

**Responsive Design:**
- [ ] Mobile (375px) — all pages work
- [ ] Tablet (768px) — all pages work
- [ ] Desktop (1024px+) — all pages work
- [ ] Filter sheet works on mobile
- [ ] Header hamburger menu works

---

## 17. Catatan Penting

### 1. Document ID

Strapi menggunakan `documentId` (string UUID-like) sebagai identifier di URL. Di Laravel:

**Opsi A: Hash dari ID (Recommended)**
```php
use Hashids\Hashids;

$hashids = new Hashids('salt-salah-satu', 12);
$documentId = $hashids->encode($vehicle->id);
```

**Opsi B: UUID di migration**
```php
$table->uuid('document_id')->unique();
```

### 2. Draft & Publish

Strapi mendukung draft/publish. Di Laravel, skip fitur ini. Semua data langsung "published".

### 3. Timestamps

Strapi return `createdAt` dan `updatedAt` dalam format ISO 8601. Laravel Eloquent timestamps sudah support:
```php
$vehicle->created_at->toISOString()
// Returns: "2026-01-15T08:30:00.000000Z"
```

### 4. Null Fields

Strapi return `null` untuk fields kosong. Laravel Resource harus handle:
```php
'documentNote' => $this->document_note,  // otomatis null jika kosong
'taxExpiryYear' => $this->tax_expiry_year ? (int) $this->tax_expiry_year : null,
```

### 5. Populate

Strapi's `populate=*` → Laravel's `with()` (eager loading):
```php
// Controller
$vehicles = Vehicle::with(['promo', 'images', 'defects', 'defects.images', 'sales'])
    ->where(...->paginate(...);
```

### 6. CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 7. Error Handling

Laravel harus return error format yang bisa diakses frontend:
```php
// 404 Not Found
return response()->json(['error' => 'Not Found'], 404);

// 422 Validation Error
return response()->json(['error' => 'Validation Failed', 'errors' => $e->errors()], 422);

// 500 Server Error
return response()->json(['error' => 'Internal Server Error'], 500);
```

---

**Document Version:** 1.0
**Last Updated:** 2026-07-23
**Created By:** opencode agent
**Status:** READY FOR IMPLEMENTATION
