import { useApiQuery } from "./useApiQuery";

/**
 * Hook to fetch all pharmacy categories from the backend.
 * Returns a flat array of { id, name, description } sorted by name.
 */
export function useCategories() {
  const result = useApiQuery({
    queryKey: ["pharmacy-categories"],
    url: "pharmacy/categories",
    staleTime: 5 * 60 * 1000, // cache for 5 minutes — categories change rarely
  });

  const categories = result.data?.data ?? [];

  return { ...result, categories };
}
