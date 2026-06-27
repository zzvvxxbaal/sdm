"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth";
import { ROUTES } from "@/constants/routes";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthInput,
  AuthButton,
  AuthFooter,
  AuthErrorMessage,
  AuthDivider,
  SocialLoginButtons,
} from "@/components/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, error, isLoading, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await signUp({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      router.push(ROUTES.DASHBOARD);
    } catch {
      // Error handled by AuthProvider
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="회원가입"
          subtitle="서대문교회 청년부와 함께해요"
        />

        <AuthErrorMessage message={error?.message} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            {...register("displayName")}
            label="이름"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            error={errors.displayName?.message}
          />

          <AuthInput
            {...register("email")}
            label="이메일"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
          />

          <AuthInput
            {...register("password")}
            label="비밀번호"
            type="password"
            placeholder="******"
            autoComplete="new-password"
            error={errors.password?.message}
          />

          <AuthInput
            {...register("confirmPassword")}
            label="비밀번호 확인"
            type="password"
            placeholder="******"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-2">
            회원가입
          </AuthButton>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <AuthFooter mode="register" />
      </AuthCard>
    </AuthLayout>
  );
}
