export const UserRole = {
  USER: "user",
  MEMBER: "member",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "auth/invalid-credentials",
  USER_NOT_FOUND: "auth/user-not-found",
  EMAIL_IN_USE: "auth/email-already-in-use",
  WEAK_PASSWORD: "auth/weak-password",
  INVALID_EMAIL: "auth/invalid-email",
  TOO_MANY_REQUESTS: "auth/too-many-requests",
  NETWORK_ERROR: "auth/network-request-failed",
  POPUP_CLOSED: "auth/popup-closed-by-user",
  UNAUTHORIZED: "auth/unauthorized",
  UNKNOWN: "auth/unknown",
} as const;

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERRORS.INVALID_CREDENTIALS]: "이메일 또는 비밀번호가 올바르지 않습니다.",
  [AUTH_ERRORS.USER_NOT_FOUND]: "등록되지 않은 이메일입니다.",
  [AUTH_ERRORS.EMAIL_IN_USE]: "이미 사용 중인 이메일입니다.",
  [AUTH_ERRORS.WEAK_PASSWORD]: "비밀번호는 6자 이상이어야 합니다.",
  [AUTH_ERRORS.INVALID_EMAIL]: "올바른 이메일 형식이 아닙니다.",
  [AUTH_ERRORS.TOO_MANY_REQUESTS]: "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  [AUTH_ERRORS.NETWORK_ERROR]: "네트워크 오류가 발생했습니다.",
  [AUTH_ERRORS.POPUP_CLOSED]: "로그인 창이 닫혔습니다.",
  [AUTH_ERRORS.UNAUTHORIZED]: "접근 권한이 없습니다.",
  [AUTH_ERRORS.UNKNOWN]: "알 수 없는 오류가 발생했습니다.",
};

export const DEFAULT_AUTH_ERROR_MESSAGE = "인증 중 오류가 발생했습니다.";
