import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const SpecificationsSchema = z.record(z.string(), z.union([z.string(), z.number()])).default({});
export const KeyMetricsSchema = z.array(z.object({
  label: z.string(),
  value: z.string()
})).default([]);

export const ProductJSONValidator = zValidator("json", z.object({
  specifications: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
  features: z.union([z.string(), z.array(z.string())]).optional(),
  gallery_urls: z.union([z.string(), z.array(z.string())]).optional()
}).passthrough(), (result, c) => {
  if (!result.success) {
    return c.json({ success: false, error: "Invalid JSON format for array/object fields: " + result.error.message }, 400);
  }
});

export const ProjectJSONValidator = zValidator("json", z.object({
  specifications: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
  key_metrics: z.union([z.string(), z.array(z.any())]).optional(),
  system_types: z.union([z.string(), z.array(z.string())]).optional(),
  brands_used: z.union([z.string(), z.array(z.string())]).optional(),
  compliance_standards: z.union([z.string(), z.array(z.string())]).optional(),
  gallery_urls: z.union([z.string(), z.array(z.string())]).optional()
}).passthrough(), (result, c) => {
  if (!result.success) {
    return c.json({ success: false, error: "Invalid JSON format for array/object fields: " + result.error.message }, 400);
  }
});
