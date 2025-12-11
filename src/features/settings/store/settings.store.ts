import { create } from "zustand";
import {
  RecentProjectProps,
  UpdateSettingsState,
} from "../types/settings.types";
import { saveSettingsToFile } from "../lib/settings-utils";

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  updateRecentProjects: (projects: RecentProjectProps[]) => void;
  updateSettings: (settings: UpdateSettingsState) => void;
}

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

      saveSettingsToFile({ ...state, ...newState });

      return newState;
    });
  },

  updateRecentProjects: (projects: RecentProjectProps[]) => {
    set((state) => {
      const newState = { recentProjects: projects };
      saveSettingsToFile({ ...state, ...newState });
      return newState;
    });
  },

  updateSettings: (settings: UpdateSettingsState) => {
    set((state) => {
      saveSettingsToFile({ ...state, ...settings });
      return settings;
    });
  },
}));
