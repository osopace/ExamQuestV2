import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  modalKey: string | null;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openModal: (key: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  modalKey: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openModal: (key) => set({ modalKey: key }),
  closeModal: () => set({ modalKey: null }),
}));
