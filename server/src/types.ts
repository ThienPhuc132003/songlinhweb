/** Cloudflare Worker environment bindings */
export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  CACHE: KVNamespace;
  CORS_ORIGIN: string;
  ADMIN_API_KEY: string;
  RESEND_API_KEY?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
  SITE_URL?: string;
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
  parent_id: number | null;
  sort_order: number;
  is_active: number;
}

export interface BrandRow {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface ProductRow {
  id: number;
  category_id: number;
  brand_id: number | null;
  slug: string;
  name: string;
  description: string;
  brand: string;
  model_number: string;
  image_url: string | null;
  spec_sheet_url: string | null;
  specifications: string; // JSON object
  features: string;       // JSON array
  gallery_urls: string;   // JSON array of image URLs
  inventory_status: string; // 'in-stock' | 'pre-order' | 'contact'
  warranty: string;       // e.g. '24 Months'
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
  // B2B Portfolio fields (migration 0016)
  completion_year: string | null;
  related_solutions: string;         // JSON array: '[1, 3, 5]'
  related_products: string;          // JSON array: '[12, 45, 67]'
  // Case Study fields (migration 0017)
  challenges: string | null;
  outcomes: string | null;
  testimonial_name: string | null;
  testimonial_content: string | null;
  video_url: string | null;
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
  // New fields (migration 0018)
  status: string;          // 'draft' | 'published' | 'archived'
  category: string;        // 'general' | 'technology' | 'project-update' | 'industry-news'
  view_count: number;
  is_featured: number;
  reading_time_min: number;
  created_at: string;
  updated_at: string;
  // Authority fields (migration 0019)
  last_updated_at: string | null;
  reviewed_by: string | null;
  references: string;              // JSON array: '[{title, url, type}]'
}

export interface GalleryAlbumRow {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  description: string;
  category: string; // 'du-an' | 'ky-thuat' | 'hoat-dong' | 'general'
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

export interface ProductFeatureRow {
  id: number;
  name: string;
  slug: string;
  group_name: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProductToFeatureRow {
  product_id: number;
  feature_id: number;
}

export interface AuditLogRow {
  id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  changes: string;
  performed_by: string;
  created_at: string;
}

/** Normalized quotation request (from 0014_rfq_professional.sql) */
export interface QuotationRequestRow {
  id: number;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string;
  project_name: string | null;
  status: string; // 'new' | 'processing' | 'sent' | 'completed'
  excel_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/** Normalized quotation item linked to a quote request */
export interface QuotationItemRow {
  id: number;
  quote_id: number;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  category_name: string | null;
  quantity: number;
  notes: string | null;
}
