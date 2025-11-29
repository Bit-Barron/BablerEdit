import { create } from "zustand";

interface WizardStore {
  recentProjects: string[];
  addRecentProject: (projectPath: string) => void;
}

export const useWizardStore = create<WizardStore>((set) => ({
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
