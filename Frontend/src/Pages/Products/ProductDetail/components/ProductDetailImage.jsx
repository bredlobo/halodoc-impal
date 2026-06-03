import { Pill } from "lucide-react";

function ProductDetailImage({ product, isOutOfStock }) {
  return (
    <div className="relative overflow-hidden rounded-[21px] bg-surface shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          style={{ minHeight: "320px" }}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "320px" }}
        >
          <Pill size={64} strokeWidth={1.5} className="text-text-secondary opacity-20" />
        </div>
      )}

      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-text-primary/50 backdrop-blur-sm">
          <span className="rounded-full bg-text-primary px-5 py-2 text-[14px] font-semibold text-white">
            Stok Habis
          </span>
        </div>
      )}
    </div>
  );
}

export default ProductDetailImage;
