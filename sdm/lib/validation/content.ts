import { z } from "zod";

const optionalText = z.string().max(2000).optional().or(z.literal(""));
const urlOrEmpty = z
  .string()
  .url("올바른 링크 형식이 아닙니다")
  .optional()
  .or(z.literal(""));

export const announcementFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  content: z.string().min(1, "내용을 입력해주세요"),
  category: z.enum(["general", "urgent", "event", "ministry"]),
  isPinned: z.boolean(),
});

export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

export const eventFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  startDate: z.string().min(1, "시작일을 선택해주세요"),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  category: z.enum(["worship", "meeting", "retreat", "service", "social", "other"]),
  description: optionalText,
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const bulletinFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  date: z.string().min(1, "날짜를 선택해주세요"),
  fileURL: urlOrEmpty,
  preacher: z.string().max(100).optional().or(z.literal("")),
  scripture: z.string().max(200).optional().or(z.literal("")),
  sermonTitle: z.string().max(200).optional().or(z.literal("")),
});

export type BulletinFormData = z.infer<typeof bulletinFormSchema>;

export const playlistSongSchema = z.object({
  title: z.string().min(1, "곡 제목을 입력해주세요").max(200),
  youtubeUrl: urlOrEmpty,
});

export const playlistFormSchema = z.object({
  name: z.string().min(1, "재생목록 이름을 입력해주세요").max(100),
  category: z.enum(["worship", "praise", "contemplation", "special", "other"]),
  songs: z.array(playlistSongSchema),
});

export type PlaylistFormData = z.infer<typeof playlistFormSchema>;
export type PlaylistSongFormData = z.infer<typeof playlistSongSchema>;
