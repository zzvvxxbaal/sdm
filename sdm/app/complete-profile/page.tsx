"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth, withAuth, resolveAuthDestination } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import {
  completeProfileSchema,
  type CompleteProfileFormData,
} from "@/lib/validation/member";
import { completeProfile } from "@/services/user";
import { Gender, GENDER_LABELS } from "@/types/member";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthErrorMessage,
} from "@/components/auth";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

function CompleteProfilePage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!user.emailVerified) {
      router.replace(ROUTES.VERIFY_EMAIL);
    } else if (user.profileCompleted) {
      router.replace(resolveAuthDestination(user) ?? ROUTES.HOME);
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      displayName: user?.displayName ?? "",
    },
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    if (!user) return;
    setError(null);
    try {
      await completeProfile(user.uid, {
        displayName: data.displayName,
        birthYear: data.birthYear,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        introduction: data.introduction || null,
      });
      const profile = await refreshProfile();
      router.push(
        profile ? resolveAuthDestination(profile) ?? ROUTES.HOME : ROUTES.PENDING_APPROVAL
      );
    } catch {
      setError("프로필 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="프로필을 완성해주세요"
          subtitle="원활한 공동체 생활을 위해 기본 정보를 입력해주세요"
        />

        <AuthErrorMessage message={error ?? undefined} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="이름" required error={errors.displayName?.message}>
            <Input
              {...register("displayName")}
              placeholder="홍길동"
              hasError={!!errors.displayName}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="출생연도" required error={errors.birthYear?.message}>
              <Input
                {...register("birthYear", { valueAsNumber: true })}
                type="number"
                inputMode="numeric"
                placeholder="1999"
                hasError={!!errors.birthYear}
              />
            </Field>

            <Field label="성별" required error={errors.gender?.message}>
              <Select
                {...register("gender")}
                hasError={!!errors.gender}
                defaultValue=""
              >
                <option value="" disabled>
                  선택
                </option>
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>
                    {GENDER_LABELS[g]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

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

          <Field
            label="자기소개"
            error={errors.introduction?.message}
            hint="공동체에 나를 소개해보세요 (선택)"
          >
            <Textarea
              {...register("introduction")}
              rows={3}
              placeholder="안녕하세요!"
              hasError={!!errors.introduction}
            />
          </Field>

          <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
            제출하고 승인 요청하기
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default withAuth(CompleteProfilePage);
