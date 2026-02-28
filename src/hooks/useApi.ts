import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ===== Solutions =====
export function useSolutions() {
  return useQuery({
    queryKey: ["solutions"],
    queryFn: api.solutions.list,
  });
}

export function useSolution(slug: string) {
  return useQuery({
    queryKey: ["solution", slug],
    queryFn: () => api.solutions.get(slug),
    enabled: !!slug,
  });
}

// ===== Products =====
export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: api.products.categories,
  });
}

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: () => api.products.list(category),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.products.get(slug),
    enabled: !!slug,
  });
}

// ===== Projects =====
export function useProjects(page = 1, category?: string) {
  return useQuery({
    queryKey: ["projects", page, category],
    queryFn: () => api.projects.list(page, category),
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
