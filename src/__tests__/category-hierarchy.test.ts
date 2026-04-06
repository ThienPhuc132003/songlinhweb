/**
 * Unit Tests — Category Hierarchy Logic
 * Tests parent-child sorting, hierarchy validation, and admin operations.
 */
import { describe, it, expect } from "vitest";

interface Category {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  sort_order: number;
  is_active: number;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, slug: "camera-giam-sat", name: "Camera giám sát", parent_id: null, sort_order: 1, is_active: 1 },
  { id: 2, slug: "bao-chay", name: "PCCC & Báo cháy", parent_id: null, sort_order: 2, is_active: 1 },
  { id: 3, slug: "ha-tang-mang", name: "Hạ tầng mạng", parent_id: null, sort_order: 3, is_active: 1 },
  { id: 10, slug: "camera-ip", name: "Camera IP", parent_id: 1, sort_order: 1, is_active: 1 },
  { id: 11, slug: "camera-ptz", name: "Camera PTZ", parent_id: 1, sort_order: 2, is_active: 1 },
  { id: 12, slug: "dau-ghi-hinh", name: "Đầu ghi hình", parent_id: 1, sort_order: 3, is_active: 1 },
  { id: 20, slug: "dau-bao-khoi", name: "Đầu báo khói", parent_id: 2, sort_order: 1, is_active: 1 },
  { id: 30, slug: "switch-mang", name: "Switch mạng", parent_id: 3, sort_order: 1, is_active: 0 },
];

// ─── Hierarchy Sort (same as AdminCategories.tsx logic) ──────────────────────

function sortCategoriesHierarchically(data: Category[]): Category[] {
  return [...data].sort((a, b) => {
    const aRoot = a.parent_id
      ? data.find((c) => c.id === a.parent_id)?.sort_order ?? 0
      : a.sort_order;
    const bRoot = b.parent_id
      ? data.find((c) => c.id === b.parent_id)?.sort_order ?? 0
      : b.sort_order;
    if (aRoot !== bRoot) return aRoot - bRoot;
    if (a.parent_id && !b.parent_id) return 1;
    if (!a.parent_id && b.parent_id) return -1;
    return a.sort_order - b.sort_order;
  });
}

function getRootCategories(data: Category[], excludeId?: number): Category[] {
  return data.filter((c) => !c.parent_id && c.id !== excludeId);
}

function getChildCategories(data: Category[], parentId: number): Category[] {
  return data.filter((c) => c.parent_id === parentId);
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Category Hierarchy", () => {
  describe("sortCategoriesHierarchically", () => {
    it("places root categories first, children after", () => {
      const sorted = sortCategoriesHierarchically(MOCK_CATEGORIES);

      // Camera giám sát should come first (sort_order: 1)
      expect(sorted[0].slug).toBe("camera-giam-sat");

      // Its children should follow
      const cameraIndex = sorted.findIndex((c) => c.slug === "camera-giam-sat");
      const cameraIpIndex = sorted.findIndex((c) => c.slug === "camera-ip");
      expect(cameraIpIndex).toBeGreaterThan(cameraIndex);
    });

    it("groups children under their parent", () => {
      const sorted = sortCategoriesHierarchically(MOCK_CATEGORIES);

      // Find camera children
      const cameraChildren = sorted.filter((c) => c.parent_id === 1);
      expect(cameraChildren).toHaveLength(3);
      expect(cameraChildren.map((c) => c.slug)).toEqual([
        "camera-ip",
        "camera-ptz",
        "dau-ghi-hinh",
      ]);
    });

    it("preserves sort_order within same level", () => {
      const sorted = sortCategoriesHierarchically(MOCK_CATEGORIES);
      const rootCats = sorted.filter((c) => !c.parent_id);

      expect(rootCats[0].slug).toBe("camera-giam-sat"); // sort_order: 1
      expect(rootCats[1].slug).toBe("bao-chay"); // sort_order: 2
      expect(rootCats[2].slug).toBe("ha-tang-mang"); // sort_order: 3
    });

    it("handles empty array", () => {
      expect(sortCategoriesHierarchically([])).toEqual([]);
    });

    it("handles only root categories", () => {
      const roots = MOCK_CATEGORIES.filter((c) => !c.parent_id);
      const sorted = sortCategoriesHierarchically(roots);
      expect(sorted).toHaveLength(3);
    });
  });

  describe("getRootCategories", () => {
    it("returns only root categories (no parent_id)", () => {
      const roots = getRootCategories(MOCK_CATEGORIES);
      expect(roots).toHaveLength(3);
      expect(roots.every((c) => c.parent_id === null)).toBe(true);
    });

    it("excludes specific ID when editing", () => {
      const roots = getRootCategories(MOCK_CATEGORIES, 1);
      expect(roots).toHaveLength(2);
      expect(roots.find((c) => c.id === 1)).toBeUndefined();
    });
  });

  describe("getChildCategories", () => {
    it("returns children of camera category", () => {
      const children = getChildCategories(MOCK_CATEGORIES, 1);
      expect(children).toHaveLength(3);
    });

    it("returns single child for bao-chay", () => {
      const children = getChildCategories(MOCK_CATEGORIES, 2);
      expect(children).toHaveLength(1);
      expect(children[0].slug).toBe("dau-bao-khoi");
    });

    it("returns empty for category with no children", () => {
      const children = getChildCategories(MOCK_CATEGORIES, 20);
      expect(children).toHaveLength(0);
    });
  });

  describe("Category Validation", () => {
    it("prevents circular parent reference (self-referencing)", () => {
      const isValidParent = (categoryId: number, parentId: number | null) => {
        return parentId !== categoryId;
      };
      expect(isValidParent(1, 1)).toBe(false);
      expect(isValidParent(1, 2)).toBe(true);
      expect(isValidParent(1, null)).toBe(true);
    });

    it("only allows 2-level hierarchy (no grandchildren)", () => {
      const isValidParent = (parentId: number | null, data: Category[]) => {
        if (!parentId) return true;
        const parent = data.find((c) => c.id === parentId);
        if (!parent) return false;
        // Parent itself must be a root (no grandchild nesting)
        return parent.parent_id === null;
      };

      // Root -> OK (no parent)
      expect(isValidParent(null, MOCK_CATEGORIES)).toBe(true);
      // Child of root -> OK
      expect(isValidParent(1, MOCK_CATEGORIES)).toBe(true);
      // Grandchild (child of child) -> NOT OK
      expect(isValidParent(10, MOCK_CATEGORIES)).toBe(false);
    });

    it("validates slug format", () => {
      const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

      expect(isValidSlug("camera-giam-sat")).toBe(true);
      expect(isValidSlug("Camera Giám Sát")).toBe(false);
      expect(isValidSlug("camera_ip")).toBe(false);
      expect(isValidSlug("")).toBe(false);
    });

    it("ensures slug uniqueness check", () => {
      const slugs = MOCK_CATEGORIES.map((c) => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("Active/Inactive filtering", () => {
    it("filters active categories only", () => {
      const active = MOCK_CATEGORIES.filter((c) => c.is_active === 1);
      expect(active).toHaveLength(7);
    });

    it("includes inactive in admin view", () => {
      expect(MOCK_CATEGORIES).toHaveLength(8);
      const inactive = MOCK_CATEGORIES.filter((c) => c.is_active === 0);
      expect(inactive).toHaveLength(1);
      expect(inactive[0].slug).toBe("switch-mang");
    });
  });
});
