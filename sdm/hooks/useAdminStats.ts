import { useEffect, useState } from "react";
import { adminStatsService } from "../services/adminStatsService";

export function useAdminStats() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalQT: 0,
    totalPrayers: 0,
    teamStats: {},
    cellStats: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [
        totalUsers,
        pendingUsers,
        totalQT,
        totalPrayers,
        teamStats,
        cellStats
      ] = await Promise.all([
        adminStatsService.getTotalUsers(),
        adminStatsService.getPendingUsers(),
        adminStatsService.getTotalQT(),
        adminStatsService.getTotalPrayers(),
        adminStatsService.getTeamStats(),
        adminStatsService.getCellStats()
      ]);

      setStats({
        totalUsers,
        pendingUsers,
        totalQT,
        totalPrayers,
        teamStats,
        cellStats
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  return { stats, loading };
}