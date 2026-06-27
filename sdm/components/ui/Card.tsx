import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)]",
        "dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs text-[#737373] dark:text-[#a3a3a3]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
