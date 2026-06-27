import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { organizationSettingsConverter, type OrganizationSettingsModel } from "@/models/organization_settings";

const SETTINGS_DOC_ID = "default";

const settingsRef = doc(db, COLLECTIONS.ORGANIZATION_SETTINGS, SETTINGS_DOC_ID).withConverter(
  organizationSettingsConverter
);

const settingsWriteRef = doc(db, COLLECTIONS.ORGANIZATION_SETTINGS, SETTINGS_DOC_ID);

export async function getOrganizationSettings(): Promise<OrganizationSettingsModel | null> {
  const snapshot = await getDoc(settingsRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as OrganizationSettingsModel;
}

export async function initializeOrganizationSettings(): Promise<void> {
  const snapshot = await getDoc(settingsRef);
  if (snapshot.exists()) return;

  await setDoc(settingsWriteRef, {
    cellLabel: { singular: "순", plural: "순들" },
    teamLabel: { singular: "팀", plural: "팀들" },
    maxTeams: 0,
    maxCellsPerTeam: 0,
    maxMembersPerCell: 0,
    allowCellTransfer: true,
    allowMemberSelfTransfer: false,
    requireLeaderApproval: true,
    updatedAt: serverTimestamp(),
    updatedBy: null,
  });
}

export async function updateOrganizationSettings(
  data: Partial<{
    cellLabel: { singular: string; plural: string };
    teamLabel: { singular: string; plural: string };
    maxTeams: number;
    maxCellsPerTeam: number;
    maxMembersPerCell: number;
    allowCellTransfer: boolean;
    allowMemberSelfTransfer: boolean;
    requireLeaderApproval: boolean;
    updatedBy: string;
  }>
): Promise<void> {
  await updateDoc(settingsWriteRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCellLabel(
  singular: string,
  plural: string,
  updatedBy?: string
): Promise<void> {
  await updateDoc(settingsWriteRef, {
    cellLabel: { singular, plural },
    updatedAt: serverTimestamp(),
    updatedBy: updatedBy ?? null,
  });
}

export async function updateTeamLabel(
  singular: string,
  plural: string,
  updatedBy?: string
): Promise<void> {
  await updateDoc(settingsWriteRef, {
    teamLabel: { singular, plural },
    updatedAt: serverTimestamp(),
    updatedBy: updatedBy ?? null,
  });
}
