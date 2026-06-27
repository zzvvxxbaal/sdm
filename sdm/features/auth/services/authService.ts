import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type UserCredential,
} from "firebase/auth";

import { auth } from "@/firebase/config";
import { getProvider } from "./providers";
import {
  createInitialProfile,
  ensureProfile,
  getProfile,
  updateLastLogin,
} from "@/services/user";
import type { AuthError, SignInCredentials, SignUpCredentials } from "@/types/auth";
import type { UserProfile } from "@/types/user";
import {
  AUTH_ERRORS,
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from "@/constants/auth";

function normalizeAuthError(error: unknown): AuthError {
  if (error instanceof Error && !("code" in error)) {
    return { code: AUTH_ERRORS.UNKNOWN, message: error.message };
  }
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError?.code ?? AUTH_ERRORS.UNKNOWN;
  const message = AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR_MESSAGE;
  return { code, message };
}

export async function signIn(
  credentials: SignInCredentials
): Promise<UserProfile> {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    const profile = await ensureProfile({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    });
    await updateLastLogin(result.user.uid);
    return { ...profile, emailVerified: result.user.emailVerified };
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, getProvider("google"));
    const profile = await ensureProfile({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    });
    await updateLastLogin(result.user.uid);
    return { ...profile, emailVerified: result.user.emailVerified };
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signInWithKakao(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, getProvider("kakao"));
    const profile = await ensureProfile({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    });
    await updateLastLogin(result.user.uid);
    return { ...profile, emailVerified: result.user.emailVerified };
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function signUp(
  credentials: SignUpCredentials
): Promise<UserProfile> {
  try {
    const result: UserCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: credentials.displayName,
      });
      await sendEmailVerification(auth.currentUser);
    }

    return createInitialProfile({
      uid: result.user.uid,
      email: result.user.email,
      displayName: credentials.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    });
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

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function resendVerificationEmail(): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error("로그인 상태가 아닙니다.");
    }
    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    throw normalizeAuthError(error);
  }
}

export async function fetchProfile(uid: string): Promise<UserProfile | null> {
  return getProfile(uid);
}
