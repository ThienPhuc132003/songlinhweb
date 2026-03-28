import type {
  Solution,
  Product,
  ProductCategory,
  Project,
  Post,
  GalleryAlbum,
  GalleryImage,
  Partner,
  ContactForm,
  PaginatedResponse,
  EntityImage,
  QuoteRequestPayload,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      `API Error ${res.status}: ${res.statusText}${errorBody ? ` — ${errorBody}` : ""}`,
    );
  }

  const json = await res.json();
  return json.data;
}

/** Fetch paginated endpoint — returns { items, total, page, totalPages } */
async function fetchPaginated<T>(
  endpoint: string,
): Promise<PaginatedResponse<T>> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      `API Error ${res.status}: ${res.statusText}${errorBody ? ` — ${errorBody}` : ""}`,
    );
  }

  const json = await res.json();
  return {
    items: json.data,
    total: json.meta?.total ?? 0,
    page: json.meta?.page ?? 1,
    totalPages: json.meta?.totalPages ?? 1,
  };
}

export const api = {
  solutions: {
    list: (search?: string) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const qs = params.toString();
      return fetchApi<Solution[]>(`/solutions${qs ? `?${qs}` : ""}`);
    },
    get: (slug: string) => fetchApi<Solution>(`/solutions/${slug}`),
  },
  products: {
    list: (opts?: { category?: string; brand?: string; search?: string; page?: number; limit?: number }) => {
      const params = new URLSearchParams();
      if (opts?.category) params.set("category", opts.category);
      if (opts?.brand) params.set("brand", opts.brand);
      if (opts?.search) params.set("search", opts.search);
      if (opts?.page) params.set("page", String(opts.page));
      if (opts?.limit) params.set("limit", String(opts.limit));
      const qs = params.toString();
      return fetchPaginated<Product>(`/products${qs ? `?${qs}` : ""}`);
    },
    get: (slug: string) => fetchApi<Product & { images?: EntityImage[]; related?: Product[] }>(`/products/${slug}`),
    categories: () => fetchApi<ProductCategory[]>(`/product-categories`),
  },
  brands: {
    list: () => fetchApi<Array<{ id: number; slug: string; name: string; logo_url: string | null; description: string }>>(`/brands`),
    get: (slug: string) => fetchApi<{ id: number; slug: string; name: string; logo_url: string | null; description: string; website_url: string | null }>(`/brands/${slug}`),
  },
  projects: {
    list: (opts?: { page?: number; category?: string; featured?: boolean }) => {
      const params = new URLSearchParams();
      if (opts?.page) params.set("page", String(opts.page));
      if (opts?.category) params.set("category", opts.category);
      if (opts?.featured) params.set("featured", "true");
      const qs = params.toString();
      return fetchPaginated<Project>(`/projects${qs ? `?${qs}` : ""}`);
    },
    get: (slug: string) => fetchApi<Project>(`/projects/${slug}`),
  },
  posts: {
    list: (page = 1, tag?: string) =>
      fetchPaginated<Post>(`/posts?page=${page}${tag ? `&tag=${tag}` : ""}`),
    get: (slug: string) => fetchApi<Post>(`/posts/${slug}`),
  },
  gallery: {
    albums: () => fetchApi<GalleryAlbum[]>("/gallery"),
    get: (slug: string) =>
      fetchApi<GalleryAlbum & { images: GalleryImage[] }>(`/gallery/${slug}`),
  },
  partners: () => fetchApi<Partner[]>("/partners"),
  contact: (data: ContactForm) =>
    fetchApi<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  quotes: {
    submit: (data: QuoteRequestPayload) =>
      fetchApi<{ message: string }>("/quotes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};

