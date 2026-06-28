"use client";

import {
  Users2,
  Network,
  Megaphone,
  BookOpen,
  Settings,
  ClipboardList,
  Boxes,
  BarChart3,
} from "lucide-react";

import { useAdminStats } from "@/features/admin/hooks/useAdminStats";
import { AdminNavCard } from "@/features/admin/components";
import { PageHeader, StatItem } from "@/components/ui";

export default function AdminDashboardPage() {
  const { stats, isLoading } = useAdminStats();
  const fmt = (value: number | undefined) => (isLoading ? "—" : value ?? 0);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="관리자" description="서대문교회 청년부 운영 관리" />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatItem icon={Users2} label="전체 회원" value={fmt(stats?.totalMembers)} suffix="명" />
        <StatItem icon={ClipboardList} label="승인 대기" value={fmt(stats?.pendingApprovals)} suffix="명" />
        <StatItem icon={Network} label="팀" value={fmt(stats?.totalTeams)} suffix="개" />
        <StatItem icon={Boxes} label="소그룹" value={fmt(stats?.totalCells)} suffix="개" />
      </div>

      <div className="space-y-2.5">
        <AdminNavCard
          href="/admin/analytics"
          icon={BarChart3}
          title="분석 대시보드"
          description="사용자 · QT · 기도 · 공지 통계"
        />
        <AdminNavCard
          href="/admin/users"
          icon={Users2}
          title="사용자 분석"
          description="사용자 목록 · 역할 · 가입일"
        />
        <AdminNavCard
          href="/admin/members"
          icon={Users2}
          title="회원 관리"
          description="가입 승인 · 팀/순 · 권한"
          badge={stats?.pendingApprovals}
        />
        <AdminNavCard
          href="/admin/organization"
          icon={Network}
          title="조직 관리"
          description="팀과 소그룹 편성, 리더 지정"
        />
        <AdminNavCard
          href="/admin/content"
          icon={Megaphone}
          title="콘텐츠 관리"
          description="공지 · 일정 · 주보 · 찬양"
        />
        <AdminNavCard
          href="/admin/daily"
          icon={BookOpen}
          title="오늘의 말씀/QT"
          description="홈 화면 말씀과 묵상 설정"
        />
        <AdminNavCard
          href="/admin/settings"
          icon={Settings}
          title="설정"
          description="소그룹 명칭 등 기본 설정"
        />
      </div>
    </div>
  );
}
