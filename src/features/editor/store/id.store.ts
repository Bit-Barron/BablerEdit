import { create } from "zustand";

interface IdState {
  value: string;
  setValue: (value: string) => void;

  openIdDialog: boolean;
  setOpenIdDialog: (isOpen: boolean) => void;
}

export const useIdStore = create<IdState>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
  openIdDialog: false,
  setOpenIdDialog: (isOpen) => set({ openIdDialog: isOpen }),
}));
