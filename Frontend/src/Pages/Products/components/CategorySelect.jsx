import { useState, useRef, useEffect } from "react";

/**
 * Custom styled category dropdown.
 *
 * Props:
 *   categories  – array of { id, name }
 *   value       – currently selected category name (empty string = all)
 *   onChange    – (categoryName: string) => void
 *   isLoading   – show skeleton options while categories are fetching
 */
function CategorySelect({ categories = [], value, onChange, isLoading = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedLabel = value
    ? categories.find((c) => c.name === value)?.name ?? value
    : "Semua Kategori";

  const handleSelect = (name) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger button */}
      <button
        id="filter-category"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 outline-none
          ${
            open
              ? "border-red-300 bg-white ring-2 ring-red-100 text-slate-800"
              : value
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-white"
          }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 truncate">
          {/* Dot indicator */}
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-full transition-colors ${
              value ? "bg-red-500" : "bg-slate-300"
            }`}
          />
          <span className="truncate">{selectedLabel}</span>
        </span>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-red-500" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-30 mt-1.5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ animationDuration: "150ms" }}
        >
          {/* All categories option */}
          <div className="px-2 pt-2">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => handleSelect("")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-150
                ${
                  value === ""
                    ? "bg-red-50 text-red-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs">
                ✦
              </span>
              Semua Kategori
              {value === "" && (
                <svg
                  className="ml-auto h-4 w-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Divider */}
          {categories.length > 0 && (
            <div className="mx-4 my-1.5 border-t border-slate-100" />
          )}

          {/* Category list */}
          <div className="max-h-52 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-1 flex items-center gap-2.5 rounded-xl px-3 py-2"
                >
                  <div className="h-6 w-6 animate-pulse rounded-lg bg-slate-200" />
                  <div
                    className="h-3.5 animate-pulse rounded bg-slate-200"
                    style={{ width: `${50 + i * 15}%` }}
                  />
                </div>
              ))
            ) : (
              categories.map((cat, i) => {
                const isSelected = value === cat.name;
                // Soft colour palette cycling through a few red-adjacent hues
                const palettes = [
                  "bg-red-100 text-red-600",
                  "bg-rose-100 text-rose-600",
                  "bg-orange-100 text-orange-600",
                  "bg-pink-100 text-pink-600",
                  "bg-amber-100 text-amber-600",
                ];
                const palette = palettes[i % palettes.length];
                const initial = cat.name.charAt(0).toUpperCase();

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat.name)}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150
                      ${
                        isSelected
                          ? "bg-red-50 font-semibold text-red-600"
                          : "font-medium text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {/* Avatar initial */}
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${palette}`}
                    >
                      {initial}
                    </span>

                    <span className="truncate">{cat.name}</span>

                    {isSelected && (
                      <svg
                        className="ml-auto h-4 w-4 shrink-0 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategorySelect;
