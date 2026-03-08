import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isShareModalOpen: boolean;
  notification: { message: string; type: "success" | "error" } | null;
  setMobileMenuOpen: (open: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  showNotification: (
    message: string,
    type: "success" | "error"
  ) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isShareModalOpen: false,
  notification: null,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setShareModalOpen: (open) => set({ isShareModalOpen: open }),
  showNotification: (message, type) => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 4000);
  },
  clearNotification: () => set({ notification: null }),
}));
