function ProductCard({ product }) {
  return (
    <article className="rounded-xl bg-background p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-poster mb-4 overflow-hidden rounded-xl bg-surface">
        <div className="flex h-full w-full items-center justify-center text-[13px] font-medium text-text-secondary">
          Foto Produk
        </div>
      </div>
      <div className="mb-4 inline-flex rounded-full bg-primary-light px-3 py-1 text-[11px] font-medium text-primary">
        {product.category}
      </div>
      <h3 className="text-[16px] font-semibold text-text-primary">{product.name}</h3>
      <p className="mt-3 text-[14px] font-semibold text-primary">{product.price}</p>
      <button className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[14px] font-semibold text-text-primary transition-all duration-150 hover:bg-primary-light hover:text-primary hover:border-primary">
        Tambah ke Keranjang
      </button>
    </article>
  );
}

export default ProductCard;
