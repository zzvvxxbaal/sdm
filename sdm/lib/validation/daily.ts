import { z } from "zod";
import { parseReference } from "@/services/bible/bibleService";

export const todaysVerseFormSchema = z.object({
  reference: z
    .string()
    .min(1, "성경 구절 위치를 입력해주세요")
    .max(100)
    .refine((value) => parseReference(value) !== null, "예: 요 3:16 형식으로 입력해주세요"),
  text: z.string().min(1, "말씀 본문을 입력해주세요").max(1000),
});

export type TodaysVerseFormData = z.infer<typeof todaysVerseFormSchema>;

export const todaysQtFormSchema = z.object({
  reference: z
    .string()
    .min(1, "QT 본문 위치를 입력해주세요")
    .max(100)
    .refine((value) => parseReference(value) !== null, "예: 시 23:1 형식으로 입력해주세요"),
  title: z.string().min(1, "QT 제목을 입력해주세요").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export type TodaysQtFormData = z.infer<typeof todaysQtFormSchema>;
