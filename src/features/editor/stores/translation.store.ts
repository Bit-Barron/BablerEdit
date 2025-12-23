import { create } from "zustand";
import { Translation } from "@/features/project/types/project.types";

interface TranslationStore {
  currentTranslations: Translation[];
  setCurrentTranslations: (translations: Translation[]) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  currentTranslations: [],
  setCurrentTranslations: (translations) =>
    set({ currentTranslations: translations }),
}));
