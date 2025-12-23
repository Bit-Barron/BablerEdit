import { create } from "zustand";
import { ParsedProject } from "@/features/project/types/project.types";
import { FrameworkType } from "@/core/types/framework.types";

interface ProjectStore {
  currentProjectPath: string | null;
  setCurrentProjectPath: (path: string | null) => void;

  selectedFramework: FrameworkType | "";
  setSelectedFramework: (typeId: FrameworkType | "") => void;

  parsedProject: ParsedProject;
  setParsedProject: (project: ParsedProject) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProjectPath: null,
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),

  selectedFramework: "",
  setSelectedFramework: (typeId) => set({ selectedFramework: typeId }),

  parsedProject: {} as ParsedProject,
  setParsedProject: (project) => set({ parsedProject: project }),
}));
