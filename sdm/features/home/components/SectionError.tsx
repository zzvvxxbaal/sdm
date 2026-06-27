import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui";

export function SectionError({
  message = "불러오지 못했습니다",
}: {
  message?: string;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={message}
      description="잠시 후 다시 시도해 주세요."
    />
  );
}
