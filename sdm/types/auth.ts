import type { UserProfile } from "./user";

export { UserRole } from "./role";

export type AuthProviderId = "password" | "google" | "kakao";

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signInWithKakao: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  clearError: () => void;
}

export type { UserProfile };
