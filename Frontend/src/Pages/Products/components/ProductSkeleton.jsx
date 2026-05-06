function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 rounded-full bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-7 w-20 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
