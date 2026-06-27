import type { Metadata } from "next";
import "@/styles/globals.css";

import { AuthProvider } from "@/features/auth";

export const metadata: Metadata = {
  title: "SDM",
  description: "SDM Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#171717] dark:bg-[#0a0a0a] dark:text-[#f5f5f5]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
