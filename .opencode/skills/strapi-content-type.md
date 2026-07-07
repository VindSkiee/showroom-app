# Skill: Strapi Content Type

## Overview

Membuat Content Types untuk Showroom E-Catalog Motor di Strapi v5.

---

## Content Types

### 1. Vehicle (Kendaraan)

#### Via Admin Panel

1. Buka Strapi Admin → Content-Type Builder
2. Klik **Create new collection type**
3. Display name: `Vehicle`
4. Add fields:

| Field Name | Type | Options |
|------------|------|---------|
| `name` | Text | Required |
| `model` | Text | Required |
| `licensePlate` | Text | Required |
| `type` | Enumeration | Values: matic, manual, sport, cruiser, scoopy |
| `price` | Number | Integer, Required |
| `year` | Number | Integer, Required |
| `documentStatus` | Enumeration | Values: complete, incomplete |
| `documentNote` | Text | Long text, optional |
| `taxStatus` | Enumeration | Values: active, expired, unknown |
| `taxExpiryYear` | Number | Integer, optional |
| `taxExpiredFrom` | Number | Integer, optional |
| `defectStatus` | Enumeration | Values: none, minor, major |
| `status` | Enumeration | Values: available, sold_out |
| `images` | Media | Multiple files, allowed types: images |
| `video` | Media | Single file, allowed types: videos |

5. Add **Component** field:
   - Field name: `defects`
   - Type: Component
   - Repeatable: Yes
   - Max items: 10
   - Component: Create new → `defect-item`

6. Add **Relation** field:
   - Field name: `promo`
   - Relation: Many to One
   - Target: Promo

7. Klik **Save** → Restart server

---

### 2. DefectItem (Component)

#### Via Admin Panel

1. Di Content-Type Builder, klik **Create new component**
2. Name: `defect-item`
3. Category: `default`
4. Add fields:

| Field Name | Type | Options |
|------------|------|---------|
| `part` | Text | Required (e.g., "Body depan", "Mesin") |
| `description` | Text | Long text, Required |
| `images` | Media | Multiple files, allowed types: images, Max: 3 |

5. Klik **Save**

---

### 3. Sale (Penjualan)

#### Via Admin Panel

1. Content-Type Builder → Create new collection type
2. Display name: `Sale`
3. Add fields:

| Field Name | Type | Options |
|------------|------|---------|
| `saleDate` | Date | Required |
| `salePrice` | Number | Integer, Required |
| `buyerName` | Text | Optional |

4. Add **Relation** field:
   - Field name: `vehicle`
   - Relation: Many to One
   - Target: Vehicle

5. Klik **Save**

---

### 4. Promo

#### Via Admin Panel

1. Content-Type Builder → Create new collection type
2. Display name: `Promo`
3. Add fields:

| Field Name | Type | Options |
|------------|------|---------|
| `title` | Text | Required |
| `description` | Rich text | Optional |
| `discount` | Number | Integer, Required |
| `isActive` | Boolean | Default: true |
| `banner` | Media | Single file, allowed types: images |

4. Add **Relation** field:
   - Field name: `vehicles`
   - Relation: One to Many
   - Target: Vehicle

5. Klik **Save**

---

## Schema JSON

### Vehicle Schema

```json
{
  "kind": "collectionType",
  "collectionName": "vehicles",
  "info": {
    "singularName": "vehicle",
    "pluralName": "vehicles",
    "displayName": "Vehicle",
    "description": "Kendaraan untuk E-Catalog"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "model": {
      "type": "string",
      "required": true
    },
    "licensePlate": {
      "type": "string",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["matic", "manual", "sport", "cruiser", "scoopy"],
      "required": true
    },
    "price": {
      "type": "integer",
      "required": true,
      "min": 0
    },
    "year": {
      "type": "integer",
      "required": true,
      "min": 1990,
      "max": 2030
    },
    "documentStatus": {
      "type": "enumeration",
      "enum": ["complete", "incomplete"],
      "default": "complete"
    },
    "documentNote": {
      "type": "text"
    },
    "taxStatus": {
      "type": "enumeration",
      "enum": ["active", "expired", "unknown"],
      "default": "unknown"
    },
    "taxExpiryYear": {
      "type": "integer",
      "min": 2020,
      "max": 2030
    },
    "taxExpiredFrom": {
      "type": "integer",
      "min": 2020,
      "max": 2030
    },
    "defectStatus": {
      "type": "enumeration",
      "enum": ["none", "minor", "major"],
      "default": "none"
    },
    "status": {
      "type": "enumeration",
      "enum": ["available", "sold_out"],
      "default": "available"
    },
    "defects": {
      "type": "component",
      "repeatable": true,
      "component": "default.defect-item"
    },
    "images": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"]
    },
    "video": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["videos"]
    },
    "promo": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::promo.promo",
      "inversedBy": "vehicles"
    }
  }
}
```

### Sale Schema

```json
{
  "kind": "collectionType",
  "collectionName": "sales",
  "info": {
    "singularName": "sale",
    "pluralName": "sales",
    "displayName": "Sale",
    "description": "Data Penjualan"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "saleDate": {
      "type": "date",
      "required": true
    },
    "salePrice": {
      "type": "integer",
      "required": true,
      "min": 0
    },
    "buyerName": {
      "type": "string"
    },
    "vehicle": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::vehicle.vehicle"
    }
  }
}
```

### Promo Schema

```json
{
  "kind": "collectionType",
  "collectionName": "promos",
  "info": {
    "singularName": "promo",
    "pluralName": "promos",
    "displayName": "Promo",
    "description": "Promo E-Catalog"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "richtext"
    },
    "discount": {
      "type": "integer",
      "required": true,
      "min": 0,
      "max": 100
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "banner": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "vehicles": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::vehicle.vehicle",
      "mappedBy": "promo"
    }
  }
}
```

### DefectItem Component Schema

```json
{
  "collectionName": "components_defect_items",
  "info": {
    "displayName": "Defect Item",
    "icon": "warning",
    "description": "Item kecacatan pada kendaraan"
  },
  "attributes": {
    "part": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true
    },
    "images": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"],
      "max": 3
    }
  }
}
```

---

## Seed Data

Setelah membuat content types, seed data contoh:

### Via Admin Panel

1. Buka **Content Manager** → **Vehicle**
2. Klik **Create new entry**
3. Isi data contoh:

| Field | Value |
|-------|-------|
| Name | Honda Vario 160 |
| Model | Techno ABS |
| License Plate | B 1234 ABC |
| Type | matic |
| Price | 18500000 |
| Year | 2023 |
| Document Status | complete |
| Tax Status | active |
| Tax Expiry Year | 2026 |
| Defect Status | minor |
| Status | available |

4. Add defect:
   - Part: Body depan
   - Description: Lecet kecil 5cm
   - Images: (upload foto)

5. Save and Publish

---

## Permissions

### Public (Tanpa Auth)

```bash
# Di Strapi Admin → Settings → Users & Permissions → Public
Vehicle: find, findOne
Promo: find, findOne
Sale: (none)
```

### Authenticated (Admin)

```bash
# Di Strapi Admin → Settings → Users & Permissions → Authenticated
Vehicle: find, findOne, create, update, delete
Promo: find, findOne, create, update, delete
Sale: find, findOne, create, update, delete
```

---

## Next Steps

1. Test API endpoints → Lihat `docs/API.md`
2. Deploy ke Railway → Lihat `deploy.md`
3. Build frontend → Lihat `nextjs-page.md`
