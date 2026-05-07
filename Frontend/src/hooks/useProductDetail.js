import { useApiQuery } from "./useApiQuery";

/**
 * Hook to fetch a single product by its ID.
 * @param {string | number} id - Product ID
 */
export function useProductDetail(id) {
  const result = useApiQuery({
    queryKey: ["product", id],
    url: `pharmacy/products/${id}`,
    enabled: Boolean(id),
  });

  // API returns: { data: { ...product fields } }
  const product = result.data?.data ?? null;

  return { ...result, product };
}
