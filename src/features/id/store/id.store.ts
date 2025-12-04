import { create } from "zustand";

interface IdState {
  openIdDialog: boolean;
  setOpenIdDialog: (open: boolean) => void;

  value: string;
  setValue: (value: string) => void;
}

export const useIdStore = create<IdState>((set) => ({
  openIdDialog: false,
  setOpenIdDialog: (open: boolean) => set({ openIdDialog: open }),
  value: "",
  setValue: (value: string) => set({ value }),
}));
