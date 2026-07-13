import { create } from 'zustand'

type AppState = {
  isDark: boolean
  toggleTheme: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}))
