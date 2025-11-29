import { toast } from "sonner";
import { create } from "zustand";
import { getFrameworkConfig } from "@/core/lib/frameworks";
import { createProject } from "@/features/parser";
import { ParsedProject } from "@/features/parser/types/parser";
import { FrameworkType } from "@/core/types/framework";
import { Language } from "../types/files";

interface FilesStore {
  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  isFrameworkDialogOpen: boolean;
  setFrameworkDialogOpen: (isOpen: boolean) => void;

  translationFiles: File[];
  setTranslationFiles: (files: File[]) => void;
  removeTranslationFile: (fileToRemove: File) => void;
  validateAndAddFiles: (files: File[]) => Promise<void>;

  languages: Language[];
  addLanguage: (language: Omit<Language, "id">) => void;
  removeLanguage: (id: string) => void;

  onFileReject?: (file: File, message: string) => void;

  defaultLanguageCode?: string;
  setDefaultLanguageCode?: (code: string) => void;

  parsedProject: ParsedProject | null;
  setParsedProject: (project: ParsedProject | null) => void;
  parseFiles: () => Promise<void>;
}

export const useFilesStore = create<FilesStore>((set, get) => ({
  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  isFrameworkDialogOpen: false,
  setFrameworkDialogOpen: (isOpen: boolean) =>
    set({ isFrameworkDialogOpen: isOpen }),

  translationFiles: [],
  setTranslationFiles: (files: File[]) => set({ translationFiles: files }),

  removeTranslationFile: (fileToRemove: File) => {
    set((state) => ({
      translationFiles: state.translationFiles.filter(
        (file) => file !== fileToRemove
      ),
    }));
  },

  validateAndAddFiles: async (files: File[]) => {
    const { selectedFramework, translationFiles: currentFiles } = get();
    if (!selectedFramework) {
      toast.error("Please select a framework first");
      return;
    }

    const config = getFrameworkConfig(selectedFramework);
    if (!config) {
      toast.error("Invalid framework configuration");
      return;
    }

    const newFiles = files.filter(
      (file) =>
        !currentFiles.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        )
    );

    if (newFiles.length === 0) {
      toast.info("No new files to add", {
        description: "All selected files are already added",
      });
      return;
    }

    const validatedFiles: File[] = [];

    for (const file of newFiles) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!config.acceptedExtensions.includes(ext)) {
        toast.error(`Invalid file type for ${config.name}`, {
          description: `"${
            file.name
          }" must be one of: ${config.acceptedExtensions.join(", ")}`,
        });
        continue;
      }

      if (file.size > config.maxSize) {
        toast.error("File too large", {
          description: `"${file.name}" exceeds ${
            config.maxSize / 1024 / 1024
          }MB`,
        });
        continue;
      }

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

  defaultLanguageCode: "de",
  setDefaultLanguageCode: (code: string) => set({ defaultLanguageCode: code }),

  parsedProject: null,
  setParsedProject: (project) => set({ parsedProject: project }),

  parseFiles: async () => {
    const { translationFiles, selectedFramework, defaultLanguageCode } = get();

    if (translationFiles.length === 0) {
      toast.error("No files to parse");
      return;
    }

    if (!selectedFramework) {
      toast.error("No framework selected");
      return;
    }

    try {
      const project = await createProject(
        translationFiles,
        selectedFramework,
        defaultLanguageCode || "en"
      );

      set({ parsedProject: project });

      toast.success("Files parsed successfully!", {
        description: `${project.languages.size} language(s) with ${project.allKeys.length} keys`,
      });
    } catch (error) {
      console.error("Parse error:", error);
      toast.error("Failed to parse files", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
}));
