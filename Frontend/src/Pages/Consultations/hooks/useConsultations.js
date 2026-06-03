import { useApiQuery } from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../../lib/apiClient";

/** Ambil detail satu konsultasi berdasarkan ID */
export function useConsultationDetail(id) {
  return useApiQuery({
    queryKey: ["consultation", id],
    url: `consultations/${id}`,
    enabled: !!id,
  });
}

/** Buat permintaan konsultasi baru ke dokter */
export function useRequestConsultation(options = {}) {
  return useApiMutation({
    url: "consultations/request",
    method: "POST",
    ...options,
  });
}

/** Proses pembayaran konsultasi via Midtrans */
export function usePayConsultation(id, options = {}) {
  return useApiMutation({
    url: `consultations/${id}/payment`,
    method: "POST",
    ...options,
  });
}

/** Ambil riwayat chat konsultasi */
export function useChatHistory(consultationId) {
  return useApiQuery({
    queryKey: ["chat", consultationId],
    url: `consultations/${consultationId}/messages`,
    enabled: !!consultationId,
  });
}

/** Kirim pesan di konsultasi */
export function useSendMessage(consultationId, options = {}) {
  return useApiMutation({
    url: `consultations/${consultationId}/messages`,
    method: "POST",
    ...options,
  });
}

/** Dokter merespons (terima/tolak) permintaan konsultasi */
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

/** Ambil semua konsultasi milik user yang sedang login (pasien atau dokter) */
export function useMyConsultations(options = {}) {
  return useApiQuery({
    queryKey: ["my-consultations"],
    url: "consultations/my",
    ...options,
  });
}

/**
 * Verifikasi status pembayaran dari Midtrans API.
 * Dipanggil setelah user kembali dari halaman pembayaran Midtrans.
 * Penting untuk dev/sandbox di mana webhook tidak bisa reach localhost.
 */
export function useVerifyPayment(consultationId, options = {}) {
  return useApiQuery({
    queryKey: ["verify-payment", consultationId],
    url: `consultations/${consultationId}/verify-payment`,
    enabled: !!consultationId,
    staleTime: 0,
    refetchOnMount: true,
    ...options,
  });
}
