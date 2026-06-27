"use client";

import { useEffect, useState } from "react";

import {
  getAllAnnouncements,
  getAllEvents,
  getAllBulletins,
  getAllPlaylists,
} from "@/services/content";
import { getDailyContent } from "@/services/daily";
import { toDateSafe } from "../lib/home-format";
import type { AnnouncementModel } from "@/models/announcement";
import type { EventModel } from "@/models/event";
import type { BulletinModel } from "@/models/bulletin";
import type { PlaylistModel } from "@/models/playlist";
import type { DailyContentModel } from "@/models/daily_content";

const ANNOUNCEMENT_PREVIEW_COUNT = 5;

export interface HomeErrors {
  daily: boolean;
  announcements: boolean;
  events: boolean;
  bulletin: boolean;
  playlists: boolean;
}

export interface HomeData {
  loading: boolean;
  dailyContent: DailyContentModel | null;
  announcements: AnnouncementModel[];
  weeklyEvents: EventModel[];
  latestBulletin: BulletinModel | null;
  playlists: PlaylistModel[];
  errors: HomeErrors;
}

function getWeekRange(now: Date): { start: number; end: number } {
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start: start.getTime(), end: end.getTime() };
}

function filterWeeklyEvents(events: EventModel[]): EventModel[] {
  const { start, end } = getWeekRange(new Date());
  return events
    .filter((event) => {
      const t = new Date(event.startDate).getTime();
      return !Number.isNaN(t) && t >= start && t < end;
    })
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
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
  bulletin: false,
  playlists: false,
};

const INITIAL: HomeData = {
  loading: true,
  dailyContent: null,
  announcements: [],
  weeklyEvents: [],
  latestBulletin: null,
  playlists: [],
  errors: NO_ERRORS,
};

export function useHomeData(): HomeData {
  const [data, setData] = useState<HomeData>(INITIAL);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [daily, announcements, events, bulletins, playlists] =
        await Promise.allSettled([
          getDailyContent(),
          getAllAnnouncements(),
          getAllEvents(),
          getAllBulletins(),
          getAllPlaylists(),
        ]);
      if (!active) return;
      setData({
        loading: false,
        dailyContent: valueOr(daily, null),
        announcements: sortAnnouncements(valueOr(announcements, [])),
        weeklyEvents: filterWeeklyEvents(valueOr(events, [])),
        latestBulletin: valueOr(bulletins, [])[0] ?? null,
        playlists: valueOr(playlists, []),
        errors: {
          daily: daily.status === "rejected",
          announcements: announcements.status === "rejected",
          events: events.status === "rejected",
          bulletin: bulletins.status === "rejected",
          playlists: playlists.status === "rejected",
        },
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  return data;
}
