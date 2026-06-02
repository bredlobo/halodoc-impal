function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image skeleton */}
      <div className="aspect-square w-full animate-pulse rounded-3xl bg-slate-200" />
      {/* Content skeleton */}
      <div className="flex flex-col gap-4 pt-4">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-8 w-3/4 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-6 h-10 w-40 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
