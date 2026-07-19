export default function ProductSkeleton() {
  return (
    <div className="flex animate-pulse flex-col" aria-hidden>
      <div className="relative aspect-[3/4] overflow-hidden bg-bone">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/5 to-transparent" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-16 bg-bone" />
          <div className="h-4 w-32 bg-bone" />
        </div>
        <div className="h-4 w-14 bg-bone" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-7 bg-bone" />
        ))}
      </div>
    </div>
  );
}
