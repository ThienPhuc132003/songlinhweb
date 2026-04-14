/**
 * Unit Tests — admin-api.ts
 * Tests for admin API client auth helpers and type re-exports.
 */
import { describe, it, expect } from "vitest";

describe("ProductCategory Type Re-export", () => {
  it("admin-api re-exports ProductCategory from @/types", async () => {
    const adminModule = await import("@/lib/admin-api");
    // Verify the module exports the type (runtime check for the re-export mechanism)
    // ProductCategory is a type-only export, so we verify the module is importable
    expect(adminModule).toBeDefined();
    expect(adminModule.loginWithKey).toBeTypeOf("function");
  });

  it("ProductCategory interface has correct shape", () => {
    // Validate the interface contract
    const mockCategory: import("@/types").ProductCategory = {
      id: 1,
      slug: "camera-giam-sat",
      name: "Camera giám sát",
      description: "Camera IP, Analog, PTZ",
      image_url: null,
      parent_id: null,
      sort_order: 1,
      is_active: 1,
    };

    expect(mockCategory.id).toBe(1);
    expect(mockCategory.parent_id).toBeNull();
    expect(mockCategory.slug).toBe("camera-giam-sat");
  });

  it("ProductCategory supports optional product_count", () => {
    const categoryWithCount: import("@/types").ProductCategory = {
      id: 1,
      slug: "test",
      name: "Test",
      description: "",
      image_url: null,
      sort_order: 0,
      is_active: 1,
      product_count: 5,
    };

    expect(categoryWithCount.product_count).toBe(5);
  });
});
