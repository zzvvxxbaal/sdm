import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatItemProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

export function StatItem({
  icon: Icon,
  label,
  value,
  suffix,
  className,
}: StatItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-[#737373] dark:text-[#a3a3a3]">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1.5 text-xl font-bold text-[#171717] dark:text-[#f5f5f5]">
        {value}
        {suffix && (
          <span className="ml-0.5 text-sm font-medium text-[#a3a3a3]">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
