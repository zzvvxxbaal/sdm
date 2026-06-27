"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/firebase/config";
import { AuthContext } from "./AuthContext";
import { useAuthMethods } from "./useAuthMethods";

import type { AuthState, AuthContextValue } from "@/types/auth";
import { ensureProfile } from "@/services/user";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const currentUidRef = useRef<string | null>(null);
  const methods = useAuthMethods(setState, currentUidRef);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      currentUidRef.current = firebaseUser?.uid ?? null;
      if (firebaseUser) {
        const profile = await ensureProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        });
        setState({
          user: { ...profile, emailVerified: firebaseUser.emailVerified },
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

  const value: AuthContextValue = useMemo(
    () => ({ ...state, ...methods }),
    [state, methods]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
