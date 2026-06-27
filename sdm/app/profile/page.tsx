"use client";

import { useRouter } from "next/navigation";
import {
  Pencil,
  Phone,
  Cake,
  Users,
  Layers,
  Briefcase,
  CalendarDays,
  BookOpen,
  PenLine,
  Heart,
  CheckCircle2,
  LogOut,
} from "lucide-react";

import { useAuth, withApproval } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import {
  GENDER_LABELS,
  CHURCH_POSITION_LABELS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_COLORS,
} from "@/types/member";
import { ROLE_LABELS, ROLE_COLORS } from "@/types/role";
import { formatDate } from "@/lib/utils";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  PageHeader,
  StatItem,
} from "@/components/ui";

function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="내 프로필"
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push(ROUTES.PROFILE_EDIT)}
          >
            <Pencil className="h-3.5 w-3.5" />
            편집
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <Avatar src={user.photoURL} name={user.displayName} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">
                {user.displayName ?? "이름 미설정"}
              </h2>
              {user.generation && (
                <Badge color="#2563EB">{user.generation}</Badge>
              )}
            </div>
            <p className="truncate text-sm text-[#737373] dark:text-[#a3a3a3]">
              {user.email}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge color={ROLE_COLORS[user.role]}>
                {ROLE_LABELS[user.role]}
              </Badge>
              <Badge color={APPROVAL_STATUS_COLORS[user.approvalStatus]}>
                {APPROVAL_STATUS_LABELS[user.approvalStatus]}
              </Badge>
            </div>
          </div>
        </div>
        {user.introduction && (
          <p className="mt-4 rounded-xl bg-[#fafafa] p-3 text-sm text-[#525252] dark:bg-[#262626] dark:text-[#d4d4d4]">
            {user.introduction}
          </p>
        )}
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem
          icon={CheckCircle2}
          label="출석"
          value={user.statistics.attendanceCount}
          suffix="회"
        />
        <StatItem
          icon={Heart}
          label="출석률"
          value={user.statistics.attendanceRate}
          suffix="%"
        />
        <StatItem
          icon={BookOpen}
          label="QT"
          value={user.statistics.qtCount}
          suffix="편"
        />
        <StatItem
          icon={PenLine}
          label="기도"
          value={user.statistics.prayerCount}
          suffix="건"
        />
      </div>

      <Card className="mb-4">
        <CardHeader title="개인 정보" />
        <dl className="space-y-3">
          <InfoRow icon={Cake} label="출생연도" value={user.birthYear ? `${user.birthYear}년` : "-"} />
          <InfoRow
            icon={Users}
            label="성별"
            value={user.gender ? GENDER_LABELS[user.gender] : "-"}
          />
          <InfoRow icon={Phone} label="전화번호" value={user.phoneNumber ?? "-"} />
        </dl>
      </Card>

      <Card className="mb-4">
        <CardHeader title="교회 정보" />
        <dl className="space-y-3">
          <InfoRow icon={Layers} label="팀" value={user.teamName ?? "미배정"} />
          <InfoRow icon={Users} label="셀" value={user.cellName ?? "미배정"} />
          <InfoRow icon={Briefcase} label="사역" value={user.ministry ?? "없음"} />
          <InfoRow
            icon={CheckCircle2}
            label="직분"
            value={CHURCH_POSITION_LABELS[user.position]}
          />
          <InfoRow
            icon={CalendarDays}
            label="등록일"
            value={user.registeredAt ? formatDate(user.registeredAt) : "-"}
          />
        </dl>
      </Card>

      <Button
        fullWidth
        variant="secondary"
        onClick={() => signOut()}
        className="text-[#ef4444]"
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#a3a3a3]">
        <Icon className="h-4 w-4 text-[#a3a3a3]" />
        {label}
      </dt>
      <dd className="text-sm font-medium text-[#171717] dark:text-[#f5f5f5]">
        {value}
      </dd>
    </div>
  );
}

export default withApproval(ProfilePage);
