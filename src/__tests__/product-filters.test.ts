/**
 * Unit Tests — Product Filtering Logic
 * Tests client-side filtering, pagination, and tag matching
 * extracted from Products.tsx logic.
 */
import { describe, it, expect } from "vitest";

// ─── Sample Data (mirrors SAMPLE_PRODUCTS shape) ────────────────────────────

const MOCK_PRODUCTS = [
  {
    id: 1,
    slug: "hikvision-ds-2cd2143g2-i",
    name: "Camera IP Dome 4MP AcuSense",
    brand: "Hikvision",
    model_number: "DS-2CD2143G2-I",
    description: "Camera dome hồng ngoại 4MP",
    category_slug: "camera-giam-sat",
    features: ["4MP", "AcuSense AI", "IP67", "IK10", "PoE", "DarkFighter"],
    is_active: 1,
  },
  {
    id: 2,
    slug: "dahua-dh-ipc-hdbw3441e-as",
    name: "Camera IP Dome AI 4MP WizSense",
    brand: "Dahua",
    model_number: "DH-IPC-HDBW3441E-AS",
    description: "Camera Dome 4MP WizSense AI",
    category_slug: "camera-giam-sat",
    features: ["4MP", "WizSense AI", "SMD 3.0", "IP67", "PoE", "IK10"],
    is_active: 1,
  },
  {
    id: 3,
    slug: "cisco-isr-1111-8p",
    name: "Router Enterprise ISR 1111",
    brand: "Cisco",
    model_number: "ISR1111-8P",
    description: "Router ISR 1111 với 8 GE/4 PoE+",
    category_slug: "ha-tang-mang",
    features: ["SD-WAN", "Firewall", "4 PoE+ Ports", "VPN"],
    is_active: 1,
  },
  {
    id: 4,
    slug: "honeywell-tc806b1076",
    name: "Đầu báo khói quang điện",
    brand: "Honeywell",
    model_number: "TC806B1076",
    description: "Đầu báo khói quang điện thông minh",
    category_slug: "bao-chay",
    features: ["Chống cháy UL", "FM Approved", "2 SLC Loops", "Addressable"],
    is_active: 1,
  },
  {
    id: 5,
    slug: "toa-a-2240",
    name: "Mixer Amplifier 240W",
    brand: "TOA",
    model_number: "A-2240",
    description: "Mixer amplifier 240W, 5 inputs",
    category_slug: "am-thanh-thong-bao",
    features: ["240W", "5 Inputs", "100V Line", "Chống cháy"],
    is_active: 1,
  },
];

// ─── Filter Functions (extracted from Products.tsx logic) ────────────────────

function filterByCategory<T extends { category_slug?: string }>(
  products: T[],
  category?: string,
): T[] {
  if (!category) return products;
  return products.filter((p) => p.category_slug === category);
}

function filterByBrand<T extends { brand?: string }>(
  products: T[],
  brand?: string,
): T[] {
  if (!brand) return products;
  return products.filter(
    (p) => p.brand?.toLowerCase() === brand.toLowerCase(),
  );
}

function filterBySearch<T extends { name?: string; model_number?: string; description?: string; brand?: string }>(
  products: T[],
  search?: string,
): T[] {
  if (!search) return products;
  const q = search.toLowerCase();
  return products.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.model_number?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q),
  );
}

