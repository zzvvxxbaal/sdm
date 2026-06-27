"use client";

import { createContext, useContext } from "react";
import type { AuthContextValue } from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
