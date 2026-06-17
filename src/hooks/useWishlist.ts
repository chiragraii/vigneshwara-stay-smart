import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vigneshwara-wishlist';

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readStorage());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (roomId: string) => {
      const next = ids.includes(roomId) ? ids.filter((id) => id !== roomId) : [...ids, roomId];
      persist(next);
      return !ids.includes(roomId);
    },
    [ids, persist]
  );

  const isWishlisted = useCallback((roomId: string) => ids.includes(roomId), [ids]);

  return { ids, toggle, isWishlisted };
}