function filterByTags<T extends { features?: string | string[] }>(
  products: T[],
  tags: string[],
): T[] {
  if (tags.length === 0) return products;
  return products.filter((p) => {
    let productFeatures: string[] = [];
    if (typeof p.features === "string") {
      try {
        productFeatures = JSON.parse(p.features);
      } catch {
        productFeatures = [];
      }
    } else if (Array.isArray(p.features)) {
      productFeatures = p.features;
    }
    return tags.every((tag) =>
      productFeatures.some((f) => f.toLowerCase() === tag.toLowerCase()),
    );
  });
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Product Filtering", () => {
  describe("filterByCategory", () => {
    it("returns all products when no category specified", () => {
      expect(filterByCategory(MOCK_PRODUCTS)).toHaveLength(5);
    });

    it("filters by camera category", () => {
      const result = filterByCategory(MOCK_PRODUCTS, "camera-giam-sat");
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category_slug === "camera-giam-sat")).toBe(true);
    });

    it("returns empty for non-existent category", () => {
      expect(filterByCategory(MOCK_PRODUCTS, "non-existent")).toHaveLength(0);
    });

    it("filters single-product category correctly", () => {
      const result = filterByCategory(MOCK_PRODUCTS, "bao-chay");
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe("Honeywell");
    });
  });

  describe("filterByBrand", () => {
    it("returns all when no brand specified", () => {
      expect(filterByBrand(MOCK_PRODUCTS)).toHaveLength(5);
    });

    it("filters by brand case-insensitively", () => {
      const result = filterByBrand(MOCK_PRODUCTS, "hikvision");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("hikvision-ds-2cd2143g2-i");
    });

    it("handles uppercase brand input", () => {
      const result = filterByBrand(MOCK_PRODUCTS, "CISCO");
      expect(result).toHaveLength(1);
    });

    it("returns empty for unknown brand", () => {
      expect(filterByBrand(MOCK_PRODUCTS, "Samsung")).toHaveLength(0);
    });
  });

  describe("filterBySearch", () => {
    it("returns all when no search term", () => {
      expect(filterBySearch(MOCK_PRODUCTS)).toHaveLength(5);
    });

    it("matches by product name", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "Mixer");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("toa-a-2240");
    });

    it("matches by model number", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "ISR1111");
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe("Cisco");
    });

    it("matches by brand name", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "dahua");
      expect(result).toHaveLength(1);
    });

    it("matches by description content", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "hồng ngoại");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("hikvision-ds-2cd2143g2-i");
    });

    it("returns multiple matches for broad search", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "4MP");
      expect(result).toHaveLength(2); // Hikvision + Dahua
    });

    it("is case-insensitive", () => {
      const result = filterBySearch(MOCK_PRODUCTS, "CAMERA");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("filterByTags", () => {
    it("returns all when no tags selected", () => {
      expect(filterByTags(MOCK_PRODUCTS, [])).toHaveLength(5);
    });

    it("filters by single tag", () => {
      const result = filterByTags(MOCK_PRODUCTS, ["PoE"]);
      expect(result).toHaveLength(2); // Hikvision + Dahua cameras
    });

    it("filters by multiple tags (AND logic)", () => {
      const result = filterByTags(MOCK_PRODUCTS, ["4MP", "AcuSense AI"]);
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe("Hikvision");
    });

    it("is case-insensitive", () => {
      const result = filterByTags(MOCK_PRODUCTS, ["poe"]);
      expect(result).toHaveLength(2);
    });

    it("returns empty when tags don't match any product", () => {
      const result = filterByTags(MOCK_PRODUCTS, ["NonExistentTag"]);
      expect(result).toHaveLength(0);
    });

    it("handles JSON string features (API format)", () => {
      const apiProduct = {
        ...MOCK_PRODUCTS[0],
        features: JSON.stringify(["4MP", "PoE", "IP67"]),
      };
      const result = filterByTags([apiProduct], ["IP67"]);
      expect(result).toHaveLength(1);
    });

    it("handles malformed JSON features gracefully", () => {
      const badProduct = {
        ...MOCK_PRODUCTS[0],
        features: "not-json",
      };
      const result = filterByTags([badProduct], ["PoE"]);
      expect(result).toHaveLength(0); // gracefully returns empty
    });
  });

  describe("Combined Filters", () => {
    it("filters by category + brand", () => {
      let result = filterByCategory(MOCK_PRODUCTS, "camera-giam-sat");
      result = filterByBrand(result, "Dahua");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("dahua-dh-ipc-hdbw3441e-as");
    });

    it("filters by category + tag", () => {
      let result = filterByCategory(MOCK_PRODUCTS, "camera-giam-sat");
      result = filterByTags(result, ["AcuSense AI"]);
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe("Hikvision");
    });

    it("filters by search + tag", () => {
      let result = filterBySearch(MOCK_PRODUCTS, "Camera");
      result = filterByTags(result, ["IP67"]);
      expect(result).toHaveLength(2);
    });
  });
});

describe("Pagination", () => {
  const items = Array.from({ length: 13 }, (_, i) => ({ id: i + 1 }));

  it("returns first page correctly", () => {
    const result = paginate(items, 1, 8);
    expect(result).toHaveLength(8);
    expect(result[0].id).toBe(1);
    expect(result[7].id).toBe(8);
  });

  it("returns second page with remaining items", () => {
    const result = paginate(items, 2, 8);
    expect(result).toHaveLength(5); // 13 - 8 = 5
    expect(result[0].id).toBe(9);
  });

  it("returns empty for out-of-range page", () => {
    const result = paginate(items, 3, 8);
    expect(result).toHaveLength(0);
  });

  it("calculates total pages correctly", () => {
    const totalPages = Math.max(1, Math.ceil(items.length / 8));
    expect(totalPages).toBe(2);
  });

  it("handles empty array", () => {
    const result = paginate([], 1, 8);
    expect(result).toHaveLength(0);
  });

  it("handles single-page data", () => {
    const smallData = items.slice(0, 3);
    const result = paginate(smallData, 1, 8);
    expect(result).toHaveLength(3);
  });
});
