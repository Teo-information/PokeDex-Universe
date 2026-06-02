import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, ViewMode } from '@/types/ui.types';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface UiStore {
  theme: Theme;
  viewMode: ViewMode;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
  applyThemeToDocument: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      viewMode: 'grid',
      setTheme: (theme) => {
        set({ theme });
        get().applyThemeToDocument();
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        get().applyThemeToDocument();
      },
      setViewMode: (viewMode) => set({ viewMode }),
      applyThemeToDocument: () => {
        const { theme } = get();
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
    }),
    { name: 'pokedex-ui' },
  ),
);
