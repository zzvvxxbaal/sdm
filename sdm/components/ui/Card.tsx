import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-black/[0.1] bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.35)] transition-transform duration-200",
        "motion-safe:lg:hover:-translate-y-1 motion-safe:lg:hover:scale-[1.01]",
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
        <h3 className="text-base font-semibold text-[#111111]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs leading-5 text-[#6b7280]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
