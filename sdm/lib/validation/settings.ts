import { z } from "zod";

export const cellLabelFormSchema = z.object({
  singular: z.string().min(1, "단수 명칭을 입력해주세요").max(20, "20자 이하여야 합니다"),
  plural: z.string().min(1, "복수 명칭을 입력해주세요").max(20, "20자 이하여야 합니다"),
});

export type CellLabelFormData = z.infer<typeof cellLabelFormSchema>;
