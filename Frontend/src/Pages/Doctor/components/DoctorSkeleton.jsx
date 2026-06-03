function DoctorSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-28 w-full bg-slate-200" />
      <div className="space-y-3 px-5 pt-14 pb-5">
        <div className="h-4 w-24 rounded-full bg-slate-200" />
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-8 w-28 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default DoctorSkeleton;
