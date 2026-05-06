// ─── Product sort options ─────────────────────────────────────────────────────
export const PRODUCT_SORT_OPTIONS = [
  { label: "Terbaru", value: "createdAt:desc" },
  { label: "Harga Termurah", value: "price:asc" },
  { label: "Harga Termahal", value: "price:desc" },
  { label: "Nama A–Z", value: "name:asc" },
  { label: "Stok Terbanyak", value: "stock:desc" },
];

// ─── Default sort value ───────────────────────────────────────────────────────
export const DEFAULT_SORT = "createdAt:desc";

// ─── Debounce delay (ms) ──────────────────────────────────────────────────────
export const SEARCH_DEBOUNCE_MS = 400;
