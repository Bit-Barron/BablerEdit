export interface RecentProjectProps {
  path: string;
  name: string;
  framework: string;
  language: string;
  lastModified?: string;
  lastOpened?: string;
}

export interface UpdateSettingsState {
  darkMode?: boolean;
  recentProjects?: RecentProjectProps[];
  lastOpenedProject: string | null;
}
