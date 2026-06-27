"use client";

import { useState } from "react";
import { Modal, Button, Field, Textarea } from "@/components/ui";

interface RejectModalProps {
  isOpen: boolean;
  memberName: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function RejectModal({
  isOpen,
  memberName,
  onClose,
  onConfirm,
}: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (reason.trim().length === 0) {
      setError("거절 사유를 입력해주세요");
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      onClose();
    } catch {
      setError("처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="가입 거절"
      description={`${memberName} 님의 가입을 거절합니다.`}
    >
      <Field label="거절 사유" required error={error ?? undefined}>
        <Textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError(null);
          }}
          rows={3}
          placeholder="거절 사유를 입력해주세요"
          hasError={!!error}
        />
      </Field>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          취소
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={handleConfirm}
          isLoading={isSubmitting}
        >
          거절하기
        </Button>
      </div>
    </Modal>
  );
}
