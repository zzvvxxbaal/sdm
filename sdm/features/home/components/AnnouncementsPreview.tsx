import Link from "next/link";
import { Megaphone, Pin } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { Badge, EmptyState } from "@/components/ui";
import { ANNOUNCEMENT_CATEGORY, formatKoreanDate } from "../lib/home-format";
import type { AnnouncementModel } from "@/models/announcement";

export function AnnouncementsPreview({
  announcements,
  error = false,
}: {
  announcements: AnnouncementModel[];
  error?: boolean;
}) {
  return (
    <SectionCard
      title="공지사항"
      action={
        <Link
          href="/announcements"
          className="text-xs font-semibold text-[#2563EB] hover:underline"
        >
          전체보기
        </Link>
      }
    >
      {error ? (
        <SectionError message="공지사항을 불러오지 못했습니다" />
      ) : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="등록된 공지가 없습니다" />
      ) : (
        <ul className="space-y-2.5">
          {announcements.map((item) => {
            const category = ANNOUNCEMENT_CATEGORY[item.category];
            return (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-xl border border-[#e5e5e5] p-3 dark:border-[#2c2c2e]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {item.isPinned && (
                      <Pin className="h-3 w-3 shrink-0 text-[#2563EB]" />
                    )}
                    <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[#737373] dark:text-[#a3a3a3]">
                    {item.content}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#a3a3a3]">
                    {formatKoreanDate(item.createdAt)}
                  </p>
                </div>
                <Badge color={category.color}>{category.label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
