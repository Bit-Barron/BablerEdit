import { SETTINGS_FILE } from "@/core/config/constants";
import { appDataDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { SettingsState } from "../store/settings.store";

export const getSettingsPath = async (): Promise<string> => {
  const appDataPath = await appDataDir(); // /home/user/.local/share/BablerEdit/
  const normalizedPath = appDataPath.endsWith("/")
    ? appDataPath
    : `${appDataPath}/`;
  return `${normalizedPath}${SETTINGS_FILE}`;
};

export const saveSettingsToFile = async (state: SettingsState) => {
  try {
    const settingsPath = await getSettingsPath();

    const jsonContent: Record<string, unknown> = {
      recentProjects: state.recentProjects,
      darkMode: state.darkMode,
    };

    await writeTextFile(settingsPath, JSON.stringify(jsonContent, null, 2));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    toast.error(`Failed: ${message}`);
    return null;
  }
};
