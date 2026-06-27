import { z } from "zod";

export const teamFormSchema = z.object({
  name: z.string().min(1, "팀 이름을 입력해주세요").max(100, "팀 이름은 100자 이하여야 합니다"),
  description: z.string().max(500).optional().or(z.literal("")),
  leaderId: z.string().optional().or(z.literal("")),
});

export type TeamFormData = z.infer<typeof teamFormSchema>;

export const cellFormSchema = z.object({
  name: z.string().min(1, "셀 이름을 입력해주세요").max(100, "셀 이름은 100자 이하여야 합니다"),
  teamId: z.string().min(1, "소속 팀을 선택해주세요"),
  leaderId: z.string().optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type CellFormData = z.infer<typeof cellFormSchema>;
