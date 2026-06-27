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
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { cellConverter, type CellModel } from "@/models/cell";

const cellsRef = collection(db, COLLECTIONS.CELLS).withConverter(cellConverter);

export async function getAllCells(): Promise<CellModel[]> {
  const q = query(cellsRef, orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CellModel));
}

export async function getCellsByTeam(teamId: string): Promise<CellModel[]> {
  const q = query(
    cellsRef,
    where("teamId", "==", teamId),
    orderBy("displayOrder", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CellModel));
}

export async function getActiveCellsByTeam(teamId: string): Promise<CellModel[]> {
  const q = query(
    cellsRef,
    where("teamId", "==", teamId),
    where("isActive", "==", true),
    orderBy("displayOrder", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CellModel));
}

export async function getCellById(id: string): Promise<CellModel | null> {
  const docRef = doc(db, COLLECTIONS.CELLS, id).withConverter(cellConverter);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as CellModel;
}

export async function createCell(data: {
  name: string;
  teamId: string;
  displayOrder?: number;
  leaderId?: string | null;
  leaderName?: string | null;
  assistantLeaderId?: string | null;
  assistantLeaderName?: string | null;
  description?: string | null;
  createdBy?: string;
}): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(cellsRef, {
    name: data.name,
    teamId: data.teamId,
    displayOrder: data.displayOrder ?? 0,
    leaderId: data.leaderId ?? null,
    leaderName: data.leaderName ?? null,
    assistantLeaderId: data.assistantLeaderId ?? null,
    assistantLeaderName: data.assistantLeaderName ?? null,
    members: [],
    memberCount: 0,
    description: data.description ?? null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy ?? null,
    updatedBy: data.createdBy ?? null,
  });
  return docRef.id;
}

export async function updateCell(
  id: string,
  data: Partial<{
    name: string;
    teamId: string;
    displayOrder: number;
    leaderId: string | null;
    leaderName: string | null;
    assistantLeaderId: string | null;
    assistantLeaderName: string | null;
    description: string | null;
    isActive: boolean;
    updatedBy: string;
  }>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CELLS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function moveCellToTeam(id: string, teamId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CELLS, id);
  await updateDoc(docRef, {
    teamId,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCell(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CELLS, id);
  await deleteDoc(docRef);
}

export async function addMemberToCell(id: string, memberId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CELLS, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return;

  const cell = snapshot.data() as CellModel;
  const members = [...cell.members, memberId];

  await updateDoc(docRef, {
    members,
    memberCount: members.length,
    updatedAt: serverTimestamp(),
  });
}

export async function removeMemberFromCell(id: string, memberId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CELLS, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return;

  const cell = snapshot.data() as CellModel;
  const members = cell.members.filter((m) => m !== memberId);

  await updateDoc(docRef, {
    members,
    memberCount: members.length,
    updatedAt: serverTimestamp(),
  });
}

export async function reorderCells(teamId: string, orderedIds: string[]): Promise<void> {
  const promises = orderedIds.map((id, index) => {
    const docRef = doc(db, COLLECTIONS.CELLS, id);
    return updateDoc(docRef, {
      displayOrder: index,
      updatedAt: serverTimestamp(),
    });
  });
  await Promise.all(promises);
}
