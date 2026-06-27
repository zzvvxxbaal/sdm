import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  isAllDay: z.boolean().default(false),
  category: z.enum(["worship", "meeting", "retreat", "service", "social", "other"]).default("other"),
  ministry: z.string().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Event = z.infer<typeof eventSchema>;

export interface EventModel extends FirestoreBase {
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isAllDay: boolean;
  category: "worship" | "meeting" | "retreat" | "service" | "social" | "other";
  ministry: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  isActive: boolean;
}

export const eventConverter = {
  toFirestore(event: Omit<EventModel, "id">): Record<string, unknown> {
    return {
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      isAllDay: event.isAllDay,
      category: event.category,
      ministry: event.ministry,
      isRecurring: event.isRecurring,
      recurrenceRule: event.recurrenceRule,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: event.createdBy,
      updatedBy: event.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<EventModel, "id"> {
    const data = snapshot.data(options);
    return {
      title: data.title as string,
      description: (data.description as string) ?? null,
      location: (data.location as string) ?? null,
      startDate: data.startDate as string,
      endDate: (data.endDate as string) ?? null,
      isAllDay: (data.isAllDay as boolean) ?? false,
      category: (data.category as EventModel["category"]) ?? "other",
      ministry: (data.ministry as string) ?? null,
      isRecurring: (data.isRecurring as boolean) ?? false,
      recurrenceRule: (data.recurrenceRule as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
