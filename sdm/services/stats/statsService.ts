import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { ApprovalStatus } from "@/types/member";

export interface AdminStats {
  totalMembers: number;
  pendingApprovals: number;
  totalTeams: number;
  totalCells: number;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalQTEntries: number;
  totalPrayers: number;
  totalAnnouncements: number;
  totalEvents: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const usersRef = collection(db, COLLECTIONS.USERS);

  const [members, pending, teams, cells] = await Promise.all([
    getCountFromServer(query(usersRef, where("approvalStatus", "==", ApprovalStatus.APPROVED))),
    getCountFromServer(query(usersRef, where("approvalStatus", "==", ApprovalStatus.PENDING))),
    getCountFromServer(collection(db, COLLECTIONS.TEAMS)),
    getCountFromServer(collection(db, COLLECTIONS.CELLS)),
  ]);

  return {
    totalMembers: members.data().count,
    pendingApprovals: pending.data().count,
    totalTeams: teams.data().count,
    totalCells: cells.data().count,
  };
}

/**
 * Get comprehensive analytics statistics for dashboard
 */
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const [users, qtEntries, prayers, announcements, events] = await Promise.all([
    getCountFromServer(collection(db, COLLECTIONS.USERS)),
    getCountFromServer(collection(db, "qt_entries")),
    getCountFromServer(collection(db, COLLECTIONS.PRAYER_REQUESTS)),
    getCountFromServer(collection(db, COLLECTIONS.ANNOUNCEMENTS)),
    getCountFromServer(collection(db, COLLECTIONS.EVENTS)),
  ]);

  return {
    totalUsers: users.data().count,
    totalQTEntries: qtEntries.data().count,
    totalPrayers: prayers.data().count,
    totalAnnouncements: announcements.data().count,
    totalEvents: events.data().count,
  };
}
