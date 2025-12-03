export interface RecentProjectProps {
  path: string;
  name: string;
  framework: string;
  language: string;
}

export interface SettingsState {
  darkMode: boolean;
  recentProjects: RecentProjectProps[];
  addRecentProject: (project: RecentProjectProps) => void;
  updateRecentProjects: (projects: RecentProjectProps[]) => void;
}
