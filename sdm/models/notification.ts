import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";

export const notificationSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(["announcement", "event", "prayer", "bulletin", "system", "message"]).default("system"),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  link: z.string().nullable().optional(),
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
  type: "announcement" | "event" | "prayer" | "bulletin" | "system" | "message";
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  readAt: string | null;
  isActive: boolean;
}

export const notificationConverter = {
  toFirestore(notification: Omit<NotificationModel, "id">): Record<string, unknown> {
    return {
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      isRead: notification.isRead,
      readAt: notification.readAt,
      isActive: notification.isActive,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdBy: notification.createdBy,
      updatedBy: notification.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<NotificationModel, "id"> {
    return {
      userId: data.userId as string,
      type: (data.type as NotificationModel["type"]) ?? "system",
      title: data.title as string,
      body: data.body as string,
      link: (data.link as string) ?? null,
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
