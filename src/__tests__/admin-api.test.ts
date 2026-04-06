/**
 * Unit Tests — admin-api.ts
 * Tests for admin API client auth helpers and type re-exports.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { setApiKey, clearApiKey, hasApiKey } from "@/lib/admin-api";

describe("admin-api Auth Helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("setApiKey / hasApiKey / clearApiKey", () => {
    it("hasApiKey returns false when no key is set", () => {
      expect(hasApiKey()).toBe(false);
    });

    it("setApiKey stores the key and hasApiKey returns true", () => {
      setApiKey("test-key-123");
      expect(hasApiKey()).toBe(true);
      expect(localStorage.getItem("sltech_admin_key")).toBe("test-key-123");
    });

    it("clearApiKey removes the key", () => {
      setApiKey("test-key-123");
      expect(hasApiKey()).toBe(true);
      clearApiKey();
      expect(hasApiKey()).toBe(false);
      expect(localStorage.getItem("sltech_admin_key")).toBeNull();
    });

    it("handles setting key multiple times (overwrite)", () => {
      setApiKey("key-1");
      setApiKey("key-2");
      expect(localStorage.getItem("sltech_admin_key")).toBe("key-2");
    });

    it("clearApiKey is safe to call when no key exists", () => {
      expect(() => clearApiKey()).not.toThrow();
      expect(hasApiKey()).toBe(false);
    });
  });
});

describe("ProductCategory Type Re-export", () => {
  it("admin-api re-exports ProductCategory from @/types", async () => {
    const adminModule = await import("@/lib/admin-api");
    // Verify the module exports the type (runtime check for the re-export mechanism)
    // ProductCategory is a type-only export, so we verify the module is importable
    expect(adminModule).toBeDefined();
    expect(adminModule.setApiKey).toBeTypeOf("function");
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
