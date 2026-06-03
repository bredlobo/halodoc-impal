function ProductDetailInfo({
  product,
  formattedPrice,
  isLowStock,
  isOutOfStock,
}) {
  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category?.name && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold text-primary">
          {product.category.name}
        </span>
      )}

      {/* Name */}
      <h1 className="text-[24px] font-bold leading-[1.30] tracking-[-0.01em] text-text-primary sm:text-[32px] sm:leading-[1.25]">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-4 text-[32px] font-bold text-primary">{formattedPrice}</p>

      {/* Stock info */}
      <div className="mt-3 flex items-center gap-2">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[13px] font-semibold text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-text-secondary" />
            Stok Habis
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-[13px] font-semibold text-warning">
            <span className="h-2 w-2 rounded-full bg-warning" />
            Sisa {product.stock} unit
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-[13px] font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-success" />
            Tersedia · {product.stock} unit
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* Description */}
      {product.description ? (
        <div>
          <h2 className="mb-2 text-[13px] font-semibold tracking-widest text-text-secondary uppercase">
            Deskripsi Produk
          </h2>
          <p className="text-[14px] leading-[1.55] text-text-secondary">
            {product.description}
          </p>
        </div>
      ) : (
        <p className="text-[14px] italic text-text-secondary">
          Deskripsi produk tidak tersedia.
        </p>
      )}

      {/* Additional info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {product.unit && (
          <div className="rounded-xl bg-background p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
            <p className="text-[13px] font-semibold tracking-widest text-text-secondary uppercase">
              Satuan
            </p>
            <p className="mt-1 text-[14px] font-semibold text-text-primary">
              {product.unit}
            </p>
          </div>
        )}
        {product.expiryDate && (
          <div className="rounded-xl bg-background p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
            <p className="text-[13px] font-semibold tracking-widest text-text-secondary uppercase">
              Kadaluarsa
            </p>
            <p className="mt-1 text-[14px] font-semibold text-text-primary">
              {new Date(product.expiryDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailInfo;
