export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
  COMPLETE_PROFILE: "/complete-profile",
  PENDING_APPROVAL: "/pending-approval",

  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  SETTINGS: "/settings",

  MEMBER: "/members",
  MEMBER_DETAIL: (id: string) => `/members/${id}`,

  PRAYER: "/prayer",
  PRAYER_DETAIL: (id: string) => `/prayer/${id}`,
  PRAYER_WRITE: "/prayer/write",

  CALENDAR: "/calendar",
  CALENDAR_DETAIL: (id: string) => `/calendar/${id}`,
  CALENDAR_CREATE: "/calendar/create",

  BULLETIN: "/bulletin",
  BULLETIN_DETAIL: (id: string) => `/bulletin/${id}`,
  BULLETIN_CREATE: "/bulletin/create",

  BIBLE: "/bible",

  WORSHIP: "/worship",
  WORSHIP_DETAIL: (id: string) => `/worship/${id}`,
  WORSHIP_CREATE: "/worship/create",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_ANALYTICS: "/admin/analytics",
} as const;

export const PUBLIC_ROUTES: string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  "/api",
  "/_next",
  "/favicon.ico",
];

export const ADMIN_ROUTES: string[] = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_SETTINGS,
  ROUTES.ADMIN_ANALYTICS,
];
