import { useAuthContext } from "@/features/auth/context/AuthContext";

export function useAuth() {
  const context = useAuthContext();
  return context;
}
