import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const raw = localStorage.getItem('rc-favorites');
    try { return new Set(raw ? JSON.parse(raw) as string[] : []); } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('rc-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  return { favorites, toggleFavorite, isFavorite } as const;
}
