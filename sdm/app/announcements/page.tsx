"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Megaphone, Pin } from "lucide-react";

import { getAllAnnouncements } from "@/services/content";
import { Badge, EmptyState } from "@/components/ui";
import { HomeSkeleton } from "@/features/home/components";
import { ANNOUNCEMENT_CATEGORY, formatKoreanDate } from "@/features/home/lib/home-format";
import type { AnnouncementModel } from "@/models/announcement";

function sortByPinnedThenRecent(items: AnnouncementModel[]): AnnouncementModel[] {
  return [...items].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<AnnouncementModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const data = await getAllAnnouncements();
        if (active) setItems(sortByPinnedThenRecent(data));
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
        <header className="mb-4 flex items-center gap-2">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white text-[#525252] transition-colors hover:bg-[#fafafa] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#a3a3a3]"
            aria-label="홈으로"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">
            공지사항
          </h1>
        </header>

        {loading ? (
          <HomeSkeleton />
        ) : items.length === 0 ? (
          <EmptyState icon={Megaphone} title="등록된 공지가 없습니다" />
        ) : (
          <ul className="space-y-2.5">
            {items.map((item) => {
              const category = ANNOUNCEMENT_CATEGORY[item.category];
              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-1.5">
                      {item.isPinned && (
                        <Pin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                      )}
                      <h2 className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
                        {item.title}
                      </h2>
                    </div>
                    <Badge color={category.color}>{category.label}</Badge>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[#525252] dark:text-[#a3a3a3]">
                    {item.content}
                  </p>
                  <p className="mt-2.5 text-[11px] text-[#a3a3a3]">
                    {formatKoreanDate(item.createdAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
