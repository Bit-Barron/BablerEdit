import { create } from "zustand";

interface IdState {
  openIdDialog: boolean;
  setOpenIdDialog: (open: boolean) => void;
}

export const useIdStore = create<IdState>((set) => ({
  openIdDialog: false,
  setOpenIdDialog: (open: boolean) => set({ openIdDialog: open }),
}));
