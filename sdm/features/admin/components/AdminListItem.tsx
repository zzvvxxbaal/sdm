"use client";

import { Pencil, Trash2 } from "lucide-react";

interface AdminListItemProps {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  badges?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminListItem({
  title,
  subtitle,
  meta,
  badges,
  onEdit,
  onDelete,
}: AdminListItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
            {title}
          </span>
          {badges}
        </div>
        {subtitle && (
          <p className="mt-0.5 line-clamp-2 text-xs text-[#737373] dark:text-[#a3a3a3]">
            {subtitle}
          </p>
        )}
        {meta && <p className="mt-1 text-xs text-[#a3a3a3]">{meta}</p>}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          aria-label="수정"
          className="rounded-lg p-2 text-[#737373] hover:bg-[#f5f5f5] hover:text-[#2563EB] dark:hover:bg-[#262626]"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label="삭제"
          className="rounded-lg p-2 text-[#737373] hover:bg-[#fef2f2] hover:text-[#EF4444] dark:hover:bg-[#3f1f1f]/40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
