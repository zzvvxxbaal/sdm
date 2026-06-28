"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { withAuth, useAuth } from "@/features/auth";
import { useScheduleBoard } from "@/features/schedule";
import { MonthlyCalendar, WeeklyScheduleList } from "@/components/schedule";
import { Button, EmptyState, Field, Input, Modal, PageHeader, Select, Textarea } from "@/components/ui";
import { eventFormSchema } from "@/lib/validation";
import { formatDateKey } from "@/lib/date";
import { SCHEDULE_EVENT_TYPE_LABELS } from "@/types/schedule";
import { hasRole, UserRole } from "@/types";
import type { EventModel } from "@/models/event";

function CalendarPage() {
  const { user } = useAuth();
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventModel | null>(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventModel["category"]>("event");
  const [description, setDescription] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { monthlyEvents, weeklyEvents, loading, error, saveEvent, removeEvent } = useScheduleBoard(anchorDate, selectedDate);

  const canManage = useMemo(() => Boolean(user && hasRole(user.role, UserRole.ADMIN)), [user]);

  const openCreate = (event?: EventModel | null) => {
    const initial = event ?? null;
    setEditing(initial);
    setTitle(initial?.title ?? "");
    setStartDate(initial?.startDate?.slice(0, 16) ?? `${formatDateKey(selectedDate)}T09:00`);
    setEndDate(initial?.endDate?.slice(0, 16) ?? "");
    setLocation(initial?.location ?? "");
    setCategory(initial?.category ?? "event");
    setDescription(initial?.description ?? "");
    setIsAllDay(initial?.isAllDay ?? false);
    setFormOpen(true);
  };

  const submit = async () => {
    if (!user) return;
    setSubmitError(null);
    const parsed = eventFormSchema.safeParse({ title, startDate, endDate, location, category, description, isAllDay });
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }
    await saveEvent(
      {
        title: parsed.data.title,
        startDate: new Date(parsed.data.startDate).toISOString(),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate).toISOString() : null,
        location: parsed.data.location || null,
        category: parsed.data.category,
        description: parsed.data.description || null,
        isAllDay: parsed.data.isAllDay,
      },
      user.uid,
      editing?.id,
    );
    setFormOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-6">
      <PageHeader
        title="교회 일정"
        description="월간 달력과 주간 일정을 한 번에 확인하세요."
        action={canManage ? <Button size="sm" onClick={() => openCreate()}><Plus className="h-4 w-4" /> 일정 추가</Button> : undefined}
      />

      <div className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] bg-white px-3 py-2.5 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <Button type="button" variant="ghost" size="sm" onClick={() => setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">{anchorDate.getFullYear()}년 {anchorDate.getMonth() + 1}월</p>
          <p className="text-xs text-[#737373] dark:text-[#a3a3a3]">선택 날짜: {formatDateKey(selectedDate)}</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" />
      ) : error ? (
        <EmptyState title={error} description="잠시 후 다시 시도해주세요." />
      ) : (
        <>
          <MonthlyCalendar anchorDate={anchorDate} selectedDate={selectedDate} events={monthlyEvents} onSelectDate={(date) => setSelectedDate(date)} />
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">주간 일정</h2>
            </div>
            <WeeklyScheduleList events={weeklyEvents} />
            {canManage && weeklyEvents.map((event) => (
              <div key={`${event.id}-actions`} className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => openCreate(event)}>수정</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => void removeEvent(event.id)}>삭제</Button>
              </div>
            ))}
          </section>
        </>
      )}

      {formOpen && (
        <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? "일정 수정" : "일정 추가"}>
          <div className="space-y-3">
            <Field label="제목" required>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="일정 제목" />
            </Field>
            <Field label="시작 일시" required>
              <Input type={isAllDay ? "date" : "datetime-local"} value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </Field>
            <Field label="종료 일시">
              <Input type={isAllDay ? "date" : "datetime-local"} value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </Field>
            <Field label="분류">
              <Select value={category} onChange={(event) => setCategory(event.target.value as EventModel["category"])}>
                {Object.entries(SCHEDULE_EVENT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </Field>
            <Field label="장소">
              <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="예: 본당" />
            </Field>
            <Field label="설명">
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="일정 설명" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#525252] dark:text-[#d4d4d8]">
              <input type="checkbox" checked={isAllDay} onChange={(event) => setIsAllDay(event.target.checked)} className="h-4 w-4 rounded border-[#d4d4d8]" />
              종일 일정
            </label>
            {submitError && <p className="text-xs font-medium text-red-500">{submitError}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="secondary" fullWidth onClick={() => setFormOpen(false)}>취소</Button>
              <Button type="button" fullWidth onClick={() => void submit()}>저장</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default withAuth(CalendarPage);
