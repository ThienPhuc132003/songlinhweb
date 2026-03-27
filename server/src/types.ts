/** Cloudflare Worker environment bindings */
export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  CACHE: KVNamespace;
  CORS_ORIGIN: string;
  ADMIN_API_KEY: string;
  RESEND_API_KEY?: string;
}

/** Standard API response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
}

/** Pagination query params */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** DB row types */
export interface SolutionRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  content_md: string | null;
  icon: string;
  hero_image_url: string | null;
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface ProductRow {
  id: number;
  category_id: number;
  slug: string;
  name: string;
  description: string;
  brand: string;
  model_number: string;
  image_url: string | null;
  spec_sheet_url: string | null;
  specifications: string; // JSON object
  features: string;       // JSON array
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  client_name: string | null;
  thumbnail_url: string | null;
  content_md: string | null;
  category: string;
  year: number | null;
  sort_order: number;
  is_featured: number;
  is_active: number;
  created_at: string;
  // Case study metadata (Phase P0)
  system_types: string;        // JSON array: '["CCTV", "Access Control"]'
  brands_used: string;         // JSON array: '["Hikvision", "ZKTeco"]'
  area_sqm: number | null;
  duration_months: number | null;
  key_metrics: string;         // JSON object: '{"cameras": 120}'
  compliance_standards: string; // JSON array: '["TCVN 7336:2003"]'
  client_industry: string | null;
  project_scale: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string | null;
  thumbnail_url: string | null;
  author: string;
  tags: string; // JSON array string
  is_published: number;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbumRow {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface GalleryImageRow {
  id: number;
  album_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface PartnerRow {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface ContactRow {
  id: number;
  company_name: string;
  contact_person: string | null;
  email: string;
  phone: string;
  address: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface SiteConfigRow {
  key: string;
  value: string;
  description: string | null;
}

export interface ImageRow {
  id: number;
  entity_type: string; // 'solution' | 'project'
  entity_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface QuoteRequestRow {
  id: number;
  customer_name: string;
  email: string | null;
  phone: string;
  company: string | null;
  items: string; // JSON [{product_id, product_name, qty}]
  note: string | null;
  status: string;
  created_at: string;
}
