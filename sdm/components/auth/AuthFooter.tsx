"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface AuthFooterProps {
  mode: "login" | "register" | "forgot";
  className?: string;
}

export function AuthFooter({ mode, className }: AuthFooterProps) {
  const links = {
    login: {
      text: "계정이 없으세요?",
      linkText: "회원가입",
      href: ROUTES.REGISTER,
    },
    register: {
      text: "이미 계정이 있으세요?",
      linkText: "로그인",
      href: ROUTES.LOGIN,
    },
    forgot: {
      text: "비밀번호가 기억나세요?",
      linkText: "로그인",
      href: ROUTES.LOGIN,
    },
  };

  const current = links[mode];

  return (
    <div className={cn("mt-6 text-center", className)}>
      <p className="text-sm text-[#a3a3a3] dark:text-[#737373]">
        {current.text}{" "}
        <Link
          href={current.href}
          className="font-semibold text-[#2563EB] transition-colors hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
        >
          {current.linkText}
        </Link>
      </p>
    </div>
  );
}
