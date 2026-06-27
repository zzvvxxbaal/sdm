import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#262626]">
          <Icon className="h-6 w-6 text-[#a3a3a3]" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-[#a3a3a3] dark:text-[#737373]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
