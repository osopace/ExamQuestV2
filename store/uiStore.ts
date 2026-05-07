import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  modalKey: string | null;
  toggleSidebar: () => void;
  openModal: (key: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  modalKey: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (key) => set({ modalKey: key }),
  closeModal: () => set({ modalKey: null }),
}));
