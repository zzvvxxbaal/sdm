function Block({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[#ececec] dark:bg-[#262626] ${className}`}
    />
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-4">
      <Block className="h-32" />
      <Block className="h-20" />
      <div className="grid grid-cols-3 gap-2.5">
        <Block className="h-20" />
        <Block className="h-20" />
        <Block className="h-20" />
      </div>
      <Block className="h-40" />
      <Block className="h-40" />
      <Block className="h-28" />
    </div>
  );
}
