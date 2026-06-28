# Sprint 2: Firebase Authentication System

## Overview

SDM (Seodaemun Church Platform) implements a production-ready Firebase authentication system with Firestore integration. This document explains the architecture and how to use it.

## Architecture

### 1. Firebase Configuration (`firebase/config.ts`)

Initializes Firebase app, Authentication, and Firestore with environment variables:

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
```

**Environment Variables Required:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

### 2. Authentication Service (`features/auth/services/authService.ts`)

Provides high-level authentication methods:

- **`signUp(credentials)`** - Register new user with email/password
- **`signIn(credentials)`** - Login with email/password
- **`signInWithGoogle()`** - OAuth login via Google
- **`signInWithKakao()`** - OAuth login via Kakao (Korean provider)
- **`signOut()`** - Logout user
- **`resetPassword(email)`** - Send password reset email
- **`resendVerificationEmail()`** - Resend email verification

All methods handle Firebase errors and return/throw normalized `AuthError` types.

### 3. User Service (`services/user/userService.ts`)

Manages Firestore user profiles:

- **`createInitialProfile()`** - Create user document after signup
- **`getProfile(uid)`** - Fetch user profile from Firestore
- **`ensureProfile()`** - Create profile if missing (social login)
- **`updateLastLogin(uid)`** - Track last login timestamp
- **`completeProfile()`** - Complete profile after signup
- **`updateOwnProfile()`** - User updates their own profile
- **`updatePrivilegedFields()`** - Admin/leader updates on member

### 4. Auth State Management (`features/auth/context/`)

**AuthProvider** (`AuthProvider.tsx`):
- Wraps app with Firebase auth state listener
- Manages global auth state and methods
- Automatically creates Firestore user documents on first login

**useAuth Hook** (`hooks/useAuth.ts`):
- Access auth state and methods in components
- Returns: `{ user, isAuthenticated, isLoading, error, signIn, signOut, signUp, ... }`

**Error Handling** (`useAuthMethods.ts`):
- Normalizes Firebase auth errors
- Provides user-friendly error messages (Korean)

### 5. User Profile Model

**Firestore Collection: `users/{uid}`**

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  // Personal information
  birthYear: number | null;
  gender: Gender | null;
  phoneNumber: string | null;
  introduction: string | null;

  // Church information
  registeredAt: string | null;
  teamId: string | null;
  cellId: string | null;
  ministry: string | null;
  position: ChurchPosition;

  // Permissions
  role: "user" | "leader" | "admin";
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;

  // Timestamps (ISO 8601)
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
```

### 6. UI Components

**Login Page** (`app/(auth)/login/page.tsx`):
- Email/password form
- Social login buttons (Google, Kakao)
- Password reset link
- Remember me checkbox

**Register Page** (`app/(auth)/register/page.tsx`):
- Email/password form
- Display name input
- Social signup option
- Login link

**Password Reset** (`app/(auth)/forgot-password/page.tsx`):
- Email input for reset
- Confirmation messaging

**Email Verification** (`app/verify-email/page.tsx`):
- Prompt to verify email after signup

## How to Implement in Components

### Basic Auth Check

```tsx
"use client";
import { useAuth } from "@/features/auth";

export default function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user?.displayName}</div>;
}
```

### Handling Login

```tsx
const { signIn, error, isLoading } = useAuth();

const handleLogin = async () => {
  try {
    const profile = await signIn({
      email: "user@example.com",
      password: "password",
    });
    console.log("Logged in:", profile);
  } catch (err) {
    console.error("Login failed:", err);
  }
};
```

### Handling Signup

```tsx
const { signUp, error, isLoading } = useAuth();

const handleSignup = async () => {
  try {
    const profile = await signUp({
      email: "user@example.com",
      password: "password",
      displayName: "John Doe",
    });
    // Firestore user document created automatically
    console.log("Signed up:", profile);
  } catch (err) {
    console.error("Signup failed:", err);
  }
};
```

## Session Persistence

Firebase Auth automatically persists sessions using browser localStorage. Users remain logged in across page refreshes and browser restarts by default.

To configure persistence:

```typescript
// Browser (default)
import { setPersistence, browserLocalPersistence } from "firebase/auth";
await setPersistence(auth, browserLocalPersistence);
```

## Role-Based Access Control

User roles control access to different features:

- **`user`** - Regular member (new signup default)
- **`leader`** - Cell/team leader, can manage members
- **`admin`** - Full platform access

Check roles in components:

```tsx
const { user } = useAuth();

if (user?.role === "admin") {
  return <AdminPanel />;
}
```

Use HOCs for route protection:

```typescript
export default withRole(AdminPage, ["admin"]);
export default withAuth(ProtectedPage);
```

## Approval System

New users start with `approvalStatus: "pending"`. Leaders/admins can:
- **Approve** - `approvalStatus: "approved"`
- **Reject** - `approvalStatus: "rejected"`

Pending users can still log in but have limited access.

## Error Handling

The auth system provides normalized error codes:

```typescript
export enum AUTH_ERRORS {
  EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
  WEAK_PASSWORD = "auth/weak-password",
  INVALID_EMAIL = "auth/invalid-email",
  USER_NOT_FOUND = "auth/user-not-found",
  WRONG_PASSWORD = "auth/wrong-password",
  // ... more codes
}
```

User-friendly messages are provided for each error (in Korean).

## UI Design System

All auth components use SDM's minimal design system:
- White-based UI with 20px+ rounded cards
- Responsive mobile-first design
- Maintains iOS safe-area compatibility
- No heavy redesign

## File Structure

```
features/auth/
├── context/
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   └── useAuthMethods.ts
├── hooks/
│   └── useAuth.ts
├── services/
│   ├── authService.ts
│   └── providers.ts (OAuth providers)
├── hocs/
│   ├── withAuth.tsx (route protection)
│   ├── withRole.tsx (role-based access)
│   └── withApproval.tsx (approval status check)
└── utils/
    ├── redirect.ts
    └── roles.ts

services/user/
├── userService.ts (Firestore operations)
├── userFactory.ts (model builders)
└── index.ts (exports)

firebase/
├── config.ts (Firebase initialization)
├── auth.ts (auth exports)
└── converters/ (Firestore converters)

components/auth/
├── LoginForm.tsx
├── RegisterForm.tsx
├── AuthInput.tsx
├── AuthButton.tsx
└── ... (more UI components)

app/(auth)/
├── login/
├── register/
└── forgot-password/
```

## Testing Checklist

- [ ] User can sign up with email/password
- [ ] User profile is created in Firestore
- [ ] User receives verification email
- [ ] User can verify email
- [ ] User can log in after signup
- [ ] Session persists after page refresh
- [ ] User can log out
- [ ] User can reset password
- [ ] Social login works (Google, Kakao)
- [ ] Unapproved users can still log in (limited access)
- [ ] Admin can approve/reject members
- [ ] Home page shows logged-in user greeting
- [ ] UI layout remains intact (Header, Dock, responsive design)

## Environment Setup

1. Create `.env.local` in project root:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
# ... other variables (see .env.example)
```

2. Run development server:

```bash
cd sdm
pnpm --ignore-workspace dev
```

3. Navigate to http://localhost:3000/auth/login

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)
