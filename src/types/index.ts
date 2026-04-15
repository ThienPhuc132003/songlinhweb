// ===== Domain Types =====

export interface Solution {
  id: number;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content_md: string | null;
  icon: string;
  hero_image_url: string | null;
  features: string;        // JSON array string: [{icon, title, description}]
  applications: string;    // JSON array string: [string]
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  images?: EntityImage[];
}

/** Parsed solution feature — from features JSON column */
export interface SolutionFeature {
  icon: string;
  title: string;
  description: string;
}

export interface EntityImage {
  id: number;
  entity_type: string;
  entity_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  parent_id?: number | null;
  sort_order: number;
  is_active: number;
  product_count?: number;
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface Product {
  id: number;
  category_id: number;
  brand_id?: number | null;
  slug: string;
  name: string;
  description: string;
  brand: string;
  model_number: string;
  image_url: string | null;
  gallery_urls: string;    // JSON array of gallery image URLs
  spec_sheet_url: string | null;
  specifications: string; // JSON object
  features: string;       // JSON array
  inventory_status: string; // 'in-stock' | 'pre-order' | 'contact'
  warranty: string;          // e.g. '24 Months'
  is_active: number;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
  // Joined fields from backend
  category_name?: string;
  category_slug?: string;
  brand_name?: string | null;
  brand_slug?: string | null;
  brand_logo?: string | null;
  brand_website?: string | null;
  product_features?: ProductFeature[];
  // Detail-only fields (populated by API on /:slug endpoint)
  images?: EntityImage[];
  related?: Array<{
    slug: string;
    name: string;
    image_url: string | null;
    brand: string;
    model_number: string;
    category_name: string;
  }>;
  linked_projects?: Array<{
    slug: string;
    title: string;
    thumbnail_url: string | null;
    client_name: string | null;
    location: string;
  }>;
}

export interface ProductFeature {
  id: number;
  name: string;
  slug: string;
  group_name: string;
  sort_order?: number;
  is_active?: number;
  color?: string | null;
  icon?: string | null;
  is_priority?: number;
}

export interface Project {
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
  images?: EntityImage[];
  // Case study metadata
  system_types?: string;
  brands_used?: string;
  area_sqm?: number | null;
  duration_months?: number | null;
  key_metrics?: string;
  compliance_standards?: string;
  client_industry?: string | null;
  project_scale?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  // B2B Portfolio fields
  completion_year?: string | null;
  related_solutions?: string;
  related_products?: string;
  // Case Study fields (migration 0017)
  challenges?: string | null;
  outcomes?: string | null;
  testimonial_name?: string | null;
  testimonial_content?: string | null;
  video_url?: string | null;
  // Populated by API join (detail page)
  linked_solutions?: Array<{ id: number; title: string; slug: string; icon: string }>;
  linked_products?: Array<{ id: number; name: string; slug: string; image_url: string | null; category_name?: string }>;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string | null;
  thumbnail_url: string | null;
  author: string;
  tags: string[];
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
  last_updated_at?: string | null;
  reviewed_by?: string | null;
  references?: string | unknown[];  // JSON string or parsed array
  // Populated on detail page
  related?: Post[];
}

export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  description: string;
  category: string; // 'du-an' | 'ky-thuat' | 'hoat-dong' | 'general'
  sort_order: number;
  is_active: number;
  image_count?: number;
}

export interface GalleryImage {
  id: number;
  album_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface Contact {
  id: number;
  company_name: string;
  contact_person: string | null;
  email: string;
  phone: string;
  address: string | null;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface SiteConfig {
  key: string;
  value: string;
  description: string | null;
}

// ===== API Types =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ContactForm {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

// ===== Component Props Types =====

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ===== RFQ Cart Types =====

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  categoryName: string | null;
  quantity: number;
  notes?: string;
}

export interface QuoteFormData {
  company_name: string;
  customer_name: string;
  phone: string;
  email: string;
  project_name: string;
  notes: string;
}

export interface QuoteRequestPayload {
  company_name: string;
  customer_name: string;
  phone: string;
  email: string;
  project_name: string;
  notes: string;
  items: Array<{
    product_id: number;
    product_name: string;
    product_image: string | null;
    category_name: string | null;
    quantity: number;
    notes: string | null;
  }>;
}

// ===== Quotation Management Types (Admin) =====

export type QuoteStatus = 'new' | 'processing' | 'sent' | 'completed';

export interface QuotationRequest {
  id: number;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string;
  project_name: string | null;
  status: QuoteStatus;
  excel_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  items?: QuotationItem[];
  item_count?: number;
}

export interface QuotationItem {
  id: number;
  quote_id: number;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  category_name: string | null;
  quantity: number;
  notes: string | null;
}

// ===== Admin-Only Types =====

export interface DashboardStats {
  totalProducts: number;
  featuredProjects: number;
  unreadQuotes: number;
  unreadContacts: number;
  trends: {
    quotesThisWeek: number;
    quotesLastWeek: number;
    contactsThisWeek: number;
    contactsLastWeek: number;
  };
  dailyQuotesChart: Array<{
    day: string;
    cnt: number;
  }>;
  recentQuotes: Array<{
    id: number;
    customer_name: string;
    project_name: string | null;
    status: string;
    created_at: string;
  }>;
  storage: {
    d1: {
      products: number;
      projects: number;
      contacts: number;
      quotations: number;
      posts: number;
    };
    r2ObjectCount: number;
  };
}

export interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  changes: string;
  performed_by: string;
  created_at: string;
}
