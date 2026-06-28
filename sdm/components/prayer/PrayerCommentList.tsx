"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button, Card, EmptyState, Field, Textarea } from "@/components/ui";
import { prayerCommentSchema } from "@/lib/validation";
import { formatKoreanDateTime } from "@/lib/date";
import type { PrayerCommentModel } from "@/types/prayer";

interface PrayerCommentListProps {
  comments: PrayerCommentModel[];
  currentUserId: string;
  onAddComment: (input: { content: string; isAnonymous: boolean }) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function PrayerCommentList({ comments, currentUserId, onAddComment, onDeleteComment }: PrayerCommentListProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    const parsed = prayerCommentSchema.safeParse({ content, isAnonymous });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "댓글을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(parsed.data);
      setContent("");
      setIsAnonymous(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "댓글 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <Field label="중보 댓글 남기기">
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="함께 기도하며 남길 응원과 중보 내용을 적어주세요" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-[#525252] dark:text-[#d4d4d8]">
          <input type="checkbox" checked={isAnonymous} onChange={(event) => setIsAnonymous(event.target.checked)} className="h-4 w-4 rounded border-[#d4d4d8]" />
          익명 댓글
        </label>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <Button type="button" fullWidth isLoading={isSubmitting} onClick={submit}>
          댓글 등록
        </Button>
      </Card>

      {comments.length === 0 ? (
        <EmptyState title="아직 댓글이 없습니다" description="첫 번째로 중보 댓글을 남겨보세요." />
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">{comment.isAnonymous ? "익명" : comment.authorName || "성도"}</p>
                  <p className="text-xs text-[#a3a3a3]">{formatKoreanDateTime(comment.createdAt)}</p>
                </div>
                {comment.createdBy === currentUserId && (
                  <button type="button" onClick={() => void onDeleteComment(comment.id)} className="rounded-lg p-2 text-[#a3a3a3] transition-colors hover:bg-[#fef2f2] hover:text-[#EF4444]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#525252] dark:text-[#d4d4d8]">{comment.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
