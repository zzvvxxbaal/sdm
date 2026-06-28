"use client";

import { useAnalyticsStats } from "@/hooks/useAnalyticsStats";
import { AnalyticsGrid, ActivityFeed } from "@/components/admin";
import { PageHeader } from "@/components/ui";
import { Users, BookOpen, Heart, Megaphone, Calendar } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const { stats, isLoading } = useAnalyticsStats();

  const fmt = (value: number | undefined) => (isLoading ? "—" : value ?? 0);

  const analyticsStats = [
    { icon: Users, label: "전체 사용자", value: fmt(stats?.totalUsers), suffix: "명" },
    {
      icon: BookOpen,
      label: "QT 기록",
      value: fmt(stats?.totalQTEntries),
      suffix: "건",
    },
    {
      icon: Heart,
      label: "기도제목",
      value: fmt(stats?.totalPrayers),
      suffix: "건",
    },
    {
      icon: Megaphone,
      label: "공지사항",
      value: fmt(stats?.totalAnnouncements),
      suffix: "건",
    },
    {
      icon: Calendar,
      label: "일정",
      value: fmt(stats?.totalEvents),
      suffix: "개",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="분석 대시보드"
        description="교회 활동 통계 및 사용 현황"
      />

      {/* Analytics Stats Grid */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
          주요 지표
        </h2>
        <AnalyticsGrid stats={analyticsStats} loading={isLoading} />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
          최근 활동
        </h2>
        <ActivityFeed maxItems={10} />
      </div>
    </div>
  );
}
