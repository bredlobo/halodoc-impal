function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-background shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="aspect-[4/3] w-full bg-surface" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-20 rounded-full bg-surface" />
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-3 w-3/4 rounded bg-surface" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-24 rounded bg-surface" />
          <div className="h-7 w-20 rounded-xl bg-surface" />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
