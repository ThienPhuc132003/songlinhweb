/**
 * Admin API client — wraps fetchApi with X-API-Key header
 */

const API_URL = import.meta.env.VITE_API_URL || "";
import type {
  ProductCategory,
  QuotationRequest,
  Solution,
  Project,
  Post,
  Product,
  Brand,
  Partner,
  GalleryAlbum,
  GalleryImage,
  Contact,
  SiteConfig,
  ProductFeature,
  DashboardStats,
  AuditLog,
} from "@/types";
export type { ProductCategory };

/**
 * Login via backend — sends API key, receives HttpOnly session cookie.
 * Returns true if login succeeded.
 */
export async function loginWithKey(apiKey: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ api_key: apiKey }),
  });
  return res.ok;
}

/**
 * Logout — clears HttpOnly session cookie on the server.
 */
export async function logoutSession(): Promise<void> {
  await fetch(`${API_URL}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/**
 * Check if session is active by calling /api/admin/me.
 * Returns true if the HttpOnly cookie is valid.
 */
export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/admin/me`, {
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}


async function adminRequest(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const res = await fetch(`${API_URL}/admin${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include", // Send HttpOnly cookie automatically
    ...options,
  });

  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API Error ${res.status}`);
  }

  return res;
}

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await adminRequest(endpoint, options);
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
  const res = await adminRequest(endpoint, options);
  const json = await res.json();
  return {
    items: json.data ?? [],
    total: json.meta?.total ?? 0,
    page: json.meta?.page ?? 1,
    totalPages: json.meta?.totalPages ?? 1,
  };
}

async function adminUpload(file: File, folder?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  const res = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    credentials: "include", // Send HttpOnly cookie
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
  // Auth — uses /api/admin/me (cookie auto-sent)
  verify: () => adminFetch<{ authenticated: boolean }>("/me"),

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
    getSpecTemplates: () =>
      adminFetch<{ templates: Record<string, string[]>; mapping: Record<string, string> }>("/products/spec-templates"),
    updateSpecTemplates: (data: { templates: Record<string, string[]>; mapping?: Record<string, string> }) =>
      adminFetch<{ updated: boolean }>("/products/spec-templates", {
        method: "PUT",
        body: JSON.stringify(data),
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
    clearCache: () =>
      adminFetch<{ cleared: boolean }>("/site-config/clear-cache", {
        method: "POST",
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
      const res = await fetch(`${API_URL}/admin/quotations/${id}/excel`, {
        credentials: "include",
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

// ─── Types (re-export from canonical @/types) ────────────────────────────────
// All domain types are defined ONCE in @/types/index.ts.
// Admin pages import types from this file — we re-export so imports don't break.

export type {
  Solution,
  Project,
  Post,
  Product,
  Brand,
  Partner,
  GalleryAlbum,
  GalleryImage,
  Contact,
  SiteConfig,
  ProductFeature,
  DashboardStats,
  AuditLog,
} from "@/types";

