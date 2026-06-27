import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const attendanceSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  eventDate: z.string().min(1),
  status: z.enum(["present", "absent", "late", "excused", "pending"]).default("pending"),
  checkInTime: z.string().nullable().optional(),
  checkOutTime: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Attendance = z.infer<typeof attendanceSchema>;

export interface AttendanceModel extends FirestoreBase {
  userId: string;
  userName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  status: "present" | "absent" | "late" | "excused" | "pending";
  checkInTime: string | null;
  checkOutTime: string | null;
  note: string | null;
}

export const attendanceConverter = {
  toFirestore(attendance: Omit<AttendanceModel, "id">): Record<string, unknown> {
    return {
      userId: attendance.userId,
      userName: attendance.userName,
      eventId: attendance.eventId,
      eventTitle: attendance.eventTitle,
      eventDate: attendance.eventDate,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      note: attendance.note,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
      createdBy: attendance.createdBy,
      updatedBy: attendance.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<AttendanceModel, "id"> {
    const data = snapshot.data(options);
    return {
      userId: data.userId as string,
      userName: data.userName as string,
      eventId: data.eventId as string,
      eventTitle: data.eventTitle as string,
      eventDate: data.eventDate as string,
      status: (data.status as AttendanceModel["status"]) ?? "pending",
      checkInTime: (data.checkInTime as string) ?? null,
      checkOutTime: (data.checkOutTime as string) ?? null,
      note: (data.note as string) ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
