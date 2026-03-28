---
phase: design
feature: product-module
---
# Product Module — Design Document

## Architecture Overview

```mermaid
graph TB
    subgraph "Admin Panel"
        A1[AdminCategories]
        A2[AdminBrands]
        A3[AdminProducts<br/>+ dynamic specs]
    end

    subgraph "Cloudflare D1"
        DB1[(product_categories)]
        DB2[(brands)]
        DB3[(products)]
        DB4[(entity_images)]
    end

    subgraph "Hono API"
        R1[/api/product-categories]
        R2[/api/brands]
        R3[/api/products]
        R4[/api/products/:slug]
    end

    subgraph "Frontend Pages"
        F1[Products Catalog<br/>+ Sidebar + Filters]
        F2[ProductDetail<br/>+ Gallery + Specs]
        F3[Navbar Mega Menu]
    end

    A1 --> DB1
    A2 --> DB2
    A3 --> DB3
    R1 --> DB1
    R2 --> DB2
    R3 --> DB3
    R4 --> DB3 & DB4
    F1 --> R1 & R2 & R3
    F2 --> R4
    F3 --> R1
```

## Data Models

### Migration: `0002_product_module.sql`

```sql
-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT DEFAULT '',
  website_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- ALTER products table (add missing columns if not exists)
-- These columns may already exist from manual ALTER TABLE commands:
-- brand, model_number, specifications, features, meta_title, meta_description, updated_at
-- We also add brand_id FK:
ALTER TABLE products ADD COLUMN brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL;
```

### TypeScript Types

```typescript
// server/src/types.ts additions
interface BrandRow {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

// ProductRow already has: brand, model_number, specifications (JSON), features (JSON)
// Add brand_id for relational lookup
```

## API Design

### New Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/brands` | List active brands |
| GET | `/api/brands/:slug` | Get brand detail |
| POST | `/api/admin/brands` | Create brand (auth) |
| PUT | `/api/admin/brands/:id` | Update brand (auth) |
| DELETE | `/api/admin/brands/:id` | Delete brand (auth) |

### Enhanced Endpoints

| Method | Endpoint | Changes |
|--------|----------|---------|
| GET | `/api/products` | Add `brand` filter param, include brand data in response |
| GET | `/api/products/:slug` | Include brand data, related products |

## Components

### Admin Components
| Component | Purpose |
|-----------|---------|
| `AdminBrands.tsx` | CRUD for brands (name, slug, logo upload, website URL) |
| `AdminCategories.tsx` | Enhanced category management (hierarchical tree view) |
| `AdminProducts.tsx` | Enhanced: brand selector, dynamic specs key-value editor |

### Frontend Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `CategorySidebar` | `/san-pham` | Collapsible category tree sidebar |
| `BrandFilter` | `/san-pham` | Multi-select brand checkboxes |
| `ProductSearchBar` | `/san-pham` | Debounced search (SKU, name, brand) |
| `ProductCard` | `/san-pham` | B2B card with brand badge, model number, feature tags |
| `ProductGallery` | Detail | Main image + thumbnails |
| `ProductSpecs` | Detail | Technical specifications table from JSON |
| `ProductCTA` | Detail | "Request Quote" button + datasheet download |
| `RelatedProducts` | Detail | Same category/brand products |
| `ProductsMegaMenu` | Navbar | 3-4 column dropdown with categories |

### Page Redesigns
| Page | Changes |
|------|---------|
| `Products.tsx` | Add sidebar layout, filters, search bar, pagination |
| `ProductDetail.tsx` | Replace cart button → "Yêu cầu báo giá", add related products, enhance specs |

## Design Decisions
1. **JSON specs column** — Keep `specifications` as JSON TEXT in SQLite for maximum flexibility across product types
2. **Brands as separate table** — Enables brand pages, logo management, and clean filter UI
3. **brand_id FK + brand TEXT** — Keep `brand` TEXT for backward compat, add `brand_id` for relational
4. **B2B CTA** — "Yêu cầu báo giá" replaces AddToCartButton, links to `/lien-he` with product context
5. **Category hierarchy** — `parent_id` already in schema, leverage for sidebar tree

## Security
- Admin routes protected by `requireAuth` middleware
- No sensitive data exposed in product APIs
- Brand logo uploads through existing R2 upload pipeline

## Performance
- Category tree cached client-side via React Query
- Product list paginated (existing)
- Images use WebP pipeline
- Debounced search (300ms) to reduce API calls
