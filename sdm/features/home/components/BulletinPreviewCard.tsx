"use client";

import { FileText, ExternalLink } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { EmptyState } from "@/components/ui";
import { BibleReferenceLink } from "@/components/bible/BibleReferenceLink";
import { formatKoreanDate } from "../lib/home-format";
import type { BulletinModel } from "@/models/bulletin";

export function BulletinPreviewCard({
  bulletin,
  error = false,
}: {
  bulletin: BulletinModel | null;
  error?: boolean;
}) {
  if (error) {
    return (
      <SectionCard title="주보">
        <SectionError message="주보를 불러오지 못했습니다" />
      </SectionCard>
    );
  }

  if (!bulletin) {
    return (
      <SectionCard title="주보">
        <EmptyState icon={FileText} title="등록된 주보가 없습니다" />
      </SectionCard>
    );
  }

  const open = () => {
    if (bulletin.fileURL) {
      window.open(bulletin.fileURL, "_blank", "noopener,noreferrer");
    }
  };

  const showPreview = bulletin.resourceKind === "image" && bulletin.fileURL;

  return (
    <SectionCard title="주보">
      <button
        type="button"
        onClick={open}
        disabled={!bulletin.fileURL}
        className="w-full overflow-hidden rounded-xl border border-[#e5e5e5] text-left transition-colors hover:bg-[#fafafa] disabled:cursor-default disabled:hover:bg-transparent dark:border-[#2c2c2e] dark:hover:bg-[#262626]"
      >
        {showPreview && (
          <div className="aspect-[16/10] w-full bg-cover bg-center" style={{ backgroundImage: `url(${bulletin.fileURL})` }} />
        )}
        <div className="flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">{bulletin.title}</p>
            <p className="mt-0.5 truncate text-xs text-[#737373] dark:text-[#a3a3a3]">
              {formatKoreanDate(bulletin.date)}
              {bulletin.sermonTitle ? ` · ${bulletin.sermonTitle}` : ""}
            </p>
            {bulletin.scripture && (
              <div className="mt-1 text-xs">
                <BibleReferenceLink reference={bulletin.scripture} className="font-semibold" />
              </div>
            )}
          </div>
          {bulletin.fileURL && <ExternalLink className="h-4 w-4 shrink-0 text-[#a3a3a3]" />}
        </div>
      </button>
    </SectionCard>
  );
}
