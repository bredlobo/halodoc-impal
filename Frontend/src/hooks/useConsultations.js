import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";

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
