import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";

export function useConsultationDetail(id) {
  return useApiQuery({
    queryKey: ["consultation", id],
    url: `consultations/${id}`,
    enabled: !!id,
  });
}

export function useRequestConsultation(options = {}) {
  return useApiMutation({
    url: "consultations/request",
    method: "POST",
    ...options,
  });
}

export function usePayConsultation(id, options = {}) {
  return useApiMutation({
    url: `consultations/${id}/payment`,
    method: "POST",
    ...options,
  });
}

export function useChatHistory(consultationId) {
  return useApiQuery({
    queryKey: ["chat", consultationId],
    url: `consultations/${consultationId}/messages`,
    enabled: !!consultationId,
  });
}

export function useSendMessage(consultationId, options = {}) {
  return useApiMutation({
    url: `consultations/${consultationId}/messages`,
    method: "POST",
    ...options,
  });
}

export function useRespondToConsultation(options = {}) {
  const { onSuccess, onError, ...rest } = options;
  return useMutation({
    mutationFn: ({ consultationId, action }) =>
      apiFetch(`consultations/${consultationId}/respond`, {
        method: "PATCH",
        body: { action },
      }),
    onSuccess,
    onError,
    ...rest,
  });
}

/**
 * Fetch all consultations for the currently logged-in doctor.
 * Backend should support ?role=doctor or similar filter.
 */
export function useMyConsultations(options = {}) {
  return useApiQuery({
    queryKey: ["my-consultations"],
    url: "consultations/my",
    ...options,
  });
}
