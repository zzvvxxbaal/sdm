import { SectionCard } from "./SectionCard";
import { Badge } from "@/components/ui";
import { ROLE_LABELS, ROLE_COLORS } from "@/types/role";
import type { UserProfile } from "@/types/user";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-[#737373] dark:text-[#a3a3a3]">{label}</span>
      <span className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
        {value}
      </span>
    </div>
  );
}

export function MyChurchInfoCard({ user }: { user: UserProfile }) {
  const dash = "—";
  return (
    <SectionCard
      title="내 교회 정보"
      action={
        <Badge color={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
      }
    >
      <div className="divide-y divide-[#f0f0f0] dark:divide-[#2c2c2e]">
        <InfoRow label="이름" value={user.displayName ?? dash} />
        <InfoRow
          label="또래"
          value={user.generation ? `${user.generation}또래` : dash}
        />
        <InfoRow label="팀" value={user.teamName ?? dash} />
        <InfoRow label="순" value={user.cellName ?? dash} />
      </div>
    </SectionCard>
  );
}
