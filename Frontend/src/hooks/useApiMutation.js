import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";

export function useApiMutation({
  url,
  method = "POST",
  headers,
  invalidateQueryKeys = [],
  onSuccess,
  ...mutationOptions
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => apiFetch(url, { method, body: payload, headers }),
    onSuccess: async (data, variables, context) => {
      if (invalidateQueryKeys.length > 0) {
        await Promise.all(
          invalidateQueryKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey })
          )
        );
      }

      if (onSuccess) {
        await onSuccess(data, variables, context);
      }
    },
    ...mutationOptions,
  });
}
