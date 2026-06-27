import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_AUDIENCE_TYPES,
  NOTIFICATION_STATUS,
  type NotificationType,
  type NotificationAudienceType,
  type NotificationStatus,
  type NotificationMetadataValue,
} from "@/types/notification";

const metadataSchema = z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]));

export const notificationSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(NOTIFICATION_TYPES).default("announcement"),
  audienceType: z.enum(NOTIFICATION_AUDIENCE_TYPES).default("personal"),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  link: z.string().nullable().optional(),
  relatedCollection: z.string().nullable().optional(),
  relatedId: z.string().nullable().optional(),
  status: z.enum(NOTIFICATION_STATUS).default("draft"),
  metadata: metadataSchema.default({}),
  scheduledFor: z.string().nullable().optional(),
  sentAt: z.string().nullable().optional(),
  isRead: z.boolean().default(false),
  readAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

export interface NotificationModel extends FirestoreBase {
  userId: string;
  type: NotificationType;
  audienceType: NotificationAudienceType;
  title: string;
  body: string;
  link: string | null;
  relatedCollection: string | null;
  relatedId: string | null;
  status: NotificationStatus;
  metadata: Record<string, NotificationMetadataValue>;
  scheduledFor: string | null;
  sentAt: string | null;
  isRead: boolean;
  readAt: string | null;
  isActive: boolean;
}

export const notificationConverter = {
  toFirestore(notification: Omit<NotificationModel, "id">): Record<string, unknown> {
    return {
      userId: notification.userId,
      type: notification.type,
      audienceType: notification.audienceType,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      relatedCollection: notification.relatedCollection,
      relatedId: notification.relatedId,
      status: notification.status,
      metadata: notification.metadata,
      scheduledFor: notification.scheduledFor,
      sentAt: notification.sentAt,
      isRead: notification.isRead,
      readAt: notification.readAt,
      isActive: notification.isActive,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdBy: notification.createdBy,
      updatedBy: notification.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<NotificationModel, "id"> {
    const data = snapshot.data(options);
    return {
      userId: data.userId as string,
      type: (data.type as NotificationType) ?? "announcement",
      audienceType: (data.audienceType as NotificationAudienceType) ?? "personal",
      title: data.title as string,
      body: data.body as string,
      link: (data.link as string) ?? null,
      relatedCollection: (data.relatedCollection as string) ?? null,
      relatedId: (data.relatedId as string) ?? null,
      status: (data.status as NotificationStatus) ?? "draft",
      metadata: (data.metadata as Record<string, NotificationMetadataValue>) ?? {},
      scheduledFor: (data.scheduledFor as string) ?? null,
      sentAt: (data.sentAt as string) ?? null,
      isRead: (data.isRead as boolean) ?? false,
      readAt: (data.readAt as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
