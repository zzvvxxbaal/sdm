"use client";

import { cn } from "@/lib/utils";
import {
  User,
  BookOpen,
  PenLine,
  Heart,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)]">
      {/* Profile Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563EB] dark:bg-[#1e3a5f]">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">
              회원님
            </h2>
            <p className="text-sm text-[#a3a3a3]">서대문교회 청년부</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={BookOpen} label="성경 읽기" value="0장" />
          <StatCard icon={PenLine} label="QT 작성" value="0편" />
          <StatCard icon={Heart} label="방문 일수" value="0회" />
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 px-4 py-4 space-y-6">
        <MenuSection title="나의 활동">
          <MenuItem icon={BookOpen} label="성경 읽기 기록" href="/bible" />
          <MenuItem icon={PenLine} label="QT 일지" href="/qt" />
          <MenuItem icon={Heart} label="배우니 공간" href="/qt" />
        </MenuSection>

        <MenuSection title="설정">
          <MenuItem icon={Bell} label="알림 설정" href="/settings" />
          <MenuItem icon={Shield} label="계정 정보" href="/settings" />
          <MenuItem icon={Settings} label="애플리케이션 설정" href="/settings" />
        </MenuSection>

        <MenuSection title="">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl",
              "bg-white border border-[#e5e5e5] text-[#ef4444]",
              "hover:bg-[#fef2f2] transition-colors",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:hover:bg-[#3f1f1f]"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-semibold">로그아웃</span>
          </button>
        </MenuSection>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-2xl border border-[#e5e5e5] bg-white p-4",
        "dark:bg-[#1c1c1e] dark:border-[#2c2c2e]"
      )}
    >
      <Icon className="h-5 w-5 text-[#2563EB]" />
      <span className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">{value}</span>
      <span className="text-[10px] text-[#a3a3a3]">{label}</span>
    </div>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {title && (
        <h3 className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-2 px-1">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-xl",
        "bg-white border border-[#e5e5e5] text-[#171717]",
        "hover:bg-[#fafafa] transition-colors",
        "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
      )}
    >
      <Icon className="h-5 w-5 text-[#2563EB]" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight className="h-4 w-4 text-[#a3a3a3]" />
    </a>
  );
}
