import { useMemo } from "react";
import { useApiQuery } from "./useApiQuery";

/**
 * Builds a query string from an object, omitting undefined/empty values.
 * @param {Record<string, string | number | undefined>} params
 * @returns {string} e.g. "?search=vitamin&sortBy=price&sortOrder=asc"
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
 * Hook to fetch all pharmacy products with optional filters.
 *
 * @param {{
 *   search?: string;
 *   categoryName?: string;
 *   minPrice?: string | number;
 *   maxPrice?: string | number;
 *   sortBy?: string;
 *   sortOrder?: string;
 * }} filters
 */
export function useProducts(filters = {}) {
  const { search, categoryName, minPrice, maxPrice, sortBy, sortOrder } =
    filters;

  const queryString = useMemo(
    () =>
      buildQueryString({
        search: search || undefined,
        categoryName: categoryName || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    [search, categoryName, minPrice, maxPrice, sortBy, sortOrder],
  );

  const result = useApiQuery({
    queryKey: ["products", queryString],
    url: `pharmacy/products${queryString}`,
  });

  const products = result.data?.data ?? [];

  return { ...result, products, queryString };
}
