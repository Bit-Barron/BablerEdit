import { SETTINGS_FILE } from "@/core/config/constants";
import { appDataDir } from "@tauri-apps/api/path";
import { SettingsState } from "../types/settings.types";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";

export const saveToFile = async (state: SettingsState) => {
  try {
    const appDataPath = await appDataDir();
    const normalizedPath = appDataPath.endsWith("/")
      ? appDataPath
      : `${appDataPath}/`;

    const settingsPath = `${normalizedPath}${SETTINGS_FILE}`;

    const jsonContent: Record<string, unknown> = {
      recentProjects: state.recentProjects,
      darkMode: state.darkMode,
    };

    await writeTextFile(settingsPath, JSON.stringify(jsonContent, null, 2));
  } catch (error) {
    toast.error("Failed to save settings");
  }
};
