"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface AuthErrorMessageProps {
  message?: string;
  className?: string;
}

export function AuthErrorMessage({ message, className }: AuthErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600",
        "dark:bg-red-950/30 dark:text-red-400",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
