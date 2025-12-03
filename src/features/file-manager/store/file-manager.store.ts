import { toast } from "sonner";
import { create } from "zustand";
import { ParsedProject } from "@/features/translation/types/parser.types";
import { FrameworkType } from "@/core/types/framework.types";
import { FileWithPath } from "../types/file-manager.types";

interface FileManagerStore {
  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  isFileUploadDialogOpen: boolean;
  setFileUploadDialogOpen: (isOpen: boolean) => void;

  translationFiles: FileWithPath[];
  setTranslationFiles: (files: FileWithPath[]) => void;
  removeTranslationFile: (fileToRemove: FileWithPath) => void;

  onFileReject: (file: File, message: string) => void;

  defaultLanguageCode: string;
  setDefaultLanguageCode: (code: string) => void;

  parsedProject: ParsedProject;
  setParsedProject: (project: ParsedProject) => void;
}

export const useFileManagerStore = create<FileManagerStore>((set) => ({
  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  isFileUploadDialogOpen: false,
  setFileUploadDialogOpen: (isOpen: boolean) =>
    set({ isFileUploadDialogOpen: isOpen }),

  translationFiles: [],
  setTranslationFiles: (files: FileWithPath[]) =>
    set({ translationFiles: files }),

  removeTranslationFile: (fileToRemove: FileWithPath) => {
    set((state) => ({
      translationFiles: state.translationFiles.filter(
        (file) => file.path !== fileToRemove.path
      ),
    }));
  },

  onFileReject: (file: File, message: string) => {
    const truncatedName =
      file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;
    toast.error(message, {
      description: `"${truncatedName}" has been rejected`,
    });
  },

  defaultLanguageCode: "de",
  setDefaultLanguageCode: (code: string) => set({ defaultLanguageCode: code }),

  parsedProject: {} as ParsedProject,
  setParsedProject: (project) => set({ parsedProject: project }),
}));
