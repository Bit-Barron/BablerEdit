import { create } from "zustand";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { FrameworkType } from "@/core/types/framework.types";
import { FileWithPath } from "../types/file-manager.types";

interface FileManagerStore {
  currentProjectPath: string | null;
  setCurrentProjectPath: (path: string | null) => void;

  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  isFileUploadDialogOpen: boolean;
  setFileUploadDialogOpen: (isOpen: boolean) => void;

  translationFiles: FileWithPath[];
  setTranslationFiles: (files: FileWithPath[]) => void;

  primaryLanguageCode: string;
  setPrimaryLanguageCode: (code: string) => void;

  parsedProject: ParsedProject;
  setParsedProject: (project: ParsedProject) => void;
}

export const useFileManagerStore = create<FileManagerStore>((set) => ({
  currentProjectPath: null,
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),
  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  isFileUploadDialogOpen: false,
  setFileUploadDialogOpen: (isOpen: boolean) =>
    set({ isFileUploadDialogOpen: isOpen }),

  translationFiles: [],
  setTranslationFiles: (files: FileWithPath[]) =>
    set({ translationFiles: files }),

  primaryLanguageCode: "de",
  setPrimaryLanguageCode: (code: string) => set({ primaryLanguageCode: code }),

  parsedProject: {} as ParsedProject,
  setParsedProject: (project) => set({ parsedProject: project }),
}));
