import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  updateProfile,
  type UserCredential,
} from "firebase/auth";

import { auth, db } from "@/firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { UserRole, type AuthError, type SignInCredentials, type SignUpCredentials } from "@/types/auth";
import { AUTH_ERRORS, AUTH_ERROR_MESSAGES, DEFAULT_AUTH_ERROR_MESSAGE } from "@/constants/auth";

const googleProvider = new GoogleAuthProvider();

function normalizeAuthError(error: unknown): AuthError {
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError?.code ?? AUTH_ERRORS.UNKNOWN;
  const message = AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR_MESSAGE;
  return { code, message };
}

async function createUserProfile(userCredential: UserCredential, displayName?: string): Promise<void> {
  const { user } = userCredential;
  const userRef = doc(db, "users", user.uid);
  const now = new Date().toISOString();

  const userProfile = {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName,
    photoURL: user.photoURL,
    role: UserRole.USER,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(userRef, userProfile);
}

async function getUserProfile(uid: string): Promise<{ role: string } | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as { role: string };
  }
  return null;
}

export async function signIn(credentials: SignInCredentials): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await getUserProfile(result.user.uid);
    if (!profile) {
      await createUserProfile(result);
    }
    return result;
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signInWithKakao(): Promise<void> {
  // Kakao authentication is reserved for future implementation.
  throw new Error("Kakao authentication is not yet implemented.");
}

export async function signUp(credentials: SignUpCredentials): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: credentials.displayName,
      });
    }

    await createUserProfile(userCredential, credentials.displayName);
    return userCredential;
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function updateUserRole(uid: string, role: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    role,
    updatedAt: new Date().toISOString(),
  });
}

export async function syncUserProfile(uid: string): Promise<{ role: string } | null> {
  return getUserProfile(uid);
}
