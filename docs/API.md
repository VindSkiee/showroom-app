# API Documentation - Showroom E-Catalog Motor

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:1337` |
| Production | `https://your-app.up.railway.app` |

---

## Authentication

### Admin Panel

Akses: `/admin`

### API Token

Untuk protected routes, gunakan header:

```
Authorization: Bearer <your-api-token>
```

Buat API token di: Admin → Settings → API Tokens

---

## Endpoints

### Vehicles (Kendaraan)

#### List Vehicles

```http
GET /api/vehicles
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `filters[type][$eq]` | string | Filter: matic, manual, sport, cruiser, scoopy |
| `filters[status][$eq]` | string | Filter: available, sold_out |
| `filters[price][$lte]` | integer | Harga maksimum |
| `filters[price][$gte]` | integer | Harga minimum |
| `filters[year][$lte]` | integer | Tahun maksimum |
| `filters[year][$gte]` | integer | Tahun minimum |
| `filters[documentStatus][$eq]` | string | Filter: complete, incomplete |
| `filters[taxStatus][$eq]` | string | Filter: active, expired, unknown |
| `filters[defectStatus][$eq]` | string | Filter: none, minor, major |
| `filters[name][$containsi]` | string | Search nama motor |
| `sort` | string | Sort: `price:asc`, `price:desc`, `year:asc`, `year:desc` |
| `pagination[page]` | integer | Halaman |
| `pagination[pageSize]` | integer | Item per halaman (default: 25) |

**Example Request:**

```http
GET /api/vehicles?filters[type][$eq]=matic&filters[price][$lte]=20000000&sort=price:asc
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Honda Vario 160",
        "model": "Techno ABS",
        "licensePlate": "B 1234 ABC",
        "type": "matic",
        "price": 18500000,
        "year": 2023,
        "status": "available",
        "documentStatus": "complete",
        "documentNote": "",
        "taxStatus": "active",
        "taxExpiryYear": 2026,
        "taxExpiredFrom": null,
        "defectStatus": "minor",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "vario-1.jpg",
                "url": "/uploads/vario_1_abc123.jpg",
                "width": 800,
                "height": 600
              }
            }
          ]
        },
        "video": {
          "data": null
        },
        "promo": {
          "data": null
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

#### Get Vehicle by ID

```http
GET /api/vehicles/:id
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Honda Vario 160",
      "model": "Techno ABS",
      "licensePlate": "B 1234 ABC",
      "type": "matic",
      "price": 18500000,
      "year": 2023,
      "status": "available",
      "documentStatus": "complete",
      "documentNote": "",
      "taxStatus": "active",
      "taxExpiryYear": 2026,
      "taxExpiredFrom": null,
      "defectStatus": "minor",
      "defects": [
        {
          "id": 1,
          "part": "Body depan",
          "description": "Terdapat lecet kecil pada body depan sepanjang 5cm",
          "images": [
            {
              "id": 1,
              "attributes": {
                "name": "defect-1.jpg",
                "url": "/uploads/defect_1_xyz.jpg"
              }
            }
          ]
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

### Promos

#### List Active Promos

```http
GET /api/promos?filters[isActive][$eq]=true
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Promo Lebaran 2024",
        "description": "Diskon spesial untuk pembelian cash",
        "discount": 10,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "banner": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "promo-banner.jpg",
              "url": "/uploads/promo_banner_xyz.jpg"
            }
          }
        },
        "vehicles": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "Honda Vario 160"
              }
            }
          ]
        }
      }
    }
  ]
}
```

---

### Sales (Admin Only)

```http
GET /api/sales?filters[saleDate][$gte]=2024-01-01
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "saleDate": "2024-01-15",
        "salePrice": 17500000,
        "buyerName": "Budi Santoso",
        "createdAt": "2024-01-15T00:00:00Z",
        "vehicle": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Honda Vario 160"
            }
          }
        }
      }
    }
  ]
}
```

---

## Filters Reference

### Vehicle Type

| Value | Description |
|-------|-------------|
| `matic` | Motor Matic |
| `manual` | Motor Manual |
| `sport` | Motor Sport |
| `cruiser` | Motor Cruiser |
| `scoopy` | Motor Scoopy |

### Status

| Value | Description |
|-------|-------------|
| `available` | Tersedia |
| `sold_out` | Terjual |

### Document Status

| Value | Description |
|-------|-------------|
| `complete` | Surat lengkap |
| `incomplete` | Surat tidak lengkap (cek documentNote) |

### Tax Status

| Value | Description |
|-------|-------------|
| `active` | Pajak hidup (cek taxExpiryYear) |
| `expired` | Pajak mati (cek taxExpiredFrom) |
| `unknown` | Pajak tidak diketahui |

### Defect Status

| Value | Description |
|-------|-------------|
| `none` | Tidak ada cacat |
| `minor` | Cacat ringan |
| `major` | Cacat besar |

---

## Error Responses

### 400 Bad Request

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Invalid query parameter"
  }
}
```

### 401 Unauthorized

```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid token"
  }
}
```

### 404 Not Found

```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found"
  }
}
```

---

## Frontend Integration

### Strapi API Client (lib/strapi.ts)

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchStrapi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi error: ${res.status}`);
  }

  return res.json();
}

// Usage
const { data, meta } = await fetchStrapi<StrapiResponse<Vehicle>>("/vehicles");
```

### Environment Variables

```env
# Frontend
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend (Railway)
DATABASE_URL=postgresql://...
HOST=0.0.0.0
PORT=1337
JWT_SECRET=your-secret
API_TOKEN_SALT=your-salt
APP_KEYS=your-app-keys
```
