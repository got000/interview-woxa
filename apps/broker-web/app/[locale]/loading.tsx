export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-8xl flex-1 animate-pulse px-6 pt-8 sm:px-10 lg:px-30 mb-2">
      <div className="h-9 w-64 rounded bg-slate-900" />
      <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-900" />
      <div className="mt-2 h-4 w-2/3 max-w-2xl rounded bg-slate-900" />

      <div className="mt-8 flex flex-col gap-4">
        <div className="h-12 w-full rounded-lg bg-slate-900" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 w-20 rounded-full bg-slate-900" />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
          >
            <div className="h44 sm:h50 lg:h-70 w-full bg-slate-800" />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="h-5 w-3/4 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-800" />
              <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                <div className="h-4 w-16 rounded bg-slate-800" />
                <div className="h-4 w-24 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
