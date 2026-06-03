/* ─────────────────────────────────────────────────────────────────────────
 * Consultation Status Constants — statusConfig.js
 * Konfigurasi tampilan untuk status konsultasi dan pembayaran
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Konfigurasi tampilan lengkap untuk setiap status konsultasi.
 * Digunakan di MyConsultations & ConsultationCard.
 */
export const CONSULTATION_STATUS = {
  REQUESTED: {
    label: "Menunggu Dokter",
    emoji: "⏳",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-blue-400 animate-pulse",
    desc: "Dokter belum menerima permintaanmu",
  },
  ONGOING: {
    label: "Sedang Berlangsung",
    emoji: "💬",
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
    dot: "bg-green-400 animate-pulse",
    desc: "Klik untuk masuk ke ruang chat",
  },
  COMPLETED: {
    label: "Selesai",
    emoji: "✅",
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
    desc: "Konsultasi telah selesai",
  },
  CANCELLED: {
    label: "Dibatalkan",
    emoji: "❌",
    bg: "bg-red-50",
    text: "text-red-600",
    ring: "ring-red-200",
    dot: "bg-red-400",
    desc: "Konsultasi dibatalkan",
  },
};

/**
 * Konfigurasi tampilan untuk status pembayaran.
 * Digunakan di MyConsultations & ConsultationCard.
 */
export const PAYMENT_STATUS = {
  PENDING: { label: "Belum Bayar", color: "text-amber-600", bg: "bg-amber-50" },
  PAID:    { label: "Sudah Bayar", color: "text-green-600", bg: "bg-green-50" },
  REFUNDED:{ label: "Dikembalikan", color: "text-slate-500", bg: "bg-slate-50" },
};

/**
 * Class styles untuk badge status konsultasi (ring variant).
 * Digunakan di ConsultationPayment.
 */
export const STATUS_BADGE_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700 ring-blue-100",
  ONGOING:   "bg-amber-50 text-amber-700 ring-amber-100",
  COMPLETED: "bg-green-50 text-green-700 ring-green-100",
  CANCELLED: "bg-red-50 text-red-700 ring-red-100",
};

/**
 * Class styles untuk badge status pembayaran (ring variant).
 * Digunakan di ConsultationPayment.
 */
export const PAYMENT_BADGE_STYLES = {
  PENDING:  "bg-yellow-50 text-yellow-700 ring-yellow-100",
  PAID:     "bg-green-50 text-green-700 ring-green-100",
  REFUNDED: "bg-slate-50 text-slate-700 ring-slate-100",
};
