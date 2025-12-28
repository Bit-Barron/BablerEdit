import { create } from "zustand";
import { Translation } from "@/lib/types/project.types";

interface TranslationStore {
  currentTranslations: Translation[];
  setCurrentTranslations: (translations: Translation[]) => void;

  translationForKey: Translation[];
  setTranslationForKey: (translations: Translation[]) => void;

  displayComment: string;
  setDisplayComment: (comment: string) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  currentTranslations: [],
  setCurrentTranslations: (translations) =>
    set({ currentTranslations: translations }),
  displayComment: "",
  setDisplayComment: (comment) =>
    set({
      displayComment: comment,
    }),

  setTranslationForKey: (translations) =>
    set({ translationForKey: translations }),
  translationForKey: [],
}));
