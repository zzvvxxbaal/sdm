export const COLLECTIONS = {
  USERS: "users",
  ANNOUNCEMENTS: "announcements",
  EVENTS: "events",
  PRAYER_REQUESTS: "prayer_requests",
  BULLETINS: "bulletins",
  PLAYLISTS: "playlists",
  ATTENDANCE: "attendance",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "audit_logs",
  MINISTRIES: "ministries",
  CELL_GROUPS: "cell_groups",
  SERMONS: "sermons",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export const COLLECTION_LABELS: Record<CollectionName, string> = {
  [COLLECTIONS.USERS]: "사용자",
  [COLLECTIONS.ANNOUNCEMENTS]: "공지사항",
  [COLLECTIONS.EVENTS]: "일정",
  [COLLECTIONS.PRAYER_REQUESTS]: "기도제목",
  [COLLECTIONS.BULLETINS]: "주보",
  [COLLECTIONS.PLAYLISTS]: "재생목록",
  [COLLECTIONS.ATTENDANCE]: "출석",
  [COLLECTIONS.NOTIFICATIONS]: "알림",
  [COLLECTIONS.AUDIT_LOGS]: "감사록",
  [COLLECTIONS.MINISTRIES]: "사역",
  [COLLECTIONS.CELL_GROUPS]: "셀 그룹",
  [COLLECTIONS.SERMONS]: "설교",
};
