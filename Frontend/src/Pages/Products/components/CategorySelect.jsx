import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

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
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[14px] font-medium transition-all duration-200 outline-none
          ${
            open
              ? "border-primary bg-background shadow-[0_0_0_3px_rgba(255,92,138,0.1)] text-text-primary"
              : value
              ? "border-primary bg-primary-light text-primary"
              : "border-border bg-surface text-text-secondary hover:border-primary hover:bg-background"
          }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 truncate">
          {/* Dot indicator */}
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-full transition-colors ${
              value ? "bg-primary" : "bg-border"
            }`}
          />
          <span className="truncate">{selectedLabel}</span>
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`shrink-0 text-text-secondary transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        >
          {/* All categories option */}
          <div className="px-2 pt-2">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => handleSelect("")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-semibold transition-colors duration-150
                ${
                  value === ""
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface"
                }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface text-[13px]">
                ✦
              </span>
              Semua Kategori
              {value === "" && (
                <Check size={16} strokeWidth={2.5} className="ml-auto text-primary" />
              )}
            </button>
          </div>

          {/* Divider */}
          {categories.length > 0 && (
            <div className="mx-4 my-1.5 border-t border-border" />
          )}

          {/* Category list */}
          <div className="max-h-52 overflow-y-auto px-2 pb-2 scrollbar-thin">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-1 flex items-center gap-2.5 rounded-xl px-3 py-2"
                >
                  <div className="h-6 w-6 animate-pulse rounded-lg bg-surface" />
                  <div
                    className="h-3.5 animate-pulse rounded bg-surface"
                    style={{ width: `${50 + i * 15}%` }}
                  />
                </div>
              ))
            ) : (
              categories.map((cat) => {
                const isSelected = value === cat.name;
                const initial = cat.name.charAt(0).toUpperCase();

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat.name)}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] transition-all duration-150
                      ${
                        isSelected
                          ? "bg-primary-light font-semibold text-primary"
                          : "font-medium text-text-primary hover:bg-surface"
                      }`}
                  >
                    {/* Avatar initial */}
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[13px] font-bold text-primary"
                    >
                      {initial}
                    </span>

                    <span className="truncate">{cat.name}</span>

                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} className="ml-auto shrink-0 text-primary" />
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
