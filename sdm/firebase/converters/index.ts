import { userConverter } from "@/models/user";
import { announcementConverter } from "@/models/announcement";
import { eventConverter } from "@/models/event";
import { prayerRequestConverter } from "@/models/prayer_request";
import { bulletinConverter } from "@/models/bulletin";
import { playlistConverter } from "@/models/playlist";
import { attendanceConverter } from "@/models/attendance";
import { notificationConverter } from "@/models/notification";
import { auditLogConverter } from "@/models/audit_log";
import { ministryConverter } from "@/models/ministry";
import { cellGroupConverter } from "@/models/cell_group";
import { sermonConverter } from "@/models/sermon";
import { teamConverter } from "@/models/team";
import { cellConverter } from "@/models/cell";
import { organizationSettingsConverter } from "@/models/organization_settings";

import { COLLECTIONS } from "@/constants/collections";

export const CONVERTERS = {
  [COLLECTIONS.USERS]: userConverter,
  [COLLECTIONS.ANNOUNCEMENTS]: announcementConverter,
  [COLLECTIONS.EVENTS]: eventConverter,
  [COLLECTIONS.PRAYER_REQUESTS]: prayerRequestConverter,
  [COLLECTIONS.BULLETINS]: bulletinConverter,
  [COLLECTIONS.PLAYLISTS]: playlistConverter,
  [COLLECTIONS.ATTENDANCE]: attendanceConverter,
  [COLLECTIONS.NOTIFICATIONS]: notificationConverter,
  [COLLECTIONS.AUDIT_LOGS]: auditLogConverter,
  [COLLECTIONS.MINISTRIES]: ministryConverter,
  [COLLECTIONS.CELL_GROUPS]: cellGroupConverter,
  [COLLECTIONS.SERMONS]: sermonConverter,
  [COLLECTIONS.TEAMS]: teamConverter,
  [COLLECTIONS.CELLS]: cellConverter,
  [COLLECTIONS.ORGANIZATION_SETTINGS]: organizationSettingsConverter,
} as const;

export {
  userConverter,
  announcementConverter,
  eventConverter,
  prayerRequestConverter,
  bulletinConverter,
  playlistConverter,
  attendanceConverter,
  notificationConverter,
  auditLogConverter,
  ministryConverter,
  cellGroupConverter,
  sermonConverter,
  teamConverter,
  cellConverter,
  organizationSettingsConverter,
};
