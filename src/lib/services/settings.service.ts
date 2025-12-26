import { SETTINGS_FILE } from "@/lib/config/constants.config";
import { appDataDir } from "@tauri-apps/api/path";
import {
  exists,
  mkdir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import yaml from "js-yaml";

interface LoadUserSettingsResult {
  settingsExist: boolean;
  lastOpenedProjectExist: boolean;
  parsedProject?: any;
  lastOpenedProjectPath?: string;
  recentProjects?: Record<string, any>;
}

export async function loadUserSettings(): Promise<LoadUserSettingsResult | null> {
  const settingsPath = await getSettingsPath();
  console.log("settingsPath", settingsPath);
  const fileExists = await exists(settingsPath);

  if (!fileExists) {
    return null;
  }

  const content = await readTextFile(settingsPath);
  const savedSettings = JSON.parse(content);
  console.log("content", content);

  if (!savedSettings.lastOpenedProject) {
    return {
      settingsExist: fileExists,
      lastOpenedProjectExist: false,
      recentProjects: savedSettings.recentProjects || {},
    };
  }

  const projectExists = await exists(savedSettings.lastOpenedProject as string);
  const readLastOpenedProject = await readTextFile(
    savedSettings.lastOpenedProject as string
  );
  const parsedProject = yaml.load(readLastOpenedProject);

  return {
    settingsExist: fileExists,
    lastOpenedProjectExist: projectExists,
    parsedProject: parsedProject,
    lastOpenedProjectPath: savedSettings.lastOpenedProject as string,
    recentProjects: savedSettings.recentProjects || {},
  };
}

export async function getSettingsPath() {
  const appDataPath = await appDataDir();
  const normalizedPath = appDataPath.endsWith("/")
    ? appDataPath
    : `${appDataPath}/`;
  return `${normalizedPath}${SETTINGS_FILE}`;
}

export async function saveSettingsToFile(state: any) {
  const appDataPath = await appDataDir();

  await mkdir(appDataPath, { recursive: true });

  const settingsPath = await getSettingsPath();

  const jsonContent: Record<string, unknown> = {
    recentProjects: state.recentProjects,
    darkMode: state.darkMode,
    lastOpenedProject: state.lastOpenedProject,
  };

  await writeTextFile(settingsPath, JSON.stringify(jsonContent, null, 2));
}
