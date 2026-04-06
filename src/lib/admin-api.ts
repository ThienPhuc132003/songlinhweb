/**
 * Admin API client — wraps fetchApi with X-API-Key header
 */

const API_URL = import.meta.env.VITE_API_URL || "";
import type { ProductCategory, QuotationRequest } from "@/types";
export type { ProductCategory };

function getApiKey(): string {
  return localStorage.getItem("sltech_admin_key") || "";
}

export function setApiKey(key: string) {
  localStorage.setItem("sltech_admin_key", key);
}

export function clearApiKey() {
  localStorage.removeItem("sltech_admin_key");
}

export function hasApiKey(): boolean {
  return !!localStorage.getItem("sltech_admin_key");
}

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const apiKey = getApiKey();
  const res = await fetch(`${API_URL}/admin${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    clearApiKey();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API Error ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/** Paginated admin fetch — returns { items, total, page, totalPages } */
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

async function adminFetchPaginated<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<PaginatedResult<T>> {
  const apiKey = getApiKey();
  const res = await fetch(`${API_URL}/admin${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    clearApiKey();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API Error ${res.status}`);
  }

  const json = await res.json();
  return {
    items: json.data ?? [],
    total: json.meta?.total ?? 0,
    page: json.meta?.page ?? 1,
    totalPages: json.meta?.totalPages ?? 1,
  };
}

async function adminUpload(file: File, folder?: string) {
  const apiKey = getApiKey();
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  const res = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `Upload Error ${res.status}`);
  }

  const json = await res.json();
  return json.data as { key: string; url: string; size: number; type: string };
}

// ─── Admin API Methods ───────────────────────────────────────────────────────

export const adminApi = {
  // Auth verify - use a protected route to validate key
  verify: () => adminFetch<Product[]>("/products/items/all?limit=1"),

  // Upload
  upload: adminUpload,
  deleteUpload: (key: string) =>
    adminFetch<{ deleted: boolean }>(`/upload/${key}`, { method: "DELETE" }),

  // Solutions
  solutions: {
    list: () => adminFetch<Solution[]>("/solutions/all"),
    create: (data: Partial<Solution>) =>
      adminFetch<{ id: number }>("/solutions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Solution>) =>
      adminFetch<{ id: number }>(`/solutions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/solutions/${id}`, {
        method: "DELETE",
      }),
  },

  // Projects
  projects: {
    list: () => adminFetch<Project[]>("/projects/all"),
    create: (data: Partial<Project>) =>
      adminFetch<{ id: number }>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Project>) =>
      adminFetch<{ id: number }>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/projects/${id}`, {
        method: "DELETE",
      }),
  },

  // Posts
  posts: {
    list: () => adminFetch<Post[]>("/posts/all"),
    create: (data: Partial<Post>) =>
      adminFetch<{ id: number }>("/posts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Post>) =>
      adminFetch<{ id: number }>(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/posts/${id}`, {
        method: "DELETE",
      }),
    bulk: (action: string, postIds: number[], value?: unknown) =>
      adminFetch<{ affected: number }>("/posts/bulk", {
        method: "POST",
        body: JSON.stringify({ action, post_ids: postIds, value }),
      }),
  },

  // Product Categories
  productCategories: {
    list: () => adminFetch<ProductCategory[]>("/products/categories/all"),
    create: (data: Partial<ProductCategory>) =>
      adminFetch<{ id: number }>("/products/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<ProductCategory>) =>
      adminFetch<{ id: number }>(`/products/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/products/categories/${id}`, {
        method: "DELETE",
      }),
  },

  // Products (individual items)
  products: {
    list: () => adminFetch<Product[]>("/products/items/all"),
    create: (data: Partial<Product>) =>
      adminFetch<{ id: number }>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Product>) =>
      adminFetch<{ id: number }>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/products/${id}`, {
        method: "DELETE",
      }),
    restore: (id: number) =>
      adminFetch<{ restored: boolean }>(`/products/${id}/restore`, {
        method: "POST",
      }),
    bulk: (action: string, productIds: number[], value?: unknown) =>
      adminFetch<{ affected: number }>("/products/bulk", {
        method: "POST",
        body: JSON.stringify({ action, product_ids: productIds, value }),
      }),
  },

  // Dashboard
  dashboard: {
    stats: () => adminFetch<DashboardStats>("/dashboard/stats"),
  },

  // Audit Logs
  auditLogs: {
    list: (opts?: { entity_type?: string; entity_id?: number; page?: number; limit?: number }) => {
      const params = new URLSearchParams();
      if (opts?.entity_type) params.set("entity_type", opts.entity_type);
      if (opts?.entity_id) params.set("entity_id", String(opts.entity_id));
      if (opts?.page) params.set("page", String(opts.page));
      if (opts?.limit) params.set("limit", String(opts.limit));
      const qs = params.toString();
      return adminFetch<{ items: AuditLog[]; total: number; page: number; totalPages: number }>(
        `/audit-logs${qs ? `?${qs}` : ""}`,
      );
    },
  },

  // Brands
  brands: {
    list: () => adminFetch<Brand[]>("/brands/all"),
    create: (data: Partial<Brand>) =>
      adminFetch<{ id: number }>("/brands", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Brand>) =>
      adminFetch<{ id: number }>(`/brands/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/brands/${id}`, {
        method: "DELETE",
      }),
  },

  // Partners
  partners: {
    list: () => adminFetch<Partner[]>("/partners/all"),
    create: (data: Partial<Partner>) =>
      adminFetch<{ id: number }>("/partners", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Partner>) =>
      adminFetch<{ id: number }>(`/partners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/partners/${id}`, {
        method: "DELETE",
      }),
  },

  // Gallery
  gallery: {
    albums: () => adminFetch<GalleryAlbum[]>("/gallery/all"),
    albumDetail: (id: number) =>
      adminFetch<GalleryAlbum & { images: GalleryImage[]; image_count: number }>(
        `/gallery/albums/${id}`,
      ),
    createAlbum: (data: Partial<GalleryAlbum>) =>
      adminFetch<{ id: number }>("/gallery/albums", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateAlbum: (id: number, data: Partial<GalleryAlbum>) =>
      adminFetch<{ id: number }>(`/gallery/albums/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteAlbum: (id: number, deleteR2 = true) =>
      adminFetch<{ deleted: boolean }>(
        `/gallery/albums/${id}?delete_r2=${deleteR2}`,
        { method: "DELETE" },
      ),
    setCover: (albumId: number, imageUrl: string) =>
      adminFetch<{ id: number; cover_url: string }>(
        `/gallery/albums/${albumId}/cover`,
        { method: "PUT", body: JSON.stringify({ image_url: imageUrl }) },
      ),
    // Image CRUD
    addImage: (data: { album_id: number; image_url: string; caption?: string; sort_order?: number }) =>
      adminFetch<{ id: number }>("/gallery/images", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    addImagesBatch: (album_id: number, images: Array<{ image_url: string; caption?: string; sort_order?: number }>) =>
      adminFetch<{ inserted: number }>("/gallery/images/batch", {
        method: "POST",
        body: JSON.stringify({ album_id, images }),
      }),
    updateImage: (id: number, data: { caption?: string; sort_order?: number }) =>
      adminFetch<{ id: number }>(`/gallery/images/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    reorderImages: (items: Array<{ id: number; sort_order: number }>) =>
      adminFetch<{ updated: number }>("/gallery/images/reorder", {
        method: "PUT",
        body: JSON.stringify({ items }),
      }),
    deleteImage: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/gallery/images/${id}`, {
        method: "DELETE",
      }),
    bulkDeleteImages: (ids: number[]) =>
      adminFetch<{ deleted: number }>("/gallery/images/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
      }),
  },

  // Contacts
  contacts: {
    list: () => adminFetch<Contact[]>("/contacts"),
    updateStatus: (id: number, status: string) =>
      adminFetch<{ id: number }>(`/contacts/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/contacts/${id}`, {
        method: "DELETE",
      }),
  },

  // Site Config
  siteConfig: {
    list: () => adminFetch<SiteConfig[]>("/site-config/all"),
    update: (entries: Record<string, string>) =>
      adminFetch<{ updated: number }>("/site-config", {
        method: "PUT",
        body: JSON.stringify(entries),
      }),
  },


  // Product Features
  features: {
    list: () => adminFetch<ProductFeature[]>("/product-features/all"),
    create: (data: Partial<ProductFeature>) =>
      adminFetch<{ id: number }>("/product-features", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<ProductFeature>) =>
      adminFetch<{ id: number }>(`/product-features/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/product-features/${id}`, {
        method: "DELETE",
      }),
    assignToProduct: (productId: number, featureIds: number[]) =>
      adminFetch<{ product_id: number; feature_count: number }>(
        `/product-features/assign/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({ feature_ids: featureIds }),
        },
      ),
  },

  // Quotation Requests (RFQ management)
  quotations: {
    list: (opts?: { status?: string; page?: number; limit?: number }) => {
      const params = new URLSearchParams();
      if (opts?.status) params.set("status", opts.status);
      if (opts?.page) params.set("page", String(opts.page));
      if (opts?.limit) params.set("limit", String(opts.limit));
      const qs = params.toString();
      return adminFetchPaginated<QuotationRequest>(
        `/quotations${qs ? `?${qs}` : ""}`,
      );
    },
    detail: (id: number) =>
      adminFetch<QuotationRequest>(`/quotations/${id}`),
    updateStatus: (id: number, status: string) =>
      adminFetch<{ id: number; status: string }>(`/quotations/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    delete: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/quotations/${id}`, {
        method: "DELETE",
      }),
    downloadExcel: async (id: number): Promise<void> => {
      const apiKey = getApiKey();
      const res = await fetch(`${API_URL}/admin/quotations/${id}/excel`, {
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`);
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?(.+?)"?$/);
      const filename = match?.[1] || `SLTECH_RFQ_${id}.xlsx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
};

// ─── Types (re-export for admin) ─────────────────────────────────────────────

export interface Solution {
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
  // Case study metadata
  system_types: string;
  brands_used: string;
  area_sqm: number | null;
  duration_months: number | null;
  key_metrics: string;
  compliance_standards: string;
  client_industry: string | null;
  project_scale: string | null;
  meta_title: string | null;
  meta_description: string | null;
  // B2B Portfolio fields
  completion_year: string | null;
  related_solutions: string;
  related_products: string;
  // Case Study fields (migration 0017)
  challenges: string | null;
  outcomes: string | null;
  testimonial_name: string | null;
  testimonial_content: string | null;
  video_url: string | null;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string | null;
  thumbnail_url: string | null;
  author: string;
  tags: string;
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
  references: string;              // JSON array string
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  category_id: number | null;
  brand_id: number | null;
  brand: string;
  model_number: string;
  image_url: string | null;
  gallery_urls: string;       // JSON array
  spec_sheet_url: string | null;
  specifications: string; // JSON
  features: string;       // JSON
  inventory_status: string; // 'in-stock' | 'pre-order' | 'contact'
  warranty: string;
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  brand_name?: string | null;
  brand_slug?: string | null;
  brand_logo?: string | null;
}

// ProductCategory re-exported from @/types (imported at top)

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

export interface Partner {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: number;
}

export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  description: string;
  category: string;
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

export interface Contact {
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

export interface SiteConfig {
  key: string;
  value: string;
}

export interface ProductFeature {
  id: number;
  name: string;
  slug: string;
  group_name: string;
  sort_order: number;
  is_active: number;
  color?: string | null;
  icon?: string | null;
  is_priority?: number;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  totalProjects: number;
  recentProducts: Array<{
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    brand_name: string | null;
    created_at: string;
  }>;
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

