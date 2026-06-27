"use client";

import Link from "next/link";
import { ChevronLeft, Heart, Pin } from "lucide-react";
import { useParams } from "next/navigation";

import { withAuth, useAuth } from "@/features/auth";
import { usePrayerDetail } from "@/features/prayer";
import { PrayerCommentList } from "@/components/prayer";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { PRAYER_CATEGORY_LABELS, PRAYER_VISIBILITY_LABELS } from "@/types/prayer";
import { formatKoreanDateTime } from "@/lib/date";

function PrayerDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { prayer, comments, liked, loading, error, addComment, removeComment, likePrayer } = usePrayerDetail(params.id);

  if (loading) {
    return <div className="mx-auto max-w-lg px-4 py-6"><div className="h-56 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" /></div>;
  }

  if (error || !prayer || !user) {
    return <div className="mx-auto max-w-lg px-4 py-6"><EmptyState title={error || "기도제목을 찾을 수 없습니다"} /></div>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <Link href="/prayer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white text-[#525252] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#a3a3a3]">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">기도제목 상세</h1>
          <p className="text-xs text-[#737373] dark:text-[#a3a3a3]">함께 응답을 기록하고 댓글로 중보하세요.</p>
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          {prayer.isPinned && <Pin className="h-4 w-4 text-[#2563EB]" />}
          <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">{prayer.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{PRAYER_CATEGORY_LABELS[prayer.category]}</Badge>
          <Badge color="#0EA5E9">{PRAYER_VISIBILITY_LABELS[prayer.visibility]}</Badge>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-[#525252] dark:text-[#d4d4d8]">{prayer.content}</p>
        <div className="text-xs text-[#737373] dark:text-[#a3a3a3]">
          {prayer.isAnonymous ? "익명" : prayer.authorName || "작성자"} · {formatKoreanDateTime(prayer.createdAt)}
        </div>
        <Button type="button" variant={liked ? "danger" : "secondary"} fullWidth onClick={() => void likePrayer()}>
          <Heart className={liked ? "h-4 w-4 fill-current" : "h-4 w-4"} /> 기도했습니다 ({prayer.prayerCount})
        </Button>
      </Card>

      <PrayerCommentList comments={comments} currentUserId={user.uid} onAddComment={addComment} onDeleteComment={removeComment} />
    </div>
  );
}

export default withAuth(PrayerDetailPage);
