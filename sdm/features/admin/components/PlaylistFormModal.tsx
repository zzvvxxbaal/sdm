"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Modal, Button, Field, Input, Select } from "@/components/ui";
import { playlistFormSchema } from "@/lib/validation";
import type { PlaylistInput } from "@/services/content";
import type { PlaylistModel, PlaylistSong } from "@/models/playlist";

const CATEGORY_LABELS: Record<PlaylistModel["category"], string> = {
  worship: "예배",
  qt_music: "QT 음악",
  personal_devotion: "개인 경건",
};

interface SongRow {
  id: string;
  title: string;
  youtubeUrl: string;
}

interface PlaylistFormModalProps {
  isOpen: boolean;
  initial?: PlaylistModel | null;
  onClose: () => void;
  onSave: (data: PlaylistInput, id?: string) => Promise<void>;
}

export function PlaylistFormModal({
  isOpen,
  initial,
  onClose,
  onSave,
}: PlaylistFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<PlaylistModel["category"]>(
    initial?.category ?? "worship",
  );
  const [songs, setSongs] = useState<SongRow[]>(
    initial?.songs.map((s) => ({
      id: s.id,
      title: s.title,
      youtubeUrl: s.youtubeUrl ?? "",
    })) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSong = () =>
    setSongs((prev) => [...prev, { id: crypto.randomUUID(), title: "", youtubeUrl: "" }]);
  const removeSong = (id: string) =>
    setSongs((prev) => prev.filter((s) => s.id !== id));
  const updateSong = (id: string, field: keyof SongRow, value: string) =>
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const submit = async () => {
    setError(null);
    const parsed = playlistFormSchema.safeParse({
      name,
      category,
      songs: songs.map((s) => ({ title: s.title, youtubeUrl: s.youtubeUrl })),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요");
      return;
    }
    const payload: PlaylistSong[] = songs.map((s, index) => ({
      id: s.id,
      title: s.title,
      artist: null,
      youtubeUrl: s.youtubeUrl || null,
      lyrics: null,
      chordSheet: null,
      order: index,
    }));
    setIsSubmitting(true);
    try {
      await onSave({ name, category, songs: payload }, initial?.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "재생목록 수정" : "재생목록 추가"}>
      <div className="space-y-3">
        <Field label="이름" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 주일 예배 콘티" />
        </Field>
        <Field label="분류">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as PlaylistModel["category"])}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#525252] dark:text-[#a3a3a3]">곡 목록</span>
            <Button type="button" size="sm" variant="ghost" onClick={addSong}>
              <Plus className="h-4 w-4" /> 추가
            </Button>
          </div>
          {songs.map((song) => (
            <div key={song.id} className="flex items-start gap-2">
              <div className="flex-1 space-y-1.5">
                <Input
                  value={song.title}
                  onChange={(e) => updateSong(song.id, "title", e.target.value)}
                  placeholder="곡 제목"
                  className="h-10"
                />
                <Input
                  value={song.youtubeUrl}
                  onChange={(e) => updateSong(song.id, "youtubeUrl", e.target.value)}
                  placeholder="YouTube 링크 (선택)"
                  className="h-10"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSong(song.id)}
                aria-label="곡 삭제"
                className="mt-1 rounded-lg p-2 text-[#a3a3a3] hover:bg-[#fef2f2] hover:text-[#EF4444]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <div className="mt-2 flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button type="button" fullWidth onClick={submit} isLoading={isSubmitting}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
