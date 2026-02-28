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
    list: () => fetchApi<Solution[]>("/solutions"),
    get: (slug: string) => fetchApi<Solution>(`/solutions/${slug}`),
  },
  products: {
    list: (category?: string) =>
      fetchPaginated<Product>(
        `/products${category ? `?category=${category}` : ""}`,
      ),
    get: (slug: string) => fetchApi<Product>(`/products/${slug}`),
    categories: () => fetchApi<ProductCategory[]>("/product-categories"),
  },
  projects: {
    list: (page = 1, category?: string) =>
      fetchPaginated<Project>(
        `/projects?page=${page}${category ? `&category=${category}` : ""}`,
      ),
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
};
