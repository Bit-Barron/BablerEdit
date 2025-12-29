import { RecentProjectProps } from "@/lib/types/settings.types";
import { create } from "zustand";
import * as SettingsService from "@/lib/services/settings.service";

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  setRecentProjects: (projects: RecentProjectProps[]) => void;

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
      SettingsService.saveSettingsToFile({ ...state, ...newState });
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

      SettingsService.saveSettingsToFile({ ...state, ...newState });

      return newState;
    });
  },

  setRecentProjects: (projects: RecentProjectProps[]) => {
    set({ recentProjects: projects });
  },
}));
