"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { PageHeader, Spinner } from "@/components/ui";
import { ROLE_LABELS, ROLE_COLORS } from "@/types/role";
import type { UserModel } from "@/models/user";
import type { UserRole } from "@/types/role";

/**
 * User Analytics Page
 * Shows all users with their roles and signup dates
 */
export default function UserAnalyticsPage() {
  const [users, setUsers] = useState<(UserModel & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const q = query(collection(db, COLLECTIONS.USERS), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (UserModel & { id: string })[];
        setUsers(userData);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers =
    selectedRole === "all" ? users : users.filter((u) => u.role === selectedRole);

  const formatDate = (date: unknown) => {
    if (!date) return "—";
    try {
      const d = typeof date === "object" && date !== null && "toDate" in (date as object)
        ? (date as { toDate(): Date }).toDate()
        : new Date(date as string | number);
      return d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <PageHeader title="사용자 분석" description="사용자 목록 및 역할 확인" />
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="사용자 분석" description="사용자 목록 및 역할 확인" />

      {/* Role Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedRole("all")}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedRole === "all"
              ? "bg-[#2563EB] text-white"
              : "border border-[#e5e5e5] bg-white text-[#171717] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5]"
          }`}
        >
          전체 ({users.length})
        </button>
        {Object.entries(ROLE_LABELS).map(([role, label]) => {
          const count = users.filter((u) => u.role === role).length;
          return (
            <button
              key={role}
              onClick={() => setSelectedRole(role as UserRole)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedRole === role
                  ? "bg-[#2563EB] text-white"
                  : "border border-[#e5e5e5] bg-white text-[#171717] dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5]"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-[#e5e5e5] bg-white p-6 text-center dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
            <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">
              해당하는 사용자가 없습니다.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border border-[#e5e5e5] bg-white p-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#171717] dark:text-[#f5f5f5]">
                  {user.displayName || "이름 없음"}
                </p>
                <p className="text-xs text-[#a3a3a3]">{user.email}</p>
              </div>
              <div className="ml-3 flex flex-col items-end gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: ROLE_COLORS[user.role as UserRole] || "#6B7280" }}
                >
                  {ROLE_LABELS[user.role as UserRole] || user.role}
                </span>
                <p className="text-xs text-[#737373] dark:text-[#a3a3a3]">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
