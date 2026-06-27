export const SCHEDULE_EVENT_TYPES = ["worship", "meeting", "event", "special_service"] as const;

export type ScheduleEventType = (typeof SCHEDULE_EVENT_TYPES)[number];

export const SCHEDULE_EVENT_TYPE_LABELS: Record<ScheduleEventType, string> = {
  worship: "예배",
  meeting: "모임",
  event: "행사",
  special_service: "특별예배",
};

export const SCHEDULE_EVENT_TYPE_COLORS: Record<ScheduleEventType, string> = {
  worship: "#2563EB",
  meeting: "#0EA5E9",
  event: "#F59E0B",
  special_service: "#8B5CF6",
};
