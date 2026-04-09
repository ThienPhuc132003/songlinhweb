import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ===== Products =====
export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: api.products.categories,
  });
}

export function useProductFeatures() {
  return useQuery({
    queryKey: ["product-features"],
    queryFn: api.productFeatures.list,
  });
}

export function useProducts(opts?: {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  tags?: string[];
}) {
  return useQuery({
    queryKey: ["products", opts],
    queryFn: () => api.products.list(opts),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.products.get(slug),
    enabled: !!slug,
  });
}

// ===== Brands =====
export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: api.brands.list,
  });
}

// ===== Projects =====
export function useProjects(opts?: {
  page?: number;
  category?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ["projects", opts],
    queryFn: () => api.projects.list(opts),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => api.projects.get(slug),
    enabled: !!slug,
  });
}

// ===== Posts =====
export function usePosts(page = 1, tag?: string) {
  return useQuery({
    queryKey: ["posts", page, tag],
    queryFn: () => api.posts.list(page, tag),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => api.posts.get(slug),
    enabled: !!slug,
  });
}

// ===== Gallery =====
export function useGalleryAlbums() {
  return useQuery({
    queryKey: ["gallery-albums"],
    queryFn: api.gallery.albums,
  });
}

export function useGalleryAlbum(slug: string) {
  return useQuery({
    queryKey: ["gallery-album", slug],
    queryFn: () => api.gallery.get(slug),
    enabled: !!slug,
  });
}

// ===== Partners =====
export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: api.partners,
  });
}

// ===== Contact =====
export function useContactSubmit() {
  return useMutation({
    mutationFn: api.contact,
  });
}

// ===== Site Config =====
export function useSiteConfig() {
  return useQuery({
    queryKey: ["site-config"],
    queryFn: api.siteConfig.get,
    staleTime: 5 * 60 * 1000, // 5 min — config rarely changes
  });
}
