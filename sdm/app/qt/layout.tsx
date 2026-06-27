import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QT - SDM",
  description: "SDM 서대문교회 청년부 QT 매일 약",
};

export default function QtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
