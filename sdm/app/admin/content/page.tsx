"use client";

import { Megaphone, Calendar, FileText, Music } from "lucide-react";

import { AdminNavCard } from "@/features/admin/components";
import { PageHeader } from "@/components/ui";

export default function ContentHubPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="콘텐츠 관리" description="청년부 콘텐츠를 관리합니다" />
      <div className="space-y-2.5">
        <AdminNavCard
          href="/admin/content/announcements"
          icon={Megaphone}
          title="공지사항"
          description="청년부 공지 작성 및 관리"
        />
        <AdminNavCard
          href="/admin/content/events"
          icon={Calendar}
          title="일정"
          description="모임 · 행사 일정 관리"
        />
        <AdminNavCard
          href="/admin/content/bulletins"
          icon={FileText}
          title="주보"
          description="주간 주보 등록 및 관리"
        />
        <AdminNavCard
          href="/admin/content/playlists"
          icon={Music}
          title="찬양 콘티"
          description="예배 찬양 재생목록 관리"
        />
      </div>
    </div>
  );
}
