import { create } from "zustand";

interface WizardStore {
  primaryLanguageCode: string;
  setPrimaryLanguageCode: (code: string) => void;
}

export const useWizardStore = create<WizardStore>((set) => ({
  primaryLanguageCode: "de",
  setPrimaryLanguageCode: (code) => set({ primaryLanguageCode: code }),
}));
