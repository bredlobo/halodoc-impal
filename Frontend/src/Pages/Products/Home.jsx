import { useState } from "react";
import { useCategories, useProducts } from "../../hooks";
import {
  PRODUCT_SORT_OPTIONS,
  DEFAULT_SORT,
  SEARCH_DEBOUNCE_MS,
  DEFAULT_PAGE_SIZE,
} from "../../constants/pharmacy";
import ProductCardFull from "./components/ProductCardFull";
import ProductSkeleton from "./components/ProductSkeleton";
import CategorySelect from "./components/CategorySelect";
import Pagination from "./components/Pagination";

function ProductPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce search input and reset to page 1
  const [searchTimer, setSearchTimer] = useState(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    setSearchTimer(timer);
  };

  // Reset to page 1 whenever a filter/sort changes
  const handleCategoryChange = (val) => { setCategoryName(val); setPage(1); };
  const handleMinPriceChange = (e) => { setMinPrice(e.target.value); setPage(1); };
  const handleMaxPriceChange = (e) => { setMaxPrice(e.target.value); setPage(1); };
  const handleSortChange = (e) => { setSort(e.target.value); setPage(1); };

  // Build sort params from combined "sortBy:sortOrder" value
  const [sortBy, sortOrder] = sort.split(":");

  const { products, isLoading, isError, error, refetch, total, totalPages, currentPage } =
    useProducts({
      search: debouncedSearch,
      categoryName,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit: DEFAULT_PAGE_SIZE,
    });

  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const hasActiveFilters = debouncedSearch || categoryName || minPrice || maxPrice;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryName("");
    setMinPrice("");
    setMaxPrice("");
    setSort(DEFAULT_SORT);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold tracking-widest text-red-600 uppercase">
            Apotek Digital
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Produk Kesehatan Terpercaya
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Temukan obat-obatan, suplemen, dan alat kesehatan berkualitas. Pesan
            mudah, kirim cepat langsung ke pintumu.
          </p>

          {/* ── Search Bar ──────────────────────────────────────────────── */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-red-400/40">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 10.65 10.65z"
              />
            </svg>
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari produk, obat, suplemen..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setPage(1);
                }}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Filter toggle */}
            <button
              id="toggle-filters"
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filtersOpen
                  ? "border-red-300 bg-red-50 text-red-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-red-500"
              }`}
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.3 8.4V19a1 1 0 0 1-1.4.9l-4-2A1 1 0 0 1 9 17v-4.8L3.2 4.6A1 1 0 0 1 3 4z"
                />
              </svg>
              Filter
              {hasActiveFilters && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  !
                </span>
              )}
            </button>

            {/* Result count */}
            <p className="text-xs text-slate-500">
              {isLoading
                ? "Memuat..."
                : `${total} produk · halaman ${currentPage} / ${totalPages}`}
            </p>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="hidden text-xs text-slate-500 sm:block"
              >
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={handleSortChange}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-none transition-colors outline-none hover:border-red-200"
              >
                {PRODUCT_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Expandable Filters Panel ─────────────────────────────────── */}
          {filtersOpen && (
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 pb-4 sm:grid-cols-3">
              {/* Category filter */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Kategori
                </label>
                <CategorySelect
                  categories={categories}
                  value={categoryName}
                  onChange={handleCategoryChange}
                  isLoading={isCategoriesLoading}
                />
              </div>

              {/* Min price */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Harga Minimum (Rp)
                </label>
                <input
                  id="filter-min-price"
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Max price */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Harga Maksimum (Rp)
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="1.000.000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <div className="flex justify-end sm:col-span-3">
                  <button
                    id="clear-filters"
                    onClick={clearFilters}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-red-200 hover:text-red-500"
                  >
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Products Grid ──────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
              <span className="mb-4 text-5xl">⚠️</span>
              <h3 className="text-base font-bold text-slate-800">
                Gagal memuat produk
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {error?.message || "Terjadi kesalahan saat mengambil data."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-6xl opacity-40">🔍</span>
              <h3 className="text-lg font-bold text-slate-700">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                Coba ubah kata kunci pencarian atau hapus filter yang aktif.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-red-200 hover:text-red-500"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}

          {/* Product grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCardFull key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isError && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              limit={DEFAULT_PAGE_SIZE}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
