import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";

export const auditLogSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  userEmail: z.string().email().nullable().optional(),
  action: z.enum(["create", "read", "update", "delete", "login", "logout", "export", "import"]).default("read"),
  resource: z.string().min(1),
  resourceId: z.string().nullable().optional(),
  details: z.record(z.unknown()).nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  createdAt: z.any(),
  createdBy: z.string().nullable().optional(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

export interface AuditLogModel extends FirestoreBase {
  userId: string;
  userEmail: string | null;
  action: "create" | "read" | "update" | "delete" | "login" | "logout" | "export" | "import";
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export const auditLogConverter = {
  toFirestore(log: Omit<AuditLogModel, "id">): Record<string, unknown> {
    return {
      userId: log.userId,
      userEmail: log.userEmail,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: log.details,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
      createdBy: log.createdBy,
      updatedBy: log.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<AuditLogModel, "id"> {
    return {
      userId: data.userId as string,
      userEmail: (data.userEmail as string) ?? null,
      action: (data.action as AuditLogModel["action"]) ?? "read",
      resource: data.resource as string,
      resourceId: (data.resourceId as string) ?? null,
      details: (data.details as Record<string, unknown>) ?? null,
      ipAddress: (data.ipAddress as string) ?? null,
      userAgent: (data.userAgent as string) ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
