"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { BookOpen, Heart, Megaphone, Loader } from "lucide-react";

interface Activity {
  id: string;
  type: "qt" | "prayer" | "announcement";
  title: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  maxItems?: number;
}

/**
 * Activity feed component showing recent activities
 * Displays recent QT entries, prayers, and announcements
 */
export function ActivityFeed({ maxItems = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const [qtDocs, prayerDocs, announcementDocs] = await Promise.all([
          getDocs(
            query(collection(db, "qt_entries"), orderBy("createdAt", "desc"), limit(maxItems))
          ),
          getDocs(
            query(
              collection(db, COLLECTIONS.PRAYER_REQUESTS),
              orderBy("createdAt", "desc"),
              limit(maxItems)
            )
          ),
          getDocs(
            query(
              collection(db, COLLECTIONS.ANNOUNCEMENTS),
              orderBy("createdAt", "desc"),
              limit(maxItems)
            )
          ),
        ]);

        const combined: Activity[] = [];

        qtDocs.forEach((doc) => {
          const data = doc.data();
          combined.push({
            id: `qt-${doc.id}`,
            type: "qt",
            title: data.title || "새로운 QT",
            timestamp: data.createdAt?.toDate() || new Date(),
          });
        });

        prayerDocs.forEach((doc) => {
          const data = doc.data();
          combined.push({
            id: `prayer-${doc.id}`,
            type: "prayer",
            title: data.title || "새로운 기도제목",
            timestamp: data.createdAt?.toDate() || new Date(),
          });
        });

        announcementDocs.forEach((doc) => {
          const data = doc.data();
          combined.push({
            id: `announcement-${doc.id}`,
            type: "announcement",
            title: data.title || "새로운 공지사항",
            timestamp: data.createdAt?.toDate() || new Date(),
          });
        });

        // Sort by timestamp descending and limit
        const sorted = combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(sorted.slice(0, maxItems));
      } catch {
        // Silent error handling in activity feed
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [maxItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-5 w-5 animate-spin text-[#737373]" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-[#e5e5e5] bg-white p-6 text-center dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">최근 활동이 없습니다.</p>
      </div>
    );
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "qt":
        return <BookOpen className="h-4 w-4" />;
      case "prayer":
        return <Heart className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: Activity["type"]) => {
    switch (type) {
      case "qt":
        return "QT 기록";
      case "prayer":
        return "기도제목";
      case "announcement":
        return "공지사항";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "qt":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "prayer":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "announcement":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 rounded-lg border border-[#e5e5e5] bg-white p-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"
        >
          <div className={`rounded-lg p-2 ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#171717] dark:text-[#f5f5f5]">
              {activity.title}
            </p>
            <p className="text-xs text-[#a3a3a3] dark:text-[#737373]">
              {getActivityLabel(activity.type)} · {formatTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
