import { z } from "zod";
import { PRAYER_CATEGORIES, PRAYER_VISIBILITIES } from "@/types/prayer";

export const prayerFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  content: z.string().min(1, "기도 내용을 입력해주세요").max(4000, "내용은 4000자 이하여야 합니다"),
  category: z.enum(PRAYER_CATEGORIES),
  visibility: z.enum(PRAYER_VISIBILITIES),
  isAnonymous: z.boolean(),
});

export const prayerCommentSchema = z.object({
  content: z.string().min(1, "댓글을 입력해주세요").max(1000, "댓글은 1000자 이하여야 합니다"),
  isAnonymous: z.boolean().default(false),
});

export type PrayerFormData = z.infer<typeof prayerFormSchema>;
export type PrayerCommentFormData = z.infer<typeof prayerCommentSchema>;
