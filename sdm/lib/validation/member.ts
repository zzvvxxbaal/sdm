import { z } from "zod";
import { Gender, ChurchPosition } from "@/types/member";
import { UserRole } from "@/types/role";

const CURRENT_YEAR = new Date().getFullYear();

const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;

export const completeProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, "이름을 입력해주세요")
    .min(2, "이름은 2자 이상이어야 합니다")
    .max(50, "이름은 50자 이하여야 합니다"),
  birthYear: z
    .number({ invalid_type_error: "출생연도를 입력해주세요" })
    .int("올바른 연도를 입력해주세요")
    .min(1900, "올바른 출생연도를 입력해주세요")
    .max(CURRENT_YEAR, "올바른 출생연도를 입력해주세요"),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "성별을 선택해주세요" }),
  }),
  phoneNumber: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(phoneRegex, "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"),
  introduction: z
    .string()
    .max(500, "자기소개는 500자 이하여야 합니다")
    .optional()
    .or(z.literal("")),
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export const memberEditSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(phoneRegex, "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"),
  introduction: z
    .string()
    .max(500, "자기소개는 500자 이하여야 합니다")
    .optional()
    .or(z.literal("")),
});

export type MemberEditFormData = z.infer<typeof memberEditSchema>;

export const privilegedEditSchema = z.object({
  teamId: z.string().nullable().optional(),
  cellId: z.string().nullable().optional(),
  ministry: z.string().max(100).nullable().optional(),
  position: z.nativeEnum(ChurchPosition),
  role: z.nativeEnum(UserRole),
});

export type PrivilegedEditFormData = z.infer<typeof privilegedEditSchema>;

export const rejectMemberSchema = z.object({
  reason: z
    .string()
    .min(1, "거절 사유를 입력해주세요")
    .max(300, "거절 사유는 300자 이하여야 합니다"),
});

export type RejectMemberFormData = z.infer<typeof rejectMemberSchema>;
