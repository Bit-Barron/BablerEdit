import { create } from "zustand";
import {
  RecentProjectProps,
  SettingsState,
  UpdateSettingsState,
} from "../types/settings.types";
import { saveToFile } from "../lib/persist-settings";

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

  updateSettings: (settings: UpdateSettingsState) => {
    set((state) => {
      saveToFile({ ...state, ...settings });
      return settings;
    });
  },
}));
