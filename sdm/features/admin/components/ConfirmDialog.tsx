"use client";

import { useState } from "react";

import { Modal, Button } from "@/components/ui";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "삭제",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          취소
        </Button>
        <Button variant="danger" fullWidth onClick={handleConfirm} isLoading={isSubmitting}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
