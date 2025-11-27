import { toast } from "sonner";
import { create } from "zustand";

interface Language {
  id: string;
  name: string;
  code: string;
  file: File;
}

interface FilesStore {
  selectedFramework: string;
  setSelectedFramework: (typeId: string) => void;

  isFrameworkDialogOpen: boolean;
  setFrameworkDialogOpen: (isOpen: boolean) => void;

  translationFiles: File[];
  setTranslationFiles: (files: File[]) => void;

  languages: Language[];
  addLanguage: (language: Omit<Language, "id">) => void;
  removeLanguage: (id: string) => void;

  onFileReject?: (file: File, message: string) => void;

  defaultLanguageCode?: string;
  setDefaultLanguageCode?: (code: string) => void;
}

export const useFilesStore = create<FilesStore>((set) => ({
  selectedFramework: "",
  setSelectedFramework: (typeId: string) => set({ selectedFramework: typeId }),

  isFrameworkDialogOpen: false,
  setFrameworkDialogOpen: (isOpen: boolean) =>
    set({ isFrameworkDialogOpen: isOpen }),

  translationFiles: [],
  setTranslationFiles: (files: File[]) => set({ translationFiles: files }),

  languages: [],
  addLanguage: (language) =>
    set((state) => ({
      languages: [...state.languages, { ...language, id: crypto.randomUUID() }],
    })),
  removeLanguage: (id: string) =>
    set((state) => ({
      languages: state.languages.filter((l) => l.id !== id),
    })),

  onFileReject: (file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  },

  defaultLanguageCode: "en",
  setDefaultLanguageCode: (code: string) => set({ defaultLanguageCode: code }),
}));
