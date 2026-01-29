import { create } from "zustand";
import { FileWithPath, Translation } from "@/lib/types/project.types";

interface TranslationStore {
  currentTranslations: Translation[];
  setCurrentTranslations: (translations: Translation[]) => void;

  translationForKey: Translation[];
  setTranslationForKey: (translations: Translation[]) => void;

  displayComment: string;
  setDisplayComment: (comment: string) => void;

  setTranslationUrls: (urls: string[]) => void;
  translationUrls: string[];

  comment: string;
  setComment: (coimment: string) => void;

  commentDialogOpen: boolean;
  setCommentDialogOpen: (dialogOpen: boolean) => void;

  translationFiles: FileWithPath[]
  setTranslationFiles: (translationFiles: FileWithPath[]) => void;

  translationInputValue: string;
  setTranslationInputValue: (translationInput: string) => void;

}

export const useTranslationStore = create<TranslationStore>((set) => ({
  currentTranslations: [],
  translationFiles: [],
  setTranslationFiles: (files: FileWithPath[]) => set({
    translationFiles: files
  }),
  setCurrentTranslations: (translations) =>
    set({ currentTranslations: translations }),
  displayComment: "",
  setDisplayComment: (comment) =>
    set({
      displayComment: comment,
    }),

  translationInputValue: "",
  setTranslationInputValue: (translationInput: string) => set({
    translationInputValue: translationInput
  }),
  translationUrls: [],
  comment: "",
  setComment: (comment: string) => set({
    comment
  }),
  commentDialogOpen: false,
  setCommentDialogOpen: (open: boolean) => set({
    commentDialogOpen: open
  }),
  setTranslationUrls: (urls) => set({ translationUrls: urls }),

  setTranslationForKey: (translations) =>
    set({ translationForKey: translations }),
  translationForKey: [],
}));
