import { create } from "zustand";

export const useWindowStore = create((set) => ({
  windows: [],
  activeWindow: null,

  openWindow: (win) =>
    set((state) => ({
      windows: [...state.windows, win],
      activeWindow: win.id
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindow: state.activeWindow === id ? null : state.activeWindow
    })),

  focusWindow: (id) =>
    set(() => ({
      activeWindow: id
    }))
}));
