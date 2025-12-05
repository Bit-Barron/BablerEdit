import { appDataDir } from "@tauri-apps/api/path";
import { useEffect } from "react";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { SETTINGS_FILE } from "@/core/config/constants";
import { useSettingsStore } from "../store/settings.store";
import { toast } from "sonner";
import parseJson from "parse-json";
import { RecentProjectProps } from "../types/settings.types";

export const useSettingsHook = () => {
  const { updateSettings } = useSettingsStore();

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
          const savedSettings = parseJson(content);

          updateSettings({
            recentProjects: savedSettings.recentProjects as unknown as
              | RecentProjectProps[]
              | undefined,
            darkMode: savedSettings.darkMode as boolean,
          });
        }
      } catch (error) {
        toast.error("Failed to load settings");
      }
    };

    loadUserSettings();
  }, []);
};
