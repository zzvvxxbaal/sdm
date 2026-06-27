import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원 - SDM",
  description: "SDM 서대문교회 청년부 회원 프로필",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
