const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateSafe(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "object") {
    const candidate = value as { toDate?: () => Date; seconds?: number };
    if (typeof candidate.toDate === "function") {
      try {
        return candidate.toDate();
      } catch {
        return null;
      }
    }
    if (typeof candidate.seconds === "number") {
      return new Date(candidate.seconds * 1000);
    }
  }
  return null;
}

export function toMillis(value: unknown) {
  return toDateSafe(value)?.getTime() ?? 0;
}

export function formatDateKey(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

export function formatDateTimeKey(value: Date) {
  return `${formatDateKey(value)}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function formatKoreanDate(value: unknown) {
  const date = toDateSafe(value);
  if (!date) return "";
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function formatKoreanDateTime(value: unknown) {
  const date = toDateSafe(value);
  if (!date) return "";
  return `${formatKoreanDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatWeekdayDate(value: unknown) {
  const date = toDateSafe(value);
  if (!date) return "";
  return `${date.getMonth() + 1}.${date.getDate()}(${WEEKDAYS[date.getDay()]})`;
}

export function startOfWeekMonday(baseDate: Date) {
  const next = new Date(baseDate);
  const diff = (next.getDay() + 6) % 7;
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - diff);
  return next;
}

export function endOfWeekMonday(baseDate: Date) {
  const next = startOfWeekMonday(baseDate);
  next.setDate(next.getDate() + 7);
  return next;
}

export function startOfMonthDate(baseDate: Date) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonthDate(baseDate: Date) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1, 0, 0, 0, 0);
}

export function isSameDay(left: unknown, right: unknown) {
  const a = toDateSafe(left);
  const b = toDateSafe(right);
  if (!a || !b) return false;
  return formatDateKey(a) === formatDateKey(b);
}

export function resolveDateRangeLabel(start: unknown, end: unknown, isAllDay: boolean) {
  const startDate = toDateSafe(start);
  const endDate = toDateSafe(end);
  if (!startDate) return "";
  const base = formatWeekdayDate(startDate);
  if (isAllDay) {
    return endDate && !isSameDay(startDate, endDate)
      ? `${base} ~ ${formatWeekdayDate(endDate)} 종일`
      : `${base} 종일`;
  }
  const startTime = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
  if (!endDate) return `${base} ${startTime}`;
  if (isSameDay(startDate, endDate)) {
    return `${base} ${startTime} ~ ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
  }
  return `${base} ${startTime} ~ ${formatWeekdayDate(endDate)} ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
}
