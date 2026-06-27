import type { Timestamp } from "firebase/firestore";
import type { AnnouncementModel } from "@/models/announcement";
import type { EventModel } from "@/models/event";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Convert a Firestore Timestamp / ISO string / millis into a Date, or null. */
export function toDateSafe(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object") {
    const obj = value as { toDate?: () => Date; seconds?: number };
    if (typeof obj.toDate === "function") {
      try {
        return obj.toDate();
      } catch {
        return null;
      }
    }
    if (typeof obj.seconds === "number") return new Date(obj.seconds * 1000);
  }
  return null;
}

export function formatKoreanDate(value: unknown): string {
  const d = toDateSafe(value);
  if (!d) return "";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function formatEventWhen(startDate: string, isAllDay: boolean): string {
  const d = toDateSafe(startDate);
  if (!d) return "";
  const md = `${d.getMonth() + 1}.${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
  if (isAllDay) return `${md} 종일`;
  return `${md} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  retreat: { label: "수련회", color: "#8B5CF6" },
  service: { label: "봉사", color: "#10B981" },
  social: { label: "친교", color: "#F59E0B" },
  other: { label: "기타", color: "#6B7280" },
};

/** Type-safe re-export marker so the Timestamp import is always referenced. */
export type FirestoreTimestamp = Timestamp;
