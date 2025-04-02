import { create } from "zustand";

interface UIState {
  selectedCollectionId: number | null;
  theme: "light" | "dark";
  setSelectedCollectionId: (id: number | null) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCollectionId: null,
  theme: "dark",
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
