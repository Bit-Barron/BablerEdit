import { toast } from "sonner";
import { create } from "zustand";
import type { FrameworkType } from "@/shared/types/framework";
import { getFrameworkConfig } from "@/shared/lib/framework-config";

interface Language {
  id: string;
  name: string;
  code: string;
  file: File;
}

interface FilesStore {
  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  isFrameworkDialogOpen: boolean;
  setFrameworkDialogOpen: (isOpen: boolean) => void;

  translationFiles: File[];
  setTranslationFiles: (files: File[]) => void;
  validateAndAddFiles: (files: File[]) => Promise<void>;

  languages: Language[];
  addLanguage: (language: Omit<Language, "id">) => void;
  removeLanguage: (id: string) => void;

  onFileReject?: (file: File, message: string) => void;

  defaultLanguageCode?: string;
  setDefaultLanguageCode?: (code: string) => void;
}

export const useFilesStore = create<FilesStore>((set, get) => ({
  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  isFrameworkDialogOpen: false,
  setFrameworkDialogOpen: (isOpen: boolean) =>
    set({ isFrameworkDialogOpen: isOpen }),

  translationFiles: [],
  setTranslationFiles: (files: File[]) => set({ translationFiles: files }),

  validateAndAddFiles: async (files: File[]) => {
    const { selectedFramework } = get();
    if (!selectedFramework) {
      toast.error("Please select a framework first");
      return;
    }

    const config = getFrameworkConfig(selectedFramework);
    if (!config) {
      toast.error("Invalid framework configuration");
      return;
    }

    const validatedFiles: File[] = [];

    for (const file of files) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!config.acceptedExtensions.includes(ext)) {
        toast.error(`Invalid file type for ${config.name}`, {
          description: `"${
            file.name
          }" must be one of: ${config.acceptedExtensions.join(", ")}`,
        });
        continue;
      }

      // Check file size
      if (file.size > config.maxSize) {
        toast.error("File too large", {
          description: `"${file.name}" exceeds ${
            config.maxSize / 1024 / 1024
          }MB`,
        });
        continue;
      }

      // Run custom validator if exists
      if (config.validator) {
        const validation = await config.validator(file);
        if (!validation.valid) {
          toast.error("Validation failed", {
            description: `"${file.name}": ${validation.error}`,
          });
          continue;
        }
      }

      validatedFiles.push(file);
    }

    const currentFiles = get().translationFiles;
    const totalFiles = currentFiles.length + validatedFiles.length;

    if (totalFiles > config.maxFiles) {
      toast.error("Too many files", {
        description: `Maximum ${config.maxFiles} files allowed for ${config.name}`,
      });
      return;
    }

    if (validatedFiles.length > 0) {
      set({ translationFiles: [...currentFiles, ...validatedFiles] });
      toast.success(`Added ${validatedFiles.length} file(s)`);
    }
  },

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
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  },

  defaultLanguageCode: "en",
  setDefaultLanguageCode: (code: string) => set({ defaultLanguageCode: code }),
}));
