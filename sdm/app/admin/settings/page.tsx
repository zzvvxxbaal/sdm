"use client";

import { useMemo, useState } from "react";

import { useSettings } from "@/features/admin/hooks/useSettings";
import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  Field,
  Input,
  FullScreenSpinner,
} from "@/components/ui";

const PRESETS = ["순", "셀"];

export default function AdminSettingsPage() {
  const { cellLabel, isLoading, saveCellLabel } = useSettings();
  const [draft, setDraft] = useState<{ singular: string; plural: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const singular = draft?.singular ?? cellLabel.singular;
  const plural = draft?.plural ?? cellLabel.plural;

  const isDirty = useMemo(
    () => singular !== cellLabel.singular || plural !== cellLabel.plural,
    [cellLabel.plural, cellLabel.singular, plural, singular],
  );

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveCellLabel(singular.trim(), plural.trim());
      setDraft(null);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="설정" description="청년부 기본 설정을 관리합니다" />
      <Card>
        <CardHeader
          title="소그룹 명칭"
          description="부서에서 사용하는 소그룹 명칭(순/셀)을 설정합니다"
        />
        <div className="space-y-3">
          <div className="flex gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={singular === preset ? "primary" : "secondary"}
                onClick={() => { setDraft({ singular: preset, plural: `${preset}들` }); }}
              >
                {preset}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="단수 명칭">
              <Input value={singular} onChange={(e) => setDraft({ singular: e.target.value, plural })} placeholder="예: 순" />
            </Field>
            <Field label="복수 명칭">
              <Input value={plural} onChange={(e) => setDraft({ singular, plural: e.target.value })} placeholder="예: 순들" />
            </Field>
          </div>
          <Button
            fullWidth
            onClick={onSave}
            isLoading={saving}
            disabled={!singular.trim() || !plural.trim() || !isDirty}
          >
            저장
          </Button>
          {saved && (
            <p className="text-center text-xs font-medium text-green-600">저장되었습니다</p>
          )}
        </div>
      </Card>
    </div>
  );
}
