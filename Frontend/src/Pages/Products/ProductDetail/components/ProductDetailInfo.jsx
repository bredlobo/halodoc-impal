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
        <span className="mb-3 inline-flex w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-100">
          {product.category.name}
        </span>
      )}

      {/* Name */}
      <h1 className="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-4 text-3xl font-bold text-red-500">{formattedPrice}</p>

      {/* Stock info */}
      <div className="mt-3 flex items-center gap-2">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Stok Habis
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 ring-1 ring-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Sisa {product.stock} unit
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Tersedia · {product.stock} unit
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-slate-100" />

      {/* Description */}
      {product.description ? (
        <div>
          <h2 className="mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Deskripsi Produk
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">
          Deskripsi produk tidak tersedia.
        </p>
      )}

      {/* Additional info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {product.unit && (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Satuan
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {product.unit}
            </p>
          </div>
        )}
        {product.expiryDate && (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Kadaluarsa
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
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
