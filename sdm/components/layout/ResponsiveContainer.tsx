import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/styles/tokens";

interface ResponsiveContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export function ResponsiveContainer({
  as: Component = "div",
  className,
  children,
  style,
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", className)}
      style={{
        maxWidth: tokens.layout.contentMaxWidth,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
