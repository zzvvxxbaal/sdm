import { useCallback, useMemo } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

import { auth } from "@/firebase/config";
import {
  signIn as signInService,
  signInWithGoogle as signInWithGoogleService,
  signInWithKakao as signInWithKakaoService,
  signOut as signOutService,
  signUp as signUpService,
  resetPassword as resetPasswordService,
  resendVerificationEmail as resendVerificationService,
  fetchProfile,
} from "@/features/auth/services/authService";

import type {
  AuthState,
  AuthError,
  SignInCredentials,
  SignUpCredentials,
  UserProfile,
} from "@/types/auth";

type SetAuthState = Dispatch<SetStateAction<AuthState>>;

/**
 * Encapsulates all auth action callbacks (sign-in variants, sign-up, sign-out,
 * password reset, verification, profile refresh) so the provider stays lean.
 */
export function useAuthMethods(
  setState: SetAuthState,
  currentUidRef: RefObject<string | null>
) {
  const handleError = useCallback(
    (error: unknown): never => {
      setState((prev) => ({ ...prev, isLoading: false, error: error as AuthError }));
      throw error;
    },
    [setState]
  );

  const authenticate = useCallback(
    async (action: () => Promise<UserProfile>): Promise<UserProfile> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const profile = await action();
        setState({ user: profile, isAuthenticated: true, isLoading: false, error: null });
        return profile;
      } catch (error) {
        return handleError(error);
      }
    },
    [setState, handleError]
  );

  const signIn = useCallback(
    (credentials: SignInCredentials) => authenticate(() => signInService(credentials)),
    [authenticate]
  );
  const signInWithGoogle = useCallback(
    () => authenticate(() => signInWithGoogleService()),
    [authenticate]
  );
  const signInWithKakao = useCallback(
    () => authenticate(() => signInWithKakaoService()),
    [authenticate]
  );
  const signUp = useCallback(
    (credentials: SignUpCredentials) => authenticate(() => signUpService(credentials)),
    [authenticate]
  );

  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await signOutService();
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      handleError(error);
    }
  }, [setState, handleError]);

  const resetPassword = useCallback(
    async (email: string): Promise<void> => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        await resetPasswordService(email);
      } catch (error) {
        handleError(error);
      }
    },
    [setState, handleError]
  );

  const sendVerificationEmail = useCallback(async (): Promise<void> => {
    try {
      await resendVerificationService();
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    const uid = currentUidRef.current;
    if (!uid) return null;
    if (auth.currentUser) {
      await auth.currentUser.reload();
    }
    const profile = await fetchProfile(uid);
    if (!profile) return null;
    const merged: UserProfile = {
      ...profile,
      emailVerified: auth.currentUser?.emailVerified ?? profile.emailVerified,
    };
    setState((prev) => ({ ...prev, user: merged }));
    return merged;
  }, [currentUidRef, setState]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, [setState]);

  return useMemo(
    () => ({
      signIn,
      signInWithGoogle,
      signInWithKakao,
      signUp,
      signOut,
      resetPassword,
      sendVerificationEmail,
      refreshProfile,
      clearError,
    }),
    [
      signIn,
      signInWithGoogle,
      signInWithKakao,
      signUp,
      signOut,
      resetPassword,
      sendVerificationEmail,
      refreshProfile,
      clearError,
    ]
  );
}
