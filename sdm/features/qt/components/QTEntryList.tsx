import { Archive, Heart, Pencil, Trash2 } from "lucide-react";
import { Button, Card, EmptyState } from "@/components/ui";
import { BibleReferenceLink } from "@/components/bible/BibleReferenceLink";
import { QTVisibilityBadge } from "@/components/qt/QTVisibilityBadge";
import type { QTEntry } from "@/types/qt";

export function QTEntryList({ entries, onEdit, onDelete, onToggleFavorite, onToggleArchive }: { entries: QTEntry[]; onEdit: (entry: QTEntry) => void; onDelete: (entry: QTEntry) => void; onToggleFavorite: (entry: QTEntry) => void; onToggleArchive: (entry: QTEntry) => void }) {
  if (entries.length === 0) {
    return <EmptyState icon={Archive} title="선택한 조건의 QT가 없습니다" description="날짜를 바꾸거나 새 QT를 작성해보세요." />;
  }
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card key={entry.id} className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{entry.title}</h3>
              <p className="mt-1 text-xs text-[#737373] dark:text-[#a3a3a3]">{entry.entryDate} · {entry.userName}</p>
            </div>
            <QTVisibilityBadge visibility={entry.visibility} />
          </div>
          <BibleReferenceLink reference={entry.bibleReference} icon className="text-sm font-semibold" />
          <Section title="묵상" value={entry.meditation} />
          <Section title="기도" value={entry.prayer} />
          <Section title="적용" value={entry.application} />
          <div className="flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-medium text-[#2563EB]">#{tag}</span>)}</div>
          <div className="flex gap-2">
            <ActionButton onClick={() => onToggleFavorite(entry)} active={entry.isFavorite} icon={<Heart className="h-4 w-4" />} label="즐겨찾기" />
            <ActionButton onClick={() => onToggleArchive(entry)} active={entry.isArchived} icon={<Archive className="h-4 w-4" />} label="보관" />
            <ActionButton onClick={() => onEdit(entry)} icon={<Pencil className="h-4 w-4" />} label="수정" />
            <ActionButton onClick={() => onDelete(entry)} icon={<Trash2 className="h-4 w-4" />} label="삭제" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function Section({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#737373] dark:text-[#a3a3a3]">{title}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#171717] dark:text-[#f5f5f5]">{value}</p>
    </div>
  );
}

function ActionButton({ onClick, icon, label, active = false }: { onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }) {
  return <Button type="button" size="sm" variant={active ? "primary" : "secondary"} onClick={onClick}>{icon}{label}</Button>;
}
