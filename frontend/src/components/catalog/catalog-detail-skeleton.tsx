export function CatalogDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse px-4 pb-24 pt-4">
      <div className="aspect-[4/3] rounded-2xl bg-surface" />

      <div className="mt-6 space-y-4">
        <div className="h-8 w-3/4 rounded-lg bg-surface" />
        <div className="h-5 w-1/2 rounded-lg bg-surface" />
        <div className="h-10 w-1/3 rounded-lg bg-surface" />

        <div className="my-6 h-px bg-stone-200" />

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 rounded bg-surface" />
              <div className="h-5 w-24 rounded bg-surface" />
            </div>
          ))}
        </div>

        <div className="my-6 h-px bg-stone-200" />

        <div className="h-5 w-24 rounded bg-surface" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-surface p-4">
              <div className="h-4 w-20 rounded bg-white" />
              <div className="mt-2 h-3 w-full rounded bg-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
