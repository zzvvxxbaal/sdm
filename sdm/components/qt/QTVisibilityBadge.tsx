import { Badge } from "@/components/ui";
import type { QTVisibility } from "@/types/qt";

const LABELS: Record<QTVisibility, { label: string; color: string }> = {
  private: { label: "비공개", color: "gray" },
  cell: { label: "셀", color: "blue" },
  team: { label: "팀", color: "purple" },
  church: { label: "교회", color: "green" },
  leaders: { label: "리더", color: "amber" },
  admin: { label: "관리자", color: "red" },
};

export function QTVisibilityBadge({ visibility }: { visibility: QTVisibility }) {
  const item = LABELS[visibility];
  return <Badge color={item.color}>{item.label}</Badge>;
}
