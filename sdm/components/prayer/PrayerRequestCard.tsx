"use client";

import Link from "next/link";
import { Heart, MessageSquare, Pin, Pencil, Trash2, BadgeAlert } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { PRAYER_CATEGORY_LABELS, PRAYER_VISIBILITY_LABELS } from "@/types/prayer";
import { formatKoreanDateTime } from "@/lib/date";
import type { PrayerRequestModel } from "@/models/prayer_request";
import { cn, truncate } from "@/lib/utils";

interface PrayerRequestCardProps {
  prayer: PrayerRequestModel;
  liked: boolean;
  canEdit: boolean;
  canPin: boolean;
  onLike: (id: string) => Promise<void>;
  onEdit?: (prayer: PrayerRequestModel) => void;
  onDelete?: (prayer: PrayerRequestModel) => void;
  onTogglePin?: (prayer: PrayerRequestModel) => Promise<void>;
}

export function PrayerRequestCard({
  prayer,
  liked,
  canEdit,
  canPin,
  onLike,
  onEdit,
  onDelete,
  onTogglePin,
}: PrayerRequestCardProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {prayer.isPinned && <Pin className="h-4 w-4 text-[#2563EB]" />}
            {prayer.isAnswered && <BadgeAlert className="h-4 w-4 text-[#10B981]" />}
            <h3 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{prayer.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{PRAYER_CATEGORY_LABELS[prayer.category]}</Badge>
            <Badge color="#0EA5E9">{PRAYER_VISIBILITY_LABELS[prayer.visibility]}</Badge>
          </div>
        </div>
        {(canPin || canEdit) && (
          <div className="flex items-center gap-1">
            {canPin && onTogglePin && (
              <Button type="button" variant="ghost" size="sm" onClick={() => void onTogglePin(prayer)}>
                <Pin className={cn("h-4 w-4", prayer.isPinned && "text-[#2563EB]")} />
              </Button>
            )}
            {canEdit && onEdit && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(prayer)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canEdit && onDelete && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(prayer)}>
                <Trash2 className="h-4 w-4 text-[#EF4444]" />
              </Button>
            )}
          </div>
        )}
      </div>

      <Link href={`/prayer/${prayer.id}`} className="block rounded-2xl border border-transparent transition-colors hover:border-[#e5e5e5] dark:hover:border-[#2c2c2e]">
        <p className="whitespace-pre-wrap text-sm leading-6 text-[#525252] dark:text-[#d4d4d8]">{truncate(prayer.content, 180)}</p>
      </Link>

      <div className="flex items-center justify-between gap-3 text-xs text-[#737373] dark:text-[#a3a3a3]">
        <div>
          {prayer.isAnonymous ? "익명" : prayer.authorName || "작성자"} · {formatKoreanDateTime(prayer.createdAt)}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => void onLike(prayer.id)} className={cn("inline-flex items-center gap-1", liked && "text-[#EF4444]")}>
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            {prayer.prayerCount}
          </button>
          <Link href={`/prayer/${prayer.id}`} className="inline-flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {prayer.commentCount}
          </Link>
        </div>
      </div>
    </Card>
  );
}
