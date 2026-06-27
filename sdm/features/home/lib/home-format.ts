import type { Timestamp } from "firebase/firestore";
import type { AnnouncementModel } from "@/models/announcement";
import type { EventModel } from "@/models/event";
import { formatKoreanDate, toDateSafe } from "@/lib/date";

export function formatEventWhen(startDate: string, isAllDay: boolean): string {
  const date = toDateSafe(startDate);
  if (!date) return "";
  const base = `${date.getMonth() + 1}.${date.getDate()}(${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]})`;
  if (isAllDay) return `${base} 종일`;
  return `${base} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export const ANNOUNCEMENT_CATEGORY: Record<
  AnnouncementModel["category"],
  { label: string; color?: string }
> = {
  general: { label: "일반" },
  urgent: { label: "긴급", color: "#EF4444" },
  event: { label: "행사", color: "#2563EB" },
  ministry: { label: "사역", color: "#0EA5E9" },
};

export const EVENT_CATEGORY: Record<
  EventModel["category"],
  { label: string; color: string }
> = {
  worship: { label: "예배", color: "#2563EB" },
  meeting: { label: "모임", color: "#0EA5E9" },
  event: { label: "행사", color: "#F59E0B" },
  special_service: { label: "특별예배", color: "#8B5CF6" },
};

export { formatKoreanDate, toDateSafe };

export type FirestoreTimestamp = Timestamp;
