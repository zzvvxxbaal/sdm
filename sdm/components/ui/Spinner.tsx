import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#2563EB] dark:border-[#2c2c2e] dark:border-t-[#60a5fa]",
        className
      )}
      role="status"
      aria-label="로딩 중"
    />
  );
}

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}
