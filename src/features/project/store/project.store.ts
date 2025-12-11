import { create } from "zustand";
import { ParsedProject } from "@/features/project/types/project.types";
import { FrameworkType } from "@/core/types/framework.types";
import { FileWithPath } from "../types/file.types";

interface ProjectStore {
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

export const useProjectStore = create<ProjectStore>((set) => ({
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
