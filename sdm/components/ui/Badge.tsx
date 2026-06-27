import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

/**
 * A subtle status pill. When a hex `color` is given the badge tints itself with
 * a soft background derived from that color.
 */
export function Badge({ children, color, className }: BadgeProps) {
  const style = color
    ? { color, backgroundColor: `${color}1a`, borderColor: `${color}33` }
    : undefined;

  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        !color &&
          "border-[#e5e5e5] bg-[#f5f5f5] text-[#525252] dark:border-[#2c2c2e] dark:bg-[#262626] dark:text-[#a3a3a3]",
        className
      )}
    >
      {children}
    </span>
  );
}
