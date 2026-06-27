export const PRAYER_CATEGORIES = [
  "personal",
  "family",
  "church",
  "mission",
  "healing",
  "thanksgiving",
  "other",
] as const;

export type PrayerCategory = (typeof PRAYER_CATEGORIES)[number];

export const PRAYER_VISIBILITIES = ["private", "cell", "team", "church", "leaders"] as const;

export type PrayerVisibility = (typeof PRAYER_VISIBILITIES)[number];

export const PRAYER_CATEGORY_LABELS: Record<PrayerCategory, string> = {
  personal: "개인",
  family: "가정",
  church: "교회",
  mission: "선교",
  healing: "치유",
  thanksgiving: "감사",
  other: "기타",
};

export const PRAYER_VISIBILITY_LABELS: Record<PrayerVisibility, string> = {
  private: "비공개",
  cell: "셀",
  team: "팀",
  church: "교회",
  leaders: "리더",
};

export interface PrayerViewerContext {
  uid: string;
  role: string;
  teamId: string | null;
  cellId: string | null;
}

export interface PrayerAuthorContext {
  uid: string;
  displayName: string | null;
  role: string;
  teamId: string | null;
  cellId: string | null;
}

export interface PrayerCommentModel {
  id: string;
  prayerId: string;
  content: string;
  isAnonymous: boolean;
  authorName: string | null;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface PrayerLikeModel {
  id: string;
  prayerId: string;
  userId: string;
  createdAt: unknown;
}
