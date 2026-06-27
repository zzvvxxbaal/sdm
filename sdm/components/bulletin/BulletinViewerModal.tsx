"use client";

import { Modal } from "@/components/ui";
import type { BulletinModel } from "@/models/bulletin";

interface BulletinViewerModalProps {
  bulletin: BulletinModel | null;
  onClose: () => void;
}

export function BulletinViewerModal({ bulletin, onClose }: BulletinViewerModalProps) {
  if (!bulletin) return null;

  const isImage = bulletin.resourceKind === "image" || bulletin.fileType?.startsWith("image/") || bulletin.fileURL?.startsWith("data:image");

  return (
    <Modal isOpen={Boolean(bulletin)} onClose={onClose} title={bulletin.title} className="max-w-5xl p-4 sm:p-6">
      <div className="max-h-[80vh] overflow-auto rounded-2xl bg-[#0f172a] p-2">
        {bulletin.fileURL ? (
          isImage ? (
            <img src={bulletin.fileURL} alt={bulletin.title} className="mx-auto h-auto max-w-full rounded-xl" />
          ) : (
            <iframe title={bulletin.title} src={bulletin.fileURL} className="h-[70vh] w-full rounded-xl bg-white" />
          )
        ) : (
          <div className="flex h-60 items-center justify-center rounded-xl bg-white text-sm text-[#737373]">표시할 자료가 없습니다.</div>
        )}
      </div>
    </Modal>
  );
}
