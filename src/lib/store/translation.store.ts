import { create } from "zustand";
import { Translation } from "@/lib/types/project.types";

interface TranslationStore {
  currentTranslations: Translation[];
  setCurrentTranslations: (translations: Translation[]) => void;

  translationForKey: Translation[];
  setTranslationForKey: (translations: Translation[]) => void;

  openComment: boolean;
  setOpenComment: (open: boolean) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  currentTranslations: [],
  setCurrentTranslations: (translations) =>
    set({ currentTranslations: translations }),

  setTranslationForKey: (translations) =>
    set({ translationForKey: translations }),
  translationForKey: [],
  openComment: false,
  setOpenComment: (open) => set({ openComment: open }),
}));
