import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

export const adminStatsService = {
  async getTotalUsers() {
    const snap = await getDocs(collection(db, "users"));
    return snap.size;
  },

  async getPendingUsers() {
    const q = query(collection(db, "users"), where("approved", "==", false));
    const snap = await getDocs(q);
    return snap.size;
  },

  async getTotalQT() {
    const snap = await getDocs(collection(db, "qt"));
    return snap.size;
  },

  async getTotalPrayers() {
    const snap = await getDocs(collection(db, "prayerRequests"));
    return snap.size;
  },

  async getTeamStats() {
    const snap = await getDocs(collection(db, "users"));

    const result: Record<string, number> = {};

    snap.forEach((doc) => {
      const data = doc.data();
      const team = data.team || "unknown";
      result[team] = (result[team] || 0) + 1;
    });

    return result;
  },

  async getCellStats() {
    const snap = await getDocs(collection(db, "users"));

    const result: Record<string, number> = {};

    snap.forEach((doc) => {
      const data = doc.data();
      const cell = data.cell || "unknown";
      result[cell] = (result[cell] || 0) + 1;
    });

    return result;
  }
};