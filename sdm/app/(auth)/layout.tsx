import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDM - 인증",
  description: "SDM 서대문교회 청년부 인증",
};

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
