// ===== Domain Types =====

export interface Solution {
  id: number;
  slug: string;
  title: string;
  description: string;
  content_md: string | null;
  icon: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  images?: EntityImage[];
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
  sort_order: number;
  is_active: number;
  product_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  spec_sheet_url: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
  category?: ProductCategory;
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
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
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
}

export interface QuoteFormData {
  company_name: string;
  customer_name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface QuoteRequestPayload {
  company_name: string;
  customer_name: string;
  phone: string;
  email: string;
  notes: string;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
  }>;
}
