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
import { Search, X, SlidersHorizontal, AlertTriangle } from "lucide-react";

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

  const inputClass = "w-full rounded-xl border border-border bg-surface px-3 py-2 text-[14px] text-text-primary placeholder-text-secondary transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,92,138,0.1)]";

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
            Apotek Digital
          </span>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.25] tracking-[-0.01em] text-text-primary sm:text-[40px]">
            Produk Kesehatan Terpercaya
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.55] text-text-secondary sm:text-[18px] sm:leading-[1.50]">
            Temukan obat-obatan, suplemen, dan alat kesehatan berkualitas. Pesan
            mudah, kirim cepat langsung ke pintumu.
          </p>

          {/* ── Search Bar ──────────────────────────────────────────────── */}
          <div className="mx-auto mt-[21px] flex max-w-xl items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 transition-shadow focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(255,92,138,0.1)]">
            <Search size={16} strokeWidth={2} className="shrink-0 text-text-secondary" />
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari produk, obat, suplemen..."
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-secondary outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setPage(1);
                }}
                className="text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Hapus pencarian"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Filter toggle */}
            <button
              id="toggle-filters"
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[14px] font-semibold transition-all duration-200 ${
                filtersOpen
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-background text-text-primary hover:border-primary hover:text-primary"
              }`}
            >
              <SlidersHorizontal size={16} strokeWidth={2} />
              Filter
              {hasActiveFilters && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  !
                </span>
              )}
            </button>

            {/* Result count */}
            <p className="text-[13px] text-text-secondary">
              {isLoading
                ? "Memuat..."
                : `${total} produk · halaman ${currentPage} / ${totalPages}`}
            </p>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="hidden text-[13px] text-text-secondary sm:block"
              >
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={handleSortChange}
                className="cursor-pointer rounded-xl border border-border bg-background px-3 py-2 text-[13px] font-medium text-text-primary shadow-none transition-colors outline-none hover:border-primary"
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
            <div className="grid grid-cols-1 gap-3 border-t border-border pt-3 pb-4 sm:grid-cols-3">
              {/* Category filter */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold tracking-wider text-text-secondary uppercase">
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
                <label className="mb-1.5 block text-[13px] font-semibold tracking-wider text-text-secondary uppercase">
                  Harga Minimum (Rp)
                </label>
                <input
                  id="filter-min-price"
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              {/* Max price */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold tracking-wider text-text-secondary uppercase">
                  Harga Maksimum (Rp)
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="1.000.000"
                  className={inputClass}
                />
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <div className="flex justify-end sm:col-span-3">
                  <button
                    id="clear-filters"
                    onClick={clearFilters}
                    className="rounded-xl bg-surface px-4 py-1.5 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
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
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-error-light py-20 text-center">
              <AlertTriangle size={40} strokeWidth={1.75} className="mb-4 text-error" />
              <h3 className="text-[16px] font-semibold text-text-primary">
                Gagal memuat produk
              </h3>
              <p className="mt-1 max-w-sm text-[14px] text-text-secondary">
                {error?.message || "Terjadi kesalahan saat mengambil data."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search size={48} strokeWidth={1.5} className="mb-4 text-text-secondary opacity-40" />
              <h3 className="text-[18px] font-semibold text-text-primary">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 max-w-xs text-[14px] text-text-secondary">
                Coba ubah kata kunci pencarian atau hapus filter yang aktif.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-surface px-5 py-2.5 text-[14px] font-semibold text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}

          {/* Product grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
