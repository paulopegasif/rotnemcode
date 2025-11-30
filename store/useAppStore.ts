import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme slice
interface ThemeSlice {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// Favorites slice
interface FavoritesSlice {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

// Search slice
interface SearchSlice {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Combined store type
type AppStore = ThemeSlice & FavoritesSlice & SearchSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Theme state
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const newIsDark = !state.isDark;
          // Update DOM class
          if (newIsDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: newIsDark };
        }),
      setTheme: (isDark) =>
        set(() => {
          // Update DOM class
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark };
        }),

      // Favorites state
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fav) => fav !== id)
            : [...state.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),

      // Search state
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'rotnemcode-storage',
      partialize: (state) => ({
        isDark: state.isDark,
        favorites: state.favorites,
        // searchQuery não é persistido
      }),
      onRehydrateStorage: () => (state) => {
        // Aplicar tema após hidratar do localStorage
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
