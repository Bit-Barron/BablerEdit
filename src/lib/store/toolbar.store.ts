import { create } from "zustand";

interface ToolbarStore {
  onProjectClick: string;
  setOnProjectClick: (id: string) => void;

  currentRoute: string;
  setCurrentRoute: (route: string) => void;

  disabledButtons: boolean;
  setDisabledButtons: (disabled: boolean) => void;

  addIdDialogOpen: boolean;
  setAddIdDialogOpen: (open: boolean) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  onProjectClick: "",
  setOnProjectClick: (id: string) => set({ onProjectClick: id }),
  currentRoute: "wizard",
  setCurrentRoute: (route: string) => set({ currentRoute: route }),
  disabledButtons: false,
  setDisabledButtons: (disabled: boolean) => set({ disabledButtons: disabled }),
  addIdDialogOpen: false,
  setAddIdDialogOpen: (open: boolean) => set({ addIdDialogOpen: open }),
}));
