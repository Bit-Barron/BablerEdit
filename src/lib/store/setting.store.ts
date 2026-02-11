import { RecentProjectProps } from "@/lib/types/settings.types";
import { create } from "zustand";
import * as SettingsService from "@/lib/services/settings.service";
import { DesignSettings, DEFAULT_DESIGN_SETTINGS } from "@/lib/config/design.config";

export interface ApiKeys {
  googleTranslate: string;
  deepl: string;
  microsoftTranslator: string;
  nvidia: string;
  fireworks: string;
  mistral: string;
}

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  setRecentProjects: (projects: RecentProjectProps[]) => void;

  lastOpenedProject: string | null;
  setLastOpenedProject: (path: string) => void;

  apiKeys: ApiKeys;
  setApiKey: (provider: keyof ApiKeys, key: string) => void;

  designSettings: DesignSettings;
  setDesignSetting: <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  recentProjects: [],
  lastOpenedProject: null,
  apiKeys: {
    googleTranslate: "",
    deepl: "",
    microsoftTranslator: "",
    nvidia: "",
    fireworks: "",
    mistral: "",
  },
  setApiKey: (provider: keyof ApiKeys, key: string) => {
    set((state) => {
      const newApiKeys = { ...state.apiKeys, [provider]: key };
      const newState = { apiKeys: newApiKeys };
      SettingsService.saveSettingsToFile({ ...state, ...newState });
      return newState;
    });
  },
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

  designSettings: (() => {
    try {
      const saved = localStorage.getItem("babler-design-settings");
      return saved ? { ...DEFAULT_DESIGN_SETTINGS, ...JSON.parse(saved) } : DEFAULT_DESIGN_SETTINGS;
    } catch {
      return DEFAULT_DESIGN_SETTINGS;
    }
  })(),
  setDesignSetting: (key, value) => {
    set((state) => {
      const newSettings = { ...state.designSettings, [key]: value };
      localStorage.setItem("babler-design-settings", JSON.stringify(newSettings));
      SettingsService.saveSettingsToFile({ ...state, designSettings: newSettings });
      return { designSettings: newSettings };
    });
  },
}));
