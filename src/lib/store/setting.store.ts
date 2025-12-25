import {
  RecentProjectProps,
  UpdateSettingsState,
} from "@/lib/types/settings.types";
import { saveSettingsToFile } from "@/lib/utils/settings-utils";
import { create } from "zustand";

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  updateRecentProjects: (projects: RecentProjectProps[]) => void;
  updateSettings: (settings: UpdateSettingsState) => void;

  lastOpenedProject: string | null;
  setLastOpenedProject: (path: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  recentProjects: [],
  lastOpenedProject: null,
  setLastOpenedProject: (path: string) => {
    set((state) => {
      const newState = { lastOpenedProject: path };
      saveSettingsToFile({ ...state, ...newState });
      return newState;
    });
  },

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
