import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination component.
 *
 * Props:
 *   currentPage  – 1-based current page number
 *   totalPages   – total number of pages
 *   total        – total number of items
 *   limit        – items per page
 *   onPageChange – (page: number) => void
 *   isLoading    – dims the controls while fetching
 */
function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  isLoading = false,
}) {
  if (totalPages <= 1) return null;

  // Compute window of page numbers to display
  const buildPages = () => {
    const delta = 2; // pages shown on each side of current
    const pages = [];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = buildPages();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const btnBase =
    "flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl px-3 text-[14px] font-semibold transition-all duration-200 select-none";

  return (
    <div
      className={`mt-[34px] flex flex-col items-center gap-4 sm:flex-row sm:justify-between transition-opacity duration-200 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Info text */}
      <p className="text-[13px] text-text-secondary">
        Menampilkan{" "}
        <span className="font-semibold text-text-primary">
          {startItem}–{endItem}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-text-primary">{total}</span> produk
      </p>

      {/* Page controls */}
      <nav aria-label="Navigasi halaman" className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className={`${btnBase} border border-border bg-background text-text-secondary hover:border-primary hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-text-secondary`}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-8 items-center justify-center text-[14px] text-text-secondary"
            >
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`${btnBase} ${
                page === currentPage
                  ? "bg-primary text-white shadow-sm hover:bg-primary-hover"
                  : "border border-border bg-background text-text-secondary hover:border-primary hover:bg-primary-light hover:text-primary"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className={`${btnBase} border border-border bg-background text-text-secondary hover:border-primary hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-text-secondary`}
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
