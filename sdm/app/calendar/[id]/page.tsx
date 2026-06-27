"use client";

import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { withAuth } from "@/features/auth";
import { getScheduleEventById } from "@/services/schedule";
import { Badge, Card, EmptyState } from "@/components/ui";
import { resolveDateRangeLabel } from "@/lib/date";
import { SCHEDULE_EVENT_TYPE_LABELS } from "@/types/schedule";
import type { EventModel } from "@/models/event";

function CalendarDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      const nextEvent = await getScheduleEventById(params.id);
      if (active) {
        setEvent(nextEvent);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return <div className="mx-auto max-w-lg px-4 py-6"><div className="h-56 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" /></div>;
  }

  if (!event) {
    return <div className="mx-auto max-w-lg px-4 py-6"><EmptyState title="일정을 찾을 수 없습니다" /></div>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <Link href="/calendar" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white text-[#525252] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#a3a3a3]">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">일정 상세</h1>
          <p className="text-xs text-[#737373] dark:text-[#a3a3a3]">행사 정보를 자세히 확인하세요.</p>
        </div>
      </div>
      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">{event.title}</h2>
          <Badge color="#2563EB">{SCHEDULE_EVENT_TYPE_LABELS[event.category]}</Badge>
        </div>
        <p className="text-sm font-medium text-[#2563EB]">{resolveDateRangeLabel(event.startDate, event.endDate, event.isAllDay)}</p>
        {event.location && <p className="flex items-center gap-1 text-sm text-[#737373] dark:text-[#a3a3a3]"><MapPin className="h-4 w-4" /> {event.location}</p>}
        {event.description && <p className="whitespace-pre-wrap text-sm leading-7 text-[#525252] dark:text-[#d4d4d8]">{event.description}</p>}
      </Card>
    </div>
  );
}

export default withAuth(CalendarDetailPage);
