import type { Timestamp } from "firebase/firestore";

export interface FirestoreBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface FiresoftDelete {
  isDeleted: boolean;
  deletedAt: Timestamp | null;
  deletedBy: string | null;
}

export type FirestoreTimestamp = Timestamp;

export interface FirestoreQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  filters?: FirestoreFilter[];
}

export interface FirestoreFilter {
  field: string;
  operator: "==" | "!=" | "<" | "<=" | ">" | ">=" | "array-contains" | "in" | "array-contains-any";
  value: unknown;
}
