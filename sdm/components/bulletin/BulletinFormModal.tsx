"use client";

import { useState } from "react";

import { Button, Field, Input, Modal, Textarea } from "@/components/ui";
import { bulletinFormSchema } from "@/lib/validation";
import type { BulletinInput } from "@/services/bulletin";
import type { BulletinModel } from "@/models/bulletin";

interface BulletinFormModalProps {
  isOpen: boolean;
  initial?: BulletinModel | null;
  onClose: () => void;
  onSave: (data: BulletinInput, id?: string) => Promise<void>;
}

async function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

export function BulletinFormModal({ isOpen, initial, onClose, onSave }: BulletinFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [fileURL, setFileURL] = useState(initial?.resourceKind === "url" ? (initial?.fileURL ?? "") : "");
  const [preacher, setPreacher] = useState(initial?.preacher ?? "");
  const [scripture, setScripture] = useState(initial?.scripture ?? "");
  const [sermonTitle, setSermonTitle] = useState(initial?.sermonTitle ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    const parsed = bulletinFormSchema.safeParse({ title, date, fileURL, preacher, scripture, sermonTitle, content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let nextUrl = parsed.data.fileURL || null;
      let nextFileName: string | null = initial?.fileName ?? null;
      let nextFileSize: number | null = initial?.fileSize ?? null;
      let nextFileType: string | null = initial?.fileType ?? null;
      let resourceKind: BulletinModel["resourceKind"] = resourceFile ? "image" : initial?.resourceKind ?? "url";

      if (resourceFile) {
        nextUrl = await readFileAsDataURL(resourceFile);
        nextFileName = resourceFile.name;
        nextFileSize = resourceFile.size;
        nextFileType = resourceFile.type;
        resourceKind = "image";
      } else if (parsed.data.fileURL) {
        nextFileName = initial?.fileName ?? null;
        nextFileSize = initial?.fileSize ?? null;
        nextFileType = initial?.fileType ?? null;
        resourceKind = "url";
      }

      await onSave(
        {
          title: parsed.data.title,
          date: parsed.data.date,
          fileURL: nextUrl,
          fileName: nextFileName,
          fileSize: nextFileSize,
          fileType: nextFileType,
          resourceKind,
          preacher: parsed.data.preacher || null,
          scripture: parsed.data.scripture || null,
          sermonTitle: parsed.data.sermonTitle || null,
          content: parsed.data.content || null,
        },
        initial?.id,
      );
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "주보 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "주보 수정" : "주보 등록"}>
      <div className="space-y-3">
        <Field label="제목" required>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 2026년 6월 4주 주보" />
        </Field>
        <Field label="주일 날짜" required>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="이미지 업로드" hint="Firestore에 이미지 데이터로 저장됩니다.">
          <Input type="file" accept="image/*" onChange={(event) => setResourceFile(event.target.files?.[0] ?? null)} />
        </Field>
        <Field label="외부 주보 URL" hint="이미지를 업로드하지 않으면 이 링크가 사용됩니다.">
          <Input value={fileURL} onChange={(event) => setFileURL(event.target.value)} placeholder="https://example.com/bulletin" />
        </Field>
        <Field label="설교 제목">
          <Input value={sermonTitle} onChange={(event) => setSermonTitle(event.target.value)} placeholder="설교 제목" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="설교자">
            <Input value={preacher} onChange={(event) => setPreacher(event.target.value)} placeholder="설교자" />
          </Field>
          <Field label="본문">
            <Input value={scripture} onChange={(event) => setScripture(event.target.value)} placeholder="예: 시 23:1-6" />
          </Field>
        </div>
        <Field label="요약 메모">
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="주보 안내 문구나 주간 메모를 적어주세요" />
        </Field>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button type="button" fullWidth isLoading={isSubmitting} onClick={submit}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
