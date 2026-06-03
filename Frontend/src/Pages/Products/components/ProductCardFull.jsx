import { Link } from "react-router-dom";
import { Pill } from "lucide-react";

function ProductCardFull({ product }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-background shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Pill size={40} strokeWidth={1.5} className="text-text-secondary opacity-30" />
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-text-primary/50">
            <span className="rounded-full bg-text-primary px-3 py-1 text-[13px] font-semibold text-white">
              Stok Habis
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 rounded-full bg-warning px-2.5 py-1 text-[11px] font-semibold text-white">
            Sisa {product.stock}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        {product.category?.name && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-primary-light px-3 py-0.5 text-[11px] font-semibold text-primary">
            {product.category.name}
          </span>
        )}

        <h3 className="text-[14px] font-semibold leading-snug text-text-primary line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="text-[16px] font-bold text-primary">{formattedPrice}</p>
          <Link
            to={`/products/${product.id}`}
            className="rounded-xl bg-surface px-3 py-1.5 text-[13px] font-semibold text-text-primary transition-all duration-150 hover:bg-primary-light hover:text-primary"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCardFull;
