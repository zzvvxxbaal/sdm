import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정 - SDM",
  description: "SDM 서대문교회 청년부 설정",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
