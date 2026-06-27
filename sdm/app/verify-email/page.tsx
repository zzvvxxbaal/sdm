"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";

import { useAuth, withAuth, resolveAuthDestination } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthErrorMessage,
} from "@/components/auth";
import { Button } from "@/components/ui";

function VerifyEmailPage() {
  const router = useRouter();
  const { user, sendVerificationEmail, refreshProfile, signOut } = useAuth();

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const profile = await refreshProfile();
      if (profile?.emailVerified) {
        router.push(resolveAuthDestination(profile) ?? ROUTES.HOME);
      } else {
        setError(
          "아직 이메일 인증이 확인되지 않았습니다. 메일의 링크를 클릭한 뒤 다시 시도해주세요."
        );
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setResent(false);
    try {
      await sendVerificationEmail();
      setResent(true);
    } catch {
      setError("인증 메일 재발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-2 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563EB] dark:bg-[#1e3a5f] dark:text-[#60a5fa]">
            <MailCheck className="h-7 w-7" />
          </div>
        </div>
        <AuthHeader
          title="이메일을 인증해주세요"
          subtitle={
            user?.email
              ? `${user.email} 로 인증 메일을 보냈어요.`
              : "가입하신 이메일로 인증 메일을 보냈어요."
          }
        />

        <AuthErrorMessage message={error ?? undefined} />

        {resent && (
          <p className="mb-3 rounded-lg bg-[#f0fdf4] px-3 py-2 text-center text-xs font-medium text-[#16a34a] dark:bg-[#14532d]/30 dark:text-[#4ade80]">
            인증 메일을 다시 보냈습니다.
          </p>
        )}

        <div className="space-y-3">
          <Button fullWidth onClick={handleCheck} isLoading={isChecking}>
            인증을 완료했어요
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={handleResend}
            isLoading={isResending}
          >
            인증 메일 다시 보내기
          </Button>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-6 w-full text-center text-xs font-medium text-[#a3a3a3] hover:text-[#525252] dark:hover:text-[#d4d4d4]"
        >
          다른 계정으로 로그인
        </button>
      </AuthCard>
    </AuthLayout>
  );
}

export default withAuth(VerifyEmailPage);
