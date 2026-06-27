"use client";

import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

interface SocialLoginButtonsProps {
  className?: string;
}

export function SocialLoginButtons({ className }: SocialLoginButtonsProps) {
  const { signInWithGoogle, signInWithKakao, isLoading } = useAuth();

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isLoading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#171717] transition-all",
          "hover:bg-[#fafafa] hover:border-[#d4d4d4]",
          "dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5] dark:hover:bg-[#262626]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <GoogleIcon />
        Google로 계속하기
      </button>

      <button
        type="button"
        onClick={signInWithKakao}
        disabled={isLoading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-4 text-sm font-medium text-[#3C1E1E] transition-all",
          "hover:bg-[#F5DC00]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <KakaoIcon />
        Kakao로 계속하기
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.6 1.47 4.9 3.75 6.38-.16.57-.6 2.08-.68 2.38-.1.4.15.4.32.29.13-.09 2.1-1.42 2.95-1.99C9.57 18.55 10.75 19 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z" fill="#3C1E1E"/>
    </svg>
  );
}
