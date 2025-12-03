import { create } from "zustand";
import { RecentProjectProps, SettingsState } from "../types/settings.types";
import { saveToFile } from "../lib/file-helper";

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  recentProjects: [],

  addRecentProject: (project: RecentProjectProps) => {
    set((state) => {
      const newState = {
        recentProjects: [
          project,
          ...state.recentProjects.filter((p) => p.path !== project.path),
        ].slice(0, 5),
      };

      saveToFile({ ...state, ...newState });

      return newState;
    });
  },

  updateRecentProjects: (projects: RecentProjectProps[]) => {
    set((state) => {
      const newState = { recentProjects: projects };
      saveToFile({ ...state, ...newState });
      return newState;
    });
  },
}));
