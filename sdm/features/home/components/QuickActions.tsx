"use client";

import Link from "next/link";
import { BookOpen, PenLine, CalendarDays, HandHeart, FileText, Music2, type LucideIcon } from "lucide-react";

function ActionTile({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 rounded-2xl border border-[#e5e5e5] bg-white p-4 transition-colors hover:bg-[#fafafa] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:hover:bg-[#262626]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-semibold text-[#171717] dark:text-[#f5f5f5]">{label}</span>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <ActionTile icon={HandHeart} label="기도" href="/prayer" />
      <ActionTile icon={CalendarDays} label="일정" href="/calendar" />
      <ActionTile icon={FileText} label="주보" href="/bulletin" />
      <ActionTile icon={Music2} label="찬양" href="/worship" />
      <ActionTile icon={BookOpen} label="성경" href="/bible" />
      <ActionTile icon={PenLine} label="QT" href="/qt" />
    </div>
  );
}
