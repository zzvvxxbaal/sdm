"use client";

import { useEffect, useState } from "react";

import {
  getAllAnnouncements,
  getAllEvents,
} from "@/services/content";
import { getDailyContent } from "@/services/daily";
import { getVisiblePrayerRequests } from "@/services/prayer";
import { isSameDay, toDateSafe } from "@/lib/date";
import type { AnnouncementModel } from "@/models/announcement";
import type { EventModel } from "@/models/event";
import type { DailyContentModel } from "@/models/daily_content";
import type { PrayerRequestModel } from "@/models/prayer_request";
import type { PrayerViewerContext } from "@/types/prayer";

const ANNOUNCEMENT_PREVIEW_COUNT = 3;
const PRAYER_PREVIEW_COUNT = 3;
const TODAY_EVENT_PREVIEW_COUNT = 3;

export interface HomeErrors {
  daily: boolean;
  announcements: boolean;
  events: boolean;
  prayers: boolean;
}

export interface HomeData {
  loading: boolean;
  dailyContent: DailyContentModel | null;
  announcements: AnnouncementModel[];
  todaysEvents: EventModel[];
  prayerRequests: PrayerRequestModel[];
  errors: HomeErrors;
}

function filterTodaysEvents(events: EventModel[]): EventModel[] {
  const today = new Date();
  return events
    .filter((event) => {
      const date = toDateSafe(event.startDate);
      return date !== null && isSameDay(date, today);
    })
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, TODAY_EVENT_PREVIEW_COUNT);
}

function sortAnnouncements(items: AnnouncementModel[]): AnnouncementModel[] {
  return [...items]
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
      const at = toDateSafe(a.createdAt)?.getTime() ?? 0;
      const bt = toDateSafe(b.createdAt)?.getTime() ?? 0;
      return bt - at;
    })
    .slice(0, ANNOUNCEMENT_PREVIEW_COUNT);
}

function valueOr<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

const NO_ERRORS: HomeErrors = {
  daily: false,
  announcements: false,
  events: false,
  prayers: false,
};

const INITIAL: HomeData = {
  loading: true,
  dailyContent: null,
  announcements: [],
  todaysEvents: [],
  prayerRequests: [],
  errors: NO_ERRORS,
};

export function useHomeData(
  viewer: PrayerViewerContext | null,
  authLoading: boolean,
): HomeData {
  const [data, setData] = useState<HomeData>(INITIAL);

  useEffect(() => {
    if (authLoading) return;

    let active = true;

    setData((current) => ({
      ...current,
      loading: true,
    }));

    void (async () => {
      const [daily, announcements, events, prayers] =
        await Promise.allSettled([
          getDailyContent(),
          getAllAnnouncements(),
          getAllEvents(),
          viewer ? getVisiblePrayerRequests(viewer) : Promise.resolve([]),
        ]);
      if (!active) return;
      setData({
        loading: false,
        dailyContent: valueOr(daily, null),
        announcements: sortAnnouncements(valueOr(announcements, [])),
        todaysEvents: filterTodaysEvents(valueOr(events, [])),
        prayerRequests: valueOr(prayers, []).slice(0, PRAYER_PREVIEW_COUNT),
        errors: {
          daily: daily.status === "rejected",
          announcements: announcements.status === "rejected",
          events: events.status === "rejected",
          prayers: prayers.status === "rejected",
        },
      });
    })();
    return () => {
      active = false;
    };
  }, [authLoading, viewer]);

  return data;
}
