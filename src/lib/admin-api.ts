/**
 * Admin API client — wraps fetchApi with X-API-Key header
 */

const API_URL = import.meta.env.VITE_API_URL;

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
    deleteAlbum: (id: number) =>
      adminFetch<{ deleted: boolean }>(`/gallery/albums/${id}`, {
        method: "DELETE",
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

  // Upload
  upload: adminUpload,
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
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  category_id: number | null;
  brand: string;
  model_number: string;
  image_url: string | null;
  spec_sheet_url: string | null;
  specifications: string; // JSON
  features: string;       // JSON
  sort_order: number;
  is_active: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: number;
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
  status: string;
  created_at: string;
}

export interface SiteConfig {
  key: string;
  value: string;
}
