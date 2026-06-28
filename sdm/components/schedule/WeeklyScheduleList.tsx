import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Card, EmptyState } from "@/components/ui";
import { resolveDateRangeLabel } from "@/lib/date";
import { SCHEDULE_EVENT_TYPE_LABELS } from "@/types/schedule";
import type { EventModel } from "@/models/event";

export function WeeklyScheduleList({ events }: { events: EventModel[] }) {
  if (events.length === 0) {
    return <EmptyState icon={CalendarDays} title="선택한 주의 일정이 없습니다" description="새 일정을 등록하거나 다른 날짜를 선택해보세요." />;
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Link key={event.id} href={`/calendar/${event.id}`}>
          <Card className="space-y-2 p-4 transition-colors hover:bg-[#fafafa] dark:hover:bg-[#262626]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">{event.title}</h3>
              <span className="rounded-full bg-[#2563EB]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">{SCHEDULE_EVENT_TYPE_LABELS[event.category]}</span>
            </div>
            <p className="text-sm text-[#525252] dark:text-[#d4d4d8]">{resolveDateRangeLabel(event.startDate, event.endDate, event.isAllDay)}</p>
            {event.location && (
              <p className="flex items-center gap-1 text-xs text-[#a3a3a3]">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </p>
            )}
            {event.description && <p className="line-clamp-2 text-xs leading-5 text-[#737373] dark:text-[#a3a3a3]">{event.description}</p>}
          </Card>
        </Link>
      ))}
    </div>
  );
}
