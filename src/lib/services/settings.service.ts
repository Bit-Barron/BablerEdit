import { getSettingsPath } from "@/lib/utils/settings-utils";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";
import yaml from "js-yaml";

interface LoadUserSettingsResult {
  settingsExist: boolean;
  lastOpenedProjectExist: boolean;
  parsedProject?: any;
  lastOpenedProjectPath?: string;
}

export async function loadUserSettings(): Promise<LoadUserSettingsResult> {
  const settingsPath = await getSettingsPath();
  const fileExists = await exists(settingsPath);

  const content = await readTextFile(settingsPath);
  const savedSettings = JSON.parse(content);

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
  };
}
