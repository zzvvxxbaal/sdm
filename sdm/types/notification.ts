export const NOTIFICATION_TYPES = [
  "announcement",
  "prayer_update",
  "qt_reminder",
  "schedule_reminder",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_AUDIENCE_TYPES = ["personal", "cell", "team", "church", "leaders"] as const;

export type NotificationAudienceType = (typeof NOTIFICATION_AUDIENCE_TYPES)[number];

export const NOTIFICATION_STATUS = ["draft", "scheduled", "sent"] as const;

export type NotificationStatus = (typeof NOTIFICATION_STATUS)[number];

export type NotificationMetadataValue = string | number | boolean | null;
