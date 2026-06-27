import { BookOpenCheck, CalendarCheck, HandHeart, Flame } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { StatItem } from "@/components/ui";
import type { MemberStatistics } from "@/types/member";

export function ActivitySummaryCard({
  statistics,
  streak,
}: {
  statistics: MemberStatistics;
  streak: number;
}) {
  return (
    <SectionCard title="활동 요약">
      <div className="grid grid-cols-2 gap-2.5">
        <StatItem
          icon={BookOpenCheck}
          label="QT 횟수"
          value={statistics.qtCount}
          suffix="회"
        />
        <StatItem
          icon={CalendarCheck}
          label="출석률"
          value={statistics.attendanceRate}
          suffix="%"
        />
        <StatItem
          icon={HandHeart}
          label="기도 제목"
          value={statistics.prayerCount}
          suffix="개"
        />
        <StatItem icon={Flame} label="연속일수" value={streak} suffix="일" />
      </div>
    </SectionCard>
  );
}
