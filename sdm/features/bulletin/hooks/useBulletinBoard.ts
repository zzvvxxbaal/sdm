"use client";

import { useEffect, useMemo, useState } from "react";

import { createBulletin, deleteBulletin, getAllBulletins, updateBulletin, type BulletinInput } from "@/services/bulletin";
import type { BulletinModel } from "@/models/bulletin";

export function useBulletinBoard(searchTerm: string) {
  const [items, setItems] = useState<BulletinModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getAllBulletins());
    } catch {
      setError("주보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const nextItems = await getAllBulletins();
        if (active) setItems(nextItems);
      } catch {
        if (active) setError("주보를 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim();
    if (!keyword) return items;
    return items.filter((item) => item.date.includes(keyword) || item.title.includes(keyword));
  }, [items, searchTerm]);

  const saveBulletin = async (input: BulletinInput, userId: string, id?: string) => {
    if (id) await updateBulletin(id, input, userId);
    else await createBulletin(input, userId);
    await reload();
  };

  const removeBulletin = async (id: string) => {
    await deleteBulletin(id);
    await reload();
  };

  return { items: filteredItems, loading, error, saveBulletin, removeBulletin, reload };
}
