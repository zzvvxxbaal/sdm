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
