"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, HandHeart, Quote, Sparkles } from "lucide-react";

import { Card, CardHeader } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { ANNOUNCEMENT_CATEGORY } from "@/features/home/lib/home-format";
import { formatKoreanDate, resolveDateRangeLabel } from "@/lib/date";

function trimText(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

function HomeSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={index}
          className={index < 2 || index === 4 ? "lg:col-span-2" : undefined}
        >
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-8 w-3/4 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-neutral-100" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function MainPage() {
  const { user, isLoading } = useAuth();
  const home = useHomeData(
    user
      ? {
          uid: user.uid,
          role: user.role,
          teamId: user.teamId,
          cellId: user.cellId,
        }
      : null,
    isLoading,
  );

  const showSkeleton = isLoading || home.loading;
  const firstName = user?.displayName ?? "성도";
  const todayVerse = home.dailyContent?.todaysVerse;
  const todayQt = home.dailyContent?.todaysQt;

  return (
    <div className="space-y-4 pb-2 pt-2">
      <section className="space-y-1 px-1">
        <p className="text-sm font-medium text-neutral-500">{formatTodayLabel()}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          안녕하세요, {firstName}님
        </h1>
        <p className="text-sm text-neutral-500">
          오늘 꼭 필요한 말씀과 공동체 소식을 한눈에 확인하세요.
        </p>
      </section>

      {showSkeleton ? (
        <HomeSkeleton />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Today’s Verse"
              description="오늘의 말씀"
              action={<Quote className="h-4 w-4 text-neutral-300" />}
            />
            {todayVerse ? (
              <div className="space-y-3">
                <p className="text-lg font-semibold leading-8 text-neutral-950">
                  {todayVerse.reference}
                </p>
                <p className="text-sm leading-7 text-neutral-600">{todayVerse.text}</p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-neutral-500">
                {home.errors.daily
                  ? "오늘의 말씀을 불러오지 못했습니다."
                  : "등록된 오늘의 말씀이 없습니다."}
              </p>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Today QT"
              description="오늘의 큐티"
              action={<Sparkles className="h-4 w-4 text-neutral-300" />}
            />
            {todayQt ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-neutral-950">{todayQt.title}</p>
                  <p className="text-sm text-neutral-500">{todayQt.reference}</p>
                </div>
                <p className="text-sm leading-7 text-neutral-600">
                  {todayQt.description ?? "오늘의 묵상 본문이 준비되어 있습니다."}
                </p>
                <Link
                  href="/qt"
                  className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
                >
                  QT 보러가기
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <p className="text-sm leading-7 text-neutral-500">
                {home.errors.daily
                  ? "오늘의 큐티를 불러오지 못했습니다."
                  : "등록된 오늘의 큐티가 없습니다."}
              </p>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Prayer Requests"
              description="기도 제목 미리보기"
              action={<HandHeart className="h-4 w-4 text-neutral-300" />}
            />
            {user ? (
              home.prayerRequests.length > 0 ? (
                <div className="space-y-3">
                  {home.prayerRequests.map((prayer) => (
                    <div
                      key={prayer.id}
                      className="rounded-2xl border border-black/5 bg-neutral-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-neutral-900">
                            {trimText(prayer.title, 46)}
                          </p>
                          <p className="text-xs leading-5 text-neutral-500">
                            {trimText(prayer.content, 88)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] text-neutral-500">
                          {prayer.prayerCount}명
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/prayer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
                  >
                    전체 기도제목 보기
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <p className="text-sm leading-7 text-neutral-500">
                  {home.errors.prayers
                    ? "기도 제목을 불러오지 못했습니다."
                    : "표시할 기도 제목이 아직 없습니다."}
                </p>
              )
            ) : (
              <p className="text-sm leading-7 text-neutral-500">
                로그인 후 공동체 기도 제목을 확인할 수 있습니다.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Today Schedule"
              description="오늘의 교회 일정"
              action={<CalendarDays className="h-4 w-4 text-neutral-300" />}
            />
            {home.todaysEvents.length > 0 ? (
              <div className="space-y-3">
                {home.todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-black/5 bg-neutral-50 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-neutral-900">{event.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {resolveDateRangeLabel(event.startDate, event.endDate, event.isAllDay)}
                      </span>
                      {event.location ? <span>· {event.location}</span> : null}
                    </div>
                  </div>
                ))}
                <Link
                  href="/calendar"
                  className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
                >
                  일정 캘린더 보기
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <p className="text-sm leading-7 text-neutral-500">
                {home.errors.events
                  ? "오늘 일정을 불러오지 못했습니다."
                  : "오늘 등록된 일정이 없습니다."}
              </p>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Recent Notices"
              description="최근 공지"
              action={
                <Link href="/announcements" className="text-sm font-medium text-neutral-900">
                  전체보기
                </Link>
              }
            />
            {home.announcements.length > 0 ? (
              <div className="space-y-3">
                {home.announcements.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-neutral-50 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-neutral-500">
                          {ANNOUNCEMENT_CATEGORY[notice.category].label}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {formatKoreanDate(notice.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-neutral-900">{notice.title}</p>
                      <p className="text-sm leading-6 text-neutral-500">
                        {trimText(notice.content, 120)}
                      </p>
                    </div>
                    <Link
                      href="/announcements"
                      className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
                    >
                      보기
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-neutral-500">
                {home.errors.announcements
                  ? "최근 공지를 불러오지 못했습니다."
                  : "표시할 공지가 없습니다."}
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
