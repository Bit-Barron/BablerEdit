import { SETTINGS_FILE } from "@/core/config/constants";
import { appDataDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { SettingsState } from "../types/settings.types";

export const saveToFile = async (state: SettingsState) => {
  try {
    const appDataPath = await appDataDir();
    const normalizedPath = appDataPath.endsWith("/")
      ? appDataPath
      : `${appDataPath}/`;

    const settingsPath = `${normalizedPath}${SETTINGS_FILE}`;

    await writeTextFile(
      settingsPath,
      JSON.stringify(
        {
          recentProjects: state.recentProjects,
          darkMode: state.darkMode,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};
