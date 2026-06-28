import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { userConverter, type UserModel } from "@/models/user";
import { UserRole } from "@/types/role";
import { ApprovalStatus } from "@/types/member";
import { buildInitialUserModel } from "./userFactory";
import type {
  UserProfile,
  CompleteProfileInput,
  MemberEditableInput,
  PrivilegedEditableInput,
} from "@/types/user";
import { getGeneration } from "@/utils/generation";

const usersRef = collection(db, COLLECTIONS.USERS).withConverter(userConverter);

function userDoc(uid: string) {
  return doc(db, COLLECTIONS.USERS, uid).withConverter(userConverter);
}

function userWriteDoc(uid: string) {
  return doc(db, COLLECTIONS.USERS, uid);
}

function modelToProfile(model: UserModel): UserProfile {
  const { id, ...rest } = model;
  return { uid: id, ...rest };
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Creates the initial profile document for a newly authenticated user. New users
 * always start as USER role with a PENDING approval status.
 */
export async function createInitialProfile(params: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}): Promise<UserProfile> {
  const timestamp = nowIso();
  const model = buildInitialUserModel({
    email: params.email,
    displayName: params.displayName,
    photoURL: params.photoURL,
    emailVerified: params.emailVerified,
    timestamp,
  });

  await setDoc(userWriteDoc(params.uid), model);
  return modelToProfile({ id: params.uid, ...model });
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDoc(uid));
  if (!snapshot.exists()) return null;
  return modelToProfile({ id: snapshot.id, ...snapshot.data() });
}

/**
 * Ensures a profile exists for an authenticated user, creating one if missing
 * (used by social sign-in). Returns the resolved profile.
 */
export async function ensureProfile(params: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}): Promise<UserProfile> {
  const existing = await getProfile(params.uid);
  if (existing) return existing;
  return createInitialProfile(params);
}

export async function completeProfile(
  uid: string,
  input: CompleteProfileInput
): Promise<void> {
  await updateDoc(userWriteDoc(uid), {
    displayName: input.displayName,
    birthYear: input.birthYear,
    generation: getGeneration(input.birthYear),
    gender: input.gender,
    phoneNumber: input.phoneNumber,
    introduction: input.introduction ?? null,
    photoURL: input.photoURL ?? null,
    profileCompleted: true,
    updatedAt: nowIso(),
  });
}

export async function updateOwnProfile(
  uid: string,
  input: MemberEditableInput
): Promise<void> {
  const payload: Record<string, unknown> = { updatedAt: nowIso() };
  if (input.phoneNumber !== undefined) payload.phoneNumber = input.phoneNumber;
  if (input.photoURL !== undefined) payload.photoURL = input.photoURL;
  if (input.introduction !== undefined) payload.introduction = input.introduction;
  await updateDoc(userWriteDoc(uid), payload);
}

export async function updatePrivilegedFields(
  uid: string,
  input: PrivilegedEditableInput
): Promise<void> {
  const payload: Record<string, unknown> = { updatedAt: nowIso() };
  if (input.teamId !== undefined) payload.teamId = input.teamId;
  if (input.teamName !== undefined) payload.teamName = input.teamName;
  if (input.cellId !== undefined) payload.cellId = input.cellId;
  if (input.cellName !== undefined) payload.cellName = input.cellName;
  if (input.ministry !== undefined) payload.ministry = input.ministry;
  if (input.position !== undefined) payload.position = input.position;
  if (input.role !== undefined) payload.role = input.role;
  await updateDoc(userWriteDoc(uid), payload);
}

export async function listByApprovalStatus(
  status: ApprovalStatus
): Promise<UserProfile[]> {
  const q = query(
    usersRef,
    where("approvalStatus", "==", status),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => modelToProfile({ id: d.id, ...d.data() }));
}

export async function listAllMembers(): Promise<UserProfile[]> {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => modelToProfile({ id: d.id, ...d.data() }));
}

export async function approveMember(
  uid: string,
  adminUid: string
): Promise<void> {
  const timestamp = nowIso();
  await updateDoc(userWriteDoc(uid), {
    approvalStatus: ApprovalStatus.APPROVED,
    role: UserRole.MEMBER,
    approvedBy: adminUid,
    approvedAt: timestamp,
    rejectionReason: null,
    updatedAt: timestamp,
  });
}

export async function rejectMember(
  uid: string,
  adminUid: string,
  reason: string
): Promise<void> {
  const timestamp = nowIso();
  await updateDoc(userWriteDoc(uid), {
    approvalStatus: ApprovalStatus.REJECTED,
    approvedBy: adminUid,
    approvedAt: timestamp,
    rejectionReason: reason,
    updatedAt: timestamp,
  });
}

export async function setActiveState(
  uid: string,
  isActive: boolean
): Promise<void> {
  await updateDoc(userWriteDoc(uid), { isActive, updatedAt: nowIso() });
}

export async function updateLastLogin(uid: string): Promise<void> {
  await updateDoc(userWriteDoc(uid), { lastLoginAt: nowIso() }).catch(() => {
    // Non-critical: a missing profile (first social login) is handled elsewhere.
  });
}

/**
 * Updates the role of a user. Only admins should call this function.
 */
export async function updateUserRole(
  uid: string,
  role: UserRole
): Promise<void> {
  await updateDoc(userWriteDoc(uid), { role, updatedAt: nowIso() });
}

/**
 * Gets the current role of a user. Returns "user" if not found.
 */
export async function getCurrentUserRole(uid: string): Promise<UserRole> {
  const profile = await getProfile(uid);
  return profile?.role ?? UserRole.USER;
}
