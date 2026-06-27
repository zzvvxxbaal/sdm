import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "성경 - SDM",
  description: "SDM 서대문교회 청년부 성경",
};

export default function BibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
