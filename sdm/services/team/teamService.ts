import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { teamConverter, type TeamModel } from "@/models/team";

const teamsRef = collection(db, COLLECTIONS.TEAMS).withConverter(teamConverter);

export async function getAllTeams(): Promise<TeamModel[]> {
  const q = query(teamsRef, orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TeamModel));
}

export async function getActiveTeams(): Promise<TeamModel[]> {
  const q = query(teamsRef, where("isActive", "==", true), orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TeamModel));
}

export async function getTeamById(id: string): Promise<TeamModel | null> {
  const docRef = doc(db, COLLECTIONS.TEAMS, id).withConverter(teamConverter);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as TeamModel;
}

export async function createTeam(data: {
  name: string;
  displayOrder?: number;
  leaderId?: string | null;
  leaderName?: string | null;
  description?: string | null;
  createdBy?: string;
}): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.TEAMS), {
    name: data.name,
    displayOrder: data.displayOrder ?? 0,
    leaderId: data.leaderId ?? null,
    leaderName: data.leaderName ?? null,
    description: data.description ?? null,
    isActive: true,
    memberCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy ?? null,
    updatedBy: data.createdBy ?? null,
  });
  return docRef.id;
}

export async function updateTeam(
  id: string,
  data: Partial<{
    name: string;
    displayOrder: number;
    leaderId: string | null;
    leaderName: string | null;
    description: string | null;
    isActive: boolean;
    updatedBy: string;
  }>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEAMS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTeam(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEAMS, id);
  await deleteDoc(docRef);
}

export async function updateTeamMemberCount(id: string, count: number): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEAMS, id);
  await updateDoc(docRef, {
    memberCount: count,
    updatedAt: serverTimestamp(),
  });
}

export async function reorderTeams(orderedIds: string[]): Promise<void> {
  const promises = orderedIds.map((id, index) => {
    const docRef = doc(db, COLLECTIONS.TEAMS, id);
    return updateDoc(docRef, {
      displayOrder: index,
      updatedAt: serverTimestamp(),
    });
  });
  await Promise.all(promises);
}
