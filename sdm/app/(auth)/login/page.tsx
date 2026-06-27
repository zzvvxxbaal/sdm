"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
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
  RememberMeCheckbox,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, error, isLoading, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await signIn({ email: data.email, password: data.password });
      router.push(ROUTES.DASHBOARD);
    } catch {
      // Error handled by AuthProvider
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="로그인"
          subtitle="서대문교회 청년부의 모든 서비스를 만끼세요"
        />

        <AuthErrorMessage message={error?.message} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="current-password"
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <RememberMeCheckbox {...register("rememberMe")} />
            <a
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-[#2563EB] transition-colors hover:text-[#1d4ed8] dark:text-[#60a5fa]"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>

          <AuthButton type="submit" isLoading={isLoading} className="mt-2">
            로그인
          </AuthButton>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <AuthFooter mode="login" />
      </AuthCard>
    </AuthLayout>
  );
}
