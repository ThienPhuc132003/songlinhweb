import type { ApiResponse, PaginationParams } from "../types";

/** Build a success response */
export function ok<T>(data: T, meta?: ApiResponse["meta"]): Response {
  const body: ApiResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return Response.json(body);
}

/** Build a paginated success response */
export function paginated<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): Response {
  return ok(data, {
    page: params.page,
    totalPages: Math.ceil(total / params.limit),
    total,
  });
}

/** Build an error response */
export function err(message: string, status = 400): Response {
  const body: ApiResponse = { success: false, error: message };
  return Response.json(body, { status });
}

/** Parse pagination query params with sensible defaults */
export function parsePagination(url: URL): PaginationParams {
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit")) || 12),
  );
  return { page, limit };
}
