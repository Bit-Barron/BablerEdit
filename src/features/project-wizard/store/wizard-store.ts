import { create } from "zustand";

interface WelcomeStore {
  recentProjects: string[];
  addRecentProject: (projectPath: string) => void;
}

export const useWelcomeStore = create<WelcomeStore>((set) => ({
  recentProjects: [
    "dispotool-translations.babel",
    "my-app-locales.json",
    "website-i18n.yml",
  ],
  addRecentProject: (projectPath: string) =>
    set((state) => ({
      recentProjects: [
        projectPath,
        ...state.recentProjects.filter((p) => p !== projectPath),
      ].slice(0, 10),
    })),
}));
