export interface RecentProjectProps {
  path: string;
  name: string;
  framework: string;
  language: string;
}

export interface UpdateSettingsState {
  darkMode?: boolean;
  recentProjects?: RecentProjectProps[];
}

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  updateRecentProjects: (projects: RecentProjectProps[]) => void;
  removeRecentProject: (path: string) => void;

  updateSettings: (settings: UpdateSettingsState) => void;
}
