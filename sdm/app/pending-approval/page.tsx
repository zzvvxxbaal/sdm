"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, XCircle, Ban } from "lucide-react";

import { useAuth, withAuth, resolveAuthDestination } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import { ApprovalStatus } from "@/types/member";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthErrorMessage,
} from "@/components/auth";
import { Button } from "@/components/ui";

function PendingApprovalPage() {
  const router = useRouter();
  const { user, refreshProfile, signOut } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!user.emailVerified) {
      router.replace(ROUTES.VERIFY_EMAIL);
    } else if (!user.profileCompleted) {
      router.replace(ROUTES.COMPLETE_PROFILE);
    }
  }, [user, router]);

  const handleCheck = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const profile = await refreshProfile();
      if (profile && resolveAuthDestination(profile) === null) {
        router.push(ROUTES.HOME);
      } else {
        setError("아직 승인 처리가 완료되지 않았습니다.");
      }
    } finally {
      setIsChecking(false);
    }
  };

  const isRejected = user?.approvalStatus === ApprovalStatus.REJECTED;
  const isDeactivated =
    user?.approvalStatus === ApprovalStatus.APPROVED && !user?.isActive;

  const variant = isRejected
    ? {
        icon: XCircle,
        tint: "bg-[#fef2f2] text-[#ef4444] dark:bg-[#3f1f1f] dark:text-[#f87171]",
        title: "가입이 거절되었습니다",
        subtitle: "아래 사유를 확인해주세요.",
      }
    : isDeactivated
      ? {
          icon: Ban,
          tint: "bg-[#fafafa] text-[#737373] dark:bg-[#262626] dark:text-[#a3a3a3]",
          title: "비활성화된 계정입니다",
          subtitle: "관리자에게 문의해주세요.",
        }
      : {
          icon: Clock,
          tint: "bg-[#fefce8] text-[#ca8a04] dark:bg-[#422006] dark:text-[#eab308]",
          title: "승인을 기다리고 있어요",
          subtitle: "관리자가 가입을 확인하면 알려드릴게요.",
        };

  const Icon = variant.icon;

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-2 flex justify-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${variant.tint}`}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
        <AuthHeader title={variant.title} subtitle={variant.subtitle} />

        {isRejected && user?.rejectionReason && (
          <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 dark:border-[#7f1d1d] dark:bg-[#3f1f1f]/40">
            <p className="text-xs font-semibold text-[#ef4444]">거절 사유</p>
            <p className="mt-1 text-sm text-[#171717] dark:text-[#f5f5f5]">
              {user.rejectionReason}
            </p>
          </div>
        )}

        <AuthErrorMessage message={error ?? undefined} />

        <div className="space-y-3">
          {!isRejected && !isDeactivated && (
            <Button fullWidth onClick={handleCheck} isLoading={isChecking}>
              승인 상태 새로고침
            </Button>
          )}
          <Button fullWidth variant="secondary" onClick={() => signOut()}>
            로그아웃
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default withAuth(PendingApprovalPage);
