import { Badge } from "@/components/ui";
import type { QTVisibility } from "@/types/qt";

const LABELS: Record<QTVisibility, { label: string; color: string }> = {
  private: { label: "비공개", color: "#737373" },
  cell: { label: "셀", color: "#2563EB" },
  team: { label: "팀", color: "#7C3AED" },
  church: { label: "교회", color: "#16A34A" },
  leaders: { label: "리더", color: "#D97706" },
  admin: { label: "관리자", color: "#DC2626" },
};

export function QTVisibilityBadge({ visibility }: { visibility: QTVisibility }) {
  const item = LABELS[visibility];
  return <Badge color={item.color}>{item.label}</Badge>;
}
