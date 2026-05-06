import { useMemo } from "react";
import { useApiQuery } from "./useApiQuery";
import { DEFAULT_PAGE_SIZE } from "../constants/pharmacy";

/**
 * Builds a query string from an object, omitting undefined/empty values.
 * @param {Record<string, string | number | undefined>} params
 * @returns {string} e.g. "?search=vitamin&sortBy=price&sortOrder=asc&page=1&limit=12"
 */
function buildQueryString(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "" && val !== null) {
      qs.set(key, String(val));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
}

/**
 * Hook to fetch paginated pharmacy products with optional filters.
 *
 * @param {{
 *   search?: string;
 *   categoryName?: string;
 *   minPrice?: string | number;
 *   maxPrice?: string | number;
 *   sortBy?: string;
 *   sortOrder?: string;
 *   page?: number;
 *   limit?: number;
 * }} filters
 */
export function useProducts(filters = {}) {
  const {
    search,
    categoryName,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  } = filters;

  const queryString = useMemo(
    () =>
      buildQueryString({
        search: search || undefined,
        categoryName: categoryName || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
        page,
        limit,
      }),
    [search, categoryName, minPrice, maxPrice, sortBy, sortOrder, page, limit],
  );

  const result = useApiQuery({
    queryKey: ["products", queryString],
    url: `pharmacy/products${queryString}`,
    keepPreviousData: true, // keep old data visible while next page loads
  });

  // API returns: { data: { items, total, page, limit, totalPages } }
  const pagination = result.data?.data ?? {};
  const products = pagination.items ?? [];
  const total = pagination.total ?? 0;
  const totalPages = pagination.totalPages ?? 1;
  const currentPage = pagination.page ?? 1;

  return { ...result, products, total, totalPages, currentPage };
}
