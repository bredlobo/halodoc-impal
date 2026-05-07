function ProductDetailImage({ product, isOutOfStock }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm">
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
          <span className="text-8xl opacity-20">💊</span>
        </div>
      )}

      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <span className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white">
            Stok Habis
          </span>
        </div>
      )}
    </div>
  );
}

export default ProductDetailImage;
