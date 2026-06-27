export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: "승인 대기",
  [ApprovalStatus.APPROVED]: "승인 완료",
  [ApprovalStatus.REJECTED]: "승인 거절",
};

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: "#EAB308",
  [ApprovalStatus.APPROVED]: "#22C55E",
  [ApprovalStatus.REJECTED]: "#EF4444",
};

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "남성",
  [Gender.FEMALE]: "여성",
};

export enum ChurchPosition {
  NONE = "none",
  MEMBER = "member",
  CELL_LEADER = "cell_leader",
  TEAM_LEADER = "team_leader",
  MINISTER = "minister",
  PASTOR = "pastor",
}

export const CHURCH_POSITION_LABELS: Record<ChurchPosition, string> = {
  [ChurchPosition.NONE]: "미지정",
  [ChurchPosition.MEMBER]: "셀원",
  [ChurchPosition.CELL_LEADER]: "셀리더",
  [ChurchPosition.TEAM_LEADER]: "팀장",
  [ChurchPosition.MINISTER]: "교역자",
  [ChurchPosition.PASTOR]: "목사",
};

export interface MemberStatistics {
  attendanceCount: number;
  attendanceRate: number;
  qtCount: number;
  prayerCount: number;
}

export const EMPTY_STATISTICS: MemberStatistics = {
  attendanceCount: 0,
  attendanceRate: 0,
  qtCount: 0,
  prayerCount: 0,
};
