import { create } from "zustand";

interface WizardStore {
  recentProjects: string[];
}

export const useWizardStore = create<WizardStore>(() => ({
  recentProjects: [
    "dispotool-translations.babel",
    "my-app-locales.json",
    "website-i18n.yml",
  ],
}));
