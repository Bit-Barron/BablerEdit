import { create } from "zustand";
import { ParsedProject, FrameworkType } from "@/lib/types/project.types";

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

  projectSnapshot: ParsedProject;
  setProjectSnapshot: (snapshot: ParsedProject) => void;

  primaryLanguageCode: string;
  setPrimaryLanguageCode: (code: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),
  currentProjectPath: null,
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  projectSnapshot: {} as ParsedProject,
  setProjectSnapshot: (snapshot) => set({ projectSnapshot: snapshot }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  parsedProject: {} as ParsedProject,
  setParsedProject: (project) =>
    set((state) => {
      const snapshotExists =
        state.projectSnapshot && Object.keys(state.projectSnapshot).length > 0;

      const hasChanges = snapshotExists
        ? JSON.stringify(project) !== JSON.stringify(state.projectSnapshot)
        : false;

      return {
        parsedProject: project,
        hasUnsavedChanges: hasChanges,
      };
    }),

  primaryLanguageCode: "de",
  setPrimaryLanguageCode: (code) => set({ primaryLanguageCode: code }),
}));
