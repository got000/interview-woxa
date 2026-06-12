export default function Loading() {
  return (
    <div className="-mx-6 flex animate-pulse flex-col gap-10 mb-2">
      <div className="h-[420px] w-full bg-slate-900" />

      <div className="flex flex-col gap-10 px-6 sm:px-10 lg:px-30">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="h-7 w-1/3 rounded bg-slate-900" />
            <div className="h-4 w-full rounded bg-slate-900" />
            <div className="h-4 w-5/6 rounded bg-slate-900" />
            <div className="h-4 w-2/3 rounded bg-slate-900" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-48 w-full rounded-lg bg-slate-900" />
            <div className="h-32 w-full rounded-lg bg-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
