"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation/auth";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthInput,
  AuthButton,
  AuthFooter,
  AuthErrorMessage,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement Firebase password reset
      console.log("Password reset requested for:", data.email);
      setIsSent(true);
    } catch {
      setError("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="비밀번호 재설정"
          subtitle="가입한 이메일을 입력하세요"
        />

        {isSent ? (
          <div className="rounded-xl bg-[#eff6ff] px-4 py-6 text-center dark:bg-[#1e3a8a]/20">
            <p className="text-sm font-medium text-[#2563EB] dark:text-[#93c5fd]">
              비밀번호 재설정 링크를 이메일로 발송했습니다.
            </p>
            <p className="mt-2 text-xs text-[#a3a3a3] dark:text-[#737373]">
              메일을 확인하여 비밀번호를 바꾼 후 로그인해주세요.
            </p>
          </div>
        ) : (
          <>
            <AuthErrorMessage message={error ?? undefined} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthInput
                {...register("email")}
                label="이메일"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
              />

              <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                재설정 링크 발송
              </AuthButton>
            </form>
          </>
        )}

        <AuthFooter mode="forgot" />
      </AuthCard>
    </AuthLayout>
  );
}
