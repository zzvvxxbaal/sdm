export enum UserRole {
  USER = "user",
  MEMBER = "member",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

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
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  clearError: () => void;
}
