import { z } from "zod";

export const todaysVerseFormSchema = z.object({
  reference: z.string().min(1, "성경 구절 위치를 입력해주세요").max(100),
  text: z.string().min(1, "말씀 본문을 입력해주세요").max(1000),
});

export type TodaysVerseFormData = z.infer<typeof todaysVerseFormSchema>;

export const todaysQtFormSchema = z.object({
  reference: z.string().min(1, "QT 본문 위치를 입력해주세요").max(100),
  title: z.string().min(1, "QT 제목을 입력해주세요").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export type TodaysQtFormData = z.infer<typeof todaysQtFormSchema>;
