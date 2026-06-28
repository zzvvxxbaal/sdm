"use client";

import { useState } from "react";
import { Heart, Plus, X } from "lucide-react";

import { Button, Field, Input, Modal, Select } from "@/components/ui";
import { playlistFormSchema } from "@/lib/validation";
import { WORSHIP_PLAYLIST_CATEGORY_LABELS } from "@/types/worship";
import type { WorshipPlaylistInput } from "@/services/worship";
import type { PlaylistModel, PlaylistSong } from "@/models/playlist";

interface SongRow {
  id: string;
  title: string;
  youtubeUrl: string;
  artist: string;
}

interface WorshipPlaylistFormModalProps {
  isOpen: boolean;
  initial?: PlaylistModel | null;
  onClose: () => void;
  onSave: (data: WorshipPlaylistInput, id?: string) => Promise<void>;
}

export function WorshipPlaylistFormModal({ isOpen, initial, onClose, onSave }: WorshipPlaylistFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<PlaylistModel["category"]>(initial?.category ?? "worship");
  const [songs, setSongs] = useState<SongRow[]>(
    initial?.songs.map((song) => ({ id: song.id, title: song.title, youtubeUrl: song.youtubeUrl ?? "", artist: song.artist ?? "" })) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSong = () => setSongs((prev) => [...prev, { id: crypto.randomUUID(), title: "", youtubeUrl: "", artist: "" }]);
  const updateSong = (id: string, field: keyof SongRow, value: string) => setSongs((prev) => prev.map((song) => (song.id === id ? { ...song, [field]: value } : song)));
  const removeSong = (id: string) => setSongs((prev) => prev.filter((song) => song.id !== id));

  const submit = async () => {
    setError(null);
    const parsed = playlistFormSchema.safeParse({ name, category, songs: songs.map(({ title, youtubeUrl }) => ({ title, youtubeUrl })) });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }

    const payloadSongs: PlaylistSong[] = songs.map((song, order) => ({
      id: song.id,
      title: song.title,
      artist: song.artist || null,
      youtubeUrl: song.youtubeUrl || null,
      lyrics: null,
      chordSheet: null,
      order,
    }));

    setIsSubmitting(true);
    try {
      await onSave({ name, category, songs: payloadSongs }, initial?.id);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "플레이리스트 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "플레이리스트 수정" : "플레이리스트 생성"}>
      <div className="space-y-3">
        <Field label="이름" required>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 주일 2부 예배 찬양" />
        </Field>
        <Field label="분류">
          <Select value={category} onChange={(event) => setCategory(event.target.value as PlaylistModel["category"])}>
            {Object.entries(WORSHIP_PLAYLIST_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">곡 목록</p>
            <Button type="button" size="sm" variant="ghost" onClick={addSong}>
              <Plus className="h-4 w-4" /> 곡 추가
            </Button>
          </div>
          {songs.map((song) => (
            <div key={song.id} className="rounded-2xl border border-[#e5e5e5] p-3 dark:border-[#2c2c2e]">
              <div className="space-y-2">
                <Input value={song.title} onChange={(event) => updateSong(song.id, "title", event.target.value)} placeholder="곡 제목" />
                <Input value={song.artist} onChange={(event) => updateSong(song.id, "artist", event.target.value)} placeholder="아티스트 (선택)" />
                <div className="flex gap-2">
                  <Input value={song.youtubeUrl} onChange={(event) => updateSong(song.id, "youtubeUrl", event.target.value)} placeholder="YouTube 링크" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSong(song.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button type="button" fullWidth isLoading={isSubmitting} onClick={submit}>
            <Heart className="h-4 w-4" /> 저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
