"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "@/firebase/config";
import { AuthContext } from "./AuthContext";

import type {
  AuthState,
  AuthError,
  UserProfile,
  SignInCredentials,
  SignUpCredentials,
  AuthContextValue,
} from "@/types/auth";

import { UserRole } from "@/types/auth";

import {
  signIn as signInService,
  signInWithGoogle as signInWithGoogleService,
  signInWithKakao as signInWithKakaoService,
  signOut as signOutService,
  signUp as signUpService,
  syncUserProfile,
} from "@/features/auth/services/authService";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function buildUserProfile(user: User, role: string): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: role as UserRole,
    createdAt: user.metadata.creationTime ?? new Date().toISOString(),
    updatedAt: user.metadata.lastSignInTime ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await syncUserProfile(user.uid);
        const role = profile?.role ?? UserRole.USER;
        setState({
          user: buildUserProfile(user, role),
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await signInService(credentials);
      const profile = await syncUserProfile(result.user.uid);
      const role = profile?.role ?? UserRole.USER;
      setState({
        user: buildUserProfile(result.user, role),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await signInWithGoogleService();
      const profile = await syncUserProfile(result.user.uid);
      const role = profile?.role ?? UserRole.USER;
      setState({
        user: buildUserProfile(result.user, role),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  const signInWithKakao = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await signInWithKakaoService();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await signUpService(credentials);
      setState({
        user: buildUserProfile(result.user, UserRole.USER),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await signOutService();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      signIn,
      signInWithGoogle,
      signInWithKakao,
      signOut,
      signUp,
      clearError,
    }),
    [state, signIn, signInWithGoogle, signInWithKakao, signOut, signUp, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
