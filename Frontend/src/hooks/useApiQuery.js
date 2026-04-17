import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";

export function useApiQuery({
  queryKey,
  url,
  method = "GET",
  body,
  headers,
  enabled = true,
  ...queryOptions
}) {
  return useQuery({
    queryKey,
    queryFn: () => apiFetch(url, { method, body, headers }),
    enabled: enabled && Boolean(url),
    ...queryOptions,
  });
}
