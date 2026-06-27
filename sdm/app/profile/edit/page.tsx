"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

import { useAuth, withApproval } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import {
  memberEditSchema,
  type MemberEditFormData,
} from "@/lib/validation/member";
import { updateOwnProfile } from "@/services/user";
import { CHURCH_POSITION_LABELS } from "@/types/member";
import { ROLE_LABELS } from "@/types/role";
import {
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Textarea,
  PageHeader,
} from "@/components/ui";

function ProfileEditPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberEditFormData>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber ?? "",
      introduction: user?.introduction ?? "",
    },
  });

  if (!user) return null;

  const onSubmit = async (data: MemberEditFormData) => {
    setError(null);
    try {
      await updateOwnProfile(user.uid, {
        phoneNumber: data.phoneNumber,
        introduction: data.introduction || null,
      });
      await refreshProfile();
      router.push(ROUTES.PROFILE);
    } catch {
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="프로필 편집" description="연락처와 자기소개를 수정할 수 있어요" />

      {error && (
        <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444] dark:border-[#7f1d1d] dark:bg-[#3f1f1f]/40">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-4">
          <CardHeader title="수정 가능한 정보" />
          <div className="space-y-4">
            <Field
              label="전화번호"
              required
              error={errors.phoneNumber?.message}
              hint="예: 010-1234-5678"
            >
              <Input
                {...register("phoneNumber")}
                type="tel"
                inputMode="tel"
                placeholder="010-1234-5678"
                hasError={!!errors.phoneNumber}
              />
            </Field>

            <Field label="자기소개" error={errors.introduction?.message}>
              <Textarea
                {...register("introduction")}
                rows={4}
                placeholder="공동체에 나를 소개해보세요"
                hasError={!!errors.introduction}
              />
            </Field>
          </div>
        </Card>

        <Card className="mb-4">
          <CardHeader
            title="교회 정보"
            description="팀 · 셀 · 사역 · 직분 · 권한은 리더/관리자만 변경할 수 있어요"
          />
          <div className="space-y-3">
            <LockedRow label="팀" value={user.teamName ?? "미배정"} />
            <LockedRow label="셀" value={user.cellName ?? "미배정"} />
            <LockedRow label="사역" value={user.ministry ?? "없음"} />
            <LockedRow
              label="직분"
              value={CHURCH_POSITION_LABELS[user.position]}
            />
            <LockedRow label="권한" value={ROLE_LABELS[user.role]} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}

function LockedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#a3a3a3]">
        <Lock className="h-3.5 w-3.5 text-[#a3a3a3]" />
        {label}
      </span>
      <span className="text-sm font-medium text-[#a3a3a3]">{value}</span>
    </div>
  );
}

export default withApproval(ProfileEditPage);
