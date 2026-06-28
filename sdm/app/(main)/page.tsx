"use client";

import { useAuth } from "@/features/auth";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { useActivityStreak } from "@/features/home/hooks/useActivityStreak";
import {
  TodaysVerseCard,
  TodaysQtCard,
  TodaysUserQtCard,
  QuickActions,
  AnnouncementsPreview,
  WeeklyScheduleCard,
  BulletinPreviewCard,
  PlaylistCard,
  MyChurchInfoCard,
  ActivitySummaryCard,
  HomeSkeleton,
  RecentPrayersCard,
} from "@/features/home/components";

export default function MainPage() {
  const { user } = useAuth();
  const home = useHomeData();
  const { streak } = useActivityStreak(user?.uid);

  const firstName = user?.displayName ?? "성도";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg space-y-4 px-4 pb-24 pt-6">
        <header>
          <p className="text-xs font-medium text-[#737373] dark:text-[#a3a3a3]">
            서대문교회 청년부
          </p>
          <h1 className="mt-0.5 text-xl font-bold text-[#171717] dark:text-[#f5f5f5]">
            안녕하세요, {firstName}님
          </h1>
        </header>

        {home.loading ? (
          <HomeSkeleton />
        ) : (
          <>
            <TodaysVerseCard
              verse={home.dailyContent?.todaysVerse ?? null}
              error={home.errors.daily}
            />
            <TodaysQtCard
              qt={home.dailyContent?.todaysQt ?? null}
              error={home.errors.daily}
            />
            <TodaysUserQtCard />
            <RecentPrayersCard />
            <QuickActions />
            <AnnouncementsPreview
              announcements={home.announcements}
              error={home.errors.announcements}
            />
            <WeeklyScheduleCard
              events={home.weeklyEvents}
              error={home.errors.events}
            />
            <BulletinPreviewCard
              bulletin={home.latestBulletin}
              error={home.errors.bulletin}
            />
            <PlaylistCard playlists={home.playlists} error={home.errors.playlists} />
            {user && <MyChurchInfoCard user={user} />}
            {user && (
              <ActivitySummaryCard
                statistics={user.statistics}
                streak={streak}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
