"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease]"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl",
          "dark:bg-[#1c1c1e]",
          "animate-[slideUp_200ms_ease]",
          className
        )}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f5f5f5] hover:text-[#171717] dark:hover:bg-[#262626]"
        >
          <X className="h-5 w-5" />
        </button>
        {title && (
          <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-[#737373] dark:text-[#a3a3a3]">
            {description}
          </p>
        )}
        <div className={cn(title && "mt-4")}>{children}</div>
      </div>
    </div>
  );
}
