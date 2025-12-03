import { appDataDir } from "@tauri-apps/api/path";
import { useEffect } from "react";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { SETTINGS_FILE } from "@/core/config/constants";
import { useSettingsStore } from "../store/settings.store";

export const useSettingsHook = () => {
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const appDataPath = await appDataDir();
        const normalizedPath = appDataPath.endsWith("/")
          ? appDataPath
          : `${appDataPath}/`;

        const settingsPath = `${normalizedPath}${SETTINGS_FILE}`;
        const fileExists = await exists(settingsPath);

        if (fileExists) {
          const content = await readTextFile(settingsPath);
          const savedSettings = JSON.parse(content);

          useSettingsStore.setState({
            recentProjects: savedSettings.recentProjects || [],
            darkMode: savedSettings.darkMode || false,
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadUserSettings();
  }, []);
};
