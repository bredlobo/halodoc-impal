function ProductCardFull({ product }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-30">💊</span>
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">
              Stok Habis
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            Sisa {product.stock}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        {product.category?.name && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-100">
            {product.category.name}
          </span>
        )}

        <h3 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-red-500">{formattedPrice}</p>
          <button
            disabled={isOutOfStock}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-red-200 hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCardFull;
