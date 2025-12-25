import { create } from "zustand";
import { ParsedProject } from "@/lib/types/project.types";
import { FrameworkType } from "@/lib/types/framework.types";

interface ProjectStore {
  currentProjectPath: string | null;
  setCurrentProjectPath: (path: string | null) => void;

  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  parsedProject: ParsedProject;
  setParsedProject: (project: ParsedProject) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProjectPath: null,
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  parsedProject: {} as ParsedProject,
  setParsedProject: (project) => set({ parsedProject: project }),
}));
