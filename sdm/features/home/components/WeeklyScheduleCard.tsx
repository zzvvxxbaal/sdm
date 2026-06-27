import { CalendarDays, MapPin } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { Badge, EmptyState } from "@/components/ui";
import { EVENT_CATEGORY, formatEventWhen } from "../lib/home-format";
import type { EventModel } from "@/models/event";

export function WeeklyScheduleCard({
  events,
  error = false,
}: {
  events: EventModel[];
  error?: boolean;
}) {
  return (
    <div id="weekly-schedule" className="scroll-mt-4">
      <SectionCard title="이번 주 일정">
        {error ? (
          <SectionError message="일정을 불러오지 못했습니다" />
        ) : events.length === 0 ? (
          <EmptyState icon={CalendarDays} title="이번 주 일정이 없습니다" description="등록된 예배나 모임이 아직 없습니다." />
        ) : (
          <ul className="space-y-2.5">
            {events.map((event) => {
              const category = EVENT_CATEGORY[event.category];
              return (
                <li key={event.id} className="flex items-start gap-3 rounded-xl border border-[#e5e5e5] p-3 dark:border-[#2c2c2e]">
                  <div className="flex flex-col items-center rounded-lg bg-[#2563EB]/10 px-2.5 py-1.5 text-[#2563EB]">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">{event.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[#2563EB]">{formatEventWhen(event.startDate, event.isAllDay)}</p>
                    {event.location && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#a3a3a3]">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                  <Badge color={category.color}>{category.label}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
