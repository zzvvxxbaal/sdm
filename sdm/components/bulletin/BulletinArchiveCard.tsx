import { Download, Expand, Link as LinkIcon } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { formatKoreanDate } from "@/lib/date";
import type { BulletinModel } from "@/models/bulletin";

interface BulletinArchiveCardProps {
  bulletin: BulletinModel;
  onView: (bulletin: BulletinModel) => void;
}

export function BulletinArchiveCard({ bulletin, onView }: BulletinArchiveCardProps) {
  const download = () => {
    if (!bulletin.fileURL) return;
    const link = document.createElement("a");
    link.href = bulletin.fileURL;
    link.download = bulletin.fileName || `${bulletin.title}.png`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{bulletin.title}</p>
          <p className="mt-1 text-xs text-[#737373] dark:text-[#a3a3a3]">{formatKoreanDate(bulletin.date)}</p>
        </div>
        <Badge color={bulletin.resourceKind === "image" ? "#2563EB" : "#0EA5E9"}>{bulletin.resourceKind === "image" ? "이미지" : "링크"}</Badge>
      </div>
      {bulletin.sermonTitle && <p className="text-sm font-medium text-[#525252] dark:text-[#d4d4d8]">{bulletin.sermonTitle}</p>}
      {bulletin.content && <p className="text-sm leading-6 text-[#737373] dark:text-[#a3a3a3]">{bulletin.content}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => onView(bulletin)}>
          <Expand className="h-4 w-4" /> 보기
        </Button>
        {bulletin.fileURL && (
          <Button type="button" variant="ghost" size="sm" onClick={download}>
            <Download className="h-4 w-4" /> 다운로드
          </Button>
        )}
        {bulletin.resourceKind === "url" && bulletin.fileURL && (
          <a href={bulletin.fileURL} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[#2563EB] transition-colors hover:bg-[#eff6ff]">
            <LinkIcon className="h-4 w-4" /> 새 창
          </a>
        )}
      </div>
    </Card>
  );
}
